// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from './frame';

export interface FrameHistoryEntry {
  errorCorrected: boolean;
  frame: Frame;
  rawBytePosition: number;
}

export type FrameHistory = FrameHistoryEntry[];
