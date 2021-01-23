// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { FREQUENCY_08_0_KHZ, FREQUENCY_16_0_KHZ, FREQUENCY_19_5_KHZ } from '@physical-layer/constants';
import { DspModeToDspConfigInitializerLookUp } from '@physical-layer/model';

export const FREQUENCY_MARGIN = 800;
export const FREQUENCY_FORBIDDEN_RANGE: Array<[number, number]> = [
  [FREQUENCY_08_0_KHZ - FREQUENCY_MARGIN, FREQUENCY_08_0_KHZ + FREQUENCY_MARGIN],
  [FREQUENCY_16_0_KHZ - FREQUENCY_MARGIN, FREQUENCY_16_0_KHZ + FREQUENCY_MARGIN],
  [FREQUENCY_19_5_KHZ - FREQUENCY_MARGIN, +Infinity]
];
export const FREQUENCY_END_LOWER = FREQUENCY_08_0_KHZ - FREQUENCY_MARGIN;
export const FREQUENCY_END_UPPER = FREQUENCY_16_0_KHZ - FREQUENCY_MARGIN;
export const FREQUENCY_END_INAUDIBLE = FREQUENCY_19_5_KHZ - FREQUENCY_MARGIN;

/*
  Bands that avoids 8 kHz and 16 kHz:

     3000 -  6000  | 3 kHz
     1000 -  7000  | 6 kHz
     9000 - 15000  | 6 kHz
    16500 - 19500  | 3 kHz

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  SAFE_MARGIN_FACTOR_FAST (~0.72 in example below):
              ..................      ..................          longestFftWindowTimeMilliseconds #1
  ..................      ..................                      longestFftWindowTimeMilliseconds #2
  `           `           `           `           `           `   rxIntervalMilliseconds intervals
  '                       '                       '               txIntervalMilliseconds intervals

  SAFE_MARGIN_FACTOR_SLOW (~1.11 in example below):
                     ..................                    ..................     longestFftWindowTimeMilliseconds #1
  ..................                    ..................                        longestFftWindowTimeMilliseconds #2
  `                  `                  `                  `                  `   rxIntervalMilliseconds intervals
  '                                     '                                     '   txIntervalMilliseconds intervals

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Simplified formula to understand the relation between parameters:

    rxIntervalMilliseconds = CEIL(safeMarginFactor * longestFftWindowTimeMilliseconds)
    txIntervalMilliseconds = 2 * rxIntervalMilliseconds

  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  Theoretical limits (safeMarginFactor = 0.5):

    +-----------------+-----------+------------------------------------+------------+-------------+---------------+
    |    band name    |  fftSize  |  longestFftWindowTimeMilliseconds  | resolution |  bandwidth  |  rawByteRate  |
    +-----------------+-----------+------------------------------------+------------+-------------+---------------+
    |  Extraordinary  |    1024   |                          23.2 ms   |            |   12.0 kHz  |    43.07 B/s  |
    |  Fat            |    2048   |                          46.4 ms   |            |    6.0 kHz  |    21.53 B/s  |
    |  Normal         |    4096   |                          92.9 ms   |            |    3.0 kHz  |    10.77 B/s  |
    |  Slim           |    8192   |                         185.8 ms   |            |    1.5 kHz  |     5.38 B/s  |
    +-----------------+-----------+------------------------------------+------------+-------------+---------------+
                                           longestFftWindowTimeMilliseconds occurs on slowest sampleRate (44.1 kHz)
                      bandwidth assumes worst frequency bin resolution that occurs on fastest sampleRate (48.0 kHz)
           bandwidth shows minimal required bandwidth that can hold 256 frequency bins (8/16 kHz gaps NOT included)
                                                                             on 48.0 kHz there is still some margin
                                                                                     on 44.1 kHz it's on the limits
*/

const SAFE_MARGIN_FACTOR_FAST = 0.672;
const SAFE_MARGIN_FACTOR_SLOW = 1.075;

export const DSP_MODE_TO_DSP_CONFIG_INITIALIZER_LOOK_UP: DspModeToDspConfigInitializerLookUp = {
  // Extraordinary band ~ 12.0 kHz
  ExtraordinaryBandFast: {
    fftSize: 1024,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: 0.85
  },
  ExtraordinaryBandSlow: {
    fftSize: 1024,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: 1.12
  },

  // Fat band ~ 6.0 kHz
  FatBandFastAudibleLower: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandFastAudibleUpper: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandFastInaudible: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  FatBandSlowAudibleLower: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  FatBandSlowAudibleUpper: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  FatBandSlowInaudible: {
    fftSize: 2048,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },

  // Normal band ~ 3.0 kHz
  NormalBandFastAudibleLower: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandFastAudibleUpper: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandFastInaudible: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  NormalBandSlowAudibleLower: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  NormalBandSlowAudibleUpper: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  NormalBandSlowInaudible: {
    fftSize: 4096,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },

  // Slim band ~ 1.5 kHz
  SlimBandFastAudibleLower: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandFastAudibleUpper: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandFastInaudible: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_FAST
  },
  SlimBandSlowAudibleLower: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_LOWER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  SlimBandSlowAudibleUpper: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_UPPER,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  },
  SlimBandSlowInaudible: {
    fftSize: 8192,
    frequencyEnd: FREQUENCY_END_INAUDIBLE,
    safeMarginFactor: SAFE_MARGIN_FACTOR_SLOW
  }
};

export const SUPPORTED_SAMPLE_RATES: [number, number] = [48000, 44100]; // only these two samples rates are supported
