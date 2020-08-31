import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {IdAndName, logsToAggregatedData} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';
import { VolunteerLogs } from '../../../../../api/src/models';


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


const getRows = (volunteers: any[]) => {
  return volunteers.map(volunteer => {
    return {
      UserId: volunteer.id,
      Name: volunteer.name,
      Phone: volunteer.phone,
      Email: volunteer.email,
    };
  })
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
        transformResponse: [(res: any) => res.result],
      },
    /*  {
        ...CommunityBusinesses.configs.getLogFields,
        transformResponse: [(res: any) => res.result.map((a: any) => ({ id: a.id, name: a.name }))],
      },*/
    ],
    updateOn: [...updateOn, from, to],
  });

   const userFieldsData =  [
                            {id:1, name: "UserId"},
                            {id:2, name: "Phone"},
                            {id:3, name: "Email"},
                            ];


  useEffect(() => {
    if (loading || error) {
      return;
    }

    //logs[0].createdBy = "different"
    const volunteers = volunteersData.data;

    console.log(volunteers);

    const data = {
      groupByX: "Name",
      groupByY: "LogField",
      rows: getRows(volunteers),
    };

    setLogFields(userFieldsData);
    setAggregatedData(data);
  }, [logsData, volunteersData, userFieldsData, loading, error]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return { 
      loading, 
      data: aggregatedData, 
      error, 
      logFields, 
    };
  }
};