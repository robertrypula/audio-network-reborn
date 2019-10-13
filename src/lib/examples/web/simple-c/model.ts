// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { Pointer } from '@examples/web/simple-c/core';

export enum Type {
  Code = 'code',
  FunctionCallOnStack = 'function-call-on-stack',
  Pointer = 'pointer',
  Unused = 'unused',
  Value = 'value'
}

export interface Byte {
  type: Type;
  value: number;
}

export interface CodeEntry {
  address: number;
  code: (bag: Pointer) => void;
}
