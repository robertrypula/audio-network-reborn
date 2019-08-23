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
  + frame.spec without fletcher
  - split check function code
  - remove Fletcher-16 implementation from the code
  - remove Sha1 from frame modes
  - remove error correction benchmark
  - schedule tx frame frequencies at web audio api rather than setInternal from the clients side
  - physical layer constructor should get configs rather than modes !!!!!!!!!!!!!!!!!!!
    in current implementation it is not possible use custom config - client needs to rely on hardcoded modes

TODO (code, less important):
  - experiment with a bit higher safeMarginFactor to produce rawByteRates like: 3, 4, 6, 8, 12, 16, 20/24?, 24/32?
  - implement Buffer class and replace code near rxRawBytes.shift(); at DataLinkLayer class
  - remove movingWindowSubArrays and use Buffer in all spec
  - implement cloneArray method in shared utils and replace all occurrences of 'slice(0)'

TODO (package):
  - find alternative for coveralls
  - refactor imports to absolute paths
*/
