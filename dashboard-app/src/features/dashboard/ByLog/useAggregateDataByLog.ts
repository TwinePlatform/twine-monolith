import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {
  logsToAggregatedDataNoX,
  IdAndName,
} from '../dataManipulation/logsToAggregatedDataNoX';
import {logsToAggregatedData} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

interface AggregatedData {
  groupByX: string;
  groupByY: string;
  rows: any;
}

const getRows = (logs: [any]) => {
  return logs.map(log => {return {
                          Name: log.createdBy,
                          Hours: log.duration.hours,
                          Project: log.project,
                          Activity: log.activity,
                          Date: log.createdAt.slice(0,10),
                          EndTime: log.createdAt.slice(11,16),
                          ID: log.id,
                        }})
};

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [logFields, setLogFields] = useState<IdAndName[]>();

  const {
    loading,
    results: [logsData, volunteersData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: from, until: to },
        transformResponse: [(res: any) => res.result],
      },
      {
        ...CommunityBusinesses.configs.getVolunteers,
        transformResponse: [(res: any) => res.result.map((a: any) => ({ id: a.id, name: a.name }))],
      },
    /*  {
        ...CommunityBusinesses.configs.getLogFields,
        transformResponse: [(res: any) => res.result.map((a: any) => ({ id: a.id, name: a.name }))],
      },*/
    ],
    updateOn: [...updateOn, from, to],
  });

   const logFieldsData = {data: [
                            {id:1, name: "Hours"},
                            {id:2, name: "Project"},
                            {id:3, name: "Activity"},
                            {id:4, name: "Date"},
                            {id:5, name: "EndTime"},
                            {id:6, name: "ID"},
                            //{id:6, name: "View Log"}
                            ]
                        };


  useEffect(() => {
    if (loading || error) {
      return;
    }

    const logs = logsData.data;
    const volunteers = volunteersData.data as IdAndName[];

    
    /*
    const data = logsToAggregatedData({
      logs,
      tableType: tableType.LogByName,
      xData: volunteers,
      yData: logFieldsData.data,
    });
    */

    const data = {
      groupByX: "Name",
      groupByY: "LogField",
      rows: getRows(logs),
    };

    setLogFields(logFieldsData.data);
    setAggregatedData(data);
  }, [logsData, volunteersData, logFieldsData, loading, error]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error, logFields };

  }
};