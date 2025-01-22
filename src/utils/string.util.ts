export const replaceAt = (str: string, index: number, replacement: string) => {
  return str.substring(0, index) + replacement + str.substring(index + replacement.length);
};

export const replaceAllNumbersWith = (str: string, replaceWith: string, index = 0): string => {
  if (!Number.isNaN(+str[index])) {
    return replaceAllNumbersWith(replaceAt(str, index, replaceWith), replaceWith, index + 1);
  }

  if (index === str.length) {
    return str;
  }

  return replaceAllNumbersWith(str, replaceWith, index + 1);
};

export const replaceAllNumbersInArrayWith = (arr: string[], replaceWith: string): string[] => {
  return arr.map((el) => {
    if (!Number.isNaN(+el)) {
      return replaceWith;
    }
    return el;
  });
};

export const replaceAll = (str: string, char: string, replaceWith: string): string => {
  if (str.includes(char)) {
    return replaceAll(str.replace(char, replaceWith), char, replaceWith);
  }
  return str;
};

export const replaceLeadingZeroes = (str?: string) => {
  return Number(str ?? '').toString();
};
