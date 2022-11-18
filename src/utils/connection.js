import { CosmWasmClient, SigningCosmWasmClient } from '@cosmjs/cosmwasm-stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { GasPrice } from '@cosmjs/stargate';
import { getKeplr } from './keplr';

export const AccountType = ['Basic', 'Keplr', 'Contract']

class ConnectionManager {
  queryingClientConnection;
  signingClientConnections = {};

  getQueryClient = async (config, forceRefresh = false) => {
    const rpcEndpoint = config['rpcEndpoint'];
    if (
      this.queryingClientConnection === undefined ||
      this.queryingClientConnection.rpcEndpoint !== rpcEndpoint ||
      forceRefresh
    ) {
      this.queryingClientConnection = {
        client: await CosmWasmClient.connect(rpcEndpoint),
        rpcEndpoint,
      };
    }

    return this.queryingClientConnection.client;
  };

  getSigningClient = async (account, config) => {
    const rpcEndpoint = config['rpcEndpoint'];
    const { address } = account;
    if (
      this.signingClientConnections[address] === undefined ||
      this.signingClientConnections[address].rpcEndpoint !== rpcEndpoint
    ) {
      let signer;
      if (account.type === AccountType[0]) {
        const prefix = config['addressPrefix'];
        signer = await DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {
          prefix,
        });
      } else if (account.type === AccountType[1]) {
        const keplr = await getKeplr();
        const chainId = config['chainId'];
        await keplr.enable(chainId);
        signer = keplr.getOfflineSigner(chainId);
      } else {
        throw new Error('Invalid account type');
      }
      this.signingClientConnections[address] = {
        client: await SigningCosmWasmClient.connectWithSigner(
          rpcEndpoint,
          signer,
          {
            gasPrice: GasPrice.fromString(
              `${config['gasPrice']}${config['microDenom']}`
            ),
          }
        ),
        address,
        rpcEndpoint,
      };
    }
    return this.signingClientConnections[address].client;
  };
}

export default new ConnectionManager();
