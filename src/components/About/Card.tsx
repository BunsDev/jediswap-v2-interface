import { BrowserEvent, SharedEventName } from '@uniswap/analytics-events';
import { Link } from 'react-router-dom';
import styled, { DefaultTheme } from 'styled-components';

import { TraceEvent } from 'analytics';
import { BREAKPOINTS } from 'theme';

export enum CardType {
  Primary = 'Primary',
  Secondary = 'Secondary',
}

const StyledCard = styled.div<{ $backgroundImgSrc?: string; $type: CardType }>`
  display: flex;
  background: ${({ $backgroundImgSrc, theme }) => `${theme.surface2} ${$backgroundImgSrc ? ` url(${$backgroundImgSrc})` : ''}`};
  background-size: auto 100%;
  background-position: right;
  background-repeat: no-repeat;
  background-origin: border-box;

  flex-direction: column;
  justify-content: space-between;
  text-decoration: none;
  color: ${({ theme }) => theme.neutral1};
  padding: 24px;
  height: 212px;
  border-radius: 24px;
  border: 1px solid ${({ theme, $type }) => ($type === CardType.Primary ? 'transparent' : theme.surface3)};
  transition: ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.ease} border`};

  @media screen and (min-width: ${BREAKPOINTS.sm}px) {
    height: ${({ $backgroundImgSrc }) => ($backgroundImgSrc ? 360 : 260)}px;
  }
  @media screen and (min-width: ${BREAKPOINTS.xl}px) {
    padding: 32px;
  }
}`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CardTitle = styled.div`
  font-size: 20px;
  line-height: 28px;
  font-weight: 535;

  @media screen and (min-width: ${BREAKPOINTS.lg}px) {
    font-size: 28px;
    line-height: 36px;
  }
`;

const getCardDescriptionColor = (type: CardType, theme: DefaultTheme) => {
  switch (type) {
    case CardType.Secondary:
      return theme.neutral2;
    default:
      return theme.neutral1;
  }
};

const CardDescription = styled.div<{ type: CardType }>`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme, type }) => getCardDescriptionColor(type, theme)};
  padding: 0 40px 0 0;
  max-width: 480px;

  @media screen and (min-width: ${BREAKPOINTS.xl}px) {
    font-size: 20px;
    line-height: 28px;
    max-width: 480px;
  }
`;

const CardCTA = styled(CardDescription)`
  color: ${({ theme }) => theme.accent1};
  font-weight: 535;
  margin: 24px 0 0;
  cursor: pointer;

  transition: ${({ theme }) => `${theme.transition.duration.medium} ${theme.transition.timing.ease} opacity`};

  &:hover {
    opacity: 0.6;
  }
`;

const Card = ({ type = CardType.Primary,
  title,
  description,
  cta,
  to,
  external,
  backgroundImgSrc,
  icon,
  elementName }: {
  type?: CardType
  title: string
  description: string
  cta?: string
  to: string
  external?: boolean
  backgroundImgSrc?: string
  icon?: React.ReactNode
  elementName?: string
}) => (
  <TraceEvent events={[BrowserEvent.onClick]} name={SharedEventName.ELEMENT_CLICKED} element={elementName}>
    <StyledCard
      as={external ? 'a' : Link}
      to={external ? undefined : to}
      href={external ? to : undefined}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopenener noreferrer' : undefined}
      $backgroundImgSrc={backgroundImgSrc}
      $type={type}
    >
      <TitleRow>
        <CardTitle>{title}</CardTitle>
        {icon}
      </TitleRow>
      <CardDescription type={type}>
        {description}
        <CardCTA type={type}>{cta}</CardCTA>
      </CardDescription>
    </StyledCard>
  </TraceEvent>
);

export default Card;
