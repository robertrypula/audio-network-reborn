/*
  TODO
    - create array for microphone data in MAIN thread
    - post array buffer to THREAD
    - start collecting data in the THREAD
    - send back to MAIN thread
    - return it in the next possible getTimeDomainData call
    - show data received

      ^          ^          ^          ^          ^          ^          ^
      #---------------#
                 #---------------#
                            #---------------#
                                       #---------------#
                                                  #---------------#

    - show data for speakers
 */

class AudioNetworkRebornAudioWorkletProcessor extends AudioWorkletProcessor {
  inputSamplesArrayBuffer;
  inputSamples;
  inputSamplesCurrentIndex;

  outputSamplesArrayBuffer;
  outputSamples;
  outputSamplesCurrentIndex;

  constructor() {
    super();

    this.port.onmessage = event => {
      if (typeof event.data === 'string') {
        const actionParameter = event.data.split('|');

        if (actionParameter.length === 3 && actionParameter[0] === 'requestInputSamples') {
          this.requestInputSamples(parseInt(actionParameter[1]), parseInt(actionParameter[2]));
        }
      } else {
        this.requestOutputSamples(event.data);
      }
    };
  }

  requestInputSamples(inputSamplesSize) {
    console.log('WORKER requestInputSamples ARRAY BUFFER', inputSamplesSize);
    this.inputSamplesArrayBuffer = new ArrayBuffer(inputSamplesSize * 4);
    this.inputSamples = new Float32Array(this.inputSamplesArrayBuffer);
    this.inputSamplesCurrentIndex = 0;
  }

  requestOutputSamples(arrayBuffer, intervalMilliseconds) {
    console.log('WORKER requestOutputSamples ARRAY BUFFER', arrayBuffer, intervalMilliseconds);
    this.outputSamplesArrayBuffer = arrayBuffer;
    this.outputSamples = new Float32Array(arrayBuffer);
    this.outputSamplesCurrentIndex = 0;
  }

  process(inputs, outputs) {
    const input = inputs[0];
    const output = outputs[0];
    const inputChannel0 = input[0];
    const outputChannel0 = output[0];

    if (inputChannel0) {
      const renderingQuantum = inputChannel0.length;
      const isInputAvailable = this.inputSamples && this.inputSamples.length;

      if (isInputAvailable) {
        for (let i = 0; i < renderingQuantum; i++) {
          if (this.inputSamplesCurrentIndex === this.inputSamples.length) {
            break;
          }
          this.inputSamples[this.inputSamplesCurrentIndex++] = inputChannel0[i];
        }

        if (this.inputSamplesCurrentIndex === this.inputSamples.length) {
          this.port.postMessage(this.inputSamplesArrayBuffer, [this.inputSamplesArrayBuffer]);
          delete this.inputSamples;
          delete this.inputSamplesArrayBuffer;
        }
      }
    }

    if (outputChannel0) {
      const renderingQuantum = outputChannel0.length;
      const isOutputAvailable = this.outputSamples && this.outputSamples.length;

      if (isOutputAvailable) {
        for (let i = 0; i < renderingQuantum; i++) {
          outputChannel0[i] =
            this.outputSamplesCurrentIndex < this.outputSamples.length
              ? this.outputSamples[this.outputSamplesCurrentIndex++]
              : 0;
        }

        if (this.outputSamplesCurrentIndex === this.outputSamples.length) {
          delete this.outputSamples;
          delete this.outputSamplesArrayBuffer;
        }
      } else {
        for (let i = 0; i < renderingQuantum; i++) {
          outputChannel0[i] = 0;
        }
      }
    }

    return true;
  }
}

registerProcessor('audio-network-reborn-audio-worklet-processor', AudioNetworkRebornAudioWorkletProcessor);
