type TCheck = (houseNumber: string, justNumbersPart: number) => boolean;

interface ICheckOddResult {
   canIncludesOdd?: string;
   canNotIncludesOdd?: string;
}

interface ICheckEvenResult {
   canIncludesEven?: string;
   canNotIncludesEven?: string;
}


export class HousesParser
{
   private static _EVEN = 'четные';
   private static _EVEN_RE = new RegExp(HousesParser._EVEN);
   private static _ODD  = 'нечетные';
   private static _ODD_RE  = new RegExp(HousesParser._ODD);
   private static _SPACES_RE  = /\s/g;
   private static _NUMBER_RE  = /\d/;
   private static _RULES_RE  = /\d+(\/\d+|[a-zа-я]+|\+|\-(\d+)?|\s[\sa-zа-я]* до конца)?/g;

   private readonly _oddChecks: TCheck[] = [];
   private readonly _evenChecks: TCheck[] = [];
   private readonly _allChecks: TCheck[] = [];



   constructor(source: string)
   {
      if (typeof source !== 'string') {
         throw new Error('the source should be a string');
      }

      const processedSource = source
         .trim()
         .replace(/\s+/g, ' ')
         .toLowerCase()
         .replace(/ё/g, 'е');

      if (!/\d/.test(processedSource) && !processedSource.includes(HousesParser._EVEN)) {
         throw new Error('the source should contain numbers or even/odd modifiers');
      }

      this._init(processedSource);
   }


   //  *********************************
   //  *                               *
   //  *        Public Methods         *
   //  *                               *
   //  *********************************

   public isHouseIncluded(houseNumber: string): boolean
   {
      if (typeof houseNumber !== 'string') {
         throw new Error('the houseNumber should be a string');
      }

      const processedHouseNumber = houseNumber
         .replace(HousesParser._SPACES_RE, '')
         .toLowerCase();

      const numericPart = this._parseInt(processedHouseNumber);

      return numericPart % 2 === 0
         ? this._evenChecks.some(c => c(processedHouseNumber, numericPart)) || this._allChecks.some(c => c(processedHouseNumber, numericPart))
         : this._oddChecks.some(c => c(processedHouseNumber, numericPart)) || this._allChecks.some(c => c(processedHouseNumber, numericPart));
   }



   //  *********************************
   //  *                               *
   //  *        Private Methods        *
   //  *                               *
   //  *********************************

   private _init(str: string): void
   {
      const {canIncludesOdd, canNotIncludesOdd} = this._getOddSubstrings(str);

      if (canIncludesOdd !== undefined) {
         (() => {
            const {canIncludesEven, canNotIncludesEven} = this._getEvenSubstrings(canIncludesOdd);
            if (canNotIncludesEven !== undefined) {
               this._setChecks(this._oddChecks, canNotIncludesEven, 'odd');
            }
            if (canIncludesEven !== undefined) {
               this._setChecks(this._evenChecks, canIncludesEven, 'even');
            }
         })();
      }

      if (canNotIncludesOdd !== undefined) {
         const {canIncludesEven, canNotIncludesEven} = this._getEvenSubstrings(canNotIncludesOdd);

         if (canIncludesEven !== undefined) {
            this._setChecks(this._evenChecks, canIncludesEven, 'even');
         }

         if (canNotIncludesEven !== undefined) {
            this._setChecks(this._allChecks, canNotIncludesEven);
         }
      }
   }


   private _getOddSubstrings(str: string): ICheckOddResult
   {
      const processedStr = str.trim();
      const pos = processedStr.search(HousesParser._ODD_RE);
      const result: ICheckOddResult = {};

      switch (pos) {
         case -1:
            result.canNotIncludesOdd = processedStr;
            break;

         case 0:
            result.canIncludesOdd = processedStr.substr(pos + HousesParser._ODD.length);
            break;

         default:
            result.canIncludesOdd = processedStr.substr(pos + HousesParser._ODD.length);
            result.canNotIncludesOdd = processedStr.substr(0, pos);
      }

      return result;
   }

   private _getEvenSubstrings(str: string): ICheckEvenResult
   {
      const processedStr = str.trim();
      const pos = processedStr.search(HousesParser._EVEN_RE);
      const result: ICheckEvenResult = {};

      switch (pos) {
         case -1:
            result.canNotIncludesEven = processedStr;
            break;

         case 0:
            result.canIncludesEven = processedStr.substr(pos + HousesParser._EVEN.length);
            break;

         default:
            result.canIncludesEven = processedStr.substr(pos + HousesParser._EVEN.length);
            result.canNotIncludesEven = processedStr.substr(0, pos);
      }

      return result;
   }


   private _setChecks(checkArr: TCheck[], onlyNumbersStr: string, flag?: 'odd' | 'even'): void
   {
      if (onlyNumbersStr === '') {
         flag === 'odd'
            ? checkArr.push(this._setJustOddCheck())
            : checkArr.push(this._setJustEvenCheck());
         return;
      }

      const rules = onlyNumbersStr.match(HousesParser._RULES_RE);

      if (rules !== null)
      {
         const notEmptyRules = rules
            .filter(r => r.search(HousesParser._NUMBER_RE) !== -1);

         const simpleRules: string[] = [];

         notEmptyRules.forEach(r => {
            switch (true)
            {
               case r[r.length - 1] === '+':
               case r.includes('до конца'):
                  const minInt = this._parseInt(r);
                  checkArr.push(this._setIsGreaterOrEqualCheck(minInt));
                  break;

               case r[r.length - 1] === '-':
                  const maxInt = this._parseInt(r);
                  checkArr.push(this._setIsLessOrEqualCheck(maxInt));
                  break;

               case r.includes('-'):
                  const [minStr, maxStr] = r.split('-');
                  const min = this._parseInt(minStr);
                  const max = this._parseInt(maxStr);
                  checkArr.push(this._setIsInDiapasonCheck(min, max));
                  break;

               default:
                  simpleRules.push(r);
            }
         });

         if (simpleRules.length > 0) {
            checkArr.push(this._setIsEqualCheck(simpleRules));
         }
      }
   }




   private _setIsGreaterOrEqualCheck(num: number): TCheck
   {
      return (_houseNumber: string, justNumbersPart: number) => justNumbersPart >= num;
   }

   private _setIsLessOrEqualCheck(num: number): TCheck
   {
      return (_houseNumber: string, justNumbersPart: number) => justNumbersPart <= num;
   }

   private _setIsInDiapasonCheck(min: number, max: number): TCheck
   {
      return (_houseNumber: string, justNumbersPart: number) => justNumbersPart >= min && justNumbersPart <= max;
   }

   private _setIsEqualCheck(numbers: string[]): TCheck
   {
      return (houseNumber: string, _justNumbersPart: number) => {
         return numbers.includes(houseNumber);
      };
   }

   private _setJustEvenCheck(): TCheck
   {
      return (_houseNumber: string, justNumbersPart: number) => justNumbersPart % 2 === 0;
   }

   private _setJustOddCheck(): TCheck
   {
      return (_houseNumber: string, justNumbersPart: number) => justNumbersPart % 2 !== 0;
   }


   private _parseInt(str: string): number
   {
      const numericPart = parseInt(str, 10);
      if (Number.isNaN(numericPart) || numericPart <= 0) {
         throw new Error(`incorrect houseNumber: ${str}`);
      }

      const floatPart = parseFloat(str);
      if (floatPart !== numericPart) {
         throw new Error('the houseNumber should be an integer');
      }

      return numericPart;
   }

}