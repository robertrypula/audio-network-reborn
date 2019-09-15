// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoStub } from '@physical-layer/audio-mono-io/audio-mono-io-stub';
import { AudioMonoIoWebApi } from '@physical-layer/audio-mono-io/audio-mono-io-web-api';
import { AudioMonoIo, AudioMonoIoCreateMode } from '@physical-layer/model';

export class AudioMonoIoFactory {
  public audioMonoIoCreateMode: AudioMonoIoCreateMode = AudioMonoIoCreateMode.WebApi;

  public createAudioMonoIo(): AudioMonoIo {
    // TODO implement auto detection of browser/node environment
    switch (this.audioMonoIoCreateMode) {
      case AudioMonoIoCreateMode.Stub:
        return new AudioMonoIoStub();
      case AudioMonoIoCreateMode.WebApi:
      default:
        return new AudioMonoIoWebApi();
    }
  }
}

export const audioMonoIoFactory = new AudioMonoIoFactory();
