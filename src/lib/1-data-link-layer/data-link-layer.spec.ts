// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { createAudioMonoIoConfig } from '@physical-layer/audio-mono-io/audio-mono-io';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';

describe('Data Link Layer', () => {
  it('should ....??', () => {
    createAudioMonoIoConfig.stub = true;
    createPhysicalLayerConfig.stub = true;
    const dataLinkLayer = new DataLinkLayer();

    // dataLinkLayer.getTxGuardMilliseconds();
  });
});
