export const splitString = (str: string, n: number): string[] => {
  let arr = str?.split(" ");
  let result = [];
  let subStr = arr[0];
  for (let i = 1; i < arr.length; i++) {
    let word = arr[i];
    if (subStr.length + word.length + 1 <= n) {
      subStr = subStr + " " + word;
    } else {
      result.push(subStr);
      subStr = word;
    }
  }
  if (subStr.length) {
    result.push(subStr);
  }
  return result;
};

export const removeEmojis = (str: string | undefined): string => {
  return str?.replace(/[^\p{L}\p{N}\p{P}\p{Z}^$\n]/gu, "").trim() || "";
};
