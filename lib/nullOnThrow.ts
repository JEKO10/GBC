export const nullOnThrow = async <T>(
  fn: () => Promise<T>
): Promise<T | null> => {
  try {
    return await fn();
  } catch {
    return null;
  }
};
