import moment from 'moment';
import { useEffect, useState } from 'react';
import { innerJoin, collectBy } from 'twine-util/arrays';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import { findMostActive } from './util';
import Months from '../../../lib/util/months';


export type EqualDataPoints = {
  labels: string[]
  value: number
};

export default () => {
  const oneYearAgo = moment().subtract(1, 'year').toDate();
  const now = moment().toDate();
  const startOfThisMonth = moment().subtract(2, 'months').startOf('month');
  const endOfThisMonth = moment().subtract(2, 'months').endOf('month');

  const [timeStats, setTimeStats] = useState<EqualDataPoints>({ labels: [], value: 0 });
  const [volunteerStats, setVolunteerStats] = useState<EqualDataPoints>({ labels: [], value: 0 });
  const [activityStats, setActivityStats] = useState<EqualDataPoints>({ labels: [], value: 0 });

  const {
    loading,
    results: [logsData, volunteersData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: oneYearAgo, until: now },
        transformResponse: [(res: any) => res.result],
      },
      {
        ...CommunityBusinesses.configs.getVolunteers,
        transformResponse: [
          (res: any) => res.result,
          (res: any) => Array.isArray(res) ? res.map(({ id, name }: any) => ({ id, name })) : res,
        ],
      },
    ],
  });

  useEffect(() => {
    if (loading || error) {
      return;
    }

    // NOTE: Should use `VolunteerLog` types instead of `any`
    const logs: any[] = logsData.data;
    const volunteers: any[] = volunteersData.data;

    const fullLogs = innerJoin(
      logs,
      volunteers,
      (log, volunteer) => log.userId === volunteer.id
    );
    const monthLogs = fullLogs.filter((log) =>
      moment(log.startedAt).isBetween(startOfThisMonth, endOfThisMonth));

    // most active months (12 months)
    setTimeStats(
      findMostActive(
        collectBy((log) => moment(log.startedAt).format(Months.format.abreviated), fullLogs)
      )
    );

    // most active activities (current month)
    setActivityStats(
      findMostActive(
        collectBy((log) => log.activity, monthLogs)
      )
    );

    // most active volunteers (current month)
    setVolunteerStats(
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
      error,
      data: {
        timeStats,
        activityStats,
        volunteerStats,
      },
    };

  }
};

/*
 * - Dates in hook or as arguments to hook?
 * - No data case handled by DataCard or by other logic?
 *   -- DataCard to be consistent with DataTable?
 */
export const activityStatsToProps = (pts?: EqualDataPoints) => {
  const currentMonth = moment().format(Months.format.abreviated);

  if (! pts) {
    return {
      topText: ['During ', currentMonth],
      left: {
        label: 'No data available',
        data: [],
      },
      right: {
        label: 'hours',
        data: 0,
      },
    };
  }

  const leftLabel = pts.labels.length > 1
    ? 'Most popular activities were'
    : pts.labels.length === 1
      ? 'Most popular activity was'
      : 'No data available';
  const rightLabel = `hours${pts.labels.length > 1 ? ' each' : ''}`;

  return {
    topText: ['During ', currentMonth],
    left: {
      label: leftLabel,
      data: pts.labels,
    },
    right: {
      label: rightLabel,
      data: pts.value,
    },
  };
};


export const volunteerStatsToProps = (pts?: EqualDataPoints) => {
  const currentMonth = moment().format(Months.format.abreviated);

  if (! pts) {
    return {
      topText: ['During ', currentMonth],
      left: {
        label: 'No data available',
        data: [],
      },
      right: {
        label: 'hours',
        data: [],
      },
    };
  }

  const leftLabel = pts.labels.length > 1
    ? 'Top volunteers'
    : pts.labels.length === 1
      ? 'Top volunteer'
      : 'No data available';
  const rightLabel = `${pts.value} hours${pts.labels.length > 1 ? ' each' : ''}`;

  return {
    topText: ['During ', currentMonth],
    left: {
      label: leftLabel,
      data: [],
    },
    right: {
      label: rightLabel,
      data: pts.labels,
    },
  };
};


export const timeStatsToProps = (pts?: EqualDataPoints) => {
  if (! pts) {
    return {
      topText: ['Over the past ', '12 months'],
      left: {
        label: 'No data available',
        data: [],
      },
      right: {
        label: 'hours',
        data: 0,
      },
    };
  }

  const leftLabel = pts.labels.length >= 1
    ? 'Most volunteer days were in'
    : 'No data available';
  const rightLabel = `hours${pts.labels.length > 1 ? ' each' : ''}`;

  return {
    topText: ['Over the past ', '12 months'],
    left: {
      label: leftLabel,
      data: pts.labels,
    },
    right: {
      label: rightLabel,
      data: pts.value,
    },
  };
};
