// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { AudioMonoIoStub } from '@physical-layer/audio-mono-io/audio-mono-io.stub';
import { AudioMonoIoInterface } from '@physical-layer/model';
import { CreateConfig } from '@shared/model';

export class AudioMonoIo implements AudioMonoIoInterface {
  protected audioContext: AudioContext;
  protected fftSize = 256;

  protected analyserNode: AnalyserNode;
  protected microphoneMediaStream: MediaStream;
  protected microphoneRealNode: MediaStreamAudioSourceNode;
  protected microphoneVirtualNode: GainNode;
  protected oscillatorNode: OscillatorNode;

  public constructor() {
    this.audioContext = new AudioContext();
  }

  public getFftSize(): number {
    return this.fftSize;
  }

  public getFrequencyDomainData(currentTime: number): Float32Array {
    let data: Float32Array;

    this.inputEnable();
    data = new Float32Array(this.analyserNode.frequencyBinCount); // same as: 0.5 * fftSize
    this.analyserNode.getFloatFrequencyData(data);

    return data;
  }

  public getSampleRate(): number {
    return this.audioContext.sampleRate;
  }

  public inputDisable(): void {
    if (this.microphoneRealNode) {
      this.microphoneRealNode.disconnect(this.microphoneVirtualNode);
      this.microphoneRealNode = null;
    }

    if (this.microphoneMediaStream) {
      this.microphoneMediaStream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      this.microphoneMediaStream = null;
    }

    if (this.microphoneVirtualNode) {
      this.microphoneVirtualNode.disconnect(this.analyserNode);
      this.microphoneVirtualNode = null;
    }

    if (this.analyserNode) {
      // this.analyserNode.disconnect(this.audioContext.destination);           // TODO check it on different browsers
      this.analyserNode = null;
    }
  }

  public outputDisable(): void {
    if (this.oscillatorNode) {
      this.oscillatorNode.stop();
      this.oscillatorNode.disconnect(this.audioContext.destination);
      this.oscillatorNode = null;
    }
  }

  public setFftSize(fftSize: number): void {
    this.fftSize = fftSize;
    if (this.analyserNode) {
      this.analyserNode.fftSize = fftSize;
    }
  }

  public setPeriodicWave(frequency: number, currentTime: number): void {
    this.outputEnable();
    this.oscillatorNode.frequency.value = frequency;
    this.oscillatorNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
  }

  protected connectMicrophoneTo(node: AudioNode): void {
    // TODO fix known issue: inputEnable/inputDisable doesn't wait for promise
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((mediaStream: MediaStream) => {
        this.microphoneMediaStream = mediaStream;
        this.microphoneRealNode = this.audioContext.createMediaStreamSource(mediaStream);
        this.microphoneRealNode.connect(node);
      })
      .catch((error: any) => {
        throw new Error(error);
      });
  }

  protected handleSuspendedState(): void {
    this.audioContext.state === 'suspended' && this.audioContext.resume().then(); // TODO think more about this promise
  }

  protected inputEnable(): void {
    this.handleSuspendedState();

    if (!this.analyserNode) {
      this.analyserNode = this.audioContext.createAnalyser();
      this.analyserNode.fftSize = this.fftSize;
      this.analyserNode.smoothingTimeConstant = 0;
      // this.analyserNode.connect(this.audioContext.destination);           // TODO check it on different browsers
      this.microphoneVirtualNode = this.audioContext.createGain();
      this.microphoneVirtualNode.connect(this.analyserNode);
      this.connectMicrophoneTo(this.microphoneVirtualNode);
    }
  }

  protected outputEnable(): void {
    this.handleSuspendedState();

    if (!this.oscillatorNode) {
      this.oscillatorNode = this.audioContext.createOscillator();
      this.oscillatorNode.connect(this.audioContext.destination);
      this.oscillatorNode.type = 'sine';
      this.oscillatorNode.start();
    }
  }
}

// -----------------------------------------------------------------------------

export const createAudioMonoIoConfig: CreateConfig = { stub: false };
export const createAudioMonoIo = (): AudioMonoIoInterface =>
  createAudioMonoIoConfig.stub ? new AudioMonoIoStub() : new AudioMonoIo();
