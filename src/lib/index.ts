// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export * from './info';

export * from './0-physical-layer/audio-mono-io/audio-mono-io-factory';
export * from './0-physical-layer/audio-mono-io/audio-mono-io-stub';
export * from './0-physical-layer/audio-mono-io/audio-mono-io-web-audio-api';
export * from './0-physical-layer/config';
export * from './0-physical-layer/constants';
export * from './0-physical-layer/fft-result';
export * from './0-physical-layer/model';
export * from './0-physical-layer/physical-layer';
export * from './0-physical-layer/utils';
export * from './1-data-link-layer/config';
export * from './1-data-link-layer/constants';
export * from './1-data-link-layer/data-link-layer';
export * from './1-data-link-layer/data-link-layer-wrapper';
export * from './1-data-link-layer/frame/frame';
export * from './1-data-link-layer/model';
export * from './1-data-link-layer/utils';
export * from './3-transport-layer/transport-layer';
export * from './4-application-layer/transferable-file';
export * from './4-application-layer/transferable-file';
export * from './shared/check-algorithms/check-algorithms';
export * from './shared/environment-utils';
export * from './shared/fixed-size-buffer';
export * from './shared/model';
export * from './shared/utils';
export * from './shared/web-utils';
// export * from './visualization/simple-canvas/simple-canvas';
// export * from './visualization/spectrogram/spectrogram';
// export * from './visualization/spectrogram/utils';
// export * from './visualization/visualizers';

import './examples/web/index.scss';
export * from './examples/node/cli';
export * from './examples/web/data-link-layer/ascii-chat-advanced/ascii-chat-advanced';
export * from './examples/web/data-link-layer/ascii-chat-simple/ascii-chat-simple';
export * from './examples/web/data-link-layer/hex-bytes-simple/hex-bytes-simple';

import { CliNodeExample } from './examples/node/cli';
import { argc, argv, isNode } from './shared/environment-utils';

let cliNodeExample: CliNodeExample;

// I hope that 'run.cliNodeExample' argument will never collide
// with some other node project that will use my library... :)
if (isNode && argc >= 3 && argv[2] === 'run.cliNodeExample') {
  cliNodeExample = new CliNodeExample();
}

/*
TODO #1:
  + move example to lib (web-examples directory)
  + rename methods at Data Link class: setTxBytes, getRxBytes
  + move configs outside package.json: jest, prettier
  + source map in prod? NO!!
  + PhysicalLayer class should have rxTimeTick and txTimeTick methods, DataLinkLayer class should
    have mandatory parameters in txTimeTick rxTimeTick that is passed to PhysicalLayer and AudioMonoIo
  + comment console logs!!
  + remove node-dev, just use condition and args like node audio-network.js run.cliNodeExample
  -/+ finalize examples
    + add SCSS
    + implement advanced example HTML/CSS
    + enter sends the message
    + text and hex mode
    + history show sent and received frames
    - detect own transmitted frame caught by the microphone on the same machine
    - finalize advanced chat example
    - remove hex-bytes example
  - html loader with minification
    https://github.com/webpack-contrib/html-loader
  - migrate utf-8 codec and use them in chat examples
    https://github.com/kvz/locutus/blob/master/src/php/xml/utf8_decode.js
    https://github.com/kvz/locutus/blob/master/src/php/xml/utf8_encode.js
  - update README: add example
  - refactor imports to absolute paths
  - find alternative for coveralls
  - PREPARE THE RELEASE: 0.1.0

TODO #2:
  - WebPack analyser
    https://medium.com/@kenuete/passing-arguments-from-npm-command-to-access-it-in-webpack-config-file-4358afdc3683
  - extract the code
    https://stackoverflow.com/questions/51045727
  - implement ApplicationLayer/TransportLayer, key ideas:
    - files on chat send by starting the byte stream by ASCII 0x1C File Separator byte
      STREAM DETAILS: 0x1C {filename bytes in UTF-8} 0x00 {bytes of the file}
  - performance checker (store previous getFrequencyData array and compare with current) + example
  - schedule tx frame frequencies at web audio api rather than setInternal from the clients side
    UPDATE: Maybe not implement it? :) In general all works fine up to ~15 raw bytes per second
  - PREPARE THE RELEASE: 0.2.0

TODO #3:
  - PhysicalLayer should store history based on time tick values (getHistory, setHistory methods?)
    UPDATE: abstract class that handles history and virtual methods to be implemented in real classes (?)
    UPDATE: getFrequencyDomainData could return null (or []) when history record will end
  - physical layer constructor should get configs rather than modes !!!!!!!!!!!!!!!!!!!
    in current implementation it is not possible use custom config - client needs to rely on hardcoded modes
    UPDATE: ...or add dedicated method to set custom config for those that want to experiment
  - experiment with a bit higher safeMarginFactor to produce rawByteRates like: 3, 4, 6, 8, 12, 16, 20/24?, 24/32?
  - check constraints https://github.com/quiet/quiet-js/blob/master/quiet.js#L565
*/
