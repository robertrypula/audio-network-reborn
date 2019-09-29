// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export const libraryInfo = {
  author: 'Robert Rypuła',
  gitHub: 'https://github.com/robertrypula/audio-network-lite',
  version: '0.1.0-rc17'
};

export * from '@physical-layer/audio-mono-io/audio-mono-io-factory';
export * from '@physical-layer/audio-mono-io/stub-audio-mono-io';
export * from '@physical-layer/audio-mono-io/web-api-audio-mono-io';
export * from '@physical-layer/config';
export * from '@physical-layer/config-utils';
export * from '@physical-layer/constants';
export * from '@physical-layer/fft-result';
export * from '@physical-layer/model';
export * from '@physical-layer/physical-layer';

export * from '@data-link-layer/config';
export * from '@data-link-layer/constants';
export * from '@data-link-layer/data-link-layer';
export * from '@data-link-layer/data-link-layer-wrapper';
export * from '@data-link-layer/frame/frame';
export * from '@data-link-layer/model';
export * from '@data-link-layer/utils';

export * from '@transport-layer/transport-layer';

export * from '@application-layer/transferable-file';
export * from '@application-layer/transferable-file';

export * from '@shared/check-algorithms/check-algorithms';
export * from '@shared/environment-utils';
export * from '@shared/fixed-size-buffer';
export * from '@shared/model';
export * from '@shared/utf8/decode';
export * from '@shared/utf8/encode';
export * from '@shared/utils';
export * from '@shared/web-utils';

// export * from '@visualization/simple-canvas/simple-canvas';
// export * from '@visualization/spectrogram/spectrogram';
// export * from '@visualization/spectrogram/utils';
// export * from '@visualization/visualizers';

import '@examples/web/index.scss';
export * from '@examples/node/cli';
export * from '@examples/web/data-link-layer/chat-advanced/chat-advanced';
export * from '@examples/web/data-link-layer/chat-simple/chat-simple';
export * from '@examples/web/data-link-layer/hex-bytes-simple/hex-bytes-simple';

import { CliNodeExample } from '@examples/node/cli';
import { argc, argv, isNode } from '@shared/environment-utils';

let cliNodeExample: CliNodeExample;

// I hope that 'run.anl.cliNodeExample' argument will never collide
// with some other node project that will use my library... :)
if (isNode && argc >= 3 && argv[2] === 'run.anl.cliNodeExample') {
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
  + WebPack analyser
    https://medium.com/@kenuete/passing-arguments-from-npm-command-to-access-it-in-webpack-config-file-4358afdc3683
  + refactor imports to absolute paths
  + html loader with minification
    https://github.com/webpack-contrib/html-loader
  + migrate utf-8 codec and use them in chat examples
    https://github.com/kvz/locutus/blob/master/src/php/xml/utf8_decode.js
    https://github.com/kvz/locutus/blob/master/src/php/xml/utf8_encode.js
  + improvements at examples
    + add SCSS
    + implement advanced example HTML/CSS
    + enter sends the message
    + text and hex mode
    + history show sent and received frames
  + refactor at physical layer & data link layer configuration
    + PhysicalLayer:  dspConfig,     dspConfigInitializer,     dspMode
    + DataLinkLayer:  frameConfig,   frameConfigInitializer,   frameMode
    (+) TransportLayer: segmentConfig, segmentConfigInitializer, segmentMode    (<<<< in future)
    + set methods for updating the config in the runtime (Physical Layer)
    + set methods for updating the config in the runtime (Data Link Layer)
    + object compare function with key sorting
  + CLI 'run.cliNodeExample' run parameter needs to me more unique to avoid collision with other npm package
  - move all document methods to dom-utils.ts
  - timeTick methods should return enum rather than boolean, for example: IDLE, SYMBOL, GUARD
  - style-loader tag ID option and finalization
  - add types where missed
  - detect own transmitted frame caught by the microphone on the same machine
  - finalize advanced chat example
  - remove hex-bytes example
  - update README: add example
  - PREPARE THE RELEASE: 0.1.0

TODO #2:
  - implement ApplicationLayer/TransportLayer code with chat examples
  - PhysicalLayer should store history based on time tick values (getHistory, setHistory methods?)
  - implement 'integration' test for full stack of layers
  - PREPARE THE RELEASE: 0.2.0

TODO #3:
  - performance checker (store previous getFrequencyData array and compare with current) + example
  - experiment with scheduling tx frame frequencies at web audio api rather than setInternal from the clients side
  - experiment with a bit higher safeMarginFactor to produce rawByteRates like: 3, 4, 6, 8, 12, 16, 20/24?, 24/32?
  - check microphone constraints: https://github.com/quiet/quiet-js/blob/master/quiet.js#L565
  - add yarn task to output analyzer node viewer code (currently it's only running local server)
  - get rid of CRC lookup tables in order to reduce the bundle size
  - experiment with splitting the examples code to dedicated bundle: https://stackoverflow.com/questions/51045727
  - find alternative for coveralls
*/
