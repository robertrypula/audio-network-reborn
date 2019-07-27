// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoInterface,
  BandInterface,
  BYTE,
  FftResult,
  getClosestBinIndexes,
  getTransmissionModeDetails,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SILENCE,
  TransmissionMode,
  TransmissionModeDetails
} from '..';
import { audioMonoIoFactory } from './audio-mono-io/audio-mono-io-factory';

export class PhysicalLayer {
  public readonly audioMonoIo: AudioMonoIoInterface;

  protected rxBinIndexes: number[];
  protected transmissionModeDetails: TransmissionModeDetails;

  public constructor(transmissionMode: TransmissionMode = TransmissionMode.SlimBandSlow) {
    this.audioMonoIo = audioMonoIoFactory.createAudioMonoIo();
    this.setTransmissionMode(transmissionMode);
  }

  public getRxTimeTickMilliseconds(): number {
    return Math.round(MILLISECONDS_IN_SECOND / this.transmissionModeDetails.rawByteRate);
  }

  public getTransmissionModeDetails(): TransmissionModeDetails {
    const copy = {...this.transmissionModeDetails};

    copy.band = { ...this.transmissionModeDetails.band };

    return copy;
  }

  public getTxTimeTickMilliseconds(): number {
    return NYQUIST_TWICE * this.getRxTimeTickMilliseconds();
  }

  public rx(): number {
    const fftResult = new FftResult(this.audioMonoIo.getFrequencyDomainData(), this.audioMonoIo.getSampleRate());

    return fftResult.pick(this.rxBinIndexes).getLoudestBinIndex();
  }

  public setTransmissionMode(transmissionMode: TransmissionMode): void {
    const sampleRate = this.audioMonoIo.getSampleRate();
    let fftSize: number;

    this.transmissionModeDetails = getTransmissionModeDetails(transmissionMode, true);
    fftSize = this.transmissionModeDetails.config.fftSize;
    this.audioMonoIo.setFftSize(fftSize);
    this.rxBinIndexes = getClosestBinIndexes(fftSize, sampleRate, this.transmissionModeDetails.unifiedFrequencies);
  }

  public tx(byte: number | null): void {
    this.audioMonoIo.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE ? this.transmissionModeDetails.unifiedFrequencies[byte] : SILENCE
    );
  }
}
