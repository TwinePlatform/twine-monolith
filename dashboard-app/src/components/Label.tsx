import React from 'react';
import styled from 'styled-components';
import { ColoursEnum, Fonts } from '../styles/style_guide';


export type LabelProps = {
  inline?: boolean
  content: string
};

type InlineProps = Pick<LabelProps, 'inline'>;

const HTMLLabel = styled.label<InlineProps>`
  width: 100%;
  color: ${ColoursEnum.black};
  font-size: ${Fonts.size.normal};
  ${
    (props) => props.inline
      ? 'display: flex; align-items: center;'
      : ''
  }
`;

const BlockLabelContent = styled.p`
  width: 100%;
  text-align: left;
  margin-bottom: 0.5em;
`;

const InlineLabelContent = styled.span`
  text-align: left;
  margin-right: 0.5em;
  white-space: pre;
`;

const LabelContent: React.FunctionComponent<InlineProps> = (props) => (
  props.inline
    ? <InlineLabelContent {...props} />
    : <BlockLabelContent {...props} />
);

const Label: React.FunctionComponent<LabelProps> = (props) => (
  <HTMLLabel inline={props.inline}>
    <LabelContent inline={props.inline}>{props.content}</LabelContent>
    {props.children}
  </HTMLLabel>
);

export default Label;
