// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoInterface,
  BYTE,
  FftResult,
  getTransmissionDetails,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SILENCE_FREQUENCY,
  TransmissionDetails,
  TransmissionMode
} from '..';
import { audioMonoIoFactory } from './audio-mono-io/audio-mono-io-factory';

export class PhysicalLayer {
  public readonly audioMonoIo: AudioMonoIoInterface;

  protected transmissionDetails: TransmissionDetails;

  public constructor(transmissionMode: TransmissionMode = TransmissionMode.SlimBandFast) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
    this.setTransmissionMode(transmissionMode);
  }

  public getRxTimeTickMilliseconds(): number {
    return Math.round(MILLISECONDS_IN_SECOND / this.transmissionDetails.rawByteRate);
  }

  public getTransmissionDetails(): TransmissionDetails {
    return this.transmissionDetails;
  }

  public getTxTimeTickMilliseconds(): number {
    return NYQUIST_TWICE * this.getRxTimeTickMilliseconds();
  }

  public rx(): number {
    const fftResult = new FftResult(this.audioMonoIo.getFrequencyDomainData(), this.audioMonoIo.getSampleRate());

    return fftResult.pick(this.transmissionDetails.unifiedBinIndexes).getLoudestBinIndex();
  }

  public setTransmissionMode(transmissionMode: TransmissionMode): void {
    if (this.transmissionDetails && transmissionMode === this.transmissionDetails.transmissionMode) {
      return;
    }

    this.transmissionDetails = getTransmissionDetails(transmissionMode, this.audioMonoIo.getSampleRate());
    this.audioMonoIo.setFftSize(this.transmissionDetails.config.fftSize);
  }

  public tx(byte: number | null): void {
    this.audioMonoIo.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE
        ? this.transmissionDetails.unifiedFrequencies[byte]
        : SILENCE_FREQUENCY
    );
  }
}
