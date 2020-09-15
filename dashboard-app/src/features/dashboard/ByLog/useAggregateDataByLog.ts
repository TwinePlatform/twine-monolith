import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {
  logsToAggregatedDataNoX,
  IdAndName,
} from '../dataManipulation/logsToAggregatedDataNoX';
import {logsToAggregatedData} from '../dataManipulation/logsToAggregatedData';
import { tableType } from '../dataManipulation/tableType';
import { VolunteerLogs } from '../../../../../api/src/models';


interface UseAggregatedDataParams {
  from: Date;
  to: Date;
  updateOn?: DependencyList;
  categories: any;
  filters: any;
}

interface AggregatedData {
  groupByX: string;
  groupByY: string;
  rows: any;
}

const filterLogs = (logs: any[], categories: any[], filters: any, volunteers: IdAndName[]) => {
  if(categories.length < 1 && filters.length < 1)
    return logs;

  let filteredLogs: any = [];
  let alreadyAddedLogs: any = [];

  logs.map((log,index)=>{

    //get volunteer name
    let volunteerName; 
    volunteers.map((x) => {
      if(x.id === log.userId)
        volunteerName = x.name;
    })

    //if all of the filter terms appear in any of the categories, display the log
    
    if(categories.indexOf(log.activity) >= 0 || categories.indexOf(log.project) >= 0 || categories.indexOf(volunteerName) >= 0){
      filteredLogs.push(log);
      alreadyAddedLogs.push(index);
    }

    if(alreadyAddedLogs.indexOf(index) < 0 && (filters.indexOf(log.activity) >= 0 || filters.indexOf(log.project) >= 0 || filters.indexOf(volunteerName) >= 0) ){
      filteredLogs.push(log);
    }
  })

  return filteredLogs;
};

const getRows = (logs: [any], volunteers: IdAndName[]) => {
  return logs.map(log => {
                    let volunteerName; 
                    volunteers.map((x) => {
                      if(x.id === log.userId)
                        volunteerName = x.name;
                    })
                    return {
                          Name: volunteerName,
                          Hours: log.duration.hours,
                          Project: log.project,
                          Activity: log.activity,
                          Date: log.startedAt.slice(0,10),
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
          volunteerNames.push(log.userId);
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

export default ({ from, to, updateOn = [], categories, filters}: UseAggregatedDataParams) => {
  const [aggregatedData, setAggregatedData] = useState<AggregatedData>();
  const [aggregatedDataProjects, setAggregatedDataProjects] = useState<AggregatedData>();
  const [logFields, setLogFields] = useState<IdAndName[]>();
  const [projectFields, setProjectFields] = useState<IdAndName[]>([{id:1, name: "Hours"},{id:2, name: "Volunteers"}]);

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

    const volunteers = volunteersData.data as IdAndName[];

    const logs = filterLogs(logsData.data,categories,filters,volunteers);
 
    const data = {
      groupByX: "Name",
      groupByY: "LogField",
      rows: getRows(logs, volunteers),
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