// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { StubAudioMonoIo } from '@physical-layer/audio-mono-io/stub-audio-mono-io';
import { WebApiAudioMonoIo } from '@physical-layer/audio-mono-io/web-api-audio-mono-io';
import { AudioMonoIo, AudioMonoIoCreateMode } from '@physical-layer/model';

export class AudioMonoIoFactory {
  public audioMonoIoCreateMode: AudioMonoIoCreateMode = AudioMonoIoCreateMode.WebApi;

  public createAudioMonoIo(): AudioMonoIo {
    // TODO implement auto detection of browser/node environment
    switch (this.audioMonoIoCreateMode) {
      case AudioMonoIoCreateMode.Stub:
        return new StubAudioMonoIo();
      case AudioMonoIoCreateMode.WebApi:
      default:
        return new WebApiAudioMonoIo();
    }
  }
}

export const audioMonoIoFactory = new AudioMonoIoFactory();
