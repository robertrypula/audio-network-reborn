import { DataFrame } from './data-frame';

describe('DataFrame', () => {
  it('should return correct payload\'s length from header', () => {
    const dataFrame = new DataFrame();
    const payload = [10, 20, 30, 40];

    dataFrame.setPayload(payload);
    expect(dataFrame.getLengthFromRawBytes()).toBe(payload.length);
  });
});
