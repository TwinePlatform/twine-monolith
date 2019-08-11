import React, { FunctionComponent } from 'react';
import { withRouter } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../../lib/ui/components/Headings';
import { Accordion } from './components/Accordion';


const FAQPage: FunctionComponent = () => {
  return (
    <Grid>
      <Row middle="xs">
        <Col>
          <H1>Frequently Asked Questions</H1>
        </Col>
      </Row>
      <Row middle="xs">
        <Col>
          <Accordion
            panels={[
              {
                heading: 'What is the dashboard',
                contents: [
                  'The Twine dashboard visualises data from the volunteer app. It makes identifying trends and reporting on data much simpler and faster than our old dashboard.',
                  'From the main page, click on any of the ‘tiles’ to choose the data you want to see, as per the description. You can also navigate the dashboard using the menu in the top right of the screen.',
                  'The dashboard features easy read charts of your data, which can be filtered for added clarity. Use the legend to the right of the chart to select the data you do and don’t want to see. Simply click on any label within the legend to show or remove that data from the chart. Selecting ‘All’ will either select or deselect all the data. Hover your cursor over the chart to find out more information about the chart, explained in a pop-up box called a ‘tooltip’.',
                  'It is also possible to view your data in a table instead, by clicking on the table tab. Click on any column heading to sort the table by the data in that column.',
                  'Both chart and tables can also be filtered by date, using the ‘date picker’ in the top left of the screen. You can also toggle the data between hours and days, giving you both detailed and higher level insight into volunteering activity at your organisation. Use the download button to extract a data file you can use for further analysis.',
                ],
              },
            ]}
          />
        </Col>
      </Row>
    </Grid>
  );
};

export default withRouter(FAQPage);
