const isOnline = require(`is-online`)
const _ = require(`lodash`)
const stringify = require(`json-stringify-safe`)
const crypto = require(`crypto`)

const fetchData = require(`./src/fetch`)
const { createPluginConfig, validateOptions } = require(`./src/plugin-options`)
const { downloadOrchardCoreAssets } = require(`./src/download-assets`)

exports.onPreBootstrap = validateOptions

exports.sourceNodes = async (
  { actions, getNodes, createNodeId, store, cache, reporter },
  pluginOptions
) => {
  const { createNode, touchNode } = actions

  const online = await isOnline()

  // If the user knows they are offline, serve them cached result
  // For prod builds though always fail if we can't get the latest data
  if (
    !online &&
    process.env.GATSBY_ORCHARDCORE_OFFLINE === `true` &&
    process.env.NODE_ENV !== `production`
  ) {
    getNodes()
      .filter(n => n.internal.owner === `gatsby-source-orchard`)
      .forEach(n => touchNode({ nodeId: n.id }))

    console.log(`Using OrchardCore Offline cache ⚠️`)
    console.log(
      `Cache may be invalidated if you edit package.json, gatsby-node.js or gatsby-config.js files`
    )

    return
  }

  const pluginConfig = createPluginConfig(pluginOptions)

  const {
    assets,
  } = await fetchData({
    reporter,
    pluginConfig,
  })

  if(!assets || !assets.mediaAssets)
  {
    reporter.panic(`No media assets returned from OrchardCore. Is the server running? ⚠️`)
  }

  assets.mediaAssets.forEach(asset => {
    createAssetNode({
      asset,
      createNode,
      createNodeId
    })
  })

  await downloadOrchardCoreAssets({
    actions,
    createNodeId,
    store,
    cache,
    getNodes,
    pluginConfig
  })
}

const typePrefix = `OrchardCore`
const makeTypeName = type => _.upperFirst(_.camelCase(`${typePrefix}${type}`))

function createAssetNode({
  asset,
  createNode,
  createNodeId
}) {

  const assetNode = {
    id: createNodeId(`gatsby-source-orchardcore-${asset.path}`),
    parent: null,
    internal: {
      type: `${makeTypeName(`Asset`)}`,
      contentDigest: crypto.createHash(`md5`).update(stringify(asset)).digest(`hex`),
    },
    children: [],
    ...asset
  }

  createNode(assetNode)
}
