const getParams = req => {
  const {
    query,
    body,
  } = { ...req };

  return {
    ...query,
    ...body,
  };
};

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const equalsIgnoreCase = (
  a,
  b,
) =>
  (!a && !b) || a?.toLowerCase() === b?.toLowerCase();

const toCase = (
  string,
  to_case = 'normal',
) => {
  if (typeof string === 'string') {
    string = string.trim();

    switch (to_case) {
      case 'upper':
        string = string.toUpperCase();
        break;
      case 'lower':
        string = string.toLowerCase();
        break;
      default:
        break;
    }
  }

  return string;
};

const split = (
  string,
  to_case = 'normal',
  delimiter = ',',
  filter_blank = true,
) =>
  (typeof string !== 'string' && ![undefined, null].includes(string) ?
    [string] :
    (typeof string === 'string' ? string : '').split(delimiter).map(s => toCase(s, to_case))
  )
  .filter(s => !filter_blank || s);

const toArray = (
  x,
  to_case = 'normal',
  delimiter = ',',
  filter_blank = true,
) =>
  Array.isArray(x) ?
    x.map(v => toCase(v, to_case)).filter(v => !filter_blank || v) :
    split(x, to_case, delimiter, filter_blank);

module.exports = {
  getParams,
  sleep,
  equalsIgnoreCase,
  split,
  toArray,
};