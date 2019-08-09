// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { FrameModeToFrameConfigLookUp } from './model';

export const frameModeToFrameConfigLookUp: FrameModeToFrameConfigLookUp = {
  Header2BytesPayloadLengthBetween1And8: {
    headerLength: 2,
    payloadLengthMax: 8,
    payloadLengthMin: 1,
    payloadLengthOffset: 1,
    rawBytesLengthMax: 2 + 8,
    rawBytesLengthMin: 2 + 1
  }
};
