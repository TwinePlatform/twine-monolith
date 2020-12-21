import { DependencyList, useEffect, useState } from 'react';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import {
  IdAndName,
} from '../dataManipulation/logsToAggregatedDataNoX';
import Fuse from 'fuse.js';



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

const filterLogs = (logs: any[], categories: any[], filters: any[]) => {
  if(categories.length < 1 || filters.length < 1)
    return logs;

  let filteredLogs: any = [];
  let alreadyAddedLogs: any = [];

  const options = {
    keys: categories
  };
  
  const fuse = new Fuse(logs, options);
  
  filters.forEach((filter,index)=>{
    const searchResults = fuse.search(filter);

    if(index === 0){
      searchResults.forEach(result=>{
        filteredLogs.push(result.item);
        alreadyAddedLogs.push(result.refIndex);
      })
    }
    else{
      filteredLogs = [];
      searchResults.forEach(result=>{
        if(alreadyAddedLogs.indexOf(result.refIndex) >= 0)
          filteredLogs.push(result.item);
        return;
      })
    }
  })
  
  return filteredLogs;
};

const getRows = (logs: [any], volunteers: IdAndName[]) => {
  return logs.map(log => {
                    let volunteerName; 
                    volunteers.forEach(x=>{
                      if(x.id === log.userId)
                        volunteerName = x.name;
                    })
                    return {
                          Name: volunteerName,
                          Hours: log.duration.hours?log.duration.hours:0,
                          Minutes: log.duration.minutes?log.duration.minutes:0,
                          Project: log.project,
                          Activity: log.activity,
                          Date: log.startedAt.slice(0,10),
                          ID: log.id,
                        }})
};

const getProjectRows = (logs: [any]) => {
  let projects: any = {};
  let projectNames = logs.map(log=>log.project)

  //remove duplicate names
  projectNames = projectNames.filter((item, index) => projectNames.indexOf(item) === index)

  projectNames.map(projectName=>projects[projectName] = {Hours: 0, Volunteers: 1});

  logs.map((log)=>{
    return projects[log.project].Hours += log.duration.hours;
  })

  //count how many volunteers are on each project
  for(let project in projects){
    let volunteerNames: string[] = [];
    logs.forEach(log => {
        if(log.project === project)
          volunteerNames.push(log.userId);
        return;
      });
    volunteerNames = volunteerNames.filter((item, index) => volunteerNames.indexOf(item) === index)
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
  const projectFields = [{id:1, name: "Hours"},{id:2, name: "Volunteers"}];

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
                            {id:2, name: "Minutes"},
                            {id:2, name: "Project"},
                            {id:3, name: "Activity"},
                            {id:4, name: "Date"},
                           // {id:5, name: "StartTime"},
                            {id:5, name: "ID"}
                            ];


  useEffect(() => {
    if (loading || error) {
      return;
    }

    const volunteers = volunteersData.data as IdAndName[];

    const logs = filterLogs(getRows(logsData.data, volunteers),categories,filters);
 
    const data = {
      groupByX: "Name",
      groupByY: "LogField",
      rows: logs,
    };

    const dataProjects = {
      groupByX: "Name",
      groupByY: "ProjectField",
      rows: getProjectRows(logsData.data),
    };

    setLogFields(logFieldsData);
    setAggregatedData(data);
    setAggregatedDataProjects(dataProjects);
  }, [logsData, volunteersData, logFieldsData, loading, error, categories, filters]);


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