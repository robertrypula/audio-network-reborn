// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import CallInfo = jasmine.CallInfo;
import Spy = jasmine.Spy;
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { ErrorCorrection, RxTimeTickState, TxTimeTickState } from '@data-link-layer/model';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';
import { getHexFromBytes } from '@shared/utils';

describe('Data Link Layer', () => {
  let currentTime: number;
  let dataLinkLayer: DataLinkLayer;
  let rxIntervalMilliseconds: number;
  let txGuardMilliseconds: number;
  let txIntervalMilliseconds: number;

  beforeEach(() => {
    createPhysicalLayerConfig.stub = true;
    dataLinkLayer = new DataLinkLayer();
    currentTime = 0;
    rxIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds;
    txGuardMilliseconds = dataLinkLayer.getTxGuardMilliseconds();
    txIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds;
  });

  describe('RX', () => {
    const rxTest = (rx: number[]): Array<[number, number[]]> => {
      const rxBytesCollectionGlobal: Array<[number, number[]]> = [];
      let rxTimeTickState: RxTimeTickState;

      spyRx = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake(() => rx.shift());
      spyRxTimeTick = spyOn(dataLinkLayer, 'rxTimeTick').and.callThrough();
      do {
        rxTimeTickState = dataLinkLayer.rxTimeTick(currentTime);
        dataLinkLayer
          .getRxBytesCollection()
          .forEach((rxBytes: number[]) => rxBytesCollectionGlobal.push([currentTime, rxBytes]));
        dataLinkLayer.rxErrorCorrection === ErrorCorrection.On &&
          dataLinkLayer
            .getRxBytesErrorCorrectedCollection()
            .forEach((rxBytes: number[]) => rxBytesCollectionGlobal.push([currentTime, rxBytes]));
        currentTime += rxIntervalMilliseconds;
      } while (rxTimeTickState !== RxTimeTickState.Stopped);

      return rxBytesCollectionGlobal;
    };
    const spyRxMapper = (callInfo: CallInfo) =>
      ('    ' + callInfo.args[0]).substr(-4) +
      ': ' +
      (callInfo.returnValue === null ? 'null' : '0x' + getHexFromBytes([callInfo.returnValue]));
    const spyRxTimeTickMapper = (callInfo: CallInfo) =>
      [('    ' + callInfo.args[0]).substr(-4), callInfo.returnValue].join(': ');
    let spyRx: Spy;
    let spyRxExpectation: string[];
    let spyRxTimeTick: Spy;
    let spyRxTimeTickExpectation: string[];

    it('should generate proper RX calls', () => {
      rxTest([0x12, 0x23, 0x34, 0x45, 0x56, null]);

      spyRxExpectation = spyRx.calls.all().map(spyRxMapper);
      expect(spyRxExpectation.join(' | ')).toEqual(
        '   0: 0x12 |   63: 0x23 |  126: 0x34 |  189: 0x45 |  252: 0x56 |  315: null'
      );

      spyRxTimeTickExpectation = spyRxTimeTick.calls.all().map(spyRxTimeTickMapper);
      expect(spyRxTimeTickExpectation.join(' | ')).toEqual(
        '   0: Listening |   63: Listening |  126: Listening |  189: Listening |  252: Listening |  315: Stopped'
      );
    });

    it('should return only one out of two identical frames that are separated by one RX step', () => {
      expect(rxTest([0x00, 0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, 0x00, null])).toEqual([[441, [0x61]]]);
      // tx intervals:     ..........  ==========  ..........  ==========                          ^^^   ^^^^
      //                   \------- scrambled header -------/  scrambled data                     rxTime rxBytes
    });

    it('should return only one out of two identical frames that are separated by one RX step (offset)', () => {
      expect(rxTest([0x00, 0x00, 0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, 0x00, null])).toEqual([[504, [0x61]]]);
      // tx intervals:           ..........  ==========  ..........  ==========                          ^^^   ^^^^
      //                         \------- scrambled header -------/  scrambled data                     rxTime rxBytes
    });

    describe('Error Correction', () => {
      it('should properly find frame even if one of the bytes is corrupted', () => {
        expect(rxTest([0x0b, 0x0b, 0x22, 0x22, 0x70, 0x70, 0x14, 0x14, null])).toEqual([[378, [0x61]]]);
      });

      it('should properly find frame even if one of the bytes is corrupted', () => {
        const error = 32;

        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest([0x0b, 0x0b, 0x22, 0x22, 0x70 + error, 0x70 + error, 0x14, 0x14, null])).toEqual([[378, [0x61]]]);
      });
    });
  });

  describe('RX <-> TX', () => {
    it('should not receive the own data that was transmitted', () => {
      let currentTxByte = 0;
      const spyRx: Spy = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake((currentTimeSub: number) => {
        // console.log('RX [x]      <---  | ', currentTimeSub, currentTxByte.toString(16));
        return currentTxByte;
      });
      const spyTx: Spy = spyOn(dataLinkLayer.physicalLayer, 'tx').and.callFake(
        (byte: number, currentTimeSub: number) => {
          currentTxByte = byte !== null ? byte : 0;
          // console.log('TX [x] --->       | ', currentTimeSub, currentTxByte.toString(16));
        }
      );
      let rxBytesCollection: number[][] = [];

      dataLinkLayer.setTxBytes([0x61]);
      for (let i = 0; i < 15; i++) {
        i % 2 === 0 && dataLinkLayer.txTimeTick(currentTime);
        dataLinkLayer.rxTimeTick(currentTime);
        currentTime += rxIntervalMilliseconds;

        rxBytesCollection = dataLinkLayer.getRxBytesCollection();
        // if (rxBytesCollection.length) {
        //   console.log(rxBytesCollection);
        // }
      }
    });
  });

  describe('TX', () => {
    it('should properly scramble bytes in two subsequent equal frames and generate proper TX calls', () => {
      const RANDOM_USER_LAG_MILLISECONDS = 1500;
      const spyGetTxProgress: Spy = spyOn(dataLinkLayer, 'getTxProgress').and.callThrough();
      const spyGetTxProgressMapper = (callInfo: CallInfo) => callInfo.returnValue.toFixed(4);
      const spyTx: Spy = spyOn(dataLinkLayer.physicalLayer, 'tx');
      const spyTxMapper = (args: [number, number]) =>
        ('    ' + args[1]).substr(-4) + ': ' + (args[0] === null ? 'null' : '0x' + getHexFromBytes([args[0]]));
      const spyTxTimeTick: Spy = spyOn(dataLinkLayer, 'txTimeTick').and.callThrough();
      const spyTxTimeTickMapper = (callInfo: CallInfo) =>
        [('    ' + callInfo.args[0]).substr(-4), callInfo.returnValue].join(': ');
      let spyGetTxProgressExpectation: string[];
      let spyTxExpectation: string[];
      let spyTxTimeTickExpectation: string[];
      let txTimeTickState: TxTimeTickState;

      for (let i = 0; i < 2; i++) {
        dataLinkLayer.setTxBytes([0x61]);
        do {
          txTimeTickState = dataLinkLayer.txTimeTick(currentTime);
          dataLinkLayer.getTxProgress();
          currentTime +=
            txTimeTickState === TxTimeTickState.Symbol
              ? txIntervalMilliseconds
              : txTimeTickState === TxTimeTickState.Guard
              ? txGuardMilliseconds
              : RANDOM_USER_LAG_MILLISECONDS;
        } while (txTimeTickState !== TxTimeTickState.Idle);
      }

      spyGetTxProgressExpectation = spyGetTxProgress.calls.all().map(spyGetTxProgressMapper);
      expect(spyGetTxProgressExpectation.join(' | ')).toEqual(
        '0.2355 | 0.4710 | 0.7065 | 0.9421 | 1.0000 | 1.0000 | 0.2355 | 0.4710 | 0.7065 | 0.9421 | 1.0000 | 1.0000'
      );

      spyTxExpectation = spyTx.calls.allArgs().map(spyTxMapper);
      expect(spyTxExpectation.join(' | ')).toEqual(
        '' + //  header       header       header       data         silence (null) to stop playing last tone
          //     ....         ....         ....         ....         ....
          '   0: 0x0b |  126: 0x22 |  252: 0x70 |  378: 0x14 |  504: null | ' +
          '2035: 0xe0 | 2161: 0xb1 | 2287: 0x9b | 2413: 0xbf | 2539: null'
      );

      spyTxTimeTickExpectation = spyTxTimeTick.calls.all().map(spyTxTimeTickMapper);
      expect(spyTxTimeTickExpectation.join(' | ')).toEqual(
        '' +
          '   0: Symbol |  126: Symbol |  252: Symbol |  378: Symbol |  504: Guard |  535: Idle | ' +
          '2035: Symbol | 2161: Symbol | 2287: Symbol | 2413: Symbol | 2539: Guard | 2570: Idle'
      );
    });
  });
});
