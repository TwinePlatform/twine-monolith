import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import moment from 'moment';
import csv from 'fast-csv';
import { saveAs } from 'file-saver';
import { pipe, assoc, omit, pick, prepend, filter } from 'ramda';
import { Visitors } from '../../../api';
import { PrimaryButton } from '../../../shared/components/form/base';
import { colors, fonts } from '../../../shared/style_guide';


const writeCsv = object =>
  new Promise((resolve, reject) =>
    csv.writeToString(
      object,
      (err, data) => err ? reject({ errors: { general: 'Could not create CSV' } }) : resolve(data)));


const exportCsv = filters =>
  Visitors.get({}, {
    visits: true,
    filter: filter(Boolean, {
      gender: filters.gender,
      age: filters.age,
      visitActivity: filters.activity,
    }),
  })
    .then((res) => {
      const csvData = res.data.result
        .map(
          pipe(
            pick(['name', 'gender', 'birthYear', 'visits']),
            ({ visits, ...visitor }) => visits.map(v => ({ ...v, ...visitor })),
          ))
        .reduce((acc, x) => acc.concat(x), []) // flatten
        .map(x =>
          pipe(
            assoc('visitTime', moment(x.createdAt).format('HH:mm')),
            assoc('visitDate', moment(x.createdAt).format('DD-MM-YYYY')),
            omit(['createdAt', 'deletedAt', 'modifiedAt']),
          )(x),
        );

      const withHeaders = prepend(
        {
          id: 'Visit ID',
          name: 'Full Name',
          gender: 'Gender',
          birthYear: 'Year of Birth',
          visitActivity: 'Activity',
          visitDate: 'Visit Date',
          visitTime: 'Visit Time',
        },
        csvData,
      );

      return writeCsv(withHeaders);
    })
    .then((data) => {
      const filterOptions = [filters.gender, filters.age, filters.activity].filter(Boolean).join('-');
      const fileNameFilters = filterOptions ? `-${filterOptions}` : '';
      const csvFile = new File([data], `visits_data${fileNameFilters}.csv`, { type: 'text/plain;charset=utf-8' });
      saveAs(csvFile);
    });


const Button = styled(PrimaryButton)`
  color: ${colors.dark};
  font-size: 0.9em;
  font-weight: ${fonts.weight.heavy};
  text-align: center;
  letter-spacing: 0;
  flex: ${props => props.flex || '1'};
  padding: 0.8rem;
`;


const CsvExportButton = ({ filters, onError, children }) => {
  const onClick = useCallback(() => exportCsv(filters).catch(onError), [filters, onError]);

  return (
    <Button onClick={onClick}>
      {children}
    </Button>
  );
};

CsvExportButton.propTypes = {
  children: PropTypes.node.isRequired,
  filters: PropTypes.shape({
    gender: PropTypes.string,
    age: PropTypes.string,
    activity: PropTypes.string,
  }).isRequired,
  onError: PropTypes.func.isRequired,
};

export default CsvExportButton;
