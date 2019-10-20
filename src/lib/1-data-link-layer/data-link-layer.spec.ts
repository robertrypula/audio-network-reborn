// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer } from '@data-link-layer/data-link-layer';
import { createPhysicalLayerConfig } from '@physical-layer/physical-layer';

describe('Data Link Layer', () => {
  it('should ....??', () => {
    const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    createPhysicalLayerConfig.stub = true;
    const dataLinkLayer = new DataLinkLayer();
    const spyTx = spyOn(dataLinkLayer.physicalLayer, 'rx').and.callFake(() => data.shift());

    dataLinkLayer.rxTimeTick(0);
    dataLinkLayer.rxTimeTick(1);
    dataLinkLayer.rxTimeTick(2);
    dataLinkLayer.rxTimeTick(3);
    dataLinkLayer.rxTimeTick(4);
    // expect(spyTx).toHaveBeenCalledTimes(0);
    // TODO finalize the test
  });
});
