import moment from 'moment';
import { useEffect, useState } from 'react';
import { innerJoin, collectBy } from 'twine-util/arrays';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import { findMostActive } from './util';
import Months from '../../../lib/util/months';


export type LabelledHours = {
  label: string
  hours: number
};


export default () => {
  const oneYearAgo = moment().subtract(1, 'year').toDate();
  const now = moment().toDate();
  const startOfThisMonth = moment().subtract(2, 'months').startOf('month');
  const endOfThisMonth = moment().subtract(2, 'months').endOf('month');

  const [mostActiveMonths, setMostActiveMonths] = useState<LabelledHours[]>([]);
  const [mostActiveVolunteers, setMostActiveVolunteers] = useState<LabelledHours[]>([]);
  const [mostActiveActivities, setMostActiveActivities] = useState<LabelledHours[]>([]);

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
        transformResponse: [(res: any) => res.result.map(({ id, name }: any) => ({ id, name }))],
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

/*
 * - Dates in hook or as arguments to hook?
 * - No data case handled by DataCard or by other logic?
 *   -- DataCard to be consistent with DataTable?
 */
export const mostActiveActivitiesToProps = (acts?: LabelledHours[]) => {
  const currentMonth = moment().format(Months.format.abreviated);

  if (! acts) {
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

  const leftLabel = acts.length > 1
    ? 'Most popular activities were'
    : acts.length === 1
      ? 'Most popular activity was'
      : 'No data available';
  const rightLabel = `hours${acts.length > 1 ? ' each' : ''}`;

  return {
    topText: ['During', currentMonth],
    left: {
      label: leftLabel,
      data: acts.map((x) => x.label),
    },
    right: {
      label: rightLabel,
      data: acts.map((x) => x.hours)[0],
    },
  };
};


export const mostActiveVolunteersToProps = (acts?: LabelledHours[]) => {
  const currentMonth = moment().format(Months.format.abreviated);

  if (! acts) {
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

  const leftLabel = acts.length > 1
    ? 'Top volunteers'
    : acts.length === 1
      ? 'Top volunteer'
      : 'No data available';
  const rightLabel = `hours${acts.length > 1 ? ' each' : ''}`;

  return {
    topText: ['During', currentMonth],
    left: {
      label: leftLabel,
      data: [],
    },
    right: {
      label: rightLabel,
      data: acts.map((x) => x.label),
    },
  };
};


export const mostActiveMonthsToProps = (acts?: LabelledHours[]) => {
  if (! acts) {
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

  const leftLabel = acts.length >= 1
    ? 'Most volunteer days were in'
    : 'No data available';
  const rightLabel = `hours${acts.length > 1 ? ' each' : ''}`;

  return {
    topText: ['Over the past', '12 months'],
    left: {
      label: leftLabel,
      data: acts.map((x) => x.label),
    },
    right: {
      label: rightLabel,
      data: acts.map((x) => x.hours)[0],
    },
  };
};
