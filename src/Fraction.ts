// eslint-disable-next-line max-classes-per-file
import { gcd } from './NumberHelperFunctions';

export type FractionRepresentation =
  | 'fraction'
  | 'piechart'
  | 'percentage'
  | 'decimal';

export class Fraction {
  numerator: number;
  denumerator: number;

  constructor(numerator?: number, denumerator?: number) {
    this.numerator = numerator === undefined ? 1 : numerator;
    this.denumerator = denumerator === undefined ? 1 : denumerator;
  }

  get value() {
    const _gcd = gcd(this.numerator, this.denumerator);
    return `${this.numerator / _gcd}/${this.denumerator / _gcd}`;
  }

  equal(fraction: Fraction) {
    return this.value === fraction.value;
  }
}

export class FractionAndRepresentation {
  fraction: Fraction;
  representation: FractionRepresentation;

  constructor(
    numerator?: number,
    denumerator?: number,
    representation?: FractionRepresentation,
  ) {
    this.fraction = new Fraction(numerator, denumerator);
    this.representation =
      representation === undefined ? 'fraction' : representation;
  }

  equal(f: FractionAndRepresentation) {
    if (
      (this.representation === 'piechart' || f.representation === 'piechart') &&
      this.representation !== f.representation
    )
      return (
        this.fraction.denumerator === f.fraction.denumerator &&
        this.fraction.numerator === f.fraction.numerator
      );
    return this.fraction.value === f.fraction.value;
  }
}
