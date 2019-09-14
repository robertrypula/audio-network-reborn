// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoCreateMode, audioMonoIoFactory, DataLinkLayer, libraryInfo } from '@';

describe('Index', () => {
  describe('Library Info', () => {
    it('should return version', () => {
      expect(libraryInfo.version).toBeTruthy();
    });

    it('should return author', () => {
      expect(libraryInfo.author).toBeTruthy();
    });

    it('should return githubUrl', () => {
      expect(libraryInfo.githubUrl).toBeTruthy();
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
