import { gcd } from './NumberHelperFunctions';

export class Fraction {
  numerator: number;
  denumerator: number;

  constructor(numerator: number, denumeration: number) {
    this.numerator = numerator;
    this.denumerator = denumeration;
  }

  get value() {
    const _gcd = gcd(this.numerator, this.denumerator);
    return `${this.numerator / _gcd}/${this.denumerator / _gcd}`;
  }

  equal(fraction: Fraction) {
    return this.value === fraction.value;
  }
}
