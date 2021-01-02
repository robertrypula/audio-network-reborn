// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { getFrameConfig } from '@data-link-layer/config-utils';
import { GET_SCRAMBLE_SEQUENCE } from '@data-link-layer/constants';
import { createFrame } from '@data-link-layer/frame/frame';
import {
  ErrorCorrection,
  FrameConfig,
  FrameConfigInitializer,
  FrameHistoryEntry,
  FrameInterface,
  FrameMode,
  RxTimeTickState,
  ScramblerMode,
  SelfReception,
  TxTimeTickState
} from '@data-link-layer/model';
import { findFrameCandidates, scrambler } from '@data-link-layer/utils';
import { PhysicalLayerInterface } from '@physical-layer/model';
import { createPhysicalLayer } from '@physical-layer/physical-layer';
import { FixedSizeBuffer } from '@shared/fixed-size-buffer';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayerInterface;

  public rxErrorCorrection = ErrorCorrection.Off; // keep 'off' as current 'brute-force' solution is just bad... :)
  public rxSelfReception = SelfReception.On;
  public scrambleSequence: number[] = GET_SCRAMBLE_SEQUENCE();

  protected frameConfig: FrameConfig;
  protected rxFrameHistory: FixedSizeBuffer<FrameHistoryEntry>;
  protected rxRawBytesA: FixedSizeBuffer<number>;
  protected rxRawBytesB: FixedSizeBuffer<number>;
  protected rxRawBytesCounter = 0;
  protected txFrame: FrameInterface;
  protected txRawBytesCounter = 0;

  public constructor(frameMode: FrameMode = FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24) {
    this.physicalLayer = createPhysicalLayer();
    this.setFrameMode(frameMode);
  }

  public getFrameConfig(): FrameConfig {
    return this.frameConfig;
  }

  public getRxBytesCollection(): number[][] {
    return this.getRxBytesCollectionFromFrameHistory(
      this.rxFrameHistory.data.filter(
        (frameHistoryEntry: FrameHistoryEntry): boolean => !frameHistoryEntry.isErrorCorrected
      )
    );
  }

  public getRxBytesErrorCorrectedCollection(): number[][] {
    return this.getRxBytesCollectionFromFrameHistory(
      this.rxFrameHistory.data.filter(
        (frameHistoryEntry: FrameHistoryEntry): boolean => frameHistoryEntry.isErrorCorrected
      )
    );
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
    /* TODO finalize class changes
    console.log(
      this.rxRawBytesCounter,
      ' - ',
      isEven,
      ' - ',
      this.rxRawBytesA.data.join(','),
      ' ||| ',
      this.rxRawBytesB.data.join(',')
    );
    */

    !rxRawBytes.isBelowMinimalLength() &&
      findFrameCandidates(
        rxRawBytes.data,
        this.scrambleSequence,
        this.frameConfig,
        this.rxErrorCorrection,
        (frameCandidate: FrameInterface, isErrorCorrected: boolean): void => {
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
    let lengthMin: number;

    this.frameConfig = getFrameConfig(frameConfigInitializer);
    lengthMax = this.frameConfig.rawBytesLength.max;
    lengthMin = this.frameConfig.rawBytesLength.min;
    this.rxRawBytesA = new FixedSizeBuffer<number>(lengthMax, lengthMin);
    this.rxRawBytesB = new FixedSizeBuffer<number>(lengthMax, lengthMin);
    this.rxFrameHistory = new FixedSizeBuffer<FrameHistoryEntry>(100); // TODO calculate this value and make it smaller
  }

  public setFrameMode(frameMode: FrameMode): void {
    if (!this.frameConfig || frameMode !== this.frameConfig.frameMode) {
      this.setFrameConfigInitializer(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode]);
    }
  }

  public setTxBytes(bytes: number[]): void {
    this.txFrame = createFrame(this.frameConfig);
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

  protected getRxBytesCollectionFromFrameHistory(rxFrameHistoryFiltered: FrameHistoryEntry[]): number[][] {
    const rawBytePositionLast: number = rxFrameHistoryFiltered.length
      ? this.rxFrameHistory.data[rxFrameHistoryFiltered.length - 1].rawBytePosition
      : null;
    const rawBytePositionToFilter: number =
      rawBytePositionLast === this.rxRawBytesCounter - 1 ? rawBytePositionLast : null;

    return rxFrameHistoryFiltered
      .filter(
        (frameHistoryEntry: FrameHistoryEntry): boolean => frameHistoryEntry.rawBytePosition === rawBytePositionToFilter
      )
      .map((frameHistoryEntry: FrameHistoryEntry): number[] => frameHistoryEntry.frame.getPayload());
  }

  protected tryToFindValidFrame(frameCandidate: FrameInterface, isErrorCorrected: boolean): boolean {
    if (frameCandidate.isValid()) {
      const frame: FrameInterface = isErrorCorrected ? frameCandidate.clone() : frameCandidate;
      const equalFramesHalfStepBack: FrameHistoryEntry[] = this.rxFrameHistory.data.filter(
        (frameHistoryEntry: FrameHistoryEntry): boolean =>
          frameHistoryEntry.rawBytePosition >= this.rxRawBytesCounter - 1 && frameHistoryEntry.frame.isEqualTo(frame)
      );

      if (equalFramesHalfStepBack.length === 0) {
        this.rxFrameHistory.insert({ frame, isErrorCorrected, rawBytePosition: this.rxRawBytesCounter });

        return true;
      }
    }

    return false;
  }
}
