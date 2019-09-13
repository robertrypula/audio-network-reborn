// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoStub } from '@physical-layer/audio-mono-io/audio-mono-io-stub';
import { AudioMonoIoWebAudioApi } from '@physical-layer/audio-mono-io/audio-mono-io-web-audio-api';
import { AudioMonoIoCreateMode, AudioMonoIoInterface } from '@physical-layer/model';

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
