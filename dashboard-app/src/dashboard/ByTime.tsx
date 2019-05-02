import React, { useEffect, useState } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { H1 } from '../components/Headings';
import { CommunityBusinesses } from '../api';
import DataTable from '../components/DataTable';
import { DataTableRow, DataTableProps } from '../components/DataTable/types';
import useRequestOnLoad from '../util/hooks/useRequestOnLoad';
import { UnitEnum } from '../types';
import DateRange from '../util/dateRange';

const blah = {
  title: 'Data Table Title',
  headers: [
    'Volunteer Name',
    'Total Volunteer Hours',
    'Cafe/Catering',
    'Community outreach and communications',
    'Committee work, AGM',
    'Helping with raising funds (shop, events…)',
    'Office support',
    'Other',
    'Outdoor and practical work',
    'Professional pro bono work (Legal, IT, Research)',
    'Shop/Sales',
    'Support and Care for vulnerable community members',
  ],
  rows: [
    {
      columns: {
        'Volunteer Name': { content: 'foo' },
        'Total Volunteer Hours': { content: 2 },
        'Cafe/Catering': { content: 3 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        Other: { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'bar' },
        'Total Volunteer Hours': { content: 4 },
        'Cafe/Catering': { content: 5 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        Other: { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'baz' },
        'Total Volunteer Hours': { content: 6 },
        'Cafe/Catering': { content: 7 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        Other: { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
    {
      columns: {
        'Volunteer Name': { content: 'bax' },
        'Total Volunteer Hours': { content: 8 },
        'Cafe/Catering': { content: 9 },
        'Community outreach and communications': { content: 5 },
        'Committee work, AGM': { content: 5 },
        'Helping with raising funds (shop, events…)': { content: 5 },
        'Office support': { content: 5 },
        Other: { content: 5 },
        'Outdoor and practical work': { content: 5 },
        'Professional pro bono work (Legal, IT, Research)': { content: 5 },
        'Shop/Sales': { content: 5 },
        'Support and Care for vulnerable community members': { content: 5 },
      },
    },
  ],
};

export default () => {
  const { error, loading, data } = useRequestOnLoad(CommunityBusinesses.getLogs);
  const [unit, setUnit] = useState(UnitEnum.HOURS);
  const [months, setMonths] = useState(DateRange.months);


  const props: DataTableProps = {
    title: 'Volunteer Activity over Months',
    headers: ['Activity', `Total ${unit}`, ...months],
    rows: [],
  };

  if (!loading && data) {
    const rows = data.reduce((acc: DataTableRow[], el: any) => {
      const activityExists = acc.some((x) => x.columns.Activity.content === el.activity);
      if (activityExists) {
        return acc.map((x) => {
          if (x.columns.Activity.content === el.activity) {
            x.columns[el.activity].content +=;
          }
        });
      }
      const monthsContent = months.map((m: string) => ({ [m]: { content: 1 } }));
      const newRow = {
        columns: Object.assign({
          Activity: { content: el.activity, },
          [`Total ${unit}`]: { content: 0 },
        }, ...monthsContent),
      };
      return acc.concat(newRow);
    }, []);

    props.rows = rows;
  }
  console.log(props);

  return (
    <Grid>
      <Row center="xs">
        <Col>
          <H1>By Time</H1>
          {data && <DataTable {...props} />}
        </Col>
      </Row>
    </Grid>
  );
};
