// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES } from '@data-link-layer/constants';
import { FrameConfigInterface } from '@data-link-layer/model';

/*tslint:disable:no-bitwise*/

const frameConfig: FrameConfigInterface = {
  checkAlgorithm: null,
  ...HEADER_3_BYTES_PAYLOAD_LENGTH_FIXED_AT_8_BYTES
};

describe('Frame', () => {
  describe('clone', () => {
    it('should ...', () => {
      // TODO implement
    });
  });
  describe('getNextRawByte', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('getPayload', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('getRawBytePosition', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('getRawBytes', () => {
    it('should properly generate raw bytes (header + payload) for given payload', () => {
      // TODO implement
      // const fakeCheckSequence = getBytesFromHex('ab bc de');
      // const frame = new Frame(frameConfig);
      // const payload = getBytesFromHex('06 07 08 09 0a 43 64 34');
      //
      // spyOn(fromCheckAlgorithms, 'getCheckAlgorithmImplementation').and.callFake(() => fakeCheckSequence);
      // expect(frame.setPayload(payload).getRawBytes()).toEqual([...fakeCheckSequence, ...payload]);
    });
  });

  describe('isEqualTo', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('isNotEqualTo', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('isValid', () => {
    it('should detect errors', () => {
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

  describe('setPayload', () => {
    it('should ...', () => {
      // TODO implement
    });
  });

  describe('setRawBytes', () => {
    it('should ...', () => {
      // TODO implement
    });
  });
});
