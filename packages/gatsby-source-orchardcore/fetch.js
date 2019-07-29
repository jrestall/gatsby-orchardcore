"use strict";

var _graphqlRequest = require("graphql-request");

const _ = require(`lodash`);

const chalk = require(`chalk`);

const {
  formatPluginOptionsForCLI
} = require(`./plugin-options`);

module.exports = async ({
  reporter,
  pluginConfig
}) => {
  // Fetch articles.
  console.time(`Fetch OrchardCore data`);
  console.log(`Starting to fetch data from OrchardCore`);
  const token = pluginConfig.get(`accessToken`);
  const clientOptions = {
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined
    }
  };
  const endpoint = pluginConfig.get(`url`);
  const client = new _graphqlRequest.GraphQLClient(endpoint, clientOptions);
  const query = `{
      mediaAssets(includeSubDirectories: true) {
        lastModifiedUtc
        length
        name
        path
      }
    }`;
  const result = {};

  try {
    console.log(`Fetching assets`);
    result.assets = await client.request(query);
    console.log(`Done fetching assets`);
  } catch (e) {
    let details;
    let errors;

    if (e.code === `ENOTFOUND`) {
      details = `You seem to be offline`;
    } else if (e.response) {
      if (e.response.status === 404) {
        // host and space used to generate url
        details = `Endpoint not found. Check if ${chalk.yellow(`url`)} setting is correct`;
        errors = {
          url: `Check if setting is correct`
        };
      } else if (e.response.status === 401) {
        // authorization error
        details = `Authorization error. Check if ${chalk.yellow(`accessToken`)} is correct`;
        errors = {
          accessToken: `Check if setting is correct`
        };
      }
    }

    console.log(`${e.response.errors} status: ${e.response.status}`);
    reporter.panic(`Accessing your OrchardCore server failed.
      Try setting GATSBY_ORCHARDCORE_OFFLINE=true to see if we can serve from cache.
      ${details ? `\n${details}\n` : ``}
      Used options:
      ${formatPluginOptionsForCLI(pluginConfig.getOriginalPluginOptions(), errors)}`);
  }

  return result;
};