import { QueryResult } from '@apollo/client'
import * as Sentry from '@sentry/react'
import { ChainId, Currency, Token } from '@vnaysn/jediswap-sdk-core'
import ms from 'ms'
import { useEffect } from 'react'

import { AVERAGE_L1_BLOCK_TIME } from 'constants/chainInfo'
import { DEFAULT_CHAIN_ID, NATIVE_CHAIN_ID, nativeOnChain, WRAPPED_NATIVE_CURRENCY } from 'constants/tokens'
import { getNativeTokenDBAddress } from 'utils/nativeTokens'
import { Chain, ContractInput, HistoryDuration, TokenStandard } from './types-and-hooks'

export enum PollingInterval {
  Slow = ms('5m'),
  Normal = ms('1m'),
  Fast = AVERAGE_L1_BLOCK_TIME,
  LightningMcQueen = ms('3s'), // approx block interval for polygon
}

// Polls a query only when the current component is mounted, as useQuery's pollInterval prop will continue to poll after unmount
export function usePollQueryWhileMounted<T, K>(queryResult: QueryResult<T, K>, interval: PollingInterval) {
  const { startPolling, stopPolling } = queryResult

  useEffect(() => {
    startPolling(interval)
    return stopPolling
  }, [interval, startPolling, stopPolling])

  return queryResult
}

export enum TimePeriod {
  HOUR,
  DAY,
  WEEK,
  MONTH,
  YEAR,
}

export function toHistoryDuration(timePeriod: TimePeriod): HistoryDuration {
  switch (timePeriod) {
    case TimePeriod.HOUR:
      return HistoryDuration.Hour
    case TimePeriod.DAY:
      return HistoryDuration.Day
    case TimePeriod.WEEK:
      return HistoryDuration.Week
    case TimePeriod.MONTH:
      return HistoryDuration.Month
    case TimePeriod.YEAR:
      return HistoryDuration.Year
  }
}

export type PricePoint = { timestamp: number; value: number }

export function isPricePoint(p: PricePoint | null): p is PricePoint {
  return p !== null
}

export const GQL_MAINNET_CHAINS = [
  Chain.Ethereum,
  Chain.Polygon,
  Chain.Celo,
  Chain.Optimism,
  Chain.Arbitrum,
  Chain.Bnb,
  Chain.Avalanche,
  Chain.Base,
] as const

const GQL_TESTNET_CHAINS = [Chain.EthereumGoerli, Chain.EthereumSepolia] as const

const UX_SUPPORTED_GQL_CHAINS = [...GQL_MAINNET_CHAINS, ...GQL_TESTNET_CHAINS] as const
export type InterfaceGqlChain = (typeof UX_SUPPORTED_GQL_CHAINS)[number]

export function chainIdToBackendName(chainId: string | undefined) {
  return 'MAINNET'
}

const GQL_CHAINS = [ChainId.MAINNET] as const
type GqlChainsType = (typeof GQL_CHAINS)[number]

export function isGqlSupportedChain(chainId: ChainId | undefined): chainId is GqlChainsType {
  return false
}
export function toContractInput(currency: Currency) {
  const chain = chainIdToBackendName(currency.chainId)
  return {}
}

export function gqlToCurrency(token: {
  address?: string
  chain: Chain
  standard?: TokenStandard
  decimals?: number
  name?: string
  symbol?: string
}): Currency | undefined {
  const chainId = supportedChainIdFromGQLChain(token.chain)
  if (!chainId) {
    return undefined
  }
  if (token.standard === TokenStandard.Native || token.address === 'NATIVE' || !token.address) {
    return nativeOnChain(chainId)
  }
  return new Token(chainId, token.address, token.decimals ?? 18, token.symbol, token.name)
}

const URL_CHAIN_PARAM_TO_BACKEND: { [key: string]: InterfaceGqlChain } = {
  ethereum: Chain.Ethereum,
  polygon: Chain.Polygon,
  celo: Chain.Celo,
  arbitrum: Chain.Arbitrum,
  optimism: Chain.Optimism,
  bnb: Chain.Bnb,
  avalanche: Chain.Avalanche,
  base: Chain.Base,
}

/**
 * @param chainName parsed in chain name from url query parameter
 * @returns if chainName is a valid chain name, returns the backend chain name, otherwise returns undefined
 */
export function getValidUrlChainName(chainName: string | undefined): Chain | undefined {
  const validChainName = chainName && URL_CHAIN_PARAM_TO_BACKEND[chainName]
  return validChainName || undefined
}

/**
 * @param chainName parsed in chain name from url query parameter
 * @returns if chainName is a valid chain name supported by the backend, returns the backend chain name, otherwise returns Chain.Ethereum
 */
export function validateUrlChainParam(chainName: string | undefined) {
  const isValidChainName = chainName && URL_CHAIN_PARAM_TO_BACKEND[chainName]
  const isValidBackEndChain =
    isValidChainName && (BACKEND_SUPPORTED_CHAINS as ReadonlyArray<Chain>).includes(isValidChainName)
  return isValidBackEndChain ? URL_CHAIN_PARAM_TO_BACKEND[chainName] : Chain.Ethereum
}

export function isSupportedGQLChain(chain: Chain): chain is InterfaceGqlChain {
  return (UX_SUPPORTED_GQL_CHAINS as ReadonlyArray<Chain>).includes(chain)
}

export function supportedChainIdFromGQLChain(chain: InterfaceGqlChain): ChainId
export function supportedChainIdFromGQLChain(chain: Chain): ChainId | undefined
export function supportedChainIdFromGQLChain(chain: Chain): ChainId | undefined {
  return DEFAULT_CHAIN_ID
}

export function logSentryErrorForUnsupportedChain({
  extras,
  errorMessage,
}: {
  extras?: Record<string, any>
  errorMessage: string
}) {
  Sentry.withScope((scope) => {
    extras &&
      Object.entries(extras).map(([k, v]) => {
        scope.setExtra(k, v)
      })
    Sentry.captureException(new Error(errorMessage))
  })
}

export const BACKEND_SUPPORTED_CHAINS = [
  Chain.Ethereum,
  Chain.Arbitrum,
  Chain.Optimism,
  Chain.Polygon,
  Chain.Base,
  Chain.Bnb,
  Chain.Celo,
] as const
export const BACKEND_NOT_YET_SUPPORTED_CHAIN_IDS = [ChainId.MAINNET] as const

export function getTokenDetailsURL({
  address,
  chain,
  inputAddress,
  isInfoExplorePageEnabled,
}: {
  address?: string | null
  chain: Chain
  inputAddress?: string | null
  isInfoExplorePageEnabled: boolean
}) {
  const chainName = chain.toLowerCase()
  const tokenAddress = address ?? NATIVE_CHAIN_ID
  const inputAddressSuffix = inputAddress ? `?inputCurrency=${inputAddress}` : ''
  return `${isInfoExplorePageEnabled ? '/explore' : ''}/tokens/${chainName}/${tokenAddress}${inputAddressSuffix}`
}

export function unwrapToken<
  T extends {
    address?: string | null
  } | null
>(chainId: ChainId, token: T): T {
  if (!token?.address) {
    return token
  }

  const address = token.address.toLowerCase()
  const nativeAddress = WRAPPED_NATIVE_CURRENCY[chainId]?.address.toLowerCase()
  if (address !== nativeAddress) {
    return token
  }

  const nativeToken = nativeOnChain(chainId)
  return {
    ...token,
    ...nativeToken,
    address: NATIVE_CHAIN_ID,
    extensions: undefined, // prevents marking cross-chain wrapped tokens as native
  }
}
