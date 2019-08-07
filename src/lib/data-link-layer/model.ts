// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataFrame } from './data-frame';

export interface DataFrameHistoryEntry {
  rawBytePosition: number;
  dataFrame: DataFrame;
}

export type DataFrameHistory = DataFrameHistoryEntry[];
