// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataFrame, DataFrameHistory, getAllOneByteErrors, getRightAlignedSubArrays, PhysicalLayer } from '..';
import { FRAME_RAW_BYTES_LENGTH_MAX, FRAME_RAW_BYTES_LENGTH_MIN } from './constants';
import { DataFrameHistoryEntry } from './model';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected rxDataFrameHistoryA: DataFrameHistory = [];
  protected rxDataFrameHistoryB: DataFrameHistory = [];
  protected rxDataFrames: DataFrame[];
  protected rxFrameRawBytesLengthMin = FRAME_RAW_BYTES_LENGTH_MIN;
  protected rxRawBytesA: number[] = [];
  protected rxRawBytesB: number[] = [];
  protected rxRawBytesCounter = 0;
  protected txDataFrame: DataFrame;

  public constructor() {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): number[][] | null {
    return this.rxDataFrames.length
      ? this.rxDataFrames.map((item) => item.getPayload())
      : null;
  }

  public rxTimeTick(): void {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxRawBytes = isEven ? this.rxRawBytesA : this.rxRawBytesB;

    if (rxRawBytes.length > FRAME_RAW_BYTES_LENGTH_MAX) {
      rxRawBytes.shift();
    }
    rxRawBytes.push(this.physicalLayer.rx());

    this.rxDataFrames = [];
    getRightAlignedSubArrays(rxRawBytes, this.rxFrameRawBytesLengthMin, (rawBytes) => {
      this.tryToFindValidFrame(rawBytes);
      // TODO experiment with data correction in next versions
      // getAllOneByteErrors(rawBytes, () => this.tryToFindValidFrame(rawBytes));
    });
    this.rxRawBytesCounter++;
  }

  public setData(data: number[]): void {
    this.txDataFrame = new DataFrame();
    this.txDataFrame.setPayload(data);
  }

  public txTimeTick(): boolean {
    return this.physicalLayer.tx(this.txDataFrame.getNextRawByte());
  }

  protected tryToFindValidFrame(rawBytes: number[]): void {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxDataFrameHistory = isEven ? this.rxDataFrameHistoryA : this.rxDataFrameHistoryB;
    const rxDataFrameHistorySecondStream = isEven ? this.rxDataFrameHistoryB : this.rxDataFrameHistoryA;
    const dataFrame = new DataFrame().setRawBytes(rawBytes);

    if (dataFrame.isValid()) {
      const lastEntryInSecondStream = rxDataFrameHistorySecondStream.length
        ? rxDataFrameHistorySecondStream[rxDataFrameHistorySecondStream.length - 1]
        : null;
      const wasFrameDetectedHalfStepBack = lastEntryInSecondStream
        ? lastEntryInSecondStream.rawBytePosition === this.rxRawBytesCounter - 1
        : false;

      if (!wasFrameDetectedHalfStepBack || lastEntryInSecondStream.dataFrame.isNotEqualTo(dataFrame)) {
        rxDataFrameHistory.push({ rawBytePosition: this.rxRawBytesCounter, dataFrame });
        this.rxDataFrames.push(dataFrame);
      }
    }
  }
}
