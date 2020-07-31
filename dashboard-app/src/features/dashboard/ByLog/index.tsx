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
import ProjectModal from '../../../lib/ui/components/ProjectModal';
import VolunteerModal from '../../../lib/ui/components/VolunteerModal';
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
const ByLog: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [volunteerModalVisible, setVolunteerModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
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
      <VolunteerModal
        visible={volunteerModalVisible}
        closeFunction={()=>setVolunteerModalVisible(false)}
      />
      <ProjectModal
        visible={projectModalVisible}
        closeFunction={()=>setProjectModalVisible(false)}
      />
      <Row center="xs">
        <Col>
          <H1>{TitlesCopy.Logs.title}</H1>
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
                <TabGroup 
                    titles={['Volunteers','Projects']}
                >
                  {
                    tableData && (
                    <div>
                        <DataTable
                        {...tableData}
                        title={getTitleForDayPicker("Volunteer Logs", fromDate, toDate)}
                        sortBy={tableData.headers[orderable.sortByIndex]}
                        order={orderable.order}
                        onChangeSortBy={onChangeSortBy}
                        showTotals
                      />
                        <PrimaryButton 
                            onClick={()=>{setVolunteerModalVisible(!volunteerModalVisible)
                                setProjectModalVisible(false)}} 
                            style={{
                            position: 'fixed', 
                            bottom: 20, 
                            right: 30
                            }}
                        >
                            + Create
                        </PrimaryButton>
                    </div>
                    )
                  }
                  {
                    tableData && (
                    <div>
                        <DataTable
                        {...tableData}
                        title={getTitleForDayPicker("Projects", fromDate, toDate)}
                        sortBy={tableData.headers[orderable.sortByIndex]}
                        order={orderable.order}
                        onChangeSortBy={onChangeSortBy}
                        showTotals
                      />
                        <PrimaryButton 
                            onClick={()=>{setProjectModalVisible(!projectModalVisible)
                                setVolunteerModalVisible(false)}} 
                            style={{
                            position: 'fixed', 
                            bottom: 20, 
                            right: 30
                            }}
                        >
                            + Create
                        </PrimaryButton>
                    </div>
                    )
                  }
                </TabGroup>
              </Col>
            </Row>
          )
      }
    </Container>
  );
};

export default withRouter(ByLog);
