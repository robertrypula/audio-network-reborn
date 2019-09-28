// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP } from '@data-link-layer/config';
import { FrameConfig, FrameConfigInitializer, FrameMode, HeaderFirstByte } from '@data-link-layer/model';
import { MinMaxRange } from '@shared/model';
import { isEqual } from '@shared/utils';

/*tslint:disable:no-bitwise*/

export const detectFrameMode = (frameConfigInitializer: FrameConfigInitializer): FrameMode => {
  return Object.keys(FrameMode).find((frameMode: FrameMode) =>
    isEqual(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode], frameConfigInitializer)
  ) as FrameMode;
};

export const getFrameConfig = (frameConfigInitializer: FrameConfigInitializer): FrameConfig => {
  const payloadLength: MinMaxRange = getPayloadLength(frameConfigInitializer);
  const rawBytesLength: MinMaxRange = getRawBytesLength(frameConfigInitializer, payloadLength);
  const frameConfig: FrameConfig = {
    frameConfigInitializer,
    frameMode: detectFrameMode(frameConfigInitializer),
    payloadLength,
    rawBytesLength
  };

  if (frameConfigInitializer.payloadLengthBitSize > 0) {
    frameConfig.headerFirstByte = getHeaderFirstByte(frameConfigInitializer);
  }

  return frameConfig;
};

export const getFrameConfigsFromAllFrameModes = (): FrameConfig[] => {
  return Object.keys(FrameMode).map((frameMode: FrameMode) =>
    getFrameConfig(FRAME_MODE_TO_FRAME_CONFIG_INITIALIZER_LOOK_UP[frameMode])
  );
};

export const getHeaderFirstByte = (frameConfigInitializer: FrameConfigInitializer): HeaderFirstByte => {
  let payloadLengthMask = 0x80;

  for (let i = 0; i < frameConfigInitializer.payloadLengthBitSize - 1; i++) {
    payloadLengthMask |= payloadLengthMask >>> 1;
  }

  return {
    checkSequenceMask: 0xff & ~payloadLengthMask,
    payloadLengthBitShift: 8 - frameConfigInitializer.payloadLengthBitSize,
    payloadLengthMask
  };
};

export const getPayloadLength = (frameConfigInitializer: FrameConfigInitializer): MinMaxRange => {
  const { payloadLengthBitSize, payloadLengthFixed, payloadLengthOffset } = frameConfigInitializer;

  if (payloadLengthBitSize < 0 || payloadLengthBitSize > 8) {
    throw new Error(`Payload length bit size equal ${payloadLengthBitSize} is out of range <0, 8>`);
  }

  if (payloadLengthBitSize === 0 && payloadLengthFixed < 0) {
    throw new Error('Payload length fixed needs to be higher than zero');
  }

  return {
    max: payloadLengthBitSize > 0 ? Math.pow(2, payloadLengthBitSize) - 1 + payloadLengthOffset : payloadLengthFixed,
    min: payloadLengthBitSize > 0 ? payloadLengthOffset : payloadLengthFixed
  };
};

export const getRawBytesLength = (
  frameConfigInitializer: FrameConfigInitializer,
  payloadLength: MinMaxRange
): MinMaxRange => {
  const { headerLength } = frameConfigInitializer;

  // 20 bytes limit because the longest supported check algorithm is Sha-1
  if (headerLength < 1 || headerLength > 20) {
    throw new Error(`Header length equal ${headerLength} is out of range <1, 20>`);
  }

  return {
    max: headerLength + payloadLength.max,
    min: headerLength + payloadLength.min
  };
};
