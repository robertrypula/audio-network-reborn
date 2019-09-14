// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayerWrapper } from '@';

const getById = (id: string) => document.getElementById(id);
const getByTagName = (tag: string) => document.getElementsByTagName(tag);

export class DataLinkLayerChatAdvancedWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    getByTagName('html')[0].classList.add('chat-advanced-base', 'data-link-layer-chat-advanced');
    getById('audio-network-lite-root').innerHTML = require('./../../chat-advanced-base/chat-advanced-base.html');
    // this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
  }
}
