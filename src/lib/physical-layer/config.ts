// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { TransmissionModeToDspConfigInitialLookUp } from './model';

/*
  8192 - 186 ms -  6 Hz - 1536 Hz   -  5.2 FFT/s     -  2.60 B/s
  4096 -  93 ms - 12 Hz - 3072 Hz   - 10.5 FFT/s     -  5.25 B/s
  2048 -  46 ms - 22 Hz - 6144 Hz   - 20.0 FFT/s     - 10.00 B/s
  1024 -  23 ms - 43 Hz - 12.0 kHz  - 40.0 FFT/s     - 20.00 B/s
  3000 - 6000   | 3000 Hz
  9000 - 15000  | 6000 Hz
 */

/*
5,859375 48.0   171 ms   12 Hz spacing, 3072 Hz band
5,383301 44.1   186 ms   12 Hz spacing, 3072 Hz band

         48.0   86 ms   24 Hz spacing, 6.1 Hz band
         44.1   93 ms   24 Hz spacing, 6.1 Hz band

					8 FFT/s
					4 bytes/s
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
  FatBandFast: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: 0.672
  },
  FatBandSlow: {
    fftSize: 2048,
    frequencyStart: 9000,
    safeMarginFactor: 1.075
  },
  NormalBandFast: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: 0.672
  },
  NormalBandSlow: {
    fftSize: 4096,
    frequencyStart: 3000,
    safeMarginFactor: 1.075
  },
  SlimBandFast: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: 0.672
  },
  SlimBandSlow: {
    fftSize: 8192,
    frequencyStart: 4500,
    safeMarginFactor: 1.075
  }
};

export const SUPPORTED_SAMPLE_RATES = [48000, 44100];
