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

const getProjectRows = (logs: [any]) => {
  let projects: any = {};
  let projectNames = logs.map(log=>log.project)

 


  //remove duplicate names
  projectNames = projectNames.filter((item, index) => projectNames.indexOf(item) == index)

  projectNames.map(projectName=>projects[projectName] = {Hours: 0, Volunteers: 1});

  logs.map((log)=>{
    projects[log.project].Hours += log.duration.hours
  })

  //count how many volunteers are on each project
  for(let project in projects){
    let volunteerNames: string[] = [];
    logs.forEach(log => {
        if(log.project == project)
          volunteerNames.push(log.createdBy);
      })
    volunteerNames = volunteerNames.filter((item, index) => volunteerNames.indexOf(item) == index)
    projects[project].Volunteers = volunteerNames.length;
  }

  let projectRows: any = [];

  for (let project in projects) {
    projectRows.push({
      Name: project,
      Hours: projects[project].Hours,
      Volunteers: projects[project].Volunteers
    })
  }

  return projectRows;
}

export default ({ from, to, updateOn = [] }: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [aggregatedDataProjects, setAggregatedDataProjects] = useState<AggregatedData>();
  const [logFields, setLogFields] = useState<IdAndName[]>();
  const [projectFields, setProjectFields] = useState<IdAndName[]>([
    {id:1, name: "Name"},
    {id:2, name: "Hours"},
    {id:3, name: "Volunteers"}
    ]);

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

   const logFieldsData =  [
                            {id:1, name: "Hours"},
                            {id:2, name: "Project"},
                            {id:3, name: "Activity"},
                            {id:4, name: "Date"},
                            {id:5, name: "EndTime"},
                            {id:6, name: "ID"}
                            ];


  useEffect(() => {
    if (loading || error) {
      return;
    }

    const logs = logsData.data;
    logs[0].createdBy = "different"
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

    const dataProjects = {
      groupByX: "Name",
      groupByY: "ProjectField",
      rows: getProjectRows(logs),
    };

    setLogFields(logFieldsData);
    setAggregatedData(data);
    setAggregatedDataProjects(dataProjects);
  }, [logsData, volunteersData, logFieldsData, loading, error]);


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
      projectFields,
      dataProjects: aggregatedDataProjects, 
    };
  }
};