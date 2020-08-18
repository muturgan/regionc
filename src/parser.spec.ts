import { HousesParser } from './parser';

describe('HousesParser', () =>
{
   test('четные', () =>
   {
      const parser = new HousesParser('четные');
      expect(parser.isHouseIncluded('18')).toBe(true);
      expect(parser.isHouseIncluded('17')).toBe(false);
      expect(parser.isHouseIncluded('18а')).toBe(true);
      expect(parser.isHouseIncluded('17а')).toBe(false);
      expect(parser.isHouseIncluded('18/1')).toBe(true);
      expect(parser.isHouseIncluded('17/1')).toBe(false);
   });

   test('нечетные', () =>
   {
      const parser = new HousesParser('нечетные');
      expect(parser.isHouseIncluded('18')).toBe(false);
      expect(parser.isHouseIncluded('17')).toBe(true);
   });

   test('нечетные 11+, четные 42+', () =>
   {
      const parser = new HousesParser('нечетные 11+, четные 42+');
      expect(parser.isHouseIncluded('18')).toBe(false);
      expect(parser.isHouseIncluded('58')).toBe(true);
      expect(parser.isHouseIncluded('9')).toBe(false);
      expect(parser.isHouseIncluded('12')).toBe(false);
      expect(parser.isHouseIncluded('17')).toBe(true);
   });

   test('нечетные 11-, четные 42-', () =>
   {
      const parser = new HousesParser('нечетные 11-, четные 42-');
      expect(parser.isHouseIncluded('1')).toBe(true);
      expect(parser.isHouseIncluded('2')).toBe(true);
      expect(parser.isHouseIncluded('13')).toBe(false);
      expect(parser.isHouseIncluded('14')).toBe(true);
      expect(parser.isHouseIncluded('43')).toBe(false);
   });

   test('четные 11-15, четные 42-45', () =>
   {
      const parser = new HousesParser('четные 11-15, четные 42-45');
      expect(parser.isHouseIncluded('10')).toBe(false);
      expect(parser.isHouseIncluded('11')).toBe(false);
      expect(parser.isHouseIncluded('12')).toBe(true);
      expect(parser.isHouseIncluded('16')).toBe(false);
      expect(parser.isHouseIncluded('42')).toBe(true);
      expect(parser.isHouseIncluded('46')).toBe(false);
   });

   test('четные с 20 и вся улица до конца', () =>
   {
      const parser = new HousesParser('четные с 20 и вся улица до конца');
      expect(parser.isHouseIncluded('18')).toBe(false);
      expect(parser.isHouseIncluded('19')).toBe(false);
      expect(parser.isHouseIncluded('20')).toBe(true);
      expect(parser.isHouseIncluded('21')).toBe(false);
      expect(parser.isHouseIncluded('22')).toBe(true);
   });

   test('нечетные с 20 и вся улица до конца', () =>
   {
      const parser = new HousesParser('нечетные с 20 и вся улица до конца');
      expect(parser.isHouseIncluded('19')).toBe(false);
      expect(parser.isHouseIncluded('20')).toBe(false);
      expect(parser.isHouseIncluded('21')).toBe(true);
      expect(parser.isHouseIncluded('22')).toBe(false);
      expect(parser.isHouseIncluded('23')).toBe(true);
   });

   test('с 20 и вся улица до конца', () =>
   {
      const parser = new HousesParser('с 20 и вся улица до конца');
      expect(parser.isHouseIncluded('19')).toBe(false);
      expect(parser.isHouseIncluded('20')).toBe(true);
      expect(parser.isHouseIncluded('21')).toBe(true);
      expect(parser.isHouseIncluded('22')).toBe(true);
   });

   test('7/1, 11, 17, 17/1, 17/2, 8/2, 15, 15/1, 15а', () =>
   {
      const parser = new HousesParser('7/1, 11, 17, 17/1, 17/2, 8/2, 15, 15/1, 15а');
      expect(parser.isHouseIncluded('18')).toBe(false);
      expect(parser.isHouseIncluded('11')).toBe(true);
      expect(parser.isHouseIncluded('11/1')).toBe(false);
      expect(parser.isHouseIncluded('17/1')).toBe(true);
      expect(parser.isHouseIncluded('15а')).toBe(true);
      expect(parser.isHouseIncluded('15б')).toBe(false);
   });

   test('12, 22, 36, 42, 45, 100-106', () =>
   {
      const parser = new HousesParser('12, 22, 36, 42, 45, 100-106');
      expect(parser.isHouseIncluded('11')).toBe(false);
      expect(parser.isHouseIncluded('12')).toBe(true);
      expect(parser.isHouseIncluded('13')).toBe(false);
      expect(parser.isHouseIncluded('101')).toBe(true);
      expect(parser.isHouseIncluded('107')).toBe(false);
   });


   describe('разгые варианты разделителей', () =>
   {
      test('четные 10-28, нечетные 5-21', () =>
      {
         const parser = new HousesParser('четные 10-28, нечетные 5-21');
         expect(parser.isHouseIncluded('1')).toBe(false);
         expect(parser.isHouseIncluded('2')).toBe(false);
         expect(parser.isHouseIncluded('5')).toBe(true);
         expect(parser.isHouseIncluded('6')).toBe(false);
         expect(parser.isHouseIncluded('11')).toBe(true);
         expect(parser.isHouseIncluded('12')).toBe(true);
         expect(parser.isHouseIncluded('22')).toBe(true);
         expect(parser.isHouseIncluded('23')).toBe(false);
         expect(parser.isHouseIncluded('29')).toBe(false);
      });

      test('четные 10-28; нечетные 5-21', () =>
      {
         const parser = new HousesParser('четные 10-28; нечетные 5-21');
         expect(parser.isHouseIncluded('1')).toBe(false);
         expect(parser.isHouseIncluded('2')).toBe(false);
         expect(parser.isHouseIncluded('5')).toBe(true);
         expect(parser.isHouseIncluded('6')).toBe(false);
         expect(parser.isHouseIncluded('11')).toBe(true);
         expect(parser.isHouseIncluded('12')).toBe(true);
         expect(parser.isHouseIncluded('22')).toBe(true);
         expect(parser.isHouseIncluded('23')).toBe(false);
         expect(parser.isHouseIncluded('29')).toBe(false);
      });

      test('четные 10-28 нечетные 5-21', () =>
      {
         const parser = new HousesParser('четные 10-28 нечетные 5-21');
         expect(parser.isHouseIncluded('1')).toBe(false);
         expect(parser.isHouseIncluded('2')).toBe(false);
         expect(parser.isHouseIncluded('5')).toBe(true);
         expect(parser.isHouseIncluded('6')).toBe(false);
         expect(parser.isHouseIncluded('11')).toBe(true);
         expect(parser.isHouseIncluded('12')).toBe(true);
         expect(parser.isHouseIncluded('22')).toBe(true);
         expect(parser.isHouseIncluded('23')).toBe(false);
         expect(parser.isHouseIncluded('29')).toBe(false);
      });

      test('четные10-28нечетные5-21', () =>
      {
         const parser = new HousesParser('четные10-28нечетные5-21');
         expect(parser.isHouseIncluded('1')).toBe(false);
         expect(parser.isHouseIncluded('2')).toBe(false);
         expect(parser.isHouseIncluded('5')).toBe(true);
         expect(parser.isHouseIncluded('6')).toBe(false);
         expect(parser.isHouseIncluded('11')).toBe(true);
         expect(parser.isHouseIncluded('12')).toBe(true);
         expect(parser.isHouseIncluded('22')).toBe(true);
         expect(parser.isHouseIncluded('23')).toBe(false);
         expect(parser.isHouseIncluded('29')).toBe(false);
      });
   });


   describe('ошибки валидации', () =>
   {
      test('в конструктор передали не строку', () =>
      {
         try {
            // @ts-expect-error
            const parser42 = new HousesParser(42);
         }
         catch (err) {
            expect(err.message).toBe('the source should be a string');
         }
      });

      test('в конструктор передали данные, не содержашие информацию о номерах домов', () =>
      {
         try {
            // @ts-expect-error
            const milkParser = new HousesParser('молоко');
         }
         catch (err) {
            expect(err.message).toBe('the source should contain numbers or even/odd modifiers');
         }
      });

      const parser = new HousesParser('100500');

      test('в метод передали не строку', () =>
      {
         try {
            // @ts-expect-error
            parser.isHouseIncluded(42);
         }
         catch (err) {
            expect(err.message).toBe('the houseNumber should be a string');
         }
      });

      test('в метод передали не числовую строку', () =>
      {
         try {
            parser.isHouseIncluded('молоко');
         }
         catch (err) {
            expect(err.message).toBe('incorrect houseNumber: молоко');
         }
      });

      test('в метод передали отрицательный номер дома', () =>
      {
         try {
            parser.isHouseIncluded('-1');
         }
         catch (err) {
            expect(err.message).toBe('incorrect houseNumber: -1');
         }
      });

      test('в метод передали нецелый номер дома', () =>
      {
         try {
            parser.isHouseIncluded('1.1');
         }
         catch (err) {
            expect(err.message).toBe('the houseNumber should be an integer');
         }
      });
   });
});