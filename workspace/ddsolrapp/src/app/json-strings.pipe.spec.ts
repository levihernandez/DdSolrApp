import { JsonStringsPipe } from './json-strings.pipe';

describe('JsonStringsPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonStringsPipe();
    expect(pipe).toBeTruthy();
  });
});
