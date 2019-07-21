// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIO, getClosestBinIndexes, getUnifiedFrequencies } from '..';
import { FftResult } from '..';

const BYTE = 256;
const SAMPLE_RATES = [48000, 44100];
const MILLISECONDS_IN_SECOND = 1000;
const NYQUIST_TWICE = 2;
const RX_SAFE_MARGIN_FACTOR = 2;
const RX_SAFE_MARGIN_MILLISECONDS = 0;

export class PhysicalLayer {
  protected audioMonoIO: AudioMonoIO;
  protected unifiedTxFrequencies: number[];
  protected rxBinIndexes: number[];
  protected fftSize: number;

  public constructor(speed: number) {
    this.audioMonoIO = new AudioMonoIO();
    this.configure(speed * 1024, 2000);
  }

  public tx(byte: number | null): void {
    this.audioMonoIO.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE ? this.unifiedTxFrequencies[byte] : 0
    );
  }

  public rx(): number {
    const fftResult = new FftResult(this.audioMonoIO.getFrequencyDomainData(), this.audioMonoIO.getSampleRate());

    return fftResult.pick(this.rxBinIndexes).getLoudestBinIndex();
  }

  public getRxTimeTickMilliseconds(): number {
    return Math.ceil(
      RX_SAFE_MARGIN_FACTOR * MILLISECONDS_IN_SECOND * this.fftSize / Math.min(...SAMPLE_RATES)
    ) + RX_SAFE_MARGIN_MILLISECONDS;
  }

  public getTxTimeTickMilliseconds(): number {
    return NYQUIST_TWICE * this.getRxTimeTickMilliseconds();
  }

  protected configure(fftSize: number, frequencyStart: number) {
    this.fftSize = fftSize;
    this.audioMonoIO.setFftSize(fftSize);
    this.unifiedTxFrequencies = getUnifiedFrequencies(fftSize, frequencyStart, BYTE, SAMPLE_RATES);
    this.rxBinIndexes = getClosestBinIndexes(fftSize, this.audioMonoIO.getSampleRate(), this.unifiedTxFrequencies);
  }
}
