import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import _DataTable from '../components/DataTable';
import UtilityBar from '../components/UtilityBar';
import { H1 } from '../../../lib/ui/components/Headings';
import { DataTableProps } from '../components/DataTable/types';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { aggregatedToTableData } from '../dataManipulation/aggregatedToTableData';
import { downloadCsv } from '../dataManipulation/downloadCsv';
import { ColoursEnum } from '../../../lib/ui/design_system';
import DownloadModal from '../../../lib/ui/components/DownloadModal';
import UploadModal from '../../../lib/ui/components/UploadModal';
import { PrimaryButton, SecondaryButton} from '../../../lib/ui/components/Buttons';
import Errors from '../components/Errors';
import useAggregateDataByActivity from './useAggregateDataByActivity';
import { TabGroup } from '../components/Tabs';
import { getTitleForDayPicker } from '../util';
import { useErrors } from '../../../lib/hooks/useErrors';
import { TitlesCopy } from '../copy/titles';
import { useOrderable } from '../hooks/useOrderable';
import { DashboardContext } from '../context';


/**
 * Types
 */
type TableData = Pick<DataTableProps, 'headers' | 'rows'>;


/**
 * Styles
 */
const DataTable = styled(_DataTable)`
  margin-top: 4rem;
`;

const Container = styled(Grid)`
`;


/**
 * Helpers
 */
const initTableData = { headers: [], rows: [] };


/**
 * Component
 */
const ByActivity: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [downloadModalVisible, setDownloadModalVisible] = useState(false);
  const [extraButtonsVisible, setExtraButtonsVisible] = useState(false);
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const { loading, error, data, activities } =
    useAggregateDataByActivity({ from: fromDate, to: toDate });

  // set and clear errors on response
  const [errors, setErrors] = useErrors(error, data);

  // get sorting state values
  const { orderable, onChangeOrderable } = useOrderable({
    initialOrderable: { sortByIndex: 1, order: 'desc' },
    updateOn: [tableData]
  });

  const onChangeSortBy = useCallback((column: string) => {
    const idx = tableData.headers.indexOf(column);
    onChangeOrderable(idx);
  }, [tableData.headers, onChangeOrderable]);

  // manipulate data for table
  useEffect(() => {
    if (!loading && data && activities) {
      setTableData(aggregatedToTableData({ data, unit, yData: activities }));
    }
  }, [activities, data, loading, unit]);

  const downloadAsCsv = useCallback(() => {
    if (!loading && data) {
      downloadCsv({ data, fromDate, toDate, fileName: 'activity', unit, orderable })
        .catch((error) => setErrors({ Download: error.message }));
    } else {
      setErrors({ Download: 'No data available to download' });
    }
  }, [loading, data, fromDate, toDate, unit, orderable, setErrors]);

  return (
    <Container>
      <UploadModal
        visible={uploadModalVisible}
        closeFunction={()=>setUploadModalVisible(false)}
        filetype={"activity"}
      />
      <DownloadModal
        visible={downloadModalVisible}
        closeFunction={()=>setDownloadModalVisible(false)}
        filename={"activitytemplate.csv"}
      />
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Activities.title}</H1>
        </Col>
      </Row>
      <Row center="xs">
        <Col xs={12}>
          <UtilityBar
            dateFilter="day"
            datePickerConstraint={DatePickerConstraints}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
          />
        </Col>
      </Row>
      {
        loading
          ? (<FullScreenBeatLoader color={ColoursEnum.purple} />)
          : (
            <Row center="xs">
              <Col xs={12}>
                <Errors errors={errors} />
                <TabGroup titles={['Table']}>
                  {
                    tableData && (
                      <DataTable
                        {...tableData}
                        title={getTitleForDayPicker(TitlesCopy.Activities.subtitle, fromDate, toDate)}
                        sortBy={tableData.headers[orderable.sortByIndex]}
                        order={orderable.order}
                        onChangeSortBy={onChangeSortBy}
                        showTotals
                      />
                    )
                  }
                </TabGroup>
              </Col>
            </Row>
          )
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
            Activity Template
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

export default withRouter(ByActivity);
