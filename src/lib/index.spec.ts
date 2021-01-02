// Copyright (c) 2019-2021 Robert Rypuła - https://github.com/robertrypula

import { libraryInfo } from '@';

describe('Index', (): void => {
  describe('Library info', (): void => {
    it('should return version', (): void => {
      expect(libraryInfo.version).toBeTruthy();
    });

    it('should return author', (): void => {
      expect(libraryInfo.author).toBeTruthy();
    });

    it('should return gitHub', (): void => {
      expect(libraryInfo.gitHub).toBeTruthy();
    });
  });
});
