// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { getFrameConfig } from '@data-link-layer/config-utils';
import { GUARD_FACTOR, SCRAMBLE_SEQUENCE } from '@data-link-layer/constants';
import { Frame } from '@data-link-layer/frame/frame';
import {
  FrameConfig,
  FrameConfigInitializer,
  FrameHistory,
  FrameMode,
  RxTimeTickState,
  TxTimeTickState
} from '@data-link-layer/model';
import { findFrameCandidates, scrambleArray } from '@data-link-layer/utils';
import { PhysicalLayer } from '@physical-layer/physical-layer';
import { FixedSizeBuffer } from '@shared/fixed-size-buffer';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected frameConfig: FrameConfig;
  protected rxErrorCorrectionEnabled = false; // keep false, current 'brute-force' solution is just bad... :)
  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFramesErrorCorrected: Frame[];
  protected rxRawBytesA: FixedSizeBuffer<number>;
  protected rxRawBytesB: FixedSizeBuffer<number>;
  protected rxRawBytesCounter = 0;
  protected scramble: number[] = SCRAMBLE_SEQUENCE();
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
    return this.rxFrames.length ? this.rxFrames.map(item => item.getPayload()) : [];
  }

  public getRxBytesErrorCorrectedCollection(): number[][] {
    return this.rxFramesErrorCorrected.length ? this.rxFramesErrorCorrected.map(item => item.getPayload()) : [];
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

    const txIntervalMilliseconds = this.physicalLayer.getDspConfig().txIntervalMilliseconds;
    const rawBytesLength = this.txFrame.getRawBytes().length;
    const totalMilliseconds = rawBytesLength * txIntervalMilliseconds + this.getTxGuardMilliseconds();
    const currentPositionMilliseconds = this.txFrame.getRawBytePosition() * txIntervalMilliseconds;

    return currentPositionMilliseconds / totalMilliseconds;
  }

  public rxTimeTick(currentTime: number): RxTimeTickState {
    const isEven: boolean = this.rxRawBytesCounter % 2 === 0;
    const rxRawBytes = isEven ? this.rxRawBytesA : this.rxRawBytesB;
    const rxRawByte = this.physicalLayer.rx(currentTime);
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
      this.scramble,
      this.frameConfig,
      this.rxErrorCorrectionEnabled,
      (frameCandidate, isErrorCorrected) => {
        this.tryToFindValidFrame(frameCandidate, isErrorCorrected) && validFramesCounter++;
      }
    );
    /*tslint:disable-next-line:no-console*/
    // validFramesCounter && console.log(new Date().getTime() - start); // TODO remove me
    this.rxRawBytesCounter++;

    return RxTimeTickState.Listening;
  }

  public setFrameConfigInitializer(frameConfigInitializer: FrameConfigInitializer): void {
    this.frameConfig = getFrameConfig(frameConfigInitializer);
    this.rxRawBytesA = new FixedSizeBuffer<number>(this.frameConfig.rawBytesLength.max);
    this.rxRawBytesB = new FixedSizeBuffer<number>(this.frameConfig.rawBytesLength.max);
  }

  public setFrameMode(frameMode: FrameMode): void {
    if (!this.frameConfig || frameMode !== this.frameConfig.frameMode) {
      this.setFrameConfigInitializer(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);
    }
  }

  public setTxBytes(bytes: number[]): void {
    this.txFrame = new Frame(this.frameConfig);
    this.txFrame.setPayload(bytes);
    scrambleArray(this.txFrame.getRawBytes(), this.scramble, this.txRawBytesCounter, true);
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
    const rxFrameHistory = isEven ? this.rxFrameHistoryA : this.rxFrameHistoryB;
    const rxFrameHistoryHalfStepBack = isEven ? this.rxFrameHistoryB : this.rxFrameHistoryA;

    if (frameCandidate.isValid()) {
      const frame = isErrorCorrected ? frameCandidate.clone() : frameCandidate;
      const equalFramesHalfStepBack = rxFrameHistoryHalfStepBack.filter(
        item => item.rawBytePosition >= this.rxRawBytesCounter - 1 && item.frame.isEqualTo(frame)
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
