import moment from 'moment';
import { useEffect, useState } from 'react';
import { Dictionary, toPairs, compose } from 'ramda';
import { Duration, Objects } from 'twine-util';
import { innerJoin, collectBy } from 'twine-util/arrays';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import Months from '../../../lib/util/months';


type MostActive = {
  label: string
  hours: number
};


const logsToDurations = compose(
  Duration.accumulate,
  (logs: any[]) => logs.map((log) => log.duration)
);

const sumLogDurations = (a: Dictionary<any[]>) =>
  Objects.mapValues(logsToDurations, a);

const sortByDuration = (xs: [string, Duration.Duration][]) =>
  xs.sort(([monthLeft, durationLeft], [monthRight, durationRight]) =>
    Duration.toSeconds(durationRight) - Duration.toSeconds(durationLeft));

const maxByDuration = (xs: [string, Duration.Duration][]) =>
  xs.reduce((acc, [month, duration]) => {
    if (!acc[0]) {
      return [[month, duration] as [string, Duration.Duration]];
    } else if (Duration.greaterThan(duration, acc[0][1])) {
      return [[month, duration] as [string, Duration.Duration]];
    } else if (Duration.equals(duration, acc[0][1])) {
      return acc.concat([month, duration]);
    } else {
      return acc;
    }
  }, [] as [string, Duration.Duration][]);

const findMostActive = compose(
  (ds) => ds
    .slice(0, 3)
    .map(([label, duration]) => ({ label, hours: Math.round(Duration.toHours(duration)) })),
  maxByDuration,
  sortByDuration,
  toPairs,
  sumLogDurations
);

export default () => {
  const [fromYear, toYear] = [moment().subtract(12, 'months'), moment()].map((d) => d.toDate());
  const [fromMonth, toMonth] = [moment().subtract(2, 'months').startOf('month'), moment().subtract(2, 'months').endOf('month')];

  const [mostActiveMonths, setMostActiveMonths] = useState<MostActive[]>([]);
  const [mostActiveVolunteers, setMostActiveVolunteers] = useState<MostActive[]>([]);
  const [mostActiveActivities, setMostActiveActivities] = useState<MostActive[]>([]);

  const {
    loading,
    results: [logsData, volunteersData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: fromYear, until: toYear },
        transformResponse: [(res: any) => res.result],
      },
      {
        ...CommunityBusinesses.configs.getVolunteers,
        transformResponse: [(res: any) => res.result.map(({ id, name }: any) => ({ id, name }))],
      },
    ],
  });

  useEffect(() => {
    if (loading || error) {
      return;
    }

    const logs = logsData.data;
    const volunteers = volunteersData.data;

    const fullLogs = innerJoin(
      logs,
      volunteers,
      (log: any, volunteer: any) => log.userId === volunteer.id
    );
    const monthLogs = fullLogs.filter((log) => moment(log.startedAt).isBetween(fromMonth, toMonth));

    // most active months (12 months)
    setMostActiveMonths(
      findMostActive(
        collectBy((log) => moment(log.startedAt).format(Months.format.abreviated), fullLogs)
      )
    );

    // most ctive activities (current month)
    setMostActiveActivities(
      findMostActive(
        collectBy((log) => log.activity, monthLogs)
      )
    );

    // most active volunteers (current month)
    setMostActiveVolunteers(
      findMostActive(
        collectBy((log) => log.name, monthLogs)
      )
    );
  }, [logsData, volunteersData]);


  if (loading) {

    return { loading };

  } else if (error) {

    return { loading, error };

  } else {

    return {
      loading,
      data: {
        mostActiveMonths,
        mostActiveActivities,
        mostActiveVolunteers,
      },
      error,
    };

  }
};
