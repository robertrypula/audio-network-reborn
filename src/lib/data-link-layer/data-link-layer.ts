// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataFrame, getRightAlignedSubArrays, PhysicalLayer } from '..';
import { FRAME_RAW_BYTES_LENGTH_MAX, FRAME_RAW_BYTES_LENGTH_MIN } from './constants';
import { DataFramesLog } from './model';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected txDataFrame: DataFrame;
  protected rxRawBytesCounter = 0;
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxDataFramesLogA: DataFramesLog[] = [];
  protected rxDataFramesLogB: DataFramesLog[] = [];

  public constructor() {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): any {
    // TODO refactor those experiments and variable names
    const rxRawBytes = this.rxRawBytesCounter % 2 === 1 ? this.rxRawBytesA : this.rxRawBytesB;
    const rxDataFramesLog = this.rxRawBytesCounter % 2 === 1 ? this.rxDataFramesLogA : this.rxDataFramesLogB;

    getRightAlignedSubArrays(rxRawBytes, FRAME_RAW_BYTES_LENGTH_MIN, (rawBytes) => {
      const dataFrame = new DataFrame().setRawBytes(rawBytes);

      if (dataFrame.isValid()) {
        const rxDataFramesLogSecondStream
          = rxDataFramesLog === this.rxDataFramesLogA ? this.rxDataFramesLogB : this.rxDataFramesLogA;
        const rxDataFramesLogSecondStreamLast = rxDataFramesLogSecondStream.length
          ? rxDataFramesLogSecondStream[rxDataFramesLogSecondStream.length - 1]
          : null;
        const wasFrameDetectedHalfStepBack = rxDataFramesLogSecondStreamLast
          ? rxDataFramesLogSecondStreamLast.rawBytePosition === this.rxRawBytesCounter - 1
          : false;

        if (wasFrameDetectedHalfStepBack) {
          const isHalfStepBackFrameDifferentThanCurrentOne = wasFrameDetectedHalfStepBack
            ? rxDataFramesLogSecondStreamLast.dataFrame.getRawBytes().join(',') !== dataFrame.getRawBytes().join(',')
            : false;

          if (isHalfStepBackFrameDifferentThanCurrentOne) {
            rxDataFramesLog.push({ rawBytePosition: this.rxRawBytesCounter, dataFrame });
          }
        } else {
          rxDataFramesLog.push({ rawBytePosition: this.rxRawBytesCounter, dataFrame });
        }
      }
    });

    return [
      this.rxRawBytesA,
      this.rxRawBytesB,
      this.rxDataFramesLogA.map((item) => item.dataFrame),
      this.rxDataFramesLogB.map((item) => item.dataFrame)
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
