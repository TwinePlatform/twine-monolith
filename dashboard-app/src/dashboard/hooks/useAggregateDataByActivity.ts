import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../hooks';
import { CommunityBusinesses } from '../../api';
import { logsToAggregatedData, AggregatedData } from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>({ rows: [], headers: [] });

  const {
    loading,
    results: [logsData, volunteersData, activitiesData],
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
        transformResponse: [(res: any) => res.result],
      },
      {
        ...CommunityBusinesses.configs.getVolunteerActivities,
        transformResponse: [(res: any) => res.result.map((a: any) => a.name)],
      },
    ],
    updateOn: [...updateOn, from, to],
  });


  useEffect(() => {
    if (loading || error) {
      return;
    }

    const logs = logsData.data;
    const activities = activitiesData.data;
    const volunteers = volunteersData.data;

    const data = logsToAggregatedData({
      logs,
      columnHeaders: ['Volunteer Name', ...activities],
      tableType: tableType.ActivityByName,
      volunteers,
    });

    setAggregatedData(data);
  }, [logsData, volunteersData, activitiesData]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error };

  }
};
