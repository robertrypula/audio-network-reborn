// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import { DataLinkLayer, DataLinkLayerWrapper } from '../../../../index';
import * as fromBaseTemplate from '../../chat-advanced-base.template';
import * as fromTemplate from './ascii-chat-advanced.template';

const getById = (id: string) => document.getElementById(id);

export class DataLinkLayerAsciiChatAdvancedWebExample {
  public dataLinkLayerWrapper: DataLinkLayerWrapper;

  public constructor() {
    document.getElementsByTagName('html')[0].classList.add('chat-advanced-base', 'data-link-layer-ascii-chat-advanced');
    getById('audio-network-lite-root').innerHTML = fromBaseTemplate.mainHtml;
    // this.dataLinkLayerWrapper = new DataLinkLayerWrapper(new DataLinkLayer());
  }
}
