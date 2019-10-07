// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from '@data-link-layer/frame/frame';
import { CheckAlgorithm, MinMaxRange } from '@shared/model';

export enum FrameMode {
  Header2BytesPayloadLengthBetween1And8BytesCrc16 = 'Header2BytesPayloadLengthBetween1And8BytesCrc16',
  Header2BytesPayloadLengthFixedAt8BytesCrc16 = 'Header2BytesPayloadLengthFixedAt8BytesCrc16',
  Header3BytesPayloadLengthBetween1And8BytesCrc24 = 'Header3BytesPayloadLengthBetween1And8BytesCrc24',
  Header3BytesPayloadLengthFixedAt8BytesCrc24 = 'Header3BytesPayloadLengthFixedAt8BytesCrc24'
}

export enum RxTimeTickState {
  Listening = 'Listening',
  Stopped = 'Stopped'
}

export enum ScramblerMode {
  Scramble = 'Scramble',
  UnScramble = 'UnScramble'
}

export enum TxTimeTickState {
  Guard = 'Guard',
  Idle = 'Idle',
  Symbol = 'Symbol'
}

// -----------------------------------------------------------------------------

export interface DataLinkLayerWrapperListenHandlers {
  next: (bytes: number[], isErrorCorrected: boolean) => void;
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
  guardFactor: number;
  headerLength: number;
  payloadLengthBitSize: number; // value in range <0, 8>
  payloadLengthFixed?: number; // required if payloadLengthBitSize === 0
  payloadLengthOffset?: number; // required if payloadLengthBitSize > 0
}

export interface FrameCounter {
  errorCorrectedInvalid?: number;
  errorCorrectedValid?: number;
  errorCorrectedValidFake?: number;
  invalid?: number;
  valid?: number;
  validFake?: number;
}

export interface FrameCounterSimple {
  errorCorrected: number;
  nonErrorCorrected: number;
}

export interface FrameHistoryEntry {
  frame: Frame;
  isErrorCorrected: boolean;
  rawBytePosition: number;
}

export interface HeaderFirstByte {
  checkSequenceMask: number;
  payloadLengthBitShift: number;
  payloadLengthMask: number;
}

export interface TestCaseFrameCounterWithPayload {
  frameCounter: FrameCounter;
  payload: string;
}

export interface TestCaseFrameIntegrity {
  payload: string;
  expectedRawBytes: string;
}

// -----------------------------------------------------------------------------

export type FrameConfigInitializerWithoutCheckAlgorithm = Omit<FrameConfigInitializer, 'checkAlgorithm'>;

export type FrameHistory = FrameHistoryEntry[];

export type FrameModeToFrameConfigInitializerLookUp = {
  [key in keyof typeof FrameMode]: FrameConfigInitializer;
};
