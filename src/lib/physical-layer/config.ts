// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { SpeedProfileConfig } from './model';

/*
  8192 - 186 ms -  6 Hz - 1536 Hz   -  5.2 FFT/s     -  2.60 B/s
  4096 -  93 ms - 12 Hz - 3072 Hz   - 10.5 FFT/s     -  5.25 B/s
  2048 -  47 ms - 24 Hz - 6144 Hz   - 20.0 FFT/s     - 10.00 B/s
  3000 - 6000   | 3000 Hz
  9000 - 15000  | 6000 Hz
 */

//                   ############
//       ############
//        -----       -----
//              -----       -----
//       012345012345012345012345
//    ---------   ---------
//          ---------   ---------
//                   ############
//       ############

export const speedProfileConfig: SpeedProfileConfig = {
  FatBandFast: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: 0.672,
    safeMarginMilliseconds: 0
  },
  FatBandSlow: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: 1.075,
    safeMarginMilliseconds: 0
  },
  NormalBandFast: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: 0.672,
    safeMarginMilliseconds: 0
  },
  NormalBandSlow: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: 1.075,
    safeMarginMilliseconds: 0
  },
  SlimBandFast: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: 0.672,
    safeMarginMilliseconds: 0
  },
  SlimBandSlow: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: 1.075,
    safeMarginMilliseconds: 0
  }
};

export const SUPPORTED_SAMPLE_RATES = [48000, 44100];
