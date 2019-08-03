// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as fromConstants from './constants';
import { DataFrame } from './data-frame';
import * as utils from './utils';

/*tslint:disable:no-bitwise*/

describe('DataFrame', () => {
  describe('getCalculatedChecksumFromPayload', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getChecksumFromRawBytes', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getLengthFromPayload', () => {
    it('should ...', () => {
      expect(true).toBe(true);  // TODO implement
    });
  });

  describe('getLengthFromRawBytes', () => {
    it('should return correct length of the payload from raw bytes (header)', () => {
      const dataFrame = new DataFrame();
      const payload = [10, 20, 30, 40];

      expect(dataFrame.setPayload(payload).getLengthFromRawBytes()).toBe(payload.length);
    });
  });

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
      const dataFrame = new DataFrame();
      const payload = [0x06, 0x07, 0x08, 0x09, 0x0A];
      const fakeChecksum = [0x0A, 0x0B];
      const headerBytes = [
        (((payload.length - fromConstants.FRAME_PAYLOAD_LENGTH_OFFSET) & 0x07) << 5) | (fakeChecksum[0] & 0x1F),
        fakeChecksum[1]
      ];

      spyOn(utils, 'getFletcher16').and.returnValue(fakeChecksum);
      expect(dataFrame.setPayload(payload).getRawBytes()).toEqual([...headerBytes, ...payload]);
    });
  });

  describe('isValid', () => {
    it('should detect errors', () => {
      const dataFrame = new DataFrame();
      const payload = [0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD];

      dataFrame.setPayload(payload);
      expect(dataFrame.isValid()).toBe(true);
      dataFrame.getRawBytes()[2]++;
      expect(dataFrame.isValid()).toBe(false);
    });

    it('should detect errors when any of one byte is fully corrupted at given test payload', () => {
      const dataFrame = new DataFrame();
      const payload = [0xF6, 0xF7, 0xF8, 0xF9, 0xFA, 0xFB, 0xFC, 0xFD];
      let framesValid = 0;
      let framesInvalid = 0;

      dataFrame.setPayload(payload);
      expect(dataFrame.isValid()).toBe(true);
      utils.getAllOneByteErrorsInPlace(dataFrame.getRawBytes(), () => {
        dataFrame.isValid() ? framesValid++ : framesInvalid++;
      });
      expect(dataFrame.isValid()).toBe(true);
      expect([framesValid, framesInvalid]).toEqual([0, 255 * dataFrame.getRawBytes().length]);
    });

    it('should detect expected number of frames in long random byte stream', () => {
      const useStoredRandom = true;
      const storedRandomA = [
        0x40, 0x1D, 0xFD, 0xF3, 0x87, 0x15, 0x2A, 0xD7, 0x3C, 0x45, 0xB6, 0x3C, 0x45, 0x55, 0x10, 0x96, 0x7A, 0xCB,
        0x5C, 0x9A, 0x36, 0x82, 0xD1, 0xF7, 0x87, 0x89, 0x9E, 0xA4, 0xBE, 0xBA, 0xDF, 0xD4, 0xBD, 0x97, 0xBA, 0x44,
        0x60, 0x07, 0xAE, 0x7A, 0x40, 0xF2, 0x7A, 0x51, 0x5B, 0x4B, 0xFF, 0x64, 0x67, 0x60, 0x66, 0x6C, 0x65, 0x24
      ];
      const storedRandomB = [
        0x3D, 0xBF, 0x80, 0x37, 0xD8, 0x24, 0x05, 0x2E, 0x26, 0xE7, 0xD5, 0x57, 0xA3, 0x06, 0xA3, 0xA8, 0x75, 0xC4,
        0x60, 0xA5, 0x4B, 0x3D, 0x18, 0x13, 0xD0, 0xD4, 0xC0, 0x7E, 0x2C, 0x10, 0xEB, 0xD6, 0x80, 0x17, 0xC6, 0xDD,
        0x67, 0x3E, 0x71, 0x0E, 0xC3, 0xDF, 0x76, 0xF6, 0x2A, 0xD9, 0xAF, 0x2A, 0x1D, 0xA9, 0x46, 0xE3, 0x7F, 0x38
      ];
      const min = fromConstants.FRAME_RAW_BYTES_LENGTH_MIN;
      const max = fromConstants.FRAME_RAW_BYTES_LENGTH_MAX;
      const frameCounter = { validFake: 0, validReal: 0, invalid: 0 };
      const frameText = 'abcdefgh';
      const byteStream = [
        ...(useStoredRandom ? storedRandomA : new Array(10e6).fill(0).map(() => utils.getRandomInt(0, 255))),
        ...new DataFrame().setPayload(utils.getBytesFromString(frameText)).getRawBytes(),
        ...(useStoredRandom ? storedRandomB : new Array(10e6).fill(0).map(() => utils.getRandomInt(0, 255)))
      ];

      utils.getMovingWindowSubArrays(byteStream, min, max, (subArray) => {
        utils.getRightAlignedSubArrays(subArray, min, (rawBytes) => {
          const dataFrame = new DataFrame().setRawBytes(rawBytes);
          dataFrame.isValid()
            ? (utils.getStringFromBytes(dataFrame.getPayload()) === frameText
              ? frameCounter.validReal++
              : frameCounter.validFake++
            )
            : frameCounter.invalid++;
        });
      });
      expect(frameCounter).toEqual({ invalid: 899, validFake: 0, validReal: 1 });
      /*
        10 000 000 random bytes + 10 valid frame bytes + 10 000 000 random bytes
          - tests result A: { invalid: 159999691, validFake: 344, validReal: 1 }
          - tests result B: { invalid: 159999734, validFake: 301, validReal: 1 }
          - tests result C: { invalid: 159999716, validFake: 319, validReal: 1 }
        It means that statistically every ~62 thousands random bytes there is one fake valid frame.
        When transmission speed is 5 bytes per second then we should get a fake frame every ~3.5 hours.
       */
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
