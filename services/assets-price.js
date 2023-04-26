const _ = require('lodash');
const moment = require('moment');
const config = require('config-yml');

const {
  read,
  write,
} = require('./index');
const coingecko = require('./coingecko');
const {
  sleep,
  equalsIgnoreCase,
  toArray,
} = require('../utils');
const data = require('../data');

let {
  environment,
} = { ...config };

environment = process.env.ENVIRONMENT || environment;

const chains_data = toArray(data?.chains?.[environment]);
const assets_data = toArray(data?.assets?.[environment]);

module.exports = async (
  params = {},
  collection = 'assets',
  currency = 'usd',
) => {
  let response;

  const current_time = moment();

  const {
    asset,
    timestamp,
  } = { ...params };
  let {
    assets,
  } = { ...params };

  assets = _.uniq(toArray(assets || asset, 'lower'));

  if (assets.length > 0) {
    const price_timestamp = moment(Number(timestamp) || current_time.valueOf()).startOf('day').valueOf();

    const cache =
      current_time.diff(moment(price_timestamp), 'hours', true) > 0 &&
      await read(
        collection,
        {
          bool: {
            must: [
              { match: { price_timestamp } },
            ],
            should: assets.map(a => { return { match: { asset_id: a } }; }),
            minimum_should_match: 1,
          },
        },
        { size: assets.length },
      );

    const data =
      assets.map(a => {
        let asset_data = assets_data.find(_a => equalsIgnoreCase(_a?.id, a));

        if (!asset_data) {
          const chain_data = chains_data.evm.find(c => equalsIgnoreCase(_.head(c.provider_params)?.nativeCurrency?.symbol, a));

          if (chain_data) {
            const {
              provider_params,
              coingecko_id,
              gas_coingecko_id,
            } = { ...chain_data };

            const {
              nativeCurrency,
            } = { ..._.head(provider_params) };

            asset_data = {
              id: a,
              ...nativeCurrency,
              coingecko_id: gas_coingecko_id || coingecko_id,
            };
          }
        }

        const {
          id,
          coingecko_id,
          name,
          symbol,
          image,
          is_stablecoin,
          default_price,
        } = { ...asset_data };

        return {
          id: `${id}_${price_timestamp}`,
          asset_id: id,
          coingecko_id,
          name,
          symbol,
          image,
          price: is_stablecoin ? 1 : default_price || undefined,
        };
      });

    if (cache?.data) {
      toArray(cache.data)
        .forEach(d => {
          const index = data.findIndex(_d => equalsIgnoreCase(_d.asset_id, d.asset_id));

          if (index > -1) {
            data[index] = {
              ...data[index],
              ...d,
            };
          }
        });
    }

    const updated_at_threshold = current_time.subtract(1, 'hours').valueOf();
    const to_update_data = data.filter(d => !d?.updated_at || d.updated_at < updated_at_threshold || typeof d.price !== 'number');
    const coingecko_ids = _.uniq(toArray(to_update_data.map(d => d?.coingecko_id)));

    if (coingecko_ids.length > 0) {
      let _data;

      if (timestamp) {
        for (const id of coingecko_ids) {
          const _response =
            await coingecko(
              `/coins/${id}/history`,
              {
                id,
                date: moment(Number(timestamp)).format('DD-MM-YYYY'),
                localization: 'false',
              },
            );

          _data = toArray(_.concat(_data, _response));
        }
      }
      else {
        const _response =
          await coingecko(
            '/coins/markets',
            {
              vs_currency: currency,
              ids: coingecko_ids.join(','),
              per_page: 250,
            },
          );

        _data = toArray(_response);
      }

      // update data from coingecko
      toArray(_data)
        .map(d => {
          const {
            id,
            market_data,
            current_price,
          } = { ...d };

          const asset_data = assets_data.find(a => a?.coingecko_id === id) || data.find(d => d?.coingecko_id === id);

          const {
            name,
            symbol,
            image,
            is_stablecoin,
          } = { ...asset_data };
          let {
            asset_id,
          } = { ...asset_data };

          asset_id = asset_id || asset_data?.id;

          let price = market_data?.current_price?.[currency] || current_price;
          price = !price && is_stablecoin ? 1 : price;

          return {
            id: `${asset_id}_${price_timestamp}`,
            asset_id,
            coingecko_id: id,
            name,
            symbol,
            image,
            price,
          };
        })
        .forEach(d => {
          const {
            asset_id,
            coingecko_id,
            price,
          } = { ...d };

          for (let i = 0; i < data.length; i++) {
            const _d = data[i];

            if (equalsIgnoreCase(_d.asset_id, asset_id) || equalsIgnoreCase(_d.coingecko_id, coingecko_id)) {
              data[i] = {
                ...d,
                ...data[i],
                price: price || _d.price,
              };
            }
          }
        });
    }

    const updated_data = data.filter(d => d?.asset_id && ('symbol' in d) && typeof d.price === 'number' && (!d.updated_at || d.updated_at < updated_at_threshold));

    if (updated_data.length > 0) {
      const synchronous = updated_data.length < 5;

      for (const d of updated_data) {
        const {
          asset_id,
        } = { ...d };

        const updated_at = moment().valueOf();
        const price_timestamp = moment(Number(timestamp) || updated_at).startOf('day').valueOf();
        const id = `${asset_id}_${price_timestamp}`;
        const write_data = { ...d, id, price_timestamp, updated_at };

        if (synchronous) {
          await write(collection, id, write_data);
        }
        else {
          write(collection, id, write_data);
        }
      }

      if (!synchronous) {
        await sleep(5 * 1000);
      }
    }

    response = data;
  }

  return response;
};