// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { createAudioMonoIo } from '@physical-layer/audio-mono-io/audio-mono-io';
import { DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP } from '@physical-layer/config';
import { getDspConfig } from '@physical-layer/config-utils';
import { BYTE_UNIQUE_VALUES, SILENCE_FREQUENCY } from '@physical-layer/constants';
import { FftResult } from '@physical-layer/fft-result';
import {
  AudioMonoIoInterface,
  DspConfig,
  DspConfigInitializer,
  DspMode,
  PhysicalLayerInterface
} from '@physical-layer/model';
import { PhysicalLayerStub } from '@physical-layer/physical-layer.stub';
import { CreateConfig } from '@shared/model';

export class PhysicalLayer implements PhysicalLayerInterface {
  public readonly audioMonoIo: AudioMonoIoInterface;

  protected dspConfig: DspConfig;

  public constructor(dspMode: DspMode = DspMode.NormalBandFastAudibleLower) {
    // console.log('PhysicalLayer real'); // TODO remove
    this.audioMonoIo = createAudioMonoIo();
    this.setDspMode(dspMode);
  }

  public getDspConfig(): DspConfig {
    return this.dspConfig;
  }

  public rx(currentTime: number): number {
    const frequencyDomainData: Float32Array = this.audioMonoIo.getFrequencyDomainData(currentTime);

    return frequencyDomainData
      ? new FftResult(frequencyDomainData, this.audioMonoIo.getSampleRate())
          .pick(this.dspConfig.unifiedBinIndexes)
          .getLoudestBinIndex()
      : null;
  }

  public setDspConfigInitializer(dspConfigInitializer: DspConfigInitializer): void {
    this.dspConfig = getDspConfig(dspConfigInitializer, this.audioMonoIo.getSampleRate());
    this.audioMonoIo.setFftSize(this.dspConfig.dspConfigInitializer.fftSize);
  }

  public setDspMode(dspMode: DspMode): void {
    if (!this.dspConfig || dspMode !== this.dspConfig.dspMode) {
      this.setDspConfigInitializer(DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP[dspMode]);
    }
  }

  public tx(byte: number, currentTime: number): void {
    this.audioMonoIo.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE_UNIQUE_VALUES
        ? this.dspConfig.unifiedFrequencies[byte]
        : SILENCE_FREQUENCY,
      currentTime
    );
  }
}

// -----------------------------------------------------------------------------

export const createPhysicalLayerConfig: CreateConfig = { stub: false };
export const createPhysicalLayer = (): PhysicalLayerInterface => {
  return createPhysicalLayerConfig.stub ? new PhysicalLayerStub() : new PhysicalLayer();
};
