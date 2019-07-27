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

export const transmissionModeToDspConfigInitialLookUp: TransmissionModeToDspConfigInitialLookUp = {
  // Extraordinary band ~ 12.0 kHz
  ExtraordinaryBandSlow: {
    fftSize: 1024,
    frequencyStart: 7500,
    safeMarginFactor: 1.075
  },

  // Fat band ~ 6.0 kHz
  FatBandFastAudibleUpper: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: 0.672
  },
  FatBandSlowAudibleUpper: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: 1.075
  },

  // Normal band ~ 3.0 kHz
  NormalBandFastAudibleLower: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: 0.672
  },
  NormalBandFastAudibleUpper: {
    fftSize: 4096,
    frequencyStart: 12000,
    safeMarginFactor: 0.672
  },
  NormalBandFastInaudible: {
    fftSize: 4096,
    frequencyStart: 16500,
    safeMarginFactor: 0.672
  },
  NormalBandSlowAudibleLower: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: 1.075
  },
  NormalBandSlowAudibleUpper: {
    fftSize: 4096,
    frequencyStart: 12000,
    safeMarginFactor: 1.075
  },
  NormalBandSlowInaudible: {
    fftSize: 4096,
    frequencyStart: 16500,
    safeMarginFactor: 1.075
  },

  // Slim band ~ 1.5 kHz
  SlimBandFastAudibleLower: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: 0.672
  },
  SlimBandSlowAudibleLower: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: 1.075
  }
};

export const SUPPORTED_SAMPLE_RATES = [48000, 44100];
