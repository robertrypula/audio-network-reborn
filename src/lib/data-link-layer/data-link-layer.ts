// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FrameHistory, getRightAlignedSubArrays, PhysicalLayer } from '..';
import { FRAME_RAW_BYTES_LENGTH_MAX, FRAME_RAW_BYTES_LENGTH_MIN } from './constants';
import { Frame } from './frame';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFrameRawBytesLengthMin = FRAME_RAW_BYTES_LENGTH_MIN;
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxRawBytesCounter = 0;
  protected txFrame: Frame;

  public constructor() {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): number[][] | null {
    return this.rxFrames.length
      ? this.rxFrames.map((item) => item.getPayload())
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
    getRightAlignedSubArrays(rxRawBytes, this.rxFrameRawBytesLengthMin, (rawBytes) => {
      this.tryToFindValidFrame(rawBytes);
      // TODO experiment with data correction in next versions
      // getAllOneByteErrors(rawBytes, () => this.tryToFindValidFrame(rawBytes));
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

  protected tryToFindValidFrame(rawBytes: number[]): void {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxFrameHistory = isEven ? this.rxFrameHistoryA : this.rxFrameHistoryB;
    const rxFrameHistorySecondStream = isEven ? this.rxFrameHistoryB : this.rxFrameHistoryA;
    const frame = new Frame().setRawBytes(rawBytes);

    if (frame.isValid()) {
      const lastEntryInSecondStream = rxFrameHistorySecondStream.length
        ? rxFrameHistorySecondStream[rxFrameHistorySecondStream.length - 1]
        : null;
      const wasFrameDetectedHalfStepBack = lastEntryInSecondStream
        ? lastEntryInSecondStream.rawBytePosition === this.rxRawBytesCounter - 1
        : false;

      if (!wasFrameDetectedHalfStepBack || lastEntryInSecondStream.frame.isNotEqualTo(frame)) {
        rxFrameHistory.push({ rawBytePosition: this.rxRawBytesCounter, frame });
        this.rxFrames.push(frame);
      }
    }
  }
}
