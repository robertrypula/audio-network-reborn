// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayerWrapper } from '@'; // in your code it would be: ... from 'audio-network-lite';
import * as domUtils from '@examples/web/dom-utils';

export class DataLinkLayerChatAdvancedWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    const id = 'audio-network-lite-root';

    domUtils.getByTagName('html').classList.add('chat-advanced-base', 'data-link-layer-chat-advanced');
    domUtils.getById(id).innerHTML = require('./../../chat-advanced-base/chat-advanced-base.html');
    // this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
  }
}
