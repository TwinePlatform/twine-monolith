import React, { useEffect, useState, useCallback, FunctionComponent, useContext } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import { Grid, Row, Col } from 'react-flexbox-grid';

import DatePickerConstraints from './datePickerConstraints';
import _LogsDataTable from '../components/DataTable/LogsDataTable';
import ProjectsDataTable from '../components/DataTable/ProjectsDataTable';
import LogsUtilityBar from '../components/LogsUtilityBar';
import { H1 } from '../../../lib/ui/components/Headings';
import { DataTableProps } from '../components/DataTable/types';
import { FullScreenBeatLoader } from '../../../lib/ui/components/Loaders';
import { aggregatedToTableData } from '../dataManipulation/aggregatedToTableDataLogs';
import { downloadCsv } from '../dataManipulation/downloadCsvLogs';
import { ColoursEnum } from '../../../lib/ui/design_system';
import ProjectModal from '../../../lib/ui/components/ProjectModal';
import LogViewModal from '../../../lib/ui/components/LogViewModal';
import LogCreateModal from '../../../lib/ui/components/LogCreateModal';
import LogEditModal from '../../../lib/ui/components/LogEditModal';
import DeleteModal from '../../../lib/ui/components/DeleteModal';
import { PrimaryButton} from '../../../lib/ui/components/Buttons';
import Errors from '../components/Errors';
import useAggregateDataByLog from './useAggregateDataByLog';
import { TabGroup } from '../components/Tabs';
import { getTitleForDayPicker } from '../util';
import { useErrors } from '../../../lib/hooks/useErrorsLogs';
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
const LogsDataTable = styled(_LogsDataTable)`
  margin-top: 4rem;
`;

const Container = styled(Grid)`
`;


/**
 * Helpers
 */
const initTableData = { headers: [], rows: [] };

const initSelectedLog = { 
              ID: 0,
              name: "none",
              project: "no project",
              activity: "no activity",
              date: "00-00-0000",
              startTime: "00:00",
              hours: 0,
              minutes: 0,
 };

/**
 * Component
 */
const ByLog: FunctionComponent<RouteComponentProps> = () => {
  const { unit } = useContext(DashboardContext);
  const [fromDate, setFromDate] = useState<Date>(DatePickerConstraints.from.default());
  const [toDate, setToDate] = useState<Date>(DatePickerConstraints.to.default());
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState([]);
  const [logViewModalVisible, setLogViewModalVisible] = useState(false);
  const [logCreateModalVisible, setLogCreateModalVisible] = useState(false);
  const [logEditModalVisible, setLogEditModalVisible] = useState(false);
  const [logDeleteModalVisible, setLogDeleteModalVisible] = useState(false);
  const [projectModalVisible, setProjectModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState(initSelectedLog);
  const [tableData, setTableData] = useState<TableData>(initTableData);
  const [tableDataProjects, setTableDataProjects] = useState<TableData>(initTableData);
  const [refresh, setRefresh] = useState([0]);

  const { loading, error, data, logFields, dataProjects, projectFields } =
    useAggregateDataByLog({ from: fromDate, to: toDate, updateOn: refresh, categories, filters  });

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
    if (!loading && data && dataProjects && logFields && projectFields) {
      setTableData(aggregatedToTableData({ data, unit, yData: logFields}));
      setTableDataProjects(aggregatedToTableData({ data: dataProjects, unit, yData: projectFields }));
    }
  }, [logFields, data, dataProjects, loading, unit]);

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
      <LogViewModal
        visible={logViewModalVisible}
        closeFunction={()=>setLogViewModalVisible(false)}
        log={selectedLog}
        onEdit={()=>{setLogViewModalVisible(false);setLogEditModalVisible(true);}}
        onDelete={()=>setLogDeleteModalVisible(true)}
      />
      <LogCreateModal
        visible={logCreateModalVisible}
        closeFunction={()=>setLogCreateModalVisible(false)}
      />
      <LogEditModal
        visible={logEditModalVisible}
        closeFunction={()=>{setLogEditModalVisible(false);setRefresh(refresh.concat([1]));}}
        logToEdit={selectedLog}
      />
      <DeleteModal
        visible={logDeleteModalVisible}
        closeFunction={()=>{setLogDeleteModalVisible(false);setRefresh(refresh.concat([1]));}}
        logToDelete={selectedLog}
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
          <LogsUtilityBar
            dateFilter="day"
            datePickerConstraint={DatePickerConstraints}
            onFromDateChange={setFromDate}
            onToDateChange={setToDate}
            onDownloadClick={downloadAsCsv}
            categories={categories}
            filters={filters}
            setCategories={setCategories}
            setFilters={setFilters}
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
                        <LogsDataTable
                        {...tableData}
                        title={getTitleForDayPicker("Volunteer Logs", fromDate, toDate)}
                        sortBy={tableData.headers[orderable.sortByIndex]}
                        order={orderable.order}
                        onChangeSortBy={onChangeSortBy}
                        showTotals
                        setSelectedLog={setSelectedLog}
                        setLogViewModalVisible={()=>{setLogViewModalVisible(true)
                            setProjectModalVisible(false)
                            setLogCreateModalVisible(false)}}
                      />
                        <PrimaryButton 
                            onClick={()=>{setLogCreateModalVisible(!logCreateModalVisible)
                                setProjectModalVisible(false)
                                setLogViewModalVisible(false)}} 
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
                    tableDataProjects && (
                    <div>
                        <ProjectsDataTable
                        {...tableDataProjects}
                        title={getTitleForDayPicker("Projects", fromDate, toDate)}
                        sortBy={tableDataProjects.headers[orderable.sortByIndex]}
                        order={orderable.order}
                        onChangeSortBy={onChangeSortBy}
                        showTotals
                      />
                        <PrimaryButton 
                            onClick={()=>{setProjectModalVisible(!projectModalVisible)
                                setLogCreateModalVisible(false)
                                setLogViewModalVisible(false)}} 
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
