// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from '@data-link-layer/frame/frame';
import { CheckAlgorithm, MinMaxRange } from '@shared/model';

export interface DataLinkLayerWrapperListenHandlers {
  next: (bytes: number[]) => void;
  complete: () => void;
}

export interface DataLinkLayerWrapperSendHandlers {
  next: (progress: number) => void;
  complete: () => void;
}

export interface FrameConfig {
  frameConfigInitializer: FrameConfigInitializer;
  frameMode: FrameMode;
  headerFirstByte?: HeaderFirstByte;
  payloadLength: MinMaxRange;
  rawBytesLength: MinMaxRange;
}

export interface FrameConfigInitializer {
  checkAlgorithm: CheckAlgorithm;
  headerLength: number;
  payloadLengthBitSize: number; // value in range <0, 8>
  payloadLengthOffset?: number; // required if payloadLengthBitSize > 0
  payloadLengthFixed?: number; // required if payloadLengthBitSize === 0
}

export type FrameConfigInitializerWithoutCheckAlgorithm = Omit<FrameConfigInitializer, 'checkAlgorithm'>;

export interface FrameCounter {
  errorCorrectedInvalid?: number;
  errorCorrectedValid?: number;
  errorCorrectedValidFake?: number;
  invalid?: number;
  valid?: number;
  validFake?: number;
}

export type FrameHistory = FrameHistoryEntry[];

export interface FrameHistoryEntry {
  frame: Frame;
  isErrorCorrected: boolean;
  rawBytePosition: number;
}

export enum FrameMode {
  Header2BytesPayloadLengthBetween1And8BytesCrc16 = 'Header2BytesPayloadLengthBetween1And8BytesCrc16',
  Header2BytesPayloadLengthFixedAt8BytesCrc16 = 'Header2BytesPayloadLengthFixedAt8BytesCrc16',
  Header3BytesPayloadLengthBetween1And8BytesCrc24 = 'Header3BytesPayloadLengthBetween1And8BytesCrc24',
  Header3BytesPayloadLengthFixedAt8BytesCrc24 = 'Header3BytesPayloadLengthFixedAt8BytesCrc24'
}

export type FrameModeToFrameConfigInitializerLookUp = {
  [key in keyof typeof FrameMode]: FrameConfigInitializer;
};

export interface HeaderFirstByte {
  checkSequenceMask: number;
  payloadLengthBitShift: number;
  payloadLengthMask: number;
}

export interface TestCaseFrameCounterWithPayload {
  frameCounter: FrameCounter;
  payload: string;
}

export interface TestCaseIntegrity {
  payload: string;
  expectedRawBytes: string;
}
