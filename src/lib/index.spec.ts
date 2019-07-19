// Copyright (c) 2019 Robert Rypuła - https://github.com/robertrypula

import * as AudioNetworkLite from './index';

describe('Index', () => {
  it('should return version', () => {
    expect(AudioNetworkLite.version).toBeTruthy();
  });

  it('should return author', () => {
    expect(AudioNetworkLite.author).toBeTruthy();
  });

  it('should return githubUrl', () => {
    expect(AudioNetworkLite.githubUrl).toBeTruthy();
  });
});
