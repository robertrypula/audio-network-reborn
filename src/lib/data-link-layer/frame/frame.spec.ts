// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getBytesFromHex } from '../..';
import * as fromCheckAlgorithms from '../../shared/check-algorithms';
import { frameModeToFrameConfigLookUp } from '../config';
import { FrameMode } from '../model';
import { Frame } from './frame';

/*tslint:disable:no-bitwise*/

const frameMode = FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16;
const frameConfig = frameModeToFrameConfigLookUp[frameMode];

describe('Frame', () => {
  describe('getNextRawByte', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('getPayload', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('getRawBytes', () => {
    it('should properly generate raw bytes (header + payload) for given payload', () => {
      const frame = new Frame(frameConfig);
      const payload = getBytesFromHex('06 07 08 09 0a');
      const fakeCheckSequence = getBytesFromHex('0a 0b');
      const headerBytes = [
        (((payload.length - frameConfig.headerPayloadLengthOffset) & 0x07) << 5) | (fakeCheckSequence[0] & 0x1f),
        fakeCheckSequence[1]
      ];

      spyOn(fromCheckAlgorithms, 'getFletcher16').and.returnValue(fakeCheckSequence);
      expect(frame.setPayload(payload).getRawBytes()).toEqual([...headerBytes, ...payload]);
    });
  });

  describe('isEqualTo', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('isNotEqualTo', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('isValid', () => {
    it('should detect errors', () => {
      const frame = new Frame(frameConfig);
      const payload = getBytesFromHex('f6 f7 f8 f9 fa fb fc fd');

      frame.setPayload(payload);
      expect(frame.isValid()).toBe(true);
      frame.getRawBytes()[2]++;
      expect(frame.isValid()).toBe(false);
    });
  });

  describe('setPayload', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });

  describe('setRawBytes', () => {
    it('should ...', () => {
      expect(true).toBe(true); // TODO implement
    });
  });
});
