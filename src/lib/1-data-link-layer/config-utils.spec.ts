// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getFrameConfigsFromAllFrameModes } from '@data-link-layer/config-utils';
import { FrameMode } from '@data-link-layer/model';
import { CheckAlgorithm } from '@shared/model';

describe('Config Utils', () => {
  describe('getFrameConfigsFromAllFrameModes', () => {
    it('should return valid list', () => {
      expect(getFrameConfigsFromAllFrameModes()).toEqual([
        {
          frameConfigInitializer: {
            checkAlgorithm: CheckAlgorithm.Crc16,
            headerLength: 2,
            payloadLengthBitSize: 3,
            payloadLengthOffset: 1
          },
          frameMode: FrameMode.Header2BytesPayloadLengthBetween1And8BytesCrc16,
          headerFirstByte: { checkSequenceMask: 0x1f, payloadLengthBitShift: 5, payloadLengthMask: 0xe0 },
          payloadLength: { max: 8, min: 1 },
          rawBytesLength: { max: 10, min: 3 }
        },
        {
          frameConfigInitializer: {
            checkAlgorithm: CheckAlgorithm.Crc16,
            headerLength: 2,
            payloadLengthBitSize: 0,
            payloadLengthFixed: 8
          },
          frameMode: FrameMode.Header2BytesPayloadLengthFixedAt8BytesCrc16,
          payloadLength: { max: 8, min: 8 },
          rawBytesLength: { max: 10, min: 10 }
        },
        {
          frameConfigInitializer: {
            checkAlgorithm: CheckAlgorithm.Crc24,
            headerLength: 3,
            payloadLengthBitSize: 3,
            payloadLengthOffset: 1
          },
          frameMode: FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24,
          headerFirstByte: { checkSequenceMask: 0x1f, payloadLengthBitShift: 5, payloadLengthMask: 0xe0 },
          payloadLength: { max: 8, min: 1 },
          rawBytesLength: { max: 11, min: 4 }
        },
        {
          frameConfigInitializer: {
            checkAlgorithm: CheckAlgorithm.Crc24,
            headerLength: 3,
            payloadLengthBitSize: 0,
            payloadLengthFixed: 8
          },
          frameMode: FrameMode.Header3BytesPayloadLengthFixedAt8BytesCrc24,
          payloadLength: { max: 8, min: 8 },
          rawBytesLength: { max: 11, min: 11 }
        }
      ]);
    });
  });
});
