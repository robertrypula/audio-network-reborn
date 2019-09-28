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
  const frameConfig: FrameConfig = {
    frameConfigInitializer,
    frameMode: detectFrameMode(frameConfigInitializer),
    payloadLength,
    rawBytesLength: {
      max: frameConfigInitializer.headerLength + payloadLength.max,
      min: frameConfigInitializer.headerLength + payloadLength.min
    }
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

  return {
    max: payloadLengthBitSize > 0 ? Math.pow(2, payloadLengthBitSize) - 1 + payloadLengthOffset : payloadLengthFixed,
    min: payloadLengthBitSize > 0 ? payloadLengthOffset : payloadLengthFixed
  };
};
