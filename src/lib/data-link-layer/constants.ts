// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getBytesFromHex } from '../shared/utils';
import { FrameConfigWithoutCheckAlgorithm } from './model';

// TODO check import issue when it's not function
export const SCRAMBLE_SEQUENCE = () => getBytesFromHex('f9 cb 5d b3 ce 5a 88 5e e6 aa d3 3f bc 60 0e 8d b5');

export const HEADER_2_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES: FrameConfigWithoutCheckAlgorithm = {
  headerFirstByteCheckSequenceMask: 0x1f,
  headerFirstBytePayloadLengthBitShift: 5,
  headerFirstBytePayloadLengthMask: 0xe0,
  headerLength: 2,
  headerPayloadLengthEnabled: true,
  headerPayloadLengthOffset: 1,
  payloadLengthFixed: null,
  payloadLengthMax: 8,
  payloadLengthMin: 1,
  rawBytesLengthMax: 10,
  rawBytesLengthMin: 3
};

export const HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES: FrameConfigWithoutCheckAlgorithm = {
  headerFirstByteCheckSequenceMask: 0x1f,
  headerFirstBytePayloadLengthBitShift: 5,
  headerFirstBytePayloadLengthMask: 0xe0,
  headerLength: 3,
  headerPayloadLengthEnabled: true,
  headerPayloadLengthOffset: 1,
  payloadLengthFixed: null,
  payloadLengthMax: 8,
  payloadLengthMin: 1,
  rawBytesLengthMax: 11,
  rawBytesLengthMin: 4
};

export const HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES: FrameConfigWithoutCheckAlgorithm = {
  headerFirstByteCheckSequenceMask: null,
  headerFirstBytePayloadLengthBitShift: null,
  headerFirstBytePayloadLengthMask: null,
  headerLength: 3,
  headerPayloadLengthEnabled: false,
  headerPayloadLengthOffset: null,
  payloadLengthFixed: 8,
  payloadLengthMax: null,
  payloadLengthMin: null,
  rawBytesLengthMax: 11,
  rawBytesLengthMin: 11
};
