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

    /*
    it('should detect expected number of frames in long byte stream', () => {
      const dataFrame = new DataFrame();
      const validFrameRawBytes = (new DataFrame()).setPayload(utils.getBytesFromString('abcdefgh')).getRawBytes();
      let byteStream: number[] = [];
      let framesValid = 0;
      let framesInvalid = 0;
      const min = fromConstants.FRAME_RAW_BYTES_LENGTH_MIN;
      const max = fromConstants.FRAME_RAW_BYTES_LENGTH_MAX;

      for (let i = 0; i < 1000000; i++) {
        byteStream.push(utils.getRandomInt(0, 255));
      }
      byteStream = [
        ...byteStream.slice(0, byteStream.length >>> 1),
        ...validFrameRawBytes,
        ...byteStream.slice(byteStream.length >>> 1)
      ];

      utils.getMovingWindowSubArrays(byteStream, min, max, (subArray) => {
        utils.getRightAlignedSubArrays(subArray, min, (rawBytes) => {
          dataFrame.setRawBytes(rawBytes);
          if (dataFrame.isValid()) {
            framesValid++;
            console.log(
              dataFrame.getLengthFromRawBytes(), dataFrame.getPayload().map((i) => String.fromCharCode(i)).join('')
            );
          } else {
            framesInvalid++;
          }
        });
      });
      expect(framesValid + framesInvalid).toBe(8000036);
      console.log([framesValid, framesInvalid]); // .toEqual([1, 0]);

      // console.log(validFrameRawBytes.map(i => i.toString(16)).join(','));
      // console.log(byteStream.map(i => i.toString(16)).join(','));
      // for (let i = 0; i <= byteStream.length - fromConstants.FRAME_RAW_BYTES_LENGTH_MAX; i++) {
      //   for (let j = fromConstants.FRAME_RAW_BYTES_LENGTH_MIN; j <= fromConstants.FRAME_RAW_BYTES_LENGTH_MAX; j++) {
      //     // console.log(byteStream.slice(i, i + j));
      //     const rawBytes = byteStream.slice(i, i + j);
      //     // console.log('->', rawBytes.map(i => i.toString(10)).join(','));
      //
      //     dataFrame.setRawBytes(rawBytes);
      //     dataFrame.isValid() ? framesValid++ : framesInvalid++;
      //   }
      // }
      // console.log([framesValid, framesInvalid]); // .toEqual([1, 0]);
    });
    */
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
