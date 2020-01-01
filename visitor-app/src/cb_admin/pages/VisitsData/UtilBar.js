import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col } from 'react-flexbox-grid';
import LabelledSelect from '../../../shared/components/form/LabelledSelect';
import { Form as F } from '../../../shared/components/form/base';
import CsvExportButton from './CsvExportButton';
import { AgeGroups } from './utils/util';
import { BasisType } from './utils/staticValues';
import DateRanges from './utils/dateRange';


const Form = styled(F)`
  width: 100%;
`;

const Spacer = styled.p`
  margin: 0.4em;
`;

const ageOptions = AgeGroups.toSelectOptions();
const timeOptions = DateRanges.toSelectOptions();

const UtilBar = ({ onChange, errors, basis, options, filters, onExportError }) => (
  <Row center="xs">
    <Form onChange={onChange} onSubmit={e => e.preventDefault()}>
      <Col xs={2}>
        <LabelledSelect
          id="visits-data-time-period"
          name="filters.time"
          label="Date range"
          options={timeOptions}
          errors={errors.time}
        />
      </Col>
      <Col xs={2}>
        <LabelledSelect
          id="visits-data-data-points"
          name="basis"
          label="Data points"
          value={basis}
          options={[{ key: '0', value: BasisType.Visits }, { key: '1', value: BasisType.Visitors }]}
        />
      </Col>
      <Col xs={2}>
        <LabelledSelect
          id="visits-data-gender"
          name="filters.gender"
          label="By gender"
          options={options.genders}
          errors={errors.gender}
        />
      </Col>
      <Col xs={2}>
        <LabelledSelect
          id="visits-data-age"
          name="filters.age"
          label="By age group"
          options={ageOptions}
          errors={errors.age}
        />
      </Col>
      <Col xs={3}>
        <LabelledSelect
          id="visits-data-activity"
          name="filters.activity"
          label="By activity"
          options={options.activities}
          errors={errors.activity}
        />
      </Col>
      <Col xs={1}>
        <Spacer />
        <CsvExportButton
          filters={filters}
          onError={onExportError}
        >
        Export
        </CsvExportButton>
      </Col>
    </Form>
  </Row>);

UtilBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.shape({}).isRequired,
  basis: PropTypes.string.isRequired,
  options: PropTypes.shape({
    genders: PropTypes.array,
    activities: PropTypes.array,
  }).isRequired,
  filters: PropTypes.shape({
    gender: PropTypes.string,
    age: PropTypes.number,
    time: PropTypes.number,
    activity: PropTypes.string,
  }).isRequired,
  onExportError: PropTypes.func.isRequired,
};

export default UtilBar;
