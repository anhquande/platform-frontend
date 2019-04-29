export class InvalidETOStateError extends Error {
  constructor(actual: string, expected: string) {
    super(`Invalid ETO state. ${expected} was expected instead of ${actual}`);
  }
}
