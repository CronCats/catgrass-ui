const stargaze = require('../../modules/chain-registry/stargaze/chain.json')
const juno = require('../../modules/chain-registry/juno/chain.json')

// Testnets
const juno_testnet = require('./testnets/juno_testnet.json')
const stargaze_testnet = require('./testnets/stargaze_testnet.json')
const stargaze_testnet_collections = require('./testnets/stargaze_testnet_collections.json')

// Deploys
const deploysMainnet = require('./deploys/mainnet.json')
const deploysTestnet = require('./deploys/testnet.json')

class ConfigManager {

  // formats chain registry to smaller obj
  formatConfig = raw => {
    let contractAddress = ''
    if (raw.network_type === 'testnet') contractAddress = deploysTestnet[raw.chain_id]
    if (raw.network_type === 'mainnet') contractAddress = deploysMainnet[raw.chain_id]

    // if (!contractAddress) return;
    return {
      contractAddress,
      ...raw,
      chainName: `${raw.pretty_name} ${raw.network_type}`,
      chainId: `${raw.chain_id}`,
      rpcEndpoint: `${raw.apis.rpc[0].address}`,
      restEndpoint: `${raw.apis.rest[0].address}`,
      faucetEndpoint: ``,
      addressPrefix: `${raw.bech32_prefix}`, //'juno',
      microDenom: `u${raw.denom || raw.bech32_prefix}`, //'ujuno',
      coinDecimals: '6', // TODO: Is this always the case?!
      gasPrice: '0.025', // TODO: Is this always the case?!
      slip44: parseInt(`${raw.slip44}`), //118
    }
  }

  getConfigs = () => {
    return {
      juno: this.formatConfig(juno),
      juno_testnet: this.formatConfig(juno_testnet),
      stargaze: this.formatConfig(stargaze),
      stargaze_testnet: this.formatConfig(stargaze_testnet),

      // Collections
      stargaze_testnet_collections,
    }
  }

  getConfig = key => {
    return this.getConfigs()[key]
  }
}

export default new ConfigManager()
