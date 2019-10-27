// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { getFrameConfig } from '@data-link-layer/config-utils';
import { HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES } from '@data-link-layer/constants';
import { Frame } from '@data-link-layer/frame/frame';
import { FrameConfig } from '@data-link-layer/model';
import { CheckAlgorithm } from '@shared/model';
import { getBytesFromHex, getHexFromBytes } from '@shared/utils';

/*tslint:disable:no-bitwise*/

const frameConfig: FrameConfig = getFrameConfig({
  checkAlgorithm: CheckAlgorithm.Crc24,
  ...HEADER_3_BYTES_PAYLOAD_LENGTH_BETWEEN_1_AND_8_BYTES
});

describe('Frame', (): void => {
  describe('clone', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('getNextRawByte', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('getPayload', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('getRawBytePosition', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('getRawBytes', (): void => {
    it('should properly generate raw bytes (header + payload) for given payload', (): void => {
      // TODO implement
      // const fakeCheckSequence = getBytesFromHex('ab bc de');
      // const frame = new Frame(frameConfig);
      // const payload = getBytesFromHex('06 07 08 09 0a 43 64 34');
      //
      // spyOn(fromCheckAlgorithms, 'getCheckAlgorithmImplementation').and.callFake(() => fakeCheckSequence);
      // expect(frame.setPayload(payload).getRawBytes()).toEqual([...fakeCheckSequence, ...payload]);
    });
  });

  describe('isEqualTo', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('isNotEqualTo', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('isValid', (): void => {
    it('should detect errors', (): void => {
      // TODO implement
      // const frame = new Frame(frameConfig);
      // const payload = getBytesFromHex('f6 f7 f8 f9 fa fb fc fd');
      // let checksum = getBytesFromHex('ab cd ef');
      //
      // spyOn(fromCheckAlgorithms, 'getCheckAlgorithmImplementation').and.returnValue(() => () => [...checksum]);
      // frame.setPayload(payload);
      // expect(frame.isValid()).toBe(true);
      // frame.getRawBytes()[2]++;
      // // checksum[0]++;
      // expect(frame.isValid()).toBe(false);
    });
  });

  describe('setPayload', (): void => {
    it('should ...', (): void => {
      // TODO implement
    });
  });

  describe('setRawBytes', (): void => {
    it('should properly set raw bytes', (): void => {
      const validRawBytes = '7d 54 3e 33 41 ec 66';
      const frame = new Frame(frameConfig);

      frame.setRawBytes(getBytesFromHex(validRawBytes));
      expect(getHexFromBytes(frame.getRawBytes())).toEqual(validRawBytes);
      expect(frame.isValid()).toBe(true);
    });
  });
});
