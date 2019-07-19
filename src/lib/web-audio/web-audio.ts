// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

export class WebAudio {
  protected audioContext: AudioContext;
  protected analyserNode: AnalyserNode;
  protected oscillatorNode: OscillatorNode;
  protected microphoneNode: AudioNode;

  public constructor() {
    this.audioContext = new AudioContext();
    this.audioContext.createScriptProcessor();

    this.analyserNode = this.audioContext.createAnalyser();
    this.analyserNode.fftSize = 2048;
    this.analyserNode.smoothingTimeConstant = 0;
    this.analyserNode.connect(this.audioContext.destination);

    this.connectMicrophoneTo(this.analyserNode);

    this.oscillatorNode = this.audioContext.createOscillator();
    this.oscillatorNode.connect(this.audioContext.destination);
  }

  public getTimeDomainData(): Float32Array {
    const data = new Float32Array(this.analyserNode.fftSize);

    this.analyserNode.getFloatTimeDomainData(data);

    return data;
  }

  protected connectMicrophoneTo(node: AudioNode): void {
    const constraints = {
      audio: true,
      video: false
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        this.microphoneNode = this.audioContext.createMediaStreamSource(stream);
        this.microphoneNode.connect(node);
      })
      .catch((error) => {
        // console.error(error);
      });
  }
}
