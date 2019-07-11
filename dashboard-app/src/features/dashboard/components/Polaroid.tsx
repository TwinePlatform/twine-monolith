import React from 'react';
import styled from 'styled-components';
import _Card from '../../../lib/ui/components/Card';
import { H2 } from '../../../lib/ui/components/Headings';
import { Paragraph as P } from '../../../lib/ui/components/Typography';
import { RoundedButton } from '../../../lib/ui/components/Buttons';
import { ColoursEnum, Fonts } from '../../../lib/ui/design_system';


/*
 * Types
 */
type PolaroidProps = {
  title: string
  caption: string
  callToAction?: string
  placeHolder?: string
  disabled?: boolean
  onClick?: () => void,
};

/*
 * Style
 */
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
  min-height: 2rem;
`;

const DefaultPicFiller = styled(Paragraph)`
  font-size: ${Fonts.size.special};
  color: ${ColoursEnum.white};
`;

/*
 * Component
 */
const TopContainer: React.FunctionComponent<Pick<PolaroidProps, 'placeHolder'>> = (props) => {
  return (
  <CardFiller>
    {props.children
      ? props.children
      : <DefaultPicFiller>{props.placeHolder || ''}</DefaultPicFiller>}
  </CardFiller>
  );
};

const Polaroid: React.FunctionComponent<PolaroidProps> = (props) => {
  const {
    children,
    placeHolder,
    title,
    caption,
    callToAction,
    disabled = false,
    onClick = () => {},
  } = props;

  return (
    <Card>
      <TopContainer placeHolder={placeHolder} children={children}/>
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
