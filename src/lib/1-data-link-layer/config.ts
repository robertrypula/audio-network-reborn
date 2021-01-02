// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import * as fromConstants from '@data-link-layer/constants';
import { FrameModeToFrameConfigInitializerLookUp } from '@data-link-layer/model';
import { CheckAlgorithm } from '@shared/model';

export const FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP: FrameModeToFrameConfigInitializerLookUp = {
  Header2BytesPayloadLengthBetween1And8BytesCrc16: {
    checkAlgorithm: CheckAlgorithm.Crc16,
    ...fromConstants.HEADER_2_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES
  },
  Header2BytesPayloadLengthFixedAt8BytesCrc16: {
    checkAlgorithm: CheckAlgorithm.Crc16,
    ...fromConstants.HEADER_2_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES
  },
  Header3BytesPayloadLengthBetween1And8BytesCrc24: {
    checkAlgorithm: CheckAlgorithm.Crc24,
    ...fromConstants.HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES
  },
  Header3BytesPayloadLengthFixedAt8BytesCrc24: {
    checkAlgorithm: CheckAlgorithm.Crc24,
    ...fromConstants.HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES
  }
};
