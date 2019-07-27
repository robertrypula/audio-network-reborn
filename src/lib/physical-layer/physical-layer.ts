// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoInterface,
  BYTE,
  DspConfig,
  FftResult,
  getDspConfig,
  SILENCE_FREQUENCY,
  TransmissionMode
} from '..';
import { audioMonoIoFactory } from './audio-mono-io/audio-mono-io-factory';

export class PhysicalLayer {
  public readonly audioMonoIo: AudioMonoIoInterface;

  protected dspConfig: DspConfig;

  public constructor(transmissionMode: TransmissionMode = TransmissionMode.SlimBandFastAudibleLower) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
    this.setTransmissionMode(transmissionMode);
  }

  public getDspConfig(): DspConfig {
    return this.dspConfig;
  }

  public rx(): number {
    const fftResult = new FftResult(this.audioMonoIo.getFrequencyDomainData(), this.audioMonoIo.getSampleRate());

    return fftResult.pick(this.dspConfig.unifiedBinIndexes).getLoudestBinIndex();
  }

  public setTransmissionMode(transmissionMode: TransmissionMode): void {
    if (this.dspConfig && transmissionMode === this.dspConfig.transmissionMode) {
      return;
    }

    this.dspConfig = getDspConfig(transmissionMode, this.audioMonoIo.getSampleRate());
    this.audioMonoIo.setFftSize(this.dspConfig.dspConfigInitial.fftSize);
  }

  public tx(byte: number | null): void {
    this.audioMonoIo.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE
        ? this.dspConfig.unifiedFrequencies[byte]
        : SILENCE_FREQUENCY
    );
  }
}
