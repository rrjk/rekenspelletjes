import { UnexpectedValueError } from './UnexpectedValueError';

export const operators = ['times', 'divide', 'plus', 'minus'] as const;
export type Operator = (typeof operators)[number];
/**
 * Convert a string into an Operator.
 * In case an illegal string is provided, which does not resolve to an operator
 * plus is returned.
 *
 * @param value string to convert
 * @returns string converted to an Operator
 */
export function convertOperator(value: string | null): Operator {
  switch (value) {
    case 'times':
    case 'divide':
    case 'plus':
    case 'minus':
      return value;
    default:
      return 'plus';
  }
}
/**
 * Convert an Operator to the symbol for the operator
 * @param operator Operator to convert
 * @returns Symbol for the operator
 */
export function operatorToSymbol(operator: Operator): string {
  switch (operator) {
    case 'plus':
      return '+';
    case 'minus':
      return '−';
    case 'divide':
      return '∶';
    case 'times':
      return '×';
    default:
      throw new UnexpectedValueError(operator);
  }
}
