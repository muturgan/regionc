import { HousesParser } from './parser';

describe('HousesParser', () =>
{
   test('first test', () =>
   {
      const parser = new HousesParser('четные 2-28, нечетные 1-21');
      expect(parser.isHouseIncluded('18')).toBe(false);
   });
});