// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class AudioMonoIO {
  protected audioContext: AudioContext;

  protected analyserNode: AnalyserNode;
  protected microphoneMediaStream: MediaStream;
  protected microphoneRealNode: MediaStreamAudioSourceNode;
  protected microphoneVirtualNode: GainNode;
  protected oscillatorNode: OscillatorNode;

  protected fftSize: number = 256;

  public constructor() {
    this.audioContext = new AudioContext();
  }

  public getFftSize(): number {
    return this.fftSize;
  }

  public getSampleRate(): number {
    return this.audioContext.sampleRate;
  }

  public getFrequencyDomainData(): Float32Array {
    let data: Float32Array;

    this.inputEnable();
    data = new Float32Array(this.analyserNode.frequencyBinCount);   // same as: 0.5 * fftSize
    this.analyserNode.getFloatFrequencyData(data);

    return data;
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

  public setFftSize(fftSize: number): void {
    this.fftSize = fftSize;
    if (this.analyserNode) {
      this.analyserNode.fftSize = fftSize;
    }
  }

  public setPeriodicWave(frequency: number): void {
    this.outputEnable();
    this.oscillatorNode.frequency.value = frequency;
    this.oscillatorNode.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
  }

  public outputDisable(): void {
    if (this.oscillatorNode) {
      this.oscillatorNode.stop();
      this.oscillatorNode.disconnect(this.audioContext.destination);
      this.oscillatorNode = null;
    }
  }

  protected connectMicrophoneTo(node: AudioNode): void {
    // TODO
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: false })
      .then((mediaStream: MediaStream) => {
        this.microphoneMediaStream = mediaStream;
        this.microphoneRealNode = this.audioContext.createMediaStreamSource(mediaStream);
        this.microphoneRealNode.connect(node);
      })
      .catch((error) => {
        // console.error(error);
      });
  }

  protected inputEnable(): void {
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
    if (!this.oscillatorNode) {
      this.oscillatorNode = this.audioContext.createOscillator();
      this.oscillatorNode.connect(this.audioContext.destination);
      this.oscillatorNode.type = 'sine';
      this.oscillatorNode.start();
    }
  }
}

/*
5,859375 48.0   171 ms   12 Hz spacing, 3072 Hz band
5,383301 44.1   186 ms   12 Hz spacing, 3072 Hz band

         48.0   86 ms   24 Hz spacing, 6.1 Hz band
         44.1   93 ms   24 Hz spacing, 6.1 Hz band

					8 FFT/s
					4 bytes/s

 */
