export const replaceAt = (str: string, index: number, replacement: string) => {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
};

export const replaceLeadingZeroes = (str?: string) => {
  return Number(str ?? '').toString();
};
