// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithm } from '../shared/model';
import {
  HEADER_2_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES,
  HEADER_2_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES,
  HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES,
  HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES
} from './constants';
import { FrameModeToFrameConfigLookUp } from './model';

export const frameModeToFrameConfigLookUp: FrameModeToFrameConfigLookUp = {
  Header2BytesPayloadLengthBetween1And8BytesCrc16: {
    checkAlgorithm: CheckAlgorithm.Crc16,
    ...HEADER_2_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES
  },
  Header2BytesPayloadLengthFixedAt8BytesCrc16: {
    checkAlgorithm: CheckAlgorithm.Crc16,
    ...HEADER_2_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES
  },
  Header3BytesPayloadLengthBetween1And8BytesCrc24: {
    checkAlgorithm: CheckAlgorithm.Crc24,
    ...HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES
  },
  Header3BytesPayloadLengthFixedAt8BytesCrc24: {
    checkAlgorithm: CheckAlgorithm.Crc24,
    ...HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES
  }
};
