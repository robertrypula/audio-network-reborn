// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  FrameConfigInterface,
  FrameHistory,
  FrameMode,
  getAllOneByteErrors,
  getRawBytesLengthMax,
  getRawBytesLengthMin,
  getRightAlignedSubArrays,
  PhysicalLayer
} from '..';
import { frameModeToFrameConfigLookUp } from './config';
import { Frame } from './frame/frame';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected frameConfig: FrameConfigInterface;
  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFramesErrorCorrected: Frame[];
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxRawBytesCounter = 0;
  protected txFrame: Frame;

  public constructor(protected frameMode: FrameMode = FrameMode.Header3BytesPayloadLengthBetween1And8BytesSha1) {
    this.physicalLayer = new PhysicalLayer();
    this.frameConfig = frameModeToFrameConfigLookUp[frameMode];
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

    if (rxRawBytes.length > getRawBytesLengthMax(this.frameConfig)) {
      rxRawBytes.shift();
    }
    rxRawBytes.push(this.physicalLayer.rx());

    this.rxFrames = [];
    this.rxFramesErrorCorrected = [];
    // const start = new Date().getTime();    TODO remove me
    getRightAlignedSubArrays(rxRawBytes, getRawBytesLengthMin(this.frameConfig), rawBytes => {
      if (!this.tryToFindValidFrame(rawBytes)) {
        // getAllOneByteErrors(rawBytes, () => this.tryToFindValidFrame(rawBytes, true));
      }
    });
    // const end = new Date().getTime();    TODO remove me
    // console.log(end - start);    TODO remove me
    this.rxRawBytesCounter++;
  }

  public setData(data: number[]): void {
    this.txFrame = new Frame(this.frameMode);
    this.txFrame.setPayload(data);
  }

  public txTimeTick(): boolean {
    return this.physicalLayer.tx(this.txFrame.getNextRawByte());
  }

  protected tryToFindValidFrame(rawBytes: number[], errorCorrected = false): boolean {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxFrameHistory = isEven ? this.rxFrameHistoryA : this.rxFrameHistoryB;
    const rxFrameHistoryHalfStepBack = isEven ? this.rxFrameHistoryB : this.rxFrameHistoryA;
    const frame = new Frame(this.frameMode).setRawBytes(rawBytes.slice(0));

    if (frame.isValid()) {
      const equalFramesHalfStepBack = rxFrameHistoryHalfStepBack.filter(
        item => item.rawBytePosition >= this.rxRawBytesCounter - 1 && item.frame.isEqualTo(frame)
      );

      if (equalFramesHalfStepBack.length === 0) {
        rxFrameHistory.push({ errorCorrected, frame, rawBytePosition: this.rxRawBytesCounter });
        errorCorrected ? this.rxFramesErrorCorrected.push(frame) : this.rxFrames.push(frame);
        return true;
      }
    }

    return false;
  }
}
