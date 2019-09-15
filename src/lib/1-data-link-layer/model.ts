// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from '@data-link-layer/frame/frame';
import { CheckAlgorithm } from '@shared/model';

export interface DataLinkLayerWrapperListenHandlers {
  next: (bytes: number[]) => void;
  complete: () => void;
}

export interface DataLinkLayerWrapperSendHandlers {
  next: (progress: number) => void;
  complete: () => void;
}

export interface FrameConfig {
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
  rawBytesLengthMax: number;
  rawBytesLengthMin: number;
}

export type FrameConfigWithoutCheckAlgorithm = Omit<FrameConfig, 'checkAlgorithm'>;

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

export type FrameModeToFrameConfigLookUp = {
  [key in keyof typeof FrameMode]: FrameConfig;
};

export interface TestCaseFrameCounterWithPayload {
  frameCounter: FrameCounter;
  payload: string;
}

export interface TestCaseIntegrity {
  payload: string;
  expectedRawBytes: string;
}
