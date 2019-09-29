// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  AudioMonoIoCreateMode,
  audioMonoIoFactory,
  DataLinkLayer,
  libraryInfo,
  RxTimeTickState,
  TxTimeTickState
} from '@';

describe('Index', () => {
  describe('Library Info', () => {
    it('should return version', () => {
      expect(libraryInfo.version).toBeTruthy();
    });

    it('should return author', () => {
      expect(libraryInfo.author).toBeTruthy();
    });

    it('should return gitHub', () => {
      expect(libraryInfo.gitHub).toBeTruthy();
    });
  });

  it('should be dummy integration test that uses the lib code', () => {
    audioMonoIoFactory.audioMonoIoCreateMode = AudioMonoIoCreateMode.Stub;
    const dataLinkLayer = new DataLinkLayer();

    dataLinkLayer.setTxBytes([1, 2, 3]);
    expect(dataLinkLayer.txTimeTick(0)).toBe(TxTimeTickState.Symbol);
    expect(dataLinkLayer.txTimeTick(1)).toBe(TxTimeTickState.Symbol);
    expect(dataLinkLayer.txTimeTick(2)).toBe(TxTimeTickState.Symbol);
    expect(dataLinkLayer.txTimeTick(3)).toBe(TxTimeTickState.Symbol);
    expect(dataLinkLayer.txTimeTick(4)).toBe(TxTimeTickState.Symbol);
    expect(dataLinkLayer.txTimeTick(5)).toBe(TxTimeTickState.Symbol);
    expect(dataLinkLayer.txTimeTick(6)).toBe(TxTimeTickState.Guard);
    expect(dataLinkLayer.txTimeTick(7)).toBe(TxTimeTickState.Idle);

    expect(dataLinkLayer.rxTimeTick(7)).toBe(RxTimeTickState.Listening);
    expect(dataLinkLayer.getRxBytesCollection()).toEqual([]);
  });
});
