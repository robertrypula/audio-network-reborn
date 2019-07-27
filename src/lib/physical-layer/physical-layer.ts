// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoInterface,
  BYTE,
  FftResult,
  getTransmissionModeDetails,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SILENCE_FREQUENCY,
  TransmissionMode,
  TransmissionModeDetails
} from '..';
import { audioMonoIoFactory } from './audio-mono-io/audio-mono-io-factory';

export class PhysicalLayer {
  public readonly audioMonoIo: AudioMonoIoInterface;

  protected transmissionModeDetails: TransmissionModeDetails;

  public constructor(transmissionMode: TransmissionMode = TransmissionMode.SlimBandSlow) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
    this.setTransmissionMode(transmissionMode);
  }

  public getRxTimeTickMilliseconds(): number {
    return Math.round(MILLISECONDS_IN_SECOND / this.transmissionModeDetails.rawByteRate);
  }

  public getTransmissionModeDetails(): TransmissionModeDetails {
    return this.transmissionModeDetails;
  }

  public getTxTimeTickMilliseconds(): number {
    return NYQUIST_TWICE * this.getRxTimeTickMilliseconds();
  }

  public rx(): number {
    const fftResult = new FftResult(this.audioMonoIo.getFrequencyDomainData(), this.audioMonoIo.getSampleRate());

    return fftResult.pick(this.transmissionModeDetails.binIndexes).getLoudestBinIndex();
  }

  public setTransmissionMode(transmissionMode: TransmissionMode): void {
    this.transmissionModeDetails = getTransmissionModeDetails(transmissionMode, this.audioMonoIo.getSampleRate());
    this.audioMonoIo.setFftSize(this.transmissionModeDetails.config.fftSize);
  }

  public tx(byte: number | null): void {
    this.audioMonoIo.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE
        ? this.transmissionModeDetails.unifiedFrequencies[byte]
        : SILENCE_FREQUENCY
    );
  }
}
