// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoInterface } from '../model';

export class AudioMonoIoStub implements AudioMonoIoInterface {
  protected fftSize: number = 4096;
  protected sampleRate: number = 48000;

  public getFftSize(): number {
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.getFftSize -> ' + this.fftSize);
    return this.fftSize;
  }

  public getSampleRate(): number {
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.getSampleRate -> ' + this.sampleRate);
    return this.sampleRate;
  }

  public getFrequencyDomainData(): Float32Array {
    const length = 0.5 * this.fftSize;
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.getFrequencyDomainData -> [arrayLength=' + length + ']');
    return new Float32Array(length);
  }

  public inputDisable(): void {
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.inputDisable');
  }

  public setFftSize(fftSize: number): void {
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.setFftSize -> ' + fftSize);
    this.fftSize = fftSize;
  }

  public setPeriodicWave(frequency: number): void {
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.setPeriodicWave -> ' + frequency.toFixed(6));
  }

  public outputDisable(): void {
    // tslint:disable-next-line:no-console
    console.info('AudioMonoIoStub.outputDisable');
  }
}
