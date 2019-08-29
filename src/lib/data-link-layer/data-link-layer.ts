// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import {
  findFrameCandidates,
  FixedSizeBuffer,
  FrameConfigInterface,
  FrameHistory,
  FrameMode,
  PhysicalLayer,
  SCRAMBLE_SEQUENCE,
  scrambleArray
} from '..';
import { frameModeToFrameConfigLookUp } from './config';
import { Frame } from './frame/frame';

export class DataLinkLayer {
  public readonly physicalLayer: PhysicalLayer;

  protected readonly rxErrorCorrectionEnabled = false; // keep false, current 'brute-force' solution is just bad... :)
  protected rxFrameHistoryA: FrameHistory = [];
  protected rxFrameHistoryB: FrameHistory = [];
  protected rxFrames: Frame[];
  protected rxFramesErrorCorrected: Frame[];
  protected rxRawBytesA: FixedSizeBuffer<number>;
  protected rxRawBytesB: FixedSizeBuffer<number>;
  protected rxRawBytesCounter = 0;
  protected scramble: number[] = SCRAMBLE_SEQUENCE();
  protected txFrame: Frame;
  protected txRawBytesCounter = 0;

  public constructor(
    protected readonly frameConfig: FrameConfigInterface = frameModeToFrameConfigLookUp[
      FrameMode.Header3BytesPayloadLengthBetween1And8BytesCrc24
    ]
  ) {
    this.physicalLayer = new PhysicalLayer();
    this.rxRawBytesA = new FixedSizeBuffer<number>(this.frameConfig.rawBytesLengthMax);
    this.rxRawBytesB = new FixedSizeBuffer<number>(this.frameConfig.rawBytesLengthMax);
  }

  public getRxBytesCollection(): number[][] {
    return this.rxFrames.length ? this.rxFrames.map(item => item.getPayload()) : [];
  }

  public getRxBytesErrorCorrectedCollection(): number[][] {
    return this.rxFramesErrorCorrected.length ? this.rxFramesErrorCorrected.map(item => item.getPayload()) : [];
  }

  public rxTimeTick(currentTime: number): void {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxRawBytes = isEven ? this.rxRawBytesA : this.rxRawBytesB;
    // const start = new Date().getTime(); // TODO remove me
    let validFramesCounter = 0; // TODO remove me

    rxRawBytes.insert(this.physicalLayer.rx(currentTime));
    this.rxFrames = [];
    this.rxFramesErrorCorrected = [];

    findFrameCandidates(
      rxRawBytes.data,
      this.scramble,
      this.frameConfig,
      this.rxErrorCorrectionEnabled,
      (frameCandidate, isErrorCorrected) => {
        this.tryToFindValidFrame(frameCandidate, isErrorCorrected) && validFramesCounter++;
      }
    );
    /*tslint:disable-next-line:no-console*/
    // validFramesCounter && console.log(new Date().getTime() - start); // TODO remove me
    this.rxRawBytesCounter++;
  }

  public setTxBytes(bytes: number[]): void {
    this.txFrame = new Frame(this.frameConfig);
    this.txFrame.setPayload(bytes);
    scrambleArray(this.txFrame.getRawBytes(), this.scramble, this.txRawBytesCounter, true);
    this.txRawBytesCounter += this.txFrame.getRawBytes().length;
  }

  public txTimeTick(currentTime: number): boolean {
    return this.physicalLayer.tx(this.txFrame.getNextRawByte(), currentTime);
  }

  protected tryToFindValidFrame(frameCandidate: Frame, isErrorCorrected: boolean): boolean {
    const isEven = this.rxRawBytesCounter % 2 === 0;
    const rxFrameHistory = isEven ? this.rxFrameHistoryA : this.rxFrameHistoryB;
    const rxFrameHistoryHalfStepBack = isEven ? this.rxFrameHistoryB : this.rxFrameHistoryA;

    if (frameCandidate.isValid()) {
      const frame = isErrorCorrected ? frameCandidate.clone() : frameCandidate;
      const equalFramesHalfStepBack = rxFrameHistoryHalfStepBack.filter(
        item => item.rawBytePosition >= this.rxRawBytesCounter - 1 && item.frame.isEqualTo(frame)
      );

      if (equalFramesHalfStepBack.length === 0) {
        rxFrameHistory.push({ frame, isErrorCorrected, rawBytePosition: this.rxRawBytesCounter });
        isErrorCorrected ? this.rxFramesErrorCorrected.push(frame) : this.rxFrames.push(frame);

        return true;
      }
    }

    return false;
  }
}
