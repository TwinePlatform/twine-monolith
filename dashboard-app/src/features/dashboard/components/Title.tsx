import React from 'react';
import styled from 'styled-components';
import { H3 } from '../../../lib/ui/components/Headings';
import { SpacingEnum, ColoursEnum } from '../../../lib/ui/design_system';

export type TitleString = [string, string];

type Props = {
  title: TitleString
};

const TitleContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${SpacingEnum.small};
  background-color: ${ColoursEnum.white};
`;

const Text = styled(H3)`
  text-align: left;
  margin-bottom: 0;
`;

export const Title: React.FunctionComponent<Props> = (props) => {
  const [title, dateRange] = props.title;
  return (
      <TitleContainer>
        <Text>{title}</Text >
        <Text>{dateRange}</Text>
      </TitleContainer>
  );
};
