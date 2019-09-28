// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FrameConfigInitializerWithoutCheckAlgorithm } from '@data-link-layer/model';
import { getBytesFromHex } from '@shared/utils';

export const HEADER_2_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  headerLength: 2,
  payloadLengthBitSize: 3,
  payloadLengthOffset: 1
};

export const HEADER_2_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  headerLength: 2,
  payloadLengthBitSize: 0,
  payloadLengthFixed: 8
};

export const HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  headerLength: 3,
  payloadLengthBitSize: 3,
  payloadLengthOffset: 1
};

export const HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES: FrameConfigInitializerWithoutCheckAlgorithm = {
  headerLength: 3,
  payloadLengthBitSize: 0,
  payloadLengthFixed: 8
};

// TODO check import issue when it's not function
export const SCRAMBLE_SEQUENCE = () => getBytesFromHex('f9 cb 5d b3 ce 5a 88 5e e6 aa d3 3f bc 60 0e 8d b5');
