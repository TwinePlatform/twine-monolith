import { DependencyList, useEffect, useState } from 'react';
import { assoc } from 'ramda';
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
  independentVar: 'Projects' | 'Activities';
  updateOn?: DependencyList;
}

export default ({ from, to, updateOn = [], independentVar }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [yData, setYData] = useState<IdAndName[]>();

  const {
    loading,
    results: [logsData, projectsData, activitiesData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: from, until: to },
        transformResponse: [(res: any) => res.result.map((log: any) => assoc('project', log.project || 'General', log))],
      },
      {
        ...CommunityBusinesses.configs.getVolunteerProjects,
        transformResponse: [
          (res: any) => res.result
            .map(({ id, name }: IdAndName) => ({ id, name }))
            .concat({ id: -1, name: 'General' })
        ],
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

    const _yData = independentVar === 'Activities'
      ? projectsData.data
      : activitiesData.data

    const opts = independentVar === 'Activities'
      ? { tableType: tableType.ProjectByActivity, xData: activitiesData.data, yData: _yData }
      : { tableType: tableType.ActivityByProject, xData: projectsData.data, yData: _yData }

    const data = logsToAggregatedData({ logs: logsData.data, ...opts });

    setYData(_yData);
    setAggregatedData(data);
  }, [logsData, activitiesData, error, loading, projectsData, independentVar]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { loading, data: aggregatedData, error, yData };

  }
};
