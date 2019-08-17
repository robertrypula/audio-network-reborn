// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from './frame/frame';

export type CheckFunction = (data: number[]) => number[];

export enum CheckAlgorithm {
  Fletcher08 = 'Fletcher08',
  Fletcher16 = 'Fletcher16',
  Sha1 = 'Sha1'
}

export interface FrameConfigInterface {
  checkAlgorithm: CheckAlgorithm;
  headerFirstByteChecksumMask: number;
  headerFirstBytePayloadLengthBitShift: number;
  headerFirstBytePayloadLengthMask: number;
  headerLength: number;
  headerPayloadLengthEnabled: boolean;
  headerPayloadLengthOffset: number;
  payloadLength: number;
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
  [key in keyof typeof FrameMode]: FrameConfigInterface
};
