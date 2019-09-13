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
  rawBytesLengthMax: number;
  rawBytesLengthMin: number;
}

export type FrameConfigWithoutCheckAlgorithm = Omit<FrameConfigInterface, 'checkAlgorithm'>;

export interface FrameCounterInterface {
  errorCorrectedInvalid?: number;
  errorCorrectedValid?: number;
  errorCorrectedValidFake?: number;
  invalid?: number;
  valid?: number;
  validFake?: number;
}

export type FrameHistory = FrameHistoryEntryInterface[];

export interface FrameHistoryEntryInterface {
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
  [key in keyof typeof FrameMode]: FrameConfigInterface;
};

export interface TestCaseFrameCounterWithPayloadInterface {
  frameCounter: FrameCounterInterface;
  payload: string;
}

export interface TestCaseIntegrityInterface {
  payload: string;
  expectedRawBytes: string;
}
