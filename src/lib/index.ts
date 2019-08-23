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
  + rename checksum to FCS (Frame Check Sequence)
  + re-implement frame-modes-benchmark.spec.ts to really show how different frame config works
  - migrate CRC32 implementation from https://github.com/kvz/locutus/blob/master/src/php/strings/crc32.js
    or even better, try CRC24:
    - https://github.com/latysheff/node-polycrc/blob/master/polycrc.js#L155
    - https://dev.flarecast.eu/stash/projects/SAND/repos/swagger-ui/browse/node_modules/crc/lib/crc24.js
    - https://github.com/alexgorbatchev/node-crc/blob/master/lib/es6/crc24.js
    - https://stackoverflow.com/questions/18638900/javascript-crc32
  - extent frame modes with CRC frame modes
  - extend frame-modes-benchmark with CRC frame modes
  + add bytes scrambling to the data link layer frame
  + implement wrapper for all methods (rightAlignedSubArrays, scrambledSubArrays?, allOneItemErrors)
    that find frameCandidate in byte stream slice
    + not valid anymore: IMPORTANT do not copy rawBytes at every iteration - copy it only when isValid returns true
    + implement clone method at frame
  - schedule tx frame frequencies at web audio api rather than setInternal from the clients side
  - experiment with a bit higher safeMarginFactor to produce rawByteRates like: 3, 4, 6, 8, 12, 16, 20/24?, 24/32?
  - physical layer constructor should get configs rather than modes !!!!!!!!!!!!!!!!!!!
    in current implementation it is not possible use custom config - client needs to rely on hardcoded modes

TODO (code, less important):
  - implement Buffer class and replace code near rxRawBytes.shift(); at DataLinkLayer class
  - implement cloneArray method in shared utils and replace all occurrences of 'slice(0)'

TODO (package):
  - find alternative for coveralls
  - refactor imports to absolute paths
*/
