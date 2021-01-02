// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { FrameConfig, FrameInterface, FrameStubHooks } from '@data-link-layer/model';

export const frameStubHooks: FrameStubHooks = {
  isValid: null
};

export class FrameStub implements FrameInterface {
  protected rawBytes: number[] = [];

  public constructor(protected readonly frameConfig: FrameConfig) {}

  public clone(): FrameInterface {
    return this;
  }

  public getNextRawByte(): number {
    return null;
  }

  public getPayload(): number[] {
    return this.rawBytes.slice(this.frameConfig.frameConfigInitializer.headerLength);
  }

  public getRawBytePosition(): number {
    return 0;
  }

  public getRawBytes(): number[] {
    return this.rawBytes;
  }

  public isEqualTo(frame: FrameInterface): boolean {
    return this.rawBytes.join(',') === frame.getRawBytes().join(',');
  }

  public isNotEqualTo(frame: FrameInterface): boolean {
    return true;
  }

  public isValid(): boolean {
    return frameStubHooks.isValid ? frameStubHooks.isValid(this) : false;
  }

  public setPayload(payload: number[]): FrameInterface {
    return this;
  }

  public setRawBytes(rawBytes: number[]): FrameInterface {
    this.rawBytes = rawBytes;

    return this;
  }
}
