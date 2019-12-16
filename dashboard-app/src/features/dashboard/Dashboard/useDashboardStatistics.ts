import moment from 'moment';
import { useEffect, useState } from 'react';
import { innerJoin, collectBy } from 'twine-util/arrays';
import { useBatchRequest } from '../../../lib/hooks';
import { CommunityBusinesses } from '../../../lib/api';
import { findMostActive } from './util';
import { NumberTileProps, TextTileProps } from '../components/DataCard/types';
import Months from '../../../lib/util/months';


export type EqualDataPoints = {
  labels: string[];
  value: number;
};


export default () => {
  const threeMonthsAgo = moment().subtract(3, 'months').toDate();
  const now = moment().toDate();

  const [timeStats, setTimeStats] = useState<EqualDataPoints>({ labels: [], value: 0 });
  const [volunteerStats, setVolunteerStats] = useState<EqualDataPoints>({ labels: [], value: 0 });
  const [activityStats, setActivityStats] = useState<EqualDataPoints>({ labels: [], value: 0 });
  const [projectStats, setProjectStats] = useState<EqualDataPoints>({ labels: [], value: 0 });

  const {
    loading,
    results: [logsData, volunteersData],
    error,
  } = useBatchRequest({
    requests: [
      {
        ...CommunityBusinesses.configs.getLogs,
        params: { since: threeMonthsAgo, until: now },
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

    // most active months (3 months)
    setTimeStats(
      findMostActive(
        collectBy((log) => moment(log.startedAt).format(Months.format.abbreviated), fullLogs)
      )
    );

    // most active activities (3 months)
    setActivityStats(
      findMostActive(
        collectBy((log) => log.activity, fullLogs)
      )
    );

    // most active projects (3 months)
    setProjectStats(
      findMostActive(
        collectBy((log) => log.project || 'General', fullLogs)
      )
    );

    // most active volunteers (3 months)
    setVolunteerStats(
      findMostActive(
        collectBy((log) => log.name, fullLogs)
      )
    );
  }, [error, loading, logsData, volunteersData]);


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
        projectStats,
      },
    };

  }
};

const getCurrentMonth = () =>
  [
    moment().subtract(3, 'months'),
    moment(),
  ]
    .map((d) => d.format('DD MMM YYYY'))
    .join(' - ');

export const activityStatsToProps = (pts?: EqualDataPoints): NumberTileProps => {
  if (!pts || pts.value === 0) {
    return {
      topText: ['Between ', getCurrentMonth()],
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
    topText: ['Between ', getCurrentMonth()],
    left: {
      label: leftLabel,
      data: pts.labels,
      limit: 2,
      truncationString: '...',
    },
    right: {
      label: rightLabel,
      data: pts.value,
    },
  };
};


export const volunteerStatsToProps = (pts?: EqualDataPoints): TextTileProps => {
  if (!pts || pts.value === 0) {
    return {
      topText: ['Between ', getCurrentMonth()],
      left: {
        label: 'No data available',
        data: [],
      },
      right: {
        label: '0 hours',
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
    topText: ['Between ', getCurrentMonth()],
    left: {
      label: leftLabel,
      data: [],
    },
    right: {
      label: rightLabel,
      data: pts.labels,
      limit: 3,
      truncationString: '...',
    },
  };
};


export const timeStatsToProps = (pts?: EqualDataPoints): NumberTileProps => {
  if (!pts || pts.value === 0) {
    return {
      topText: ['Between ', getCurrentMonth()],
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
    topText: ['Between ', getCurrentMonth()],
    left: {
      label: leftLabel,
      data: pts.labels,
      limit: 3,
      truncationString: '...',
    },
    right: {
      label: rightLabel,
      data: pts.value,
    },
  };
};

export const projectStatsToProps = (pts?: EqualDataPoints): NumberTileProps => {
  if (!pts || pts.value === 0) {
    return {
      topText: ['Between ', getCurrentMonth()],
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
    ? 'Most popular projects were'
    : pts.labels.length === 1
      ? 'Most popular project was'
      : 'No data available';

  const rightLabel = `hours${pts.labels.length > 1 ? ' each' : ''}`;

  return {
    topText: ['Between ', getCurrentMonth()],
    left: {
      label: leftLabel,
      data: pts.labels,
      limit: 2,
      truncationString: '...',
    },
    right: {
      label: rightLabel,
      data: pts.value,
    },
  };
};
