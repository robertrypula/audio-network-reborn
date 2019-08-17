// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export * from './info';

export * from './application-layer/application-layer';
export * from './data-link-layer/config';
export * from './data-link-layer/constants';
export * from './data-link-layer/data-link-layer';
export * from './data-link-layer/frame/frame';
export * from './data-link-layer/model';
export * from './data-link-layer/utils';
export * from './physical-layer/audio-mono-io/audio-mono-io-factory';
export * from './physical-layer/audio-mono-io/audio-mono-io-stub';
export * from './physical-layer/audio-mono-io/audio-mono-io-web-audio-api';
export * from './physical-layer/config';
export * from './physical-layer/constants';
export * from './physical-layer/fft-result';
export * from './physical-layer/model';
export * from './physical-layer/physical-layer';
export * from './physical-layer/utils';
export * from './shared/check-algorithms';
export * from './shared/model';
export * from './shared/utils';
export * from './visualization/simple-canvas/simple-canvas';
export * from './visualization/spectrogram/spectrogram';
export * from './visualization/spectrogram/utils';
export * from './visualization/visualizers';

/*
TODO (code):
  + move check-function to shared
  + move utils to shared
  + implement to hex methods
  + get random array
  + run prettier on entire project
  - rename checksum to FCS (Frame Check Sequence)
  - re-implement frame-benchmark.spec.ts to really show how different frame config works
  - add bytes scrambling to the data link layer frame
  - migrate CRC32 implementation from https://github.com/kvz/locutus/blob/master/src/php/strings/crc32.js
  - schedule tx frame frequencies at web audio api rather than setInternal from the clients side

TODO (package):
  - find alternative for coveralls
  - refactor imports to absolute paths
 */
