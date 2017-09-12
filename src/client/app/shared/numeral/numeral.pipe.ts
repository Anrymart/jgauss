import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'numeral'})
export class NumeralPipe implements PipeTransform {
  transform(value: number, numerals: string): string {
    let tenRemainder = value % 10;
    let hundredRemainder = value % 100;
    if (hundredRemainder > 10 && hundredRemainder < 20) {
      tenRemainder = -1;
    }
    switch (tenRemainder) {
      case 1:
        return value + " " + numerals[1];
      case 2:
      case 3:
      case 4:
        return value + " " + numerals[2];
      default:
        return value + " " + numerals[5];
    }
  }
}
