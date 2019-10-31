// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import CallInfo = jasmine.CallInfo;
import Spy = jasmine.Spy;
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { createFrameConfig } from '@data-link-layer/frame/frame';
import { FrameStub, frameStubHooks } from '@data-link-layer/frame/frame-stub';
import {
  ErrorCorrection,
  FrameInterface,
  RxBytesCollector,
  RxTimeTickState,
  SelfReception,
  TxTimeTickState
} from '@data-link-layer/model';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';
import { PhysicalLayerStub } from '@physical-layer/physical-layer-stub';
import { getBytesFromHex, getHexFromBytes, padStart } from '@shared/utils';

describe('Data link layer', (): void => {
  const hex = (value: number): string => (value === null ? '--' : getHexFromBytes([value]));
  const time = (value: number): string => padStart(value, 10, 4, '0');
  let currentTime: number;
  let dataLinkLayer: DataLinkLayer;
  let rxIntervalMilliseconds: number;
  let txGuardMilliseconds: number;
  let txIntervalMilliseconds: number;

  beforeEach((): void => {
    createPhysicalLayerConfig.factory = PhysicalLayerStub;
    dataLinkLayer = new DataLinkLayer();
    currentTime = 0;
    rxIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().rxIntervalMilliseconds;
    txGuardMilliseconds = dataLinkLayer.getTxGuardMilliseconds();
    txIntervalMilliseconds = dataLinkLayer.physicalLayer.getDspConfig().txIntervalMilliseconds;
  });

  describe('RX', (): void => {
    const rxTest = (rxHex: string): RxBytesCollector[] => {
      const isRxErrorCorrectionOn: boolean = dataLinkLayer.rxErrorCorrection === ErrorCorrection.On;
      const rx = [...getBytesFromHex(rxHex), null];
      const rxBytesCollector: RxBytesCollector[] = [];
      let rxTimeTickState: RxTimeTickState;

      spyRx = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake(() => rx.shift());
      spyRxTimeTick = spyOn(dataLinkLayer, 'rxTimeTick').and.callThrough();

      do {
        rxTimeTickState = dataLinkLayer.rxTimeTick(currentTime);
        dataLinkLayer
          .getRxBytesCollection()
          .forEach((bytes: number[]): number =>
            rxBytesCollector.push(
              isRxErrorCorrectionOn
                ? { bytes: getHexFromBytes(bytes), isErrorCorrected: false, receivedAtTime: currentTime }
                : { bytes: getHexFromBytes(bytes), receivedAtTime: currentTime }
            )
          );
        isRxErrorCorrectionOn &&
          dataLinkLayer
            .getRxBytesErrorCorrectedCollection()
            .forEach((bytes: number[]): number =>
              rxBytesCollector.push(
                isRxErrorCorrectionOn
                  ? { bytes: getHexFromBytes(bytes), isErrorCorrected: true, receivedAtTime: currentTime }
                  : { bytes: getHexFromBytes(bytes), receivedAtTime: currentTime }
              )
            );
        currentTime += rxIntervalMilliseconds;
      } while (rxTimeTickState !== RxTimeTickState.Stopped);

      return rxBytesCollector;
    };
    const spyRxMapper = (callInfo: CallInfo): string => `${time(callInfo.args[0])}: ${hex(callInfo.returnValue)}`;
    const spyRxTimeTickMapper = (callInfo: CallInfo): string => `${time(callInfo.args[0])}: ${callInfo.returnValue}`;
    let spyRx: Spy;
    let spyRxExpectation: string[];
    let spyRxTimeTick: Spy;
    let spyRxTimeTickExpectation: string[];

    it('should generate proper RX calls', (): void => {
      rxTest('12 23 34 45 56');

      spyRxExpectation = spyRx.calls.all().map(spyRxMapper);
      expect(spyRxExpectation.join(' | ')).toEqual('0000: 12 | 0063: 23 | 0126: 34 | 0189: 45 | 0252: 56 | 0315: --');

      spyRxTimeTickExpectation = spyRxTimeTick.calls.all().map(spyRxTimeTickMapper);
      expect(spyRxTimeTickExpectation.join(' | ')).toEqual(
        '0000: Listening | 0063: Listening | 0126: Listening | 0189: Listening | 0252: Listening | 0315: Stopped'
      );
    });

    describe('Frame detection and duplicates removal - scramble sequence ACTIVE (default)', (): void => {
      it('should return only one out of two identical frames that are separated by one RX step', (): void => {
        expect(rxTest('0b 0b 22 22 70 70 14 14 00')).toEqual([
          // tx:       ````` ````` ````` ````` `````
          //           \_______________/ \___/
          //    3 B of scrambled header   1 B of scrambled data
          { bytes: '61', receivedAtTime: 378 }
        ]);
      });

      it('should return only one out of two identical frames that are separated by one RX step (offset)', (): void => {
        expect(rxTest('00 0b 0b 22 22 70 70 14 14 00')).toEqual([
          // tx:          ````` ````` ````` ````` `````
          //              \_______________/ \___/
          //       3 B of scrambled header   1 B of scrambled data
          { bytes: '61', receivedAtTime: 441 }
        ]);
      });
    });

    describe('Frame detection and duplicates removal - scramble sequence DISABLED', (): void => {
      it('should return only one out of two identical frames that are separated by one RX step', (): void => {
        dataLinkLayer.scrambleSequence = [0];
        expect(rxTest('12 12 57 57 13 13 61 61 00')).toEqual([
          // tx:       ````` ````` ````` ````` `````
          //           \_______________/ \___/
          //             3 B of header    1 B of data
          { bytes: '61', receivedAtTime: 378 }
        ]);
      });

      it('should return only one out of two identical frames that are separated by one RX step (offset)', (): void => {
        dataLinkLayer.scrambleSequence = [0];
        expect(rxTest('00 12 12 57 57 13 13 61 61 00')).toEqual([
          // tx:          ````` ````` ````` ````` `````
          //              \_______________/ \___/
          //                3 B of header    1 B of data
          { bytes: '61', receivedAtTime: 441 }
        ]);
      });
    });

    describe('Error correction', (): void => {
      it('should return error-free frame via getRxBytesCollection method', (): void => {
        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest('0b 0b 22 22 70 70 14 14')).toEqual([
          { bytes: '61', isErrorCorrected: false, receivedAtTime: 378 }
        ]);
      });

      it('should return error-at-one-byte frame via getRxBytesErrorCorrectedCollection method', (): void => {
        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest('0b 0b ff ff 70 70 14 14')).toEqual([
          //                 ^^ ^^ error as it should be: 22 22
          { bytes: '61', isErrorCorrected: true, receivedAtTime: 378 }
        ]);
      });
    });

    describe('Multiple valid frames detection', () => {
      /*
      // TODO finish
      it.only('should ', (): void => {
        const validRawBytes: string[] = ['12 57 13 61'];

        dataLinkLayer.scrambleSequence = [0];
        createFrameConfig.factory = FrameStub;
        frameStubHooks.isValid = (frame: FrameInterface): boolean =>
          validRawBytes.includes(getHexFromBytes(frame.getRawBytes()));

        expect(rxTest('12 12 57 57 13 13 61 61')).toEqual([{ bytes: [0x61], receivedAtTime: 504 }]);
      });
      */
    });
  });

  describe('RX <-> TX', (): void => {
    const rxTxTest = (txHex: string): RxBytesCollector[] => {
      const rxBytesCollector: RxBytesCollector[] = [];
      const TEST_SAFE_MARGIN = 4;
      let currentTxByte = 0;
      let i = 0;
      let iEnd = +Infinity;

      spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake((): number => currentTxByte);
      spyOn(dataLinkLayer.physicalLayer, 'tx').and.callFake((byte: number): void => {
        currentTxByte = byte !== null ? byte : 0;
      });

      dataLinkLayer.setTxBytes(getBytesFromHex(txHex));

      do {
        i % 2 === 0 && dataLinkLayer.txTimeTick(currentTime);
        dataLinkLayer.rxTimeTick(currentTime);
        dataLinkLayer.getRxBytesCollection().map((bytes: number[]): void => {
          rxBytesCollector.push({
            bytes: getHexFromBytes(bytes),
            receivedAtTime: currentTime
          });
        });

        currentTime += rxIntervalMilliseconds;
        if (iEnd === +Infinity && dataLinkLayer.getTxProgress() === 1) {
          iEnd = i + TEST_SAFE_MARGIN;
        }
        i++;
      } while (i < iEnd);

      return rxBytesCollector;
    };

    it('should receive the data that was transmitted at the same device when rxSelfReception is On', (): void => {
      dataLinkLayer.rxSelfReception = SelfReception.On;
      expect(rxTxTest('61 62 63')).toEqual([{ bytes: '61 62 63', receivedAtTime: 630 }]);
    });

    it('should NOT receive the data that was transmitted at the same device when rxSelfReception is Off', (): void => {
      dataLinkLayer.rxSelfReception = SelfReception.Off;
      // expect(rxTxTest('61 62 63')).toEqual([]); // TODO enable when implemented in the DataLinkLayer class
    });
  });

  describe('TX', (): void => {
    const txTest = (txHex: string): string => {
      const RANDOM_USER_LAG_MILLISECONDS = 1500;
      let txTimeTickState: TxTimeTickState;

      spyGetTxProgress = spyOn(dataLinkLayer, 'getTxProgress').and.callThrough();
      spyTx = spyOn(dataLinkLayer.physicalLayer, 'tx');
      spyTxTimeTick = spyOn(dataLinkLayer, 'txTimeTick').and.callThrough();

      for (let i = 0; i < 2; i++) {
        dataLinkLayer.setTxBytes(getBytesFromHex(txHex));
        dataLinkLayer.getTxProgress();
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

      spyTxExpectation = spyTx.calls.all().map(spyTxMapper);

      return spyTxExpectation.join(' | ');
    };
    const spyGetTxProgressMapper = (callInfo: CallInfo): string => callInfo.returnValue.toFixed(4);
    const spyTxMapper = (callInfo: CallInfo): string => `${time(callInfo.args[1])}: ${hex(callInfo.args[0])}`;
    const spyTxTimeTickMapper = (callInfo: CallInfo): string => `${time(callInfo.args[0])}: ${callInfo.returnValue}`;
    let spyGetTxProgress: Spy;
    let spyGetTxProgressExpectation: string[];
    let spyTx: Spy;
    let spyTxExpectation: string[];
    let spyTxTimeTick: Spy;
    let spyTxTimeTickExpectation: string[];

    it('should generate proper TX status and progress', (): void => {
      txTest('61');

      spyGetTxProgressExpectation = spyGetTxProgress.calls.all().map(spyGetTxProgressMapper);
      expect(spyGetTxProgressExpectation.join(' | ')).toEqual(
        '' +
          '0.0000 | 0.2355 | 0.4710 | 0.7065 | 0.9421 | 1.0000 | 1.0000 | ' +
          '0.0000 | 0.2355 | 0.4710 | 0.7065 | 0.9421 | 1.0000 | 1.0000'
      );

      spyTxTimeTickExpectation = spyTxTimeTick.calls.all().map(spyTxTimeTickMapper);
      expect(spyTxTimeTickExpectation.join(' | ')).toEqual(
        '' +
          '0000: Symbol | 0126: Symbol | 0252: Symbol | 0378: Symbol | 0504: Guard | 0535: Idle | ' +
          '2035: Symbol | 2161: Symbol | 2287: Symbol | 2413: Symbol | 2539: Guard | 2570: Idle'
      );
    });

    describe('Two subsequent equal frames', (): void => {
      it('should properly scramble bytes when scramble sequence is ACTIVE (default)', (): void => {
        expect(txTest('61')).toEqual(
          '' +
            '0000: 0b | 0126: 22 | 0252: 70 | 0378: 14 | 0504: -- | ' +
            '2035: e0 | 2161: b1 | 2287: 9b | 2413: bf | 2539: --'
          //       ^^         ^^         ^^         ^^         ^^
          //     header     header     header      data      silence (null) to stop playing last tone
        );
      });

      it('should not scramble bytes when scramble sequence is DISABLED', (): void => {
        dataLinkLayer.scrambleSequence = [0];
        expect(txTest('61')).toEqual(
          '' +
            '0000: 12 | 0126: 57 | 0252: 13 | 0378: 61 | 0504: -- | ' +
            '2035: 12 | 2161: 57 | 2287: 13 | 2413: 61 | 2539: --'
          //       ^^         ^^         ^^         ^^         ^^
          //     header     header     header      data      silence (null) to stop playing last tone
        );
      });
    });
  });
});
