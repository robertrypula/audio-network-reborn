// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { audioMonoIoFactory } from '@physical-layer/audio-mono-io/audio-mono-io-factory';
import { DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP } from '@physical-layer/config';
import { getDspConfig } from '@physical-layer/config-utils';
import { BYTE_UNIQUE_VALUES, SILENCE_FREQUENCY } from '@physical-layer/constants';
import { FftResult } from '@physical-layer/fft-result';
import { AudioMonoIo, DspConfig, DspConfigInitializer, DspMode } from '@physical-layer/model';

export class PhysicalLayer {
  public readonly audioMonoIo: AudioMonoIo;

  protected dspConfig: DspConfig;

  public constructor(dspMode: DspMode = DspMode.NormalBandFastAudibleLower) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
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
