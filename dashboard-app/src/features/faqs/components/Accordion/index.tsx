import React, { FunctionComponent } from 'react';
import styled from 'styled-components';
import { Row } from 'react-flexbox-grid';
import {
  Accordion as AccordionComponent,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { Paragraph } from '../../../../lib/ui/components/Typography';

import './styles.css';


type AccordionProps = {
  panels: {
    heading: string
    contents: string[]
  }[]
};

const PanelItem = styled(Paragraph)`
  margin-bottom: 2em;
`;

export const Accordion: FunctionComponent<AccordionProps> = ({ panels = [] }) => (
  <AccordionComponent>
    {
      panels.map(({ heading, contents }) =>
        <AccordionItem>
          <AccordionItemHeading>
            <AccordionItemButton>
              {heading}
            </AccordionItemButton>
          </AccordionItemHeading>
          <AccordionItemPanel>
            {
              contents.map((content) =>
                <Row start="xs">
                  <PanelItem>
                    {content}
                  </PanelItem>
                </Row>
              )
            }
          </AccordionItemPanel>
        </AccordionItem>
      )
    }
  </AccordionComponent>
);
