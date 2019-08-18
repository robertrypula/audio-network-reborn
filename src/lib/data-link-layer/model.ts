// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { CheckAlgorithm } from '..';
import { Frame } from './frame/frame';

export interface FrameConfigInterface {
  checkAlgorithm: CheckAlgorithm;
  headerFirstByteCheckSequenceMask: number;
  headerFirstBytePayloadLengthBitShift: number;
  headerFirstBytePayloadLengthMask: number;
  headerLength: number;
  headerPayloadLengthEnabled: boolean;
  headerPayloadLengthOffset: number;
  payloadLengthFixed: number;
  payloadLengthMax: number;
  payloadLengthMin: number;
}

export type FrameHistory = FrameHistoryEntryInterface[];

export interface FrameHistoryEntryInterface {
  errorCorrected: boolean;
  frame: Frame;
  rawBytePosition: number;
}

export enum FrameMode {
  Header2BytesPayloadLengthBetween1And8BytesFletcher16 = 'Header2BytesPayloadLengthBetween1And8BytesFletcher16',
  Header3BytesPayloadLengthBetween1And8BytesSha1 = 'Header3BytesPayloadLengthBetween1And8BytesSha1',
  Header3BytesPayloadLengthFixedAt8BytesSha1 = 'Header3BytesPayloadLengthFixedAt8BytesSha1'
}

export type FrameModeToFrameConfigLookUp = {
  [key in keyof typeof FrameMode]: FrameConfigInterface;
};
