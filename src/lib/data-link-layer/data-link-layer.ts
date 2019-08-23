// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  findFrameCandidates,
  FrameConfigInterface,
  FrameHistory,
  FrameMode,
  getRawBytesLengthMax,
  PhysicalLayer,
  SCRAMBLE_SEQUENCE,
  scrambleArray
} from '..';
import { frameModeToFrameConfigLookUp } from './config';
import { Frame } from './frame/frame';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFramesErrorCorrected: Frame[];
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxRawBytesCounter = 0;
  protected scramble: number[] = SCRAMBLE_SEQUENCE();
  protected txFrame: Frame;
  protected txRawBytesCounter = 0;

  public constructor(
    protected readonly frameConfig: FrameConfigInterface = frameModeToFrameConfigLookUp[
      FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1
    ]
  ) {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): number[][] {
    return this.rxFrames.length ? this.rxFrames.map(item => item.getPayload()) : null;
  }

  public getDataErrorCorrected(): number[][] {
    return this.rxFramesErrorCorrected.length ? this.rxFramesErrorCorrected.map(item => item.getPayload()) : null;
  }

  public rxTimeTick(): void {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxRawBytes = isEven ? this.rxRawBytesA : this.rxRawBytesB;
    const start = new Date().getTime(); // TODO remove me
    let validFramesCounter = 0; // TODO remove me

    if (rxRawBytes.length > getRawBytesLengthMax(this.frameConfig)) {
      rxRawBytes.shift();
    }
    rxRawBytes.push(this.physicalLayer.rx());

    this.rxFrames = [];
    this.rxFramesErrorCorrected = [];

    findFrameCandidates(rxRawBytes, this.scramble, this.frameConfig, false, (frameCandidate, isErrorCorrected) => {
      if (this.tryToFindValidFrame(frameCandidate, isErrorCorrected)) {
        validFramesCounter++; // TODO remove me
      }
    });
    if (validFramesCounter) {
      // TODO remove me
      /*tslint:disable-next-line:no-console*/
      console.log(new Date().getTime() - start);
    }

    this.rxRawBytesCounter++;
  }

  public setData(data: number[]): void {
    this.txFrame = new Frame(this.frameConfig);
    this.txFrame.setPayload(data);
    scrambleArray(this.txFrame.getRawBytes(), this.scramble, this.txRawBytesCounter, true);
    this.txRawBytesCounter += this.txFrame.getRawBytes().length;
  }

  public txTimeTick(): boolean {
    return this.physicalLayer.tx(this.txFrame.getNextRawByte());
  }

  protected tryToFindValidFrame(frameCandidate: Frame, isErrorCorrected: boolean): boolean {
    const isEven = this.rxRawBytesCounter % 2 === 0;
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
