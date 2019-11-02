// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import CallInfo = jasmine.CallInfo;
import Spy = jasmine.Spy;
import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { createFrameConfig, Frame } from '@data-link-layer/frame/frame';
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

      spyRx = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake((): number => rx.shift());
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
      rxTest('01 23 45 67 89 ab cd ef');

      spyRxExpectation = spyRx.calls.all().map(spyRxMapper);
      expect(spyRxExpectation.join(' | ')).toEqual(
        '0000: 01 | 0063: 23 | 0126: 45 | 0189: 67 | 0252: 89 | 0315: ab | 0378: cd | 0441: ef | 0504: --'
      );

      spyRxTimeTickExpectation = spyRxTimeTick.calls.all().map(spyRxTimeTickMapper);
      expect(spyRxTimeTickExpectation.join(' | ')).toEqual(
        '' +
          '0000: Listening | 0063: Listening | 0126: Listening | 0189: Listening | 0252: Listening | ' +
          '0315: Listening | 0378: Listening | 0441: Listening | 0504: Stopped'
      );
    });

    describe('Frame detection and duplicates removal - scramble sequence ACTIVE (default)', (): void => {
      it('should return only one out of two identical frames that are separated by one RX step', (): void => {
        expect(rxTest('2f 2f 10 10 d6 d6 ed ed f7 f7 00')).toEqual([
          // tx:       ````` ````` ````` ````` ````` `````
          //           \_______________/ \_________/
          //    3 B of scrambled header   2 B of scrambled data
          { bytes: '3a 29', receivedAtTime: 504 }
        ]);
      });

      it('should return only one out of two identical frames that are separated by one RX step (offset)', (): void => {
        expect(rxTest('00 2f 2f 10 10 d6 d6 ed ed f7 f7 00')).toEqual([
          // tx:          ````` ````` ````` ````` ````` `````
          //              \_______________/ \_________/
          //       3 B of scrambled header   2 B of scrambled data
          { bytes: '3a 29', receivedAtTime: 567 }
        ]);
      });
    });

    describe('Frame detection and duplicates removal - scramble sequence DISABLED', (): void => {
      it('should return only one out of two identical frames that are separated by one RX step', (): void => {
        dataLinkLayer.scrambleSequence = [0];
        expect(rxTest('36 36 45 45 79 79 3a 3a 29 29 00')).toEqual([
          // tx:       ````` ````` ````` ````` ````` `````
          //           \_______________/ \_________/
          //             3 B of header   2 B of data
          { bytes: '3a 29', receivedAtTime: 504 }
        ]);
      });

      it('should return only one out of two identical frames that are separated by one RX step (offset)', (): void => {
        dataLinkLayer.scrambleSequence = [0];
        expect(rxTest('00 36 36 45 45 79 79 3a 3a 29 29 00')).toEqual([
          // tx:          ````` ````` ````` ````` ````` `````
          //              \_______________/ \_________/
          //                3 B of header   2 B of data
          { bytes: '3a 29', receivedAtTime: 567 }
        ]);
      });
    });

    describe('Error correction', (): void => {
      it('should return error-free frame via getRxBytesCollection method', (): void => {
        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest('2f 2f 10 10 d6 d6 ed ed f7 f7')).toEqual([
          //                 ^^ ^^ no error
          { bytes: '3a 29', isErrorCorrected: false, receivedAtTime: 504 }
        ]);
      });

      it('should return error-at-one-byte frame via getRxBytesErrorCorrectedCollection method', (): void => {
        dataLinkLayer.rxErrorCorrection = ErrorCorrection.On;
        expect(rxTest('2f 2f ff ff d6 d6 ed ed f7 f7')).toEqual([
          //                 ^^ ^^ error as it should be 10 10
          { bytes: '3a 29', isErrorCorrected: true, receivedAtTime: 504 }
        ]);
      });
    });

    describe('Multiple valid frames detection vs duplicates removal', (): void => {
      it('should detect expected number of frames with proper timing', (): void => {
        const mapper = (rxBytes: RxBytesCollector): string => {
          const bytes: string[] = rxBytes.bytes.split(' ');
          const line: string[] = '.. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. .. ..'.split(' ');
          const toInsert: string[] = [];
          let position: number;

          for (let i = 0; i < dataLinkLayer.getFrameConfig().frameConfigInitializer.headerLength; i++) {
            bytes.unshift('##'); // in this mapper we cannot determine what are the real header bytes so lets use '##'
          }
          bytes.forEach(byte => toInsert.push('..', byte));
          position = rxBytes.receivedAtTime / rxIntervalMilliseconds - toInsert.length + 1;
          line.splice(position, toInsert.length, ...toInsert);

          return '            ' + line.join(' ');
        };
        const validRawBytes: string[] = [
          /*    */ '23 67 ab ef dc',
          /*       */ '67 ab ef dc',
          /*       */ 'ff ff ff ff',
          /* */ 'ff ff ff ff ff ff',
          /*       */ 'ff ff ff 11'
        ];

        dataLinkLayer.scrambleSequence = [0];
        createFrameConfig.factory = FrameStub;
        frameStubHooks.isValid = (frame: FrameInterface): boolean =>
          validRawBytes.includes(getHexFromBytes(frame.getRawBytes()));

        // Legend below assumes that rxIntervalMilliseconds is equal to 63:
        //              0    126   252   378   504   630   756   882  1008  1134  1260  1386
        //              |  63 | 189 | 315 | 441 | 567 | 693 | 819 | 945 |1071 |1197 |1323 |1449
        //              |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |
        expect(rxTest('01 23 45 67 ff ab ff ef ff dc ff ff ff ff ff ff ff ff ff 11 11 ff').map(mapper)).toEqual([
          '            .. ## .. ## .. ## .. ef .. dc .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
          '            .. .. .. ## .. ## .. ## .. dc .. .. .. .. .. .. .. .. .. .. .. .. .. ..',
          '            .. .. .. .. ## .. ## .. ## .. ff .. .. .. .. .. .. .. .. .. .. .. .. ..',
          '            .. .. .. .. .. .. ## .. ## .. ## .. ff .. .. .. .. .. .. .. .. .. .. ..',
          '            .. .. .. .. ## .. ## .. ## .. ff .. ff .. ff .. .. .. .. .. .. .. .. ..',
          '            .. .. .. .. .. .. .. .. ## .. ## .. ## .. ff .. .. .. .. .. .. .. .. ..',
          '            .. .. .. .. .. .. ## .. ## .. ## .. ff .. ff .. ff .. .. .. .. .. .. ..',
          '            .. .. .. .. .. .. .. .. .. .. ## .. ## .. ## .. ff .. .. .. .. .. .. ..',
          '            .. .. .. .. .. .. .. .. ## .. ## .. ## .. ff .. ff .. ff .. .. .. .. ..',
          '            .. .. .. .. .. .. .. .. .. .. .. .. ## .. ## .. ## .. ff .. .. .. .. ..',
          '            .. .. .. .. .. .. .. .. .. .. .. .. .. ## .. ## .. ## .. 11 .. .. .. ..'
        ]);
        createFrameConfig.factory = Frame;
      });
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
      expect(rxTxTest('68 65 6c 6c 6f')).toEqual([{ bytes: '68 65 6c 6c 6f', receivedAtTime: 882 }]);
    });

    it('should NOT receive the data that was transmitted at the same device when rxSelfReception is Off', (): void => {
      dataLinkLayer.rxSelfReception = SelfReception.Off;
      // expect(rxTxTest('68 65 6c 6c 6f')).toEqual([]); // TODO enable when implemented in the DataLinkLayer class
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
      txTest('3a 29');

      spyGetTxProgressExpectation = spyGetTxProgress.calls.all().map(spyGetTxProgressMapper);
      expect(spyGetTxProgressExpectation.join(' | ')).toEqual(
        '' +
          '0.0000 | 0.1906 | 0.3812 | 0.5719 | 0.7625 | 0.9531 | 1.0000 | 1.0000 | ' +
          '0.0000 | 0.1906 | 0.3812 | 0.5719 | 0.7625 | 0.9531 | 1.0000 | 1.0000'
      );

      spyTxTimeTickExpectation = spyTxTimeTick.calls.all().map(spyTxTimeTickMapper);
      expect(spyTxTimeTickExpectation.join(' | ')).toEqual(
        '' +
          '0000: Symbol | 0126: Symbol | 0252: Symbol | 0378: Symbol | 0504: Symbol | 0630: Guard | 0661: Idle | ' +
          '2161: Symbol | 2287: Symbol | 2413: Symbol | 2539: Symbol | 2665: Symbol | 2791: Guard | 2822: Idle'
      );
    });

    describe('Two subsequent equal frames', (): void => {
      it('should properly scramble bytes when scramble sequence is ACTIVE (default)', (): void => {
        expect(txTest('3a 29')).toEqual(
          '' +
            '0000: 2f | 0126: 10 | 0252: d6 | 0378: ed | 0504: f7 | 0630: -- | ' +
            '2161: 90 | 2287: cd | 2413: d7 | 2539: 20 | 2665: d3 | 2791: --'
          //       ^^         ^^         ^^         ^^         ^^         ^^
          //     header     header     header      data       data    silence (null) to stop
        ); //                                                           playing last tone
      });

      it('should not scramble bytes when scramble sequence is DISABLED', (): void => {
        dataLinkLayer.scrambleSequence = [0];
        expect(txTest('3a 29')).toEqual(
          '' +
            '0000: 36 | 0126: 45 | 0252: 79 | 0378: 3a | 0504: 29 | 0630: -- | ' +
            '2161: 36 | 2287: 45 | 2413: 79 | 2539: 3a | 2665: 29 | 2791: --'
          //       ^^         ^^         ^^         ^^         ^^         ^^
          //     header     header     header      data       data    silence (null) to stop
        ); //                                                           playing last tone
      });
    });
  });
});
