import React, { useState, useEffect, useCallback, FunctionComponent, useContext } from 'react';
import styled from 'styled-components';
import { withRouter, RouteComponentProps } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import UtilityBar from '../components/UtilityBar';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { H1 } from '../../../lib/ui/components/Headings';
import { aggregatedToTableData, TableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import { PrimaryButton, SecondaryButton} from '../../../lib/ui/components/Buttons';
import InviteModal from '../../../lib/ui/components/InviteModal';
import UploadModal from '../../../lib/ui/components/UploadModal';
import DownloadModal from '../../../lib/ui/components/DownloadModal';
import VolunteerTabs from './VolunteerTabs';
import Errors from '../components/Errors';
import useAggregateDataByVolunteer from './useAggregateDataByVolunteer';
import { getTitleForMonthPicker } from '../util';
import { LegendData } from '../components/StackedBarChart/types';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';
import { DashboardContext } from '../../../App';


/**
 * Styles
 */
const Container = styled(Grid)`
`;


/**
 * Helpers
 */
const initTableData = { headers: [], rows: [] };

/**
 * Component
 */
const ByVolunteer: FunctionComponent<RouteComponentProps> = () => {
  const { unit, setUnit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [legendData, setLegendData] = useState<LegendData>([]);
  const [inviteModalVisible, setInviteModalVisible] = useState(false);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [extraButtonsVisible, setExtraButtonsVisible] = useState(false);
  const { loading, data, error, months } =
    useAggregateDataByVolunteer({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // get sorting state values
  const {
    orderable,
    onChangeOrderable,
  } = useOrderable({ initialOrderable: { sortByIndex: 1, order: 'desc' }, updateOn: [tableData] });

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    onChangeOrderable(idx);
  }, [tableData.headers, onChangeOrderable]);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && months) {
      setTableData(aggregatedToTableData({ data, unit, yData: months }));
    }
  }, [data, loading, months, unit]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'volunteer', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [loading, data, fromDate, toDate, unit, orderable, setErrors]);

  const tabProps = {
    data,
    tableData,
    orderable,
    onChangeSortBy,
    title: getTitleForMonthPicker(TitlesCopy.Volunteers.subtitle, fromDate, toDate),
    legendData,
    setLegendData,
  };

  return (
    <Container>
      <InviteModal
        visible={inviteModalVisible}
        closeFunction={()=>setInviteModalVisible(false)}
      />
      <UploadModal
        visible={uploadModalVisible}
        closeFunction={()=>setUploadModalVisible(false)}
        filetype={"volunteer"}
      />
      <DownloadModal
        visible={downloadModalVisible}
        closeFunction={()=>setDownloadModalVisible(false)}
        filename={"volunteertemplate.csv"}
      />
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Volunteers.title}</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12}>
          <UtilityBar
            dateFilter="month"
            datePickerConstraint={DatePickerConstraints}
            onUnitChange={setUnit}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
          />
        </Col>
      </Row>
      <Errors errors={errors} />
      {
        loading
          ? <FullScreenBeatLoader color={ColoursEnum.purple} />
          : <VolunteerTabs {...tabProps} />
      }
      {extraButtonsVisible &&
        <div
          style={{
          position: 'fixed', 
          bottom: 40, 
          right: 80
        }}
        >
          <SecondaryButton
            onClick={()=>setInviteModalVisible(!inviteModalVisible)} 
          >
            Invite
          </SecondaryButton>
	        <SecondaryButton
            onClick={()=>setDownloadModalVisible(!downloadModalVisible)} 
          >
            Volunteer Template
          </SecondaryButton>
        	<SecondaryButton
            onClick={()=>setUploadModalVisible(!uploadModalVisible)} 
          >
            Upload
          </SecondaryButton>
        </div>
      }
      <PrimaryButton 
        onClick={()=>setExtraButtonsVisible(!extraButtonsVisible)} 
        style={{
          position: 'fixed', 
          bottom: 20, 
          right: 30
        }}
      >
        +
      </PrimaryButton>
    </Container>
  );
};

export default withRouter(ByVolunteer);

