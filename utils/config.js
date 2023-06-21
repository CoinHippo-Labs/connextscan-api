const config = require('config-yml');

const { equalsIgnoreCase } = require('./');

const { tokens } = { ...config };

const getTokens = () => Object.entries({ ...tokens }).map(([k, v]) => { return { id: k, asset_id: k, ...v }; });
const getToken = id => getTokens().find(d => ['id', 'coingecko_id'].findIndex(k => equalsIgnoreCase(d[k], id)) > -1);

module.exports = {
  getTokens,
  getToken,
};