// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIO,
  BYTE,
  ConfigInterface,
  FftResult,
  FrequencyBandInterface,
  getClosestBinIndexes,
  getUnifiedFrequencies,
  MILLISECONDS_IN_SECOND,
  NYQUIST_TWICE,
  SpeedProfile,
  speedProfileConfig,
  SUPPORTED_SAMPLE_RATES
} from '..';

export class PhysicalLayer {
  public readonly audioMonoIO: AudioMonoIO;

  protected config: ConfigInterface;
  protected rxBinIndexes: number[];
  protected speedProfile: SpeedProfile;
  protected unifiedTxFrequencies: number[];

  public constructor(
    speedProfile: SpeedProfile = SpeedProfile.SlimBandSlow
  ) {
    this.audioMonoIO = new AudioMonoIO();
    this.setSpeedProfile(speedProfile);
  }

  public getFrequencyBand(): FrequencyBandInterface {
    return {
      begin: this.unifiedTxFrequencies[0],
      end: this.unifiedTxFrequencies[this.unifiedTxFrequencies.length - 1]
    };
  }

  public getRxTimeTickMilliseconds(): number {
    return Math.ceil(
      this.config.safeMarginFactor * MILLISECONDS_IN_SECOND * this.config.fftSize / Math.min(...SUPPORTED_SAMPLE_RATES)
    ) + this.config.safeMarginMilliseconds;
  }

  public getSpeedProfile(): SpeedProfile {
    return this.speedProfile;
  }

  public getTxTimeTickMilliseconds(): number {
    return NYQUIST_TWICE * this.getRxTimeTickMilliseconds();
  }

  public rx(): number {
    const fftResult = new FftResult(this.audioMonoIO.getFrequencyDomainData(), this.audioMonoIO.getSampleRate());

    return fftResult.pick(this.rxBinIndexes).getLoudestBinIndex();
  }

  public setSpeedProfile(speedProfile: SpeedProfile): void {
    this.config = speedProfileConfig[speedProfile];
    this.speedProfile = speedProfile;

    this.audioMonoIO.setFftSize(this.config.fftSize);
    this.unifiedTxFrequencies =
      getUnifiedFrequencies(this.config.fftSize, this.config.frequencyStart, BYTE, SUPPORTED_SAMPLE_RATES);
    this.rxBinIndexes =
      getClosestBinIndexes(this.config.fftSize, this.audioMonoIO.getSampleRate(), this.unifiedTxFrequencies);
  }

  public tx(byte: number | null): void {
    this.audioMonoIO.setPeriodicWave(
      byte !== null && byte >= 0 && byte < BYTE ? this.unifiedTxFrequencies[byte] : 0
    );
  }
}
