import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../hooks';
import { CommunityBusinesses } from '../../api';
import { logsToAggregatedData, AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';
import Months from '../../util/months';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({ rows: [], headers: [] });

  const {
    loading,
    results: [logsData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: from, until: to },
        transformResponse: [(res: any) => res.result],
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
      columnHeaders: ['Activity', ...Months.range(from, to, Months.format.verbose)],
      tableType: tableType.MonthByActivity,
    });

    setAggregatedData(data);
  }, [logsData]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error };

  }
};
