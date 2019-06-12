import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../hooks';
import { CommunityBusinesses } from '../../api';
import {
  logsToAggregatedData,
  AggregatedData,
  IdAndName
} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';
import Months from '../../util/months';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [volunteers, setVolunteers] = useState<IdAndName[]>();
  const months = [...Months.range(from, to, Months.format.verbose)]
  .map((month, i) => ({
    id: i,
    name: month,
  }));

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
        transformResponse: [(res: any) => res.result.map(({ id, name }: IdAndName) =>
          ({ id, name }))],
      },
    ],
    updateOn: [...updateOn, from, to],
  });


  useEffect(() => {
    if (loading || error) {
      return;
    }

    const logs = logsData.data;

    const data = logsToAggregatedData({
      logs,
      tableType: tableType.MonthByName,
      xData: volunteersData.data,
      yData: months,
    });

    setVolunteers(volunteersData.data);
    setAggregatedData(data);
  }, [logsData, volunteersData]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error, months, volunteers };

  }
};
