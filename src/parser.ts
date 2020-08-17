
export class HousesParser
{
   constructor(
      private readonly _source: string,
   ) {}

   public isHouseIncluded(houseNumber: string): boolean
   {
      return this._source.includes(houseNumber);
   }
}