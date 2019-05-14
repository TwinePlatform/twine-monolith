import React from 'react';
import styled from 'styled-components';
import _Card from './Card';
import { H2 } from './Headings';
import { Paragraph as P } from './Typography';
import { RoundedButton } from './Buttons';
import { ColoursEnum, Fonts } from '../styles/design_system';


const Card = styled(_Card)`
  max-width: 30rem;
  margin-bottom: 2rem;
`;

const CardFiller = styled.div`
  height: 19rem;
  background-color: ${ColoursEnum.grey};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CaptionSection = styled.div`
  padding: 2rem;
`;

const Paragraph = styled(P)`
  margin-bottom: 2rem;
`;

const DefaultPicFiller = styled(Paragraph)`
  font-size: ${Fonts.size.special};
  color: ${ColoursEnum.white};
`;


type PolaroidProps = {
  title: string
  caption: string
  callToAction?: string
  picture?: (() => React.FunctionComponent) | string
  disabled?: boolean
  onClick?: () => void,
};

const DefaultPicture: React.FunctionComponent = (props) => (
  <CardFiller>
    <DefaultPicFiller>{props.children}</DefaultPicFiller>
  </CardFiller>
);

const Polaroid: React.FunctionComponent<PolaroidProps> = (props) => {
  const {
    title,
    caption,
    callToAction,
    picture = '',
    disabled = false,
    onClick = () => {},
  } = props;

  const image = typeof picture === 'string'
    ? () => <DefaultPicture>{picture}</DefaultPicture>
    : () => <CardFiller>{picture()}</CardFiller>;

  return (
    <Card>
      { image() }
      <CaptionSection>
        <H2>{title}</H2>
        <Paragraph>{caption}</Paragraph>
        {
          callToAction && (
            <RoundedButton disabled={disabled} onClick={onClick}>
              {callToAction}
            </RoundedButton>
          )
        }
      </CaptionSection>
    </Card>
  );
};

export default Polaroid;
