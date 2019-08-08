// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FrameHistory, getAllOneByteErrors, getRightAlignedSubArrays, PhysicalLayer } from '..';
import { FRAME_RAW_BYTES_LENGTH_MAX, FRAME_RAW_BYTES_LENGTH_MIN } from './constants';
import { Frame } from './frame';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFramesErrorCorrected: Frame[];
  protected rxFrameRawBytesLengthMin = FRAME_RAW_BYTES_LENGTH_MIN;
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxRawBytesCounter = 0;
  protected txFrame: Frame;

  public constructor() {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): number[][] {
    return this.rxFrames.length
      ? this.rxFrames.map((item) => item.getPayload())
      : null;
  }

  public getDataErrorCorrected(): number[][] {
    return this.rxFramesErrorCorrected.length
      ? this.rxFramesErrorCorrected.map((item) => item.getPayload())
      : null;
  }

  public rxTimeTick(): void {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxRawBytes = isEven ? this.rxRawBytesA : this.rxRawBytesB;

    if (rxRawBytes.length > FRAME_RAW_BYTES_LENGTH_MAX) {
      rxRawBytes.shift();
    }
    rxRawBytes.push(this.physicalLayer.rx());

    this.rxFrames = [];
    this.rxFramesErrorCorrected = [];
    getRightAlignedSubArrays(rxRawBytes, this.rxFrameRawBytesLengthMin, (rawBytes) => {
      if (!this.tryToFindValidFrame(rawBytes)) {
        // getAllOneByteErrors(rawBytes, () => this.tryToFindValidFrame(rawBytes, true));
      }
    });
    this.rxRawBytesCounter++;
  }

  public setData(data: number[]): void {
    this.txFrame = new Frame();
    this.txFrame.setPayload(data);
  }

  public txTimeTick(): boolean {
    return this.physicalLayer.tx(this.txFrame.getNextRawByte());
  }

  protected tryToFindValidFrame(rawBytes: number[], errorCorrected = false): boolean {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxFrameHistory = isEven ? this.rxFrameHistoryA : this.rxFrameHistoryB;
    const rxFrameHistoryHalfStepBack = isEven ? this.rxFrameHistoryB : this.rxFrameHistoryA;
    const frame = new Frame().setRawBytes(rawBytes.slice(0));

    if (frame.isValid()) {
      const equalFramesHalfStepBack = rxFrameHistoryHalfStepBack.
        filter((item) => item.rawBytePosition >= this.rxRawBytesCounter - 1 && item.frame.isEqualTo(frame));

      // console.log(
      //   equalFramesHalfStepBack.map(
      //     (item) => item.frame.getRawBytes().join(',') + ' ' + item.rawBytePosition
      //   ).join(' | ')
      // );

      if (equalFramesHalfStepBack.length === 0) {
        rxFrameHistory.push({ errorCorrected, frame, rawBytePosition: this.rxRawBytesCounter });
        errorCorrected ? this.rxFramesErrorCorrected.push(frame) : this.rxFrames.push(frame);
        return true;
      }
    }

    return false;
  }
}
