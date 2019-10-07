// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { getFrameConfig } from '@data-link-layer/config-utils';
import { SCRAMBLE_SEQUENCE } from '@data-link-layer/constants';
import { Frame } from '@data-link-layer/frame/frame';
import {
  ErrorCorrection,
  FrameConfig,
  FrameConfigInitializer,
  FrameHistory,
  FrameHistoryEntry,
  FrameMode,
  RxTimeTickState,
  ScramblerMode,
  TxTimeTickState
} from '@data-link-layer/model';
import { findFrameCandidates, scrambler } from '@data-link-layer/utils';
import { PhysicalLayer } from '@physical-layer/physical-layer';
import { FixedSizeBuffer } from '@shared/fixed-size-buffer';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected frameConfig: FrameConfig;
  protected rxErrorCorrection = ErrorCorrection.Off; // keep 'off' as current 'brute-force' solution is just bad... :)
  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFramesErrorCorrected: Frame[];
  protected rxRawBytesA: FixedSizeBuffer<number>;
  protected rxRawBytesB: FixedSizeBuffer<number>;
  protected rxRawBytesCounter = 0;
  protected scrambleSequence: number[] = SCRAMBLE_SEQUENCE();
  protected txFrame: Frame;
  protected txRawBytesCounter = 0;

  public constructor(frameMode: FrameMode = FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24) {
    this.physicalLayer = new PhysicalLayer();
    this.setFrameMode(frameMode);
  }

  public getFrameConfig(): FrameConfig {
    return this.frameConfig;
  }

  public getRxBytesCollection(): number[][] {
    return this.rxFrames.length ? this.rxFrames.map((frame: Frame) => frame.getPayload()) : [];
  }

  public getRxBytesErrorCorrectedCollection(): number[][] {
    return this.rxFramesErrorCorrected.length
      ? this.rxFramesErrorCorrected.map((frame: Frame) => frame.getPayload())
      : [];
  }

  public getTxGuardMilliseconds(): number {
    return Math.floor(
      this.physicalLayer.getDspConfig().txIntervalMilliseconds * this.frameConfig.frameConfigInitializer.guardFactor
    );
  }

  public getTxProgress(): number {
    if (!this.txFrame) {
      return 1;
    }

    const txIntervalMilliseconds: number = this.physicalLayer.getDspConfig().txIntervalMilliseconds;
    const rawBytesLength: number = this.txFrame.getRawBytes().length;
    const totalMilliseconds: number = rawBytesLength * txIntervalMilliseconds + this.getTxGuardMilliseconds();
    const currentPositionMilliseconds: number = this.txFrame.getRawBytePosition() * txIntervalMilliseconds;

    return currentPositionMilliseconds / totalMilliseconds;
  }

  public rxTimeTick(currentTime: number): RxTimeTickState {
    const isEven: boolean = this.rxRawBytesCounter % 2 === 0;
    const rxRawBytes: FixedSizeBuffer<number> = isEven ? this.rxRawBytesA : this.rxRawBytesB;
    const rxRawByte: number = this.physicalLayer.rx(currentTime);
    // const start = new Date().getTime(); // TODO remove me
    let validFramesCounter = 0; // TODO remove me

    if (rxRawByte === null) {
      return RxTimeTickState.Stopped;
    }

    rxRawBytes.insert(rxRawByte);
    this.rxFrames = [];
    this.rxFramesErrorCorrected = [];

    findFrameCandidates(
      rxRawBytes.data,
      this.scrambleSequence,
      this.frameConfig,
      this.rxErrorCorrection,
      (frameCandidate: Frame, isErrorCorrected: boolean) => {
        this.tryToFindValidFrame(frameCandidate, isErrorCorrected) && validFramesCounter++;
      }
    );
    /*tslint:disable-next-line:no-console*/
    // validFramesCounter && console.log(new Date().getTime() - start); // TODO remove me
    this.rxRawBytesCounter++;

    return RxTimeTickState.Listening;
  }

  public setFrameConfigInitializer(frameConfigInitializer: FrameConfigInitializer): void {
    let lengthMax: number;

    this.frameConfig = getFrameConfig(frameConfigInitializer);
    lengthMax = this.frameConfig.rawBytesLength.max;
    this.rxRawBytesA = new FixedSizeBuffer<number>(lengthMax);
    this.rxRawBytesB = new FixedSizeBuffer<number>(lengthMax);
  }

  public setFrameMode(frameMode: FrameMode): void {
    if (!this.frameConfig || frameMode !== this.frameConfig.frameMode) {
      this.setFrameConfigInitializer(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);
    }
  }

  public setTxBytes(bytes: number[]): void {
    this.txFrame = new Frame(this.frameConfig);
    this.txFrame.setPayload(bytes);
    scrambler(this.txFrame.getRawBytes(), ScramblerMode.Scramble, this.scrambleSequence, this.txRawBytesCounter);
    this.txRawBytesCounter += this.txFrame.getRawBytes().length;
  }

  public txTimeTick(currentTime: number): TxTimeTickState {
    if (this.txFrame) {
      const nextRawByte: number = this.txFrame.getNextRawByte();

      this.physicalLayer.tx(nextRawByte, currentTime);
      if (nextRawByte === null) {
        this.txFrame = null;
      }

      return nextRawByte !== null ? TxTimeTickState.Symbol : TxTimeTickState.Guard;
    }

    return TxTimeTickState.Idle;
  }

  protected tryToFindValidFrame(frameCandidate: Frame, isErrorCorrected: boolean): boolean {
    const isEven: boolean = this.rxRawBytesCounter % 2 === 0;
    const rxFrameHistory: FrameHistory = isEven ? this.rxFrameHistoryA : this.rxFrameHistoryB;
    const rxFrameHistoryHalfStepBack: FrameHistory = isEven ? this.rxFrameHistoryB : this.rxFrameHistoryA;

    if (frameCandidate.isValid()) {
      const frame: Frame = isErrorCorrected ? frameCandidate.clone() : frameCandidate;
      const equalFramesHalfStepBack: FrameHistory = rxFrameHistoryHalfStepBack.filter(
        (frameHistoryEntry: FrameHistoryEntry) =>
          frameHistoryEntry.rawBytePosition >= this.rxRawBytesCounter - 1 && frameHistoryEntry.frame.isEqualTo(frame)
      );

      if (equalFramesHalfStepBack.length === 0) {
        rxFrameHistory.push({ frame, isErrorCorrected, rawBytePosition: this.rxRawBytesCounter });
        isErrorCorrected ? this.rxFramesErrorCorrected.push(frame) : this.rxFrames.push(frame);

        return true;
      }
    }

    return false;
  }
}
