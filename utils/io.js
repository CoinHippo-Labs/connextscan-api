const getParams = req => {
  const { query, body } = { ...req };
  return { ...query, ...body };
};

const errorOutput = error => {
  return {
    error: true,
    code: 400,
    message: error?.message,
  };
};

module.exports = {
  getParams,
  errorOutput,
};