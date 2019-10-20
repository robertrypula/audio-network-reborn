// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoInterface,
  DspConfig,
  DspConfigInitializer,
  DspMode,
  PhysicalLayerInterface
} from '@physical-layer/model';

/*tslint:disable:no-empty*/

export class PhysicalLayerStub implements PhysicalLayerInterface {
  public readonly audioMonoIo: AudioMonoIoInterface;

  public constructor() {
    // console.log('PhysicalLayerStub'); // TODO remove
  }

  public getDspConfig(): DspConfig {
    return null;
  }

  public rx(currentTime: number): number {
    return 0;
  }

  public setDspConfigInitializer(dspConfigInitializer: DspConfigInitializer): void {}

  public setDspMode(dspMode: DspMode): void {}

  public tx(byte: number, currentTime: number): void {}
}
