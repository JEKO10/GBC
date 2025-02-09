export function NotNullOrUndefined<T>(
  value: T | null | undefined,
  customErrFunc?: () => never
): T | never {
  if (value === null || value === undefined) {
    return (
      customErrFunc?.() ??
      (() => {
        throw new Error(`Value should not be null or undefined`);
      })()
    );
  }

  return value;
}
