const axios = require('axios');

const { parseRequestError } = require('../utils');

module.exports = async (path = '', params = {}) => {
  const api = axios.create({ baseURL: 'https://api.coingecko.com/api/v3/', timeout: 20000 });
  const response = await api.get(path, { params }).catch(error => parseRequestError(error));
  return response?.data;
};