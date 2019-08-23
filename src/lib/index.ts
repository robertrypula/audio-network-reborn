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
export * from './shared/check-algorithms/check-algorithms';
export * from './shared/fixed-size-buffer';
export * from './shared/model';
export * from './shared/utils';
// export * from './visualization/simple-canvas/simple-canvas';
// export * from './visualization/spectrogram/spectrogram';
// export * from './visualization/spectrogram/utils';
// export * from './visualization/visualizers';
export * from './web-examples/data-link-layer-basic/data-link-layer-basic';

/*
TODO #1:
  + move example to lib (web-examples directory)
  - finalize example: enter sends the message, text and hex mode, history show sent and received frames
  + rename methods at Data Link class: setTxBytes, getRxBytes
  + move configs outside package.json: jest, prettier
  + source map in prod? NO!!
  - PhysicalLayer class should have rxTimeTick and txTimeTick methods, DataLinkLayer class should
    have mandatory parameters in txTimeTick rxTimeTick that is passed to PhysicalLayer
  + comment console logs!!
  - PREPARE THE RELEASE: 0.1.0

TODO #2:
  - refactor imports to absolute paths
  - find alternative for coveralls
  - schedule tx frame frequencies at web audio api rather than setInternal from the clients side
  - PREPARE THE RELEASE: 0.2.0

TODO #3:
  - PhysicalLayer should store history based on time tick values (getHistory, setHistory methods?)
    UPDATE: abstract class that handles history and virtual methods to be implemented in real classes (?)
  - physical layer constructor should get configs rather than modes !!!!!!!!!!!!!!!!!!!
    in current implementation it is not possible use custom config - client needs to rely on hardcoded modes
    UPDATE: ...or add dedicated method to set custom config for those that want to experiment
  - experiment with a bit higher safeMarginFactor to produce rawByteRates like: 3, 4, 6, 8, 12, 16, 20/24?, 24/32?
  - check constraints https://github.com/quiet/quiet-js/blob/master/quiet.js#L565
*/
