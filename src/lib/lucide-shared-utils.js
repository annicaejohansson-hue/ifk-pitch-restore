/** Lucide className helpers — used when the package copy of utils.js is missing. */
export const toKebabCase = (string) =>
  string.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();

export const mergeClasses = (...classes) =>
  classes
    .filter(
      (className, index, array) =>
        Boolean(className) &&
        String(className).trim() !== "" &&
        array.indexOf(className) === index,
    )
    .join(" ")
    .trim();
