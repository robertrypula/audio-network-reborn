// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIo } from '@physical-layer/model';

/*tslint:disable:no-console*/

const CONSOLE = false;

export class StubAudioMonoIo implements AudioMonoIo {
  protected fftSize = 4096;
  protected sampleRate = 48000;

  public getFftSize(): number {
    CONSOLE && console.info('StubAudioMonoIo.getFftSize -> ' + this.fftSize);
    return this.fftSize;
  }

  public getFrequencyDomainData(currentTime: number): Float32Array {
    const length = 0.5 * this.fftSize;
    CONSOLE && console.info('StubAudioMonoIo.getFrequencyDomainData -> [arrayLength=' + length + ']', currentTime);
    return new Float32Array(length);
  }

  public getSampleRate(): number {
    CONSOLE && console.info('StubAudioMonoIo.getSampleRate -> ' + this.sampleRate);
    return this.sampleRate;
  }

  public inputDisable(): void {
    CONSOLE && console.info('StubAudioMonoIo.inputDisable');
  }

  public outputDisable(): void {
    CONSOLE && console.info('StubAudioMonoIo.outputDisable');
  }

  public setFftSize(fftSize: number): void {
    CONSOLE && console.info('StubAudioMonoIo.setFftSize -> ' + fftSize);
    this.fftSize = fftSize;
  }

  public setPeriodicWave(frequency: number, currentTime: number): void {
    CONSOLE && console.info('StubAudioMonoIo.setPeriodicWave -> ' + frequency.toFixed(6), currentTime);
  }
}
