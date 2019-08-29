// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoInterface,
  BYTE_UNIQUE_VALUES,
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

  public constructor(transmissionMode: TransmissionMode = TransmissionMode.NormalBandFastAudibleLower) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
    this.setTransmissionMode(transmissionMode);
  }

  public getDspConfig(): DspConfig {
    return this.dspConfig;
  }

  public rx(currentTime: number): number {
    return new FftResult(this.audioMonoIo.getFrequencyDomainData(currentTime), this.audioMonoIo.getSampleRate())
      .pick(this.dspConfig.unifiedBinIndexes)
      .getLoudestBinIndex();
  }

  public setTransmissionMode(transmissionMode: TransmissionMode): void {
    if (!this.dspConfig || transmissionMode !== this.dspConfig.transmissionMode) {
      this.dspConfig = getDspConfig(transmissionMode, this.audioMonoIo.getSampleRate());
      this.audioMonoIo.setFftSize(this.dspConfig.dspConfigInitial.fftSize);
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
