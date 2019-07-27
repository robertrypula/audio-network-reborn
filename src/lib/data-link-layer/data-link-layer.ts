// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataFrame, PhysicalLayer } from '..';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected txDataFrame: DataFrame;
  protected rxData: number[] = [];         // TODO refactor to buffer
  protected framesA: number[][] = [];
  protected framesB: number[][] = [];

  public constructor() {
    this.physicalLayer = new PhysicalLayer();
  }

  public getData(): any {
    // TODO remove experiments and add logic that will check real frames
    const streamA = this.rxData.filter((item, index) => index % 2 === 0);
    const streamB = this.rxData.filter((item, index) => index % 2 === 1);
    const last10A = streamA.slice(-10);
    const last10B = streamB.slice(-10);

    if (last10A.length === 10 && last10A.join(',') === '10,20,30,40,50,60,70,80,90,100') {
      this.framesA.push(last10A.slice(0));
    }

    if (last10B.length === 10 && last10B.join(',') === '10,20,30,40,50,60,70,80,90,100') {
      this.framesB.push(last10B.slice(0));
    }

    return [
      streamA,
      streamB,
      this.framesA,
      this.framesB
    ];
  }

  public rxTimeTick(): void {
    this.rxData.push(this.physicalLayer.rx());
  }

  public setData(data: number[]): void {
    this.txDataFrame = new DataFrame(data);
  }

  public txTimeTick(): boolean {
    const nextByte = this.txDataFrame.getNextByte();

    this.physicalLayer.tx(nextByte);

    return nextByte !== null;
  }
}
