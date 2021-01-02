// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import {
  FrameConfigInitializerWithoutCheckAlgorithm,
  FrameCounter,
  FrameCounterSimple,
  HeaderFirstByte
} from '@data-link-layer/model';
import { getBytesFromHex } from '@shared/utils';

// those constants are really bad... refactor it
export const ERROR_CORRECTED_FALSE = false;
export const ERROR_CORRECTED_TRUE = true;
export const INPUT_DISABLE_FALSE = false;
export const INPUT_DISABLE_TRUE = true;
export const NOTIFY_COMPLETE_FALSE = false;
export const NOTIFY_COMPLETE_TRUE = true;
export const OUTPUT_DISABLE_FALSE = false;
export const OUTPUT_DISABLE_TRUE = true;

export const FRAME_COUNTER_WITH_ZEROS: FrameCounter = {
  errorCorrectedInvalid: 0,
  errorCorrectedValid: 0,
  errorCorrectedValidFake: 0,
  invalid: 0,
  valid: 0,
  validFake: 0
};

export const FRAME_COUNTER_SIMPLE_WITH_ZEROS: FrameCounterSimple = { errorCorrected: 0, nonErrorCorrected: 0 };

export const GUARD_FACTOR = 0.25;

export const HEADER_2_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  guardFactor: GUARD_FACTOR,
  headerLength: 2,
  payloadLengthBitSize: 3,
  payloadLengthOffset: 1
};

export const HEADER_2_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  guardFactor: GUARD_FACTOR,
  headerLength: 2,
  payloadLengthBitSize: 0,
  payloadLengthFixed: 8
};

export const HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  guardFactor: GUARD_FACTOR,
  headerLength: 3,
  payloadLengthBitSize: 3,
  payloadLengthOffset: 1
};

export const HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  guardFactor: GUARD_FACTOR,
  headerLength: 3,
  payloadLengthBitSize: 0,
  payloadLengthFixed: 8
};

export const HEADER_FIRST_BYTE_EMPTY: HeaderFirstByte = {
  checkSequenceMask: null,
  payloadLengthBitShift: null,
  payloadLengthMask: null
};

// TODO check import issue when it's not function
export const GET_SCRAMBLE_SEQUENCE = (): number[] =>
  getBytesFromHex('f9 cb 5d b3 ce 5a 88 5e e6 aa d3 3f bc 60 0e 8d b5');
