// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from './frame/frame';

export interface FrameConfigInterface {
  headerLength: number;
  payloadLengthMax: number;
  payloadLengthMin: number;
  payloadLengthOffset: number;
  rawBytesLengthMax: number;
  rawBytesLengthMin: number;
}

export type FrameHistory = FrameHistoryEntryInterface[];

export interface FrameHistoryEntryInterface {
  errorCorrected: boolean;
  frame: Frame;
  rawBytePosition: number;
}

export enum FrameMode {
  Header2BytesPayloadLengthBetween1And8 = 'Header2BytesPayloadLengthBetween1And8'
}

export type FrameModeToFrameConfigLookUp = {
  [key in keyof typeof FrameMode]: FrameConfigInterface
};
