// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoCreateMode, AudioMonoIoInterface } from '../model';
import { AudioMonoIoStub } from './audio-mono-io-stub';
import { AudioMonoIoWebAudioApi } from './audio-mono-io-web-audio-api';

export class AudioMonoIoFactory {
  public audioMonoIoCreateMode: AudioMonoIoCreateMode = AudioMonoIoCreateMode.WebAudioApi;

  public createAudioMonoIo(): AudioMonoIoInterface {
    // TODO implement auto detection of browser/node environment
    switch (this.audioMonoIoCreateMode) {
      case AudioMonoIoCreateMode.Stub:
        return new AudioMonoIoStub();
      case AudioMonoIoCreateMode.WebAudioApi:
      default:
        return new AudioMonoIoWebAudioApi();
    }
  }
}

export const audioMonoIoFactory = new AudioMonoIoFactory();
