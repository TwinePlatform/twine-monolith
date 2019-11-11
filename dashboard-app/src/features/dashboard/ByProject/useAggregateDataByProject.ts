import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {
  logsToAggregatedData,
  AggregatedData,
  IdAndName
} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();

  const {
    loading,
    results: [logsData, projectsData, activitiesData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: from, until: to },
        transformResponse: [(res: any) => res.result],
      },
      {
        ...CommunityBusinesses.configs.getVolunteerProjects,
        transformResponse: [(res: any) => res.result.map(({ id, name }: IdAndName) => ({ id, name }))],
      },
      {
        ...CommunityBusinesses.configs.getVolunteerActivities,
        transformResponse: [(res: any) => res.result.map(({ id, name }: IdAndName) => ({ id, name }))],
      },
    ],
    updateOn: [...updateOn, from, to],
  });

  useEffect(() => {
    if (loading || error) {
      return;
    }

    const data = logsToAggregatedData({
      logs: logsData.data,
      tableType: tableType.ActivityByProject,
      xData: projectsData.data,
      yData: activitiesData.data,
    });

    setAggregatedData(data);
  }, [logsData, activitiesData, error, loading, projectsData]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error, activities: activitiesData.data };

  }
};
