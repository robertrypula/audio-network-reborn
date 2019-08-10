// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { frameModeToFrameConfigLookUp } from '../config';
import { FrameMode } from '../model';
import * as checksumAlgorithms from './checksum-algorithms';
import { Frame } from './frame';

/*tslint:disable:no-bitwise*/

const frameMode = FrameMode.Header2BytesPayloadLengthBetween1And8BytesFletcher16;
const frameConfig = frameModeToFrameConfigLookUp[frameMode];

describe('Frame', () => {
  describe('getNextRawByte', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getPayload', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getRawBytes', () => {
    it('should properly generate raw bytes (header + payload) for given payload', () => {
      const frame = new Frame(frameMode);
      const payload = [0x06, 0x07, 0x08, 0x09, 0x0A];
      const fakeChecksum = [0x0A, 0x0B];
      const headerBytes = [
        (((payload.length - frameConfig.headerPayloadLengthOffset) & 0x07) << 5) | (fakeChecksum[0] & 0x1F),
        fakeChecksum[1]
      ];

      spyOn(checksumAlgorithms, 'getFletcher16').and.returnValue(fakeChecksum);
      expect(frame.setPayload(payload).getRawBytes()).toEqual([...headerBytes, ...payload]);
    });
  });

  describe('isEqualTo', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('isNotEqualTo', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('isValid', () => {
    it('should detect errors', () => {
      const frame = new Frame(frameMode);
      const payload = [0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD];

      frame.setPayload(payload);
      expect(frame.isValid()).toBe(true);
      frame.getRawBytes()[2]++;
      expect(frame.isValid()).toBe(false);
    });
  });

  describe('setPayload', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('setRawBytes', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });
});
