// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { audioMonoIoFactory } from '@physical-layer/audio-mono-io/audio-mono-io-factory';
import { getDspConfig } from '@physical-layer/config-utils';
import { BYTE_UNIQUE_VALUES, SILENCE_FREQUENCY } from '@physical-layer/constants';
import { FftResult } from '@physical-layer/fft-result';
import { AudioMonoIoInterface, DspConfig, DspMode } from '@physical-layer/model';

export class PhysicalLayer {
  public readonly audioMonoIo: AudioMonoIoInterface;

  protected dspConfig: DspConfig;

  public constructor(dspMode: DspMode = DspMode.NormalBandFastAudibleLower) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
    this.setDspMode(dspMode);
  }

  public getDspConfig(): DspConfig {
    return this.dspConfig;
  }

  public rx(currentTime: number): number {
    return new FftResult(this.audioMonoIo.getFrequencyDomainData(currentTime), this.audioMonoIo.getSampleRate())
      .pick(this.dspConfig.unifiedBinIndexes)
      .getLoudestBinIndex();
  }

  public setDspMode(dspMode: DspMode): void {
    if (!this.dspConfig || dspMode !== this.dspConfig.dspMode) {
      this.dspConfig = getDspConfig(dspMode, this.audioMonoIo.getSampleRate());
      this.audioMonoIo.setFftSize(this.dspConfig.dspConfigInitializer.fftSize);
    }
  }

  public tx(byte: number, currentTime: number): boolean {
    const isValidByte = byte !== null && byte >= 0 && byte < BYTE_UNIQUE_VALUES;

    this.audioMonoIo.setPeriodicWave(
      isValidByte ? this.dspConfig.unifiedFrequencies[byte] : SILENCE_FREQUENCY,
      currentTime
    );

    return isValidByte;
  }
}
