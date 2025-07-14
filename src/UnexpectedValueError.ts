export class UnexpectedValueError extends Error {
  constructor(
    // Type enables type checking
    value: never,
    // Avoid exception if `value` is:
    // - object without prototype
    // - symbol
    message?: string,
  ) {
    let msg = message;
    if (msg === undefined) {
      msg = `Unexpected value: ${JSON.stringify(value)}`;
    }
    // If JSON.stringify can't make a string of value msg remain undefined
    // In that case we fall back on a construct that always work, but is less explicit.
    if (msg === undefined) {
      msg = `Unexpected value: ${{}.toString.call(value)}`;
    }
    super(msg);
  }
}
