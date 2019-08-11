import React, { FunctionComponent } from 'react';
import {
  Accordion as AccordionComponent,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import { Paragraph } from '../../../lib/ui/components/Typography';


type AccordionProps = {
  panels: {
    heading: string
    contents: string[]
  }[]
};

export const Accordion: FunctionComponent<AccordionProps> = (props) => {
  return (
    <AccordionComponent>
      {
        props.panels.map(({ heading, contents }) =>
          <AccordionItem>
            <AccordionItemHeading>
              <AccordionItemButton>
                {heading}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {
                contents.map((content) =>
                  <Paragraph>
                    {content}
                  </Paragraph>
                )
              }
            </AccordionItemPanel>
          </AccordionItem>
        )
      }
    </AccordionComponent>
  );
};
