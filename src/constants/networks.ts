import { ChainId } from '@vnaysn/jediswap-sdk-core'

const INFURA_KEY = process.env.REACT_APP_INFURA_KEY
if (typeof INFURA_KEY === 'undefined') {
  throw new Error(`REACT_APP_INFURA_KEY must be a defined environment variable`)
}
const QUICKNODE_MAINNET_RPC_URL = process.env.REACT_APP_QUICKNODE_MAINNET_RPC_URL
if (typeof QUICKNODE_MAINNET_RPC_URL === 'undefined') {
  throw new Error(`REACT_APP_QUICKNODE_MAINNET_RPC_URL must be a defined environment variable`)
}
const QUICKNODE_BNB_RPC_URL = process.env.REACT_APP_BNB_RPC_URL
if (typeof QUICKNODE_BNB_RPC_URL === 'undefined') {
  throw new Error(`REACT_APP_BNB_RPC_URL must be a defined environment variable`)
}

/**
 * Fallback JSON-RPC endpoints.
 * These are used if the integrator does not provide an endpoint, or if the endpoint does not work.
 *
 * MetaMask allows switching to any URL, but displays a warning if it is not on the "Safe" list:
 * https://github.com/MetaMask/metamask-mobile/blob/bdb7f37c90e4fc923881a07fca38d4e77c73a579/app/core/RPCMethods/wallet_addEthereumChain.js#L228-L235
 * https://chainid.network/chains.json
 *
 * These "Safe" URLs are listed first, followed by other fallback URLs, which are taken from chainlist.org.
 */
export const FALLBACK_URLS = {
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://api.mycryptoapi.com/eth',
    'https://cloudflare-eth.com',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth',
    'https://eth-mainnet.public.blastapi.io',
  ],
  [ChainId.GOERLI]: [
    // "Safe" URLs
    'https://rpc.goerli.mudit.blog/',
    // "Fallback" URLs
    'https://rpc.ankr.com/eth_goerli',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://rpc.sepolia.dev/',
    // "Fallback" URLs
    'https://rpc.sepolia.org/',
    'https://rpc2.sepolia.org/',
    'https://rpc.sepolia.online/',
    'https://www.sepoliarpc.space/',
    'https://rpc-sepolia.rockx.com/',
    'https://rpc.bordel.wtf/sepolia',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://polygon-rpc.com/',
    'https://rpc-mainnet.matic.network',
    'https://matic-mainnet.chainstacklabs.com',
    'https://rpc-mainnet.maticvigil.com',
    'https://rpc-mainnet.matic.quiknode.pro',
    'https://matic-mainnet-full-rpc.bwarelabs.com',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://matic-mumbai.chainstacklabs.com',
    'https://rpc-mumbai.maticvigil.com',
    'https://matic-testnet-archive-rpc.bwarelabs.com',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://arb1.arbitrum.io/rpc',
    // "Fallback" URLs
    'https://arbitrum.public-rpc.com',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://goerli-rollup.arbitrum.io/rpc',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://mainnet.optimism.io/',
    // "Fallback" URLs
    'https://rpc.ankr.com/optimism',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://goerli.optimism.io',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    `https://forno.celo.org`,
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    `https://alfajores-forno.celo-testnet.org`,
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://endpoints.omniatech.io/v1/bsc/mainnet/public',
    'https://bsc-mainnet.gateway.pokt.network/v1/lb/6136201a7bad1500343e248d',
    'https://1rpc.io/bnb',
    'https://bsc-dataseed3.binance.org',
    'https://bsc-dataseed2.defibit.io',
    'https://bsc-dataseed1.ninicoin.io',
    'https://binance.nodereal.io',
    'https://bsc-dataseed4.defibit.io',
    'https://rpc.ankr.com/bsc',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://api.avax.network/ext/bc/C/rpc',
    'https://avalanche-c-chain.publicnode.com',
  ],
  [ChainId.MAINNET]: [
    // "Safe" URLs
    'https://mainnet.base.org/',
    'https://developer-access-mainnet.base.org/',
    'https://base.gateway.tenderly.co',
    'https://base.publicnode.com',
    // "Fallback" URLs
    'https://1rpc.io/base',
    'https://base.meowrpc.com',
  ],
}

/**
 * Known JSON-RPC endpoints.
 * These are the URLs used by the interface when there is not another available source of chain data.
 */
export const RPC_URLS = {
  [ChainId.MAINNET]: [
    `https://mainnet.infura.io/v3/${INFURA_KEY}`,
    QUICKNODE_MAINNET_RPC_URL,
    ...FALLBACK_URLS[ChainId.MAINNET],
  ],
  [ChainId.GOERLI]: [`https://goerli.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.GOERLI]],
  [ChainId.MAINNET]: [`https://sepolia.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://optimism-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://optimism-goerli.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://arbitrum-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://arbitrum-goerli.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://polygon-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://polygon-mumbai.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: FALLBACK_URLS[ChainId.MAINNET],
  [ChainId.MAINNET]: FALLBACK_URLS[ChainId.MAINNET],
  [ChainId.MAINNET]: [QUICKNODE_BNB_RPC_URL, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://avalanche-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
  [ChainId.MAINNET]: [`https://base-mainnet.infura.io/v3/${INFURA_KEY}`, ...FALLBACK_URLS[ChainId.MAINNET]],
}
