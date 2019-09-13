// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { info } from '@';
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { audioMonoIoFactory } from '@physical-layer/audio-mono-io/audio-mono-io-factory';
import { AudioMonoIoCreateMode } from '@physical-layer/model';

describe('Index', () => {
  describe('Info', () => {
    it('should return version', () => {
      expect(info.version).toBeTruthy();
    });

    it('should return author', () => {
      expect(info.author).toBeTruthy();
    });

    it('should return githubUrl', () => {
      expect(info.githubUrl).toBeTruthy();
    });
  });

  it('should be dummy integration test that uses the lib code', () => {
    audioMonoIoFactory.audioMonoIoCreateMode = AudioMonoIoCreateMode.Stub;
    const dataLinkLayer = new DataLinkLayer();

    dataLinkLayer.setTxBytes([1, 2, 3]);
    expect(dataLinkLayer.txTimeTick(0)).toBe(true);
    expect(dataLinkLayer.txTimeTick(1)).toBe(true);
    expect(dataLinkLayer.txTimeTick(2)).toBe(true);
    expect(dataLinkLayer.txTimeTick(3)).toBe(true);
    expect(dataLinkLayer.txTimeTick(4)).toBe(true);
    expect(dataLinkLayer.txTimeTick(5)).toBe(true);
    expect(dataLinkLayer.txTimeTick(6)).toBe(false);

    dataLinkLayer.rxTimeTick(7);
    expect(dataLinkLayer.getRxBytesCollection()).toEqual([]);
  });
});
