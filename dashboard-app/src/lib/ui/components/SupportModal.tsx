import React, { FC, useRef} from 'react';
import {useOutsideAlerter} from '../../hooks/useOutsideAlerter';
import styled from 'styled-components';
import { H2 } from './Headings';
import { Paragraph as P } from './Typography';
import { ColoursEnum, SpacingEnum, Fonts } from '../design_system';

/*
 * Types
 */
type Props = {
  visible: boolean;
  closeFunction: () => void;
}

/*
 * Styles
 */

const ModalContainer = styled.div`
    position: fixed;
    width: 30%;
    height: 25%;
    top: 30%;
    right: 5%;
    background-color: white;
    border-radius: 8px;
    boxShadow: 2px 3px 6px #00000029;
`;

const HeaderContainer = styled.div`
    background-color: ${ColoursEnum.purple};
    border-radius: 8px 8px 0px 0px;
`;

const Paragraph = styled(P)`
    margin-top: ${SpacingEnum.medium}; 
    text-align: center;
    color: ${ColoursEnum.darkGrey};
`;

const LinkParagraph = styled.p`
    text-align: center;
    font-size: ${Fonts.size.body};
`;

const ExternalLink = styled.a`
    margin-bottom: ${SpacingEnum.small}; 
`;

const Heading2 = styled(H2)`
  color: ${ColoursEnum.white};
  text-align: left;
  padding: 0.5rem;
`;

const SupportModal:FC<Props> = (props) => {
    const {visible, closeFunction} = props;

    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, closeFunction);

    if(visible)
        return (
            <ModalContainer ref={wrapperRef}>
               <HeaderContainer>
                    <Heading2>TWINE</Heading2>
                </HeaderContainer>
                <Paragraph>For more info on TWINE click here:</Paragraph>
                <ExternalLink href="https://www.twine-together.com">
                    <LinkParagraph>https://www.twine-together.com</LinkParagraph>
                </ExternalLink>
                <Paragraph>For technical support with TWINE, enter your issue into a new ticket here:</Paragraph>
                <ExternalLink href="https://twineplatform.freshdesk.com/support/tickets/new">
                    <LinkParagraph>https://twineplatform.freshdesk.com/support/tickets/new</LinkParagraph>
                </ExternalLink>
            </ModalContainer>
        );
    else
        return null;
};

export default SupportModal;