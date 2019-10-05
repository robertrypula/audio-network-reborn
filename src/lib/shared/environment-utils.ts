// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

/*
  Implementation of isNode and isBrowser based on:
  - https://stackoverflow.com/a/33697246
  - https://github.com/foo123/asynchronous.js/blob/0.5.1/asynchronous.js#L40
  - https://stackoverflow.com/a/48536881
*/

export const isNode: boolean = typeof global !== 'undefined' && toString.call(global) === '[object global]';

export const isBrowser: boolean =
  !isNode && typeof navigator !== 'undefined' && typeof document !== 'undefined' && typeof window !== 'undefined';

export const argv: string[] = isNode ? global.process.argv : [];

export const argc: number = isNode ? argv.length : 0;

export const process: NodeJS.Process = isNode ? global.process : null;
