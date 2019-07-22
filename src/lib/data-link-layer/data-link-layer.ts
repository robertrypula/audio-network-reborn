// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataFrame, PhysicalLayer } from '..';

export class DataLinkLayer {
  protected physicalLayer: PhysicalLayer;
  protected txDataFrame: DataFrame;
  protected rxData: number[] = [];         // TODO refactor to buffer

  public constructor(speed: number) {
    this.physicalLayer = new PhysicalLayer(speed);
  }

  public setData(data: number[]): void {
    this.txDataFrame = new DataFrame(data);
  }

  public txTimeTick(): void {
    this.physicalLayer.tx(this.txDataFrame.getNextByte());
  }

  public getData(): number[][] {
    // TODO add logic that will check real frames
    return [
      this.rxData.filter((item, index) => index % 2 === 0),
      this.rxData.filter((item, index) => index % 2 === 1)
    ];
  }

  public rxTimeTick(): void {
    this.rxData.push(this.physicalLayer.rx());
  }
}
