// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { TransmissionModeToDspConfigInitialLookUp } from './model';

/*
  8192 - 186 ms -  6 Hz -  1.5 kHz   -  5.2 FFT/s     -  2.60 B/s
  4096 -  93 ms - 12 Hz -  3.0 kHz   - 10.5 FFT/s     -  5.25 B/s
  2048 -  46 ms - 22 Hz -  6.0 kHz   - 20.0 FFT/s     - 10.00 B/s
  1024 -  23 ms - 43 Hz - 12.0 kHz   - 40.0 FFT/s     - 20.00 B/s

  3000 -  6000  | 3 kHz
  1000 -  7000  | 6 kHz
  9000 - 15000  | 6 kHz
 16500 - 19500  | 3 kHz
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

const SAFE_MARGIN_FACTOR_FAST = 0.672;
const SAFE_MARGIN_FACTOR_SLOW = 1.075;

export const transmissionModeToDspConfigInitialLookUp: TransmissionModeToDspConfigInitialLookUp = {
  // Extraordinary band ~ 12.0 kHz
  ExtraordinaryBandFast: {
    fftSize: 1024,
    frequencyStart: 7500,
    safeMarginFactor: 0.85
  },
  ExtraordinaryBandSlow: {
    fftSize: 1024,
    frequencyStart: 7500,
    safeMarginFactor: 1.12
  },

  // Fat band ~ 6.0 kHz
  FatBandFastAudibleLower: {
    fftSize: 2048,
    frequencyStart: 1000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandFastAudibleUpper: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandFastInaudible: {
    fftSize: 2048,
    frequencyStart: 13500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandSlowAudibleLower: {
    fftSize: 2048,
    frequencyStart: 1000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  FatBandSlowAudibleUpper: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  FatBandSlowInaudible: {
    fftSize: 2048,
    frequencyStart: 13500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },

  // Normal band ~ 3.0 kHz
  NormalBandFastAudibleLower: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandFastAudibleUpper: {
    fftSize: 4096,
    frequencyStart: 12000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandFastInaudible: {
    fftSize: 4096,
    frequencyStart: 16500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandSlowAudibleLower: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  NormalBandSlowAudibleUpper: {
    fftSize: 4096,
    frequencyStart: 12000,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  NormalBandSlowInaudible: {
    fftSize: 4096,
    frequencyStart: 16500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },

  // Slim band ~ 1.5 kHz
  SlimBandFastAudibleLower: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandFastAudibleUpper: {
    fftSize: 8192,
    frequencyStart: 13500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandFastInaudible: {
    fftSize: 8192,
    frequencyStart: 17500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandSlowAudibleLower: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  SlimBandSlowAudibleUpper: {
    fftSize: 8192,
    frequencyStart: 13500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  SlimBandSlowInaudible: {
    fftSize: 8192,
    frequencyStart: 17500,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  }
};

export const SUPPORTED_SAMPLE_RATES = [48000, 44100];
