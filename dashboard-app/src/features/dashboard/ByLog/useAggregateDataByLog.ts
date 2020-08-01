import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {
  logsToAggregatedData,
  AggregatedData,
  IdAndName,
} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [logFields, setLogFields] = useState<IdAndName[]>();

  const {
    loading,
    results: [logsData, volunteersData, logFieldsData],
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
      {
        ...CommunityBusinesses.configs.getLogFields,
        transformResponse: [(res: any) => res.result.map((a: any) => ({ id: a.id, name: a.name }))],
      },
    ],
    updateOn: [...updateOn, from, to],
  });

  console.log("log Fields Data");
  console.log(logFieldsData);


  useEffect(() => {
    if (loading || error) {
      return;
    }

    const logs = logsData.data;
    const volunteers = volunteersData.data as IdAndName[];

    const data = logsToAggregatedData({
      logs,
      tableType: tableType.ActivityByName,
      xData: volunteers,
      yData: logFieldsData.data,
    });

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