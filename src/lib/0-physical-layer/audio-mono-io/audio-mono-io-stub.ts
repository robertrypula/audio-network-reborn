// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoInterface } from '@physical-layer/model';

/*tslint:disable:no-console*/

const CONSOLE = false;

export class AudioMonoIoStub implements AudioMonoIoInterface {
  protected fftSize = 4096;
  protected sampleRate = 48000;

  public getFftSize(): number {
    CONSOLE && console.info('AudioMonoIoStub.getFftSize -> ' + this.fftSize);
    return this.fftSize;
  }

  public getFrequencyDomainData(currentTime: number): Float32Array {
    const length = 0.5 * this.fftSize;
    CONSOLE && console.info('AudioMonoIoStub.getFrequencyDomainData -> [arrayLength=' + length + ']', currentTime);
    return new Float32Array(length);
  }

  public getSampleRate(): number {
    CONSOLE && console.info('AudioMonoIoStub.getSampleRate -> ' + this.sampleRate);
    return this.sampleRate;
  }

  public inputDisable(): void {
    CONSOLE && console.info('AudioMonoIoStub.inputDisable');
  }

  public outputDisable(): void {
    CONSOLE && console.info('AudioMonoIoStub.outputDisable');
  }

  public setFftSize(fftSize: number): void {
    CONSOLE && console.info('AudioMonoIoStub.setFftSize -> ' + fftSize);
    this.fftSize = fftSize;
  }

  public setPeriodicWave(frequency: number, currentTime: number): void {
    CONSOLE && console.info('AudioMonoIoStub.setPeriodicWave -> ' + frequency.toFixed(6), currentTime);
  }
}
