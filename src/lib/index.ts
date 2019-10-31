// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export const libraryInfo = {
  author: 'Robert Rypuła',
  gitHub: 'https://github.com/robertrypula/audio-network-reborn',
  version: '0.1.0-rc20'
};

export * from '@physical-layer/audio-mono-io/audio-mono-io';
export * from '@physical-layer/audio-mono-io/audio-mono-io-stub';
export * from '@physical-layer/config';
export * from '@physical-layer/config-utils';
export * from '@physical-layer/constants';
export * from '@physical-layer/fft-result';
export * from '@physical-layer/model';
export * from '@physical-layer/physical-layer';
export * from '@physical-layer/physical-layer-stub';

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

// I hope that 'audioNetworkReborn.run.nodeExample' argument will never collide
// with some other node project that will use my library... :)
if (isNode && argc >= 3 && argv[2] === 'audioNetworkReborn.run.nodeExample') {
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
  + move all document methods to dom-utils.ts
  + style-loader tag ID option and finalization
  + timeTick methods should return enum rather than boolean, for example: IDLE, SYMBOL, GUARD
  + validation on physical layer config
  + fix getTxProgress value (take into account that guard interval is a fraction of symbol time)
  + add guard interval factor to frame config
  + rename the project to audio-network-reborn as it wont be lite - I have big plans for this project ;)
  + add types where missed but avoid adding trivial types (const test = 324 or const frame = new Frame(frameConfig))
    + add types to parameters at function handlers
  + rename scramble to scrambleSequence
  + find better names for allOneItemErrors, rightAlignedSubArrays and scrambledSubArrays methods
  + finalize unit tests for scrambler method
  + group interfaces, types and enums in model.ts files & check if all all methods and functions are AZ sorted
  + fix issue: you cannot build just after cloning as Prettier is complaining about End Of Lines
  + replace true/false values passed to functions with Enum (mostly in src/lib/1-data-link-layer/utils.ts)
  + prevent uncompleted rxRawBytes buffer from being processed at rxTimeTick
  + use 'type' instead of 'interface' in types that never be implemented by any class
  + implement data-link-layer unit tests
  + adds return types to all arrow functions
  - detect own transmitted frame caught by the microphone on the same machine and refactor history handling:
      + we don't need separate history for odd & even rxRawBytes,
      + we can return frames at getRxBytesCollection/getRxBytesErrorCorrectedCollection directly from history
      - add createFrame and FrameInterface, as currently it's not possible to mock isValid function
      - add unit test for multiple valid frames detection (scramble sequence equal [0] for test simplification purposes)
  - find better solution for TRUE/FALSE constants in 1-data-link-layer/constant.ts file
  - add wrappers for setTimeout, setInterval and 'new Date().getTime()' at shared directory
  - finalize advanced chat example
  - remove hex-bytes example
  - rename CliNodeExample?
  - update README: add example
  - PREPARE THE RELEASE: 0.1.0

TODO #2:
  - reduce the sequence number length
  - add createDataLinkLayer function (same as PhysicalLayer/AudioMonoIo) and DataLinkLayerInterface
  - implement ApplicationLayer/TransportLayer code with chat examples
  - PhysicalLayer should store history based on time tick values (getHistory, setHistory methods?)
  - implement 'integration' test for full stack of layers and refactor data-link-layer.spec.ts
  - PREPARE THE RELEASE: 0.2.0

TODO #3:
  - performance checker (store previous getFrequencyData array and compare with current) + example
  - experiment with scheduling tx frame frequencies at web audio api rather than setInternal from the clients side
  - experiment with a bit higher safeMarginFactor to produce rawByteRates like: 3, 4, 6, 8, 12, 16, 20/24?, 24/32?
  - check microphone constraints: https://github.com/quiet/quiet-js/blob/master/quiet.js#L565
  - add yarn task to output analyzer node viewer code (currently it's only running local server)
  - get rid of CRC lookup tables in order to reduce the bundle size
  - replace css-loader with custom code
  - experiment with splitting the examples code to dedicated bundle: https://stackoverflow.com/questions/51045727
  - find alternative for coveralls
  - migrate FFT implementation from root AudioNetwork project, experiment with OFDM symbols
  - https://stackoverflow.com/questions/40755149/how-to-keep-my-shebang-in-place-using-webpack
*/
