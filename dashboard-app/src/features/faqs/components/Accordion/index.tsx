import React, { FunctionComponent } from 'react';
import { Paragraph } from '../../../../lib/ui/components/Typography';
import Collapsible from 'react-collapsible';

import './styles.css';


type AccordionProps = {
  panels: {
    heading: string
    contents: string[]
  }[]
};


export const Accordion: FunctionComponent<AccordionProps> = ({ panels = [] }) => (
  <div>
    {
      panels.map(({ heading, contents }) =>
        <Collapsible trigger={heading}>
          {
            contents.map((content) =>
              <Paragraph>
                {content}
              </Paragraph>
            )
          }
        </Collapsible>
      )
    }
  </div>
);
