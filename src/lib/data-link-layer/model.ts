// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Frame } from './frame';

export interface FrameHistoryEntry {
  rawBytePosition: number;
  frame: Frame;
}

export type FrameHistory = FrameHistoryEntry[];
