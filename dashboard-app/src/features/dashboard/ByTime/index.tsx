import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
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
import DownloadModal from '../../../lib/ui/components/DownloadModal';
import UploadModal from '../../../lib/ui/components/UploadModal';
import { PrimaryButton, SecondaryButton} from '../../../lib/ui/components/Buttons';
import TimeTabs from './TimeTabs';
import Errors from '../components/Errors';
import useAggregateDataByTime from './useAggregateDataByTime';
import { getTitleForMonthPicker } from '../util';
import { LegendData } from '../components/StackedBarChart/types';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';
import { DashboardContext } from '../context';


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
const ByTime: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [legendData, setLegendData] = useState<LegendData>([]);
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [extraButtonsVisible, setExtraButtonsVisible] = useState(false);
  const { data, loading, error, months } =
    useAggregateDataByTime({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && months) {
      setTableData(aggregatedToTableData({ data, unit, yData: months }));
    }
  }, [data, unit, loading, months]);

  // get sorting state values
  const { orderable, onChangeOrderable } = useOrderable({
    initialOrderable: { sortByIndex: 0, order: 'asc' },
    updateOn: [tableData]
  });

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    onChangeOrderable(idx);
  }, [tableData.headers, onChangeOrderable]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'time', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [data, fromDate, toDate, orderable, loading, unit, setErrors]);

  const tabProps = {
    data,
    tableData,
    onChangeSortBy,
    title: getTitleForMonthPicker(TitlesCopy.Time.subtitle, fromDate, toDate),
    legendData,
    setLegendData,
    orderable,
  };

  return (
    <Container>
      <UploadModal
        visible={uploadModalVisible}
        closeFunction={()=>setUploadModalVisible(false)}
        destination={"time"}
      />
      <DownloadModal
        visible={downloadModalVisible}
        closeFunction={()=>setDownloadModalVisible(false)}
        filename={"timetemplate.csv"}
      />
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Time.title}</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12}>
          <UtilityBar
            dateFilter="month"
            datePickerConstraint={DatePickerConstraints}
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
          : <TimeTabs {...tabProps} />
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
            onClick={()=>{setDownloadModalVisible(!downloadModalVisible)
              setUploadModalVisible(false)}} 
          >
            Time Template
          </SecondaryButton>
        	<SecondaryButton
            onClick={()=>{setUploadModalVisible(!uploadModalVisible)
              setDownloadModalVisible(false)}} 
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

export default withRouter(ByTime);

