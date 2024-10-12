export class ChildNotFoundError extends Error {
  constructor(childName: string, customElementName: string) {
    super(
      `Child ${childName} of the custom element ${customElementName} was not found, wait until the first render`,
    );
    this.name = 'ChildNotFoundError';
  }
}
