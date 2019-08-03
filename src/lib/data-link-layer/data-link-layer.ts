// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataFrame, getRightAlignedSubArrays, PhysicalLayer } from '..';
import { FRAME_RAW_BYTES_LENGTH_MAX, FRAME_RAW_BYTES_LENGTH_MIN } from './constants';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected txDataFrame: DataFrame;
  protected rxRawBytesCounter = 0;
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxDataFramesA: DataFrame[] = [];
  protected rxDataFramesB: DataFrame[] = [];

  public constructor() {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): any {
    const rxRawBytes = this.rxRawBytesCounter % 2 === 1 ? this.rxRawBytesA : this.rxRawBytesB;
    const rxDataFrames = this.rxRawBytesCounter % 2 === 1 ? this.rxDataFramesA : this.rxDataFramesB;

    getRightAlignedSubArrays(rxRawBytes, FRAME_RAW_BYTES_LENGTH_MIN, (rawBytes) => {
      const dataFrame = new DataFrame().setRawBytes(rawBytes);

      if (dataFrame.isValid()) {
        rxDataFrames.push(dataFrame);
      }
    });

    return [
      this.rxRawBytesA,
      this.rxRawBytesB,
      this.rxDataFramesA,
      this.rxDataFramesB
    ];
  }

  public rxTimeTick(): void {
    const rxRawByte = this.physicalLayer.rx();

    this.rxRawBytesCounter++;
    if (this.rxRawBytesCounter % 2 === 1) {
      if (this.rxRawBytesA.length > FRAME_RAW_BYTES_LENGTH_MAX) {
        this.rxRawBytesA.shift();
      }
      this.rxRawBytesA.push(rxRawByte);
    } else {
      if (this.rxRawBytesB.length > FRAME_RAW_BYTES_LENGTH_MAX) {
        this.rxRawBytesB.shift();
      }
      this.rxRawBytesB.push(rxRawByte);
    }
  }

  public setData(data: number[]): void {
    this.txDataFrame = new DataFrame();
    this.txDataFrame.setPayload(data);
  }

  public txTimeTick(): boolean {
    const nextRawByte = this.txDataFrame.getNextRawByte();

    this.physicalLayer.tx(nextRawByte);

    return nextRawByte !== null;
  }
}
