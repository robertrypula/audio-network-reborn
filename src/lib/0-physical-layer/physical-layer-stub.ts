// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP } from '@physical-layer/config';
import { getDspConfig } from '@physical-layer/config-utils';
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

  public constructor(dspMode: DspMode) {}

  public getDspConfig(): DspConfig {
    return getDspConfig(DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP[DspMode.NormalBandFastAudibleLower]);
  }

  public rx(currentTime: number): number {
    return 0;
  }

  public setDspConfigInitializer(dspConfigInitializer: DspConfigInitializer): void {}

  public setDspMode(dspMode: DspMode): void {}

  public tx(byte: number, currentTime: number): void {}
}
