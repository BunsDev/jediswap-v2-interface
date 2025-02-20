import { Trans } from '@lingui/macro'
import { AlertTriangle, Slash } from 'react-feather'
import styled, { useTheme } from 'styled-components'

import { MouseoverTooltip } from '../../components/Tooltip'

const BadgeWrapper = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: flex-end;
`

const BadgeText = styled.div`
  font-weight: 700;
  font-family: 'DM Sans';
  font-size: 12px;
  line-height: 14px;
  margin-right: 8px;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    margin-left: auto;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    margin-left: auto;
  }
`

const ActiveDot = styled.span`
  background-color: ${({ theme }) => theme.signalGreen};
  border-radius: 50%;
  height: 8px;
  width: 8px;
`

const LabelText = styled.div<{ color: string }>`
  align-items: center;
  color: ${({ color }) => color};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  @media (max-width: ${({ theme }) => `${theme.breakpoint.md}px`}) {
    width: 154px;
  }

  @media (max-width: ${({ theme }) => `${theme.breakpoint.sm}px`}) {
    width: 154px;
  }
`

export default function RangeBadge({ removed, inRange }: { removed?: boolean; inRange?: boolean }) {
  const theme = useTheme()
  return (
    <BadgeWrapper>
      {removed ? (
        <MouseoverTooltip text={<Trans>Your position has 0 liquidity, and is not earning fees.</Trans>}>
          <LabelText color={theme.neutral2}>
            <BadgeText>
              <Trans>Inactive</Trans>
            </BadgeText>
            <Slash width={12} height={12} />
          </LabelText>
        </MouseoverTooltip>
      ) : inRange ? (
        <MouseoverTooltip
          text={
            <Trans>
              The price of this pool is within your selected range. Your position is currently earning fees.
            </Trans>
          }
        >
          <LabelText color={theme.signalGreen}>
            <BadgeText>
              <Trans>In Range</Trans>
            </BadgeText>
            {/* <ActiveDot /> */}
          </LabelText>
        </MouseoverTooltip>
      ) : (
        <MouseoverTooltip
          text={
            <Trans>
              The price of this pool is outside of your selected range. Your position is not currently earning fees.
            </Trans>
          }
        >
          <LabelText color={theme.signalRed}>
            <BadgeText>
              <Trans>Inactive</Trans>
            </BadgeText>
            {/* <AlertTriangle width={12} height={12} /> */}
          </LabelText>
        </MouseoverTooltip>
      )}
    </BadgeWrapper>
  )
}
