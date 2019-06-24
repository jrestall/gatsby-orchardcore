const ProgressBar = require(`progress`)
const { createRemoteFileNode } = require(`gatsby-source-filesystem`)

const bar = new ProgressBar(
  `Downloading OrchardCore Assets [:bar] :current/:total :elapsed secs :percent`,
  {
    total: 0,
    width: 30,
  }
)

let totalJobs = 0

/**
 * @name downloadOrchardCoreAssets
 * @description Downloads OrchardCore assets to the local filesystem.
 * The asset files will be downloaded and cached. Use `localFile` to link to them
 * @param gatsbyFunctions - Gatsby's internal helper functions
 */

const downloadOrchardCoreAssets = async gatsbyFunctions => {
  const {
    actions: { createNode, touchNode },
    createNodeId,
    store,
    cache,
    getNodes,
    pluginConfig
  } = gatsbyFunctions

  // Any OrchardCoreAsset nodes will be downloaded, cached and copied to public/static
  // regardless of if you use `localFile` to link an asset or not.
  const orchardAssetNodes = getNodes().filter(
    n =>
      n.internal.owner === `gatsby-source-orchardcore` &&
      n.internal.type === `OrchardCoreAsset`
  )

  const host = pluginConfig.get(`host`)

  await Promise.all(
    orchardAssetNodes.map(async node => {
      totalJobs += 1
      bar.total = totalJobs

      let fileNodeID
      const remoteDataCacheKey = `orchardcore-asset-${node.name}-${node.lastModifiedUtc}`
      const cacheRemoteData = await cache.get(remoteDataCacheKey)
      const url = `${host}${node.path}`

      // Avoid downloading the asset again if it's been cached
      if (cacheRemoteData) {
        fileNodeID = cacheRemoteData.fileNodeID // eslint-disable-line prefer-destructuring
        touchNode({ nodeId: cacheRemoteData.fileNodeID })
      }

      // If we don't have cached data, download the file
      if (!fileNodeID) {
        try {
          const fileNode = await createRemoteFileNode({
            url,
            store,
            cache,
            createNode,
            createNodeId,
            name: node.name,
          })

          if (fileNode) {
            bar.tick()
            fileNodeID = fileNode.id

            await cache.set(remoteDataCacheKey, { fileNodeID })
          }
        } catch (err) {
          // Ignore
        }
      }

      if (fileNodeID) {
        node.localFile___NODE = fileNodeID
      }

      return node
    })
  )
}
exports.downloadOrchardCoreAssets = downloadOrchardCoreAssets
