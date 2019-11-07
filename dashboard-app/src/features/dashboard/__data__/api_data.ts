export const logs = [
  {
    id: 1,
    startedAt: '2018-10-11T10:34:22.001',
    duration: { hours: 2 },
    activity: 'Cafe',
    project: null,
    userId: 1,
  },
  {
    id: 2,
    startedAt: '2019-02-11T10:34:22.001',
    duration: { hours: 1, minutes: 20 },
    activity: 'Running away',
    project: 'Project 1',
    userId: 1,
  },
  {
    id: 3,
    startedAt: '2018-11-11T10:34:22.001',
    duration: { hours: 0, minutes: 20 },
    activity: 'Cafe',
    project: null,
    userId: 2,
  },
  {
    id: 4,
    startedAt: '2018-12-11T10:34:22.001',
    duration: { hours: 3, minutes: 20 },
    activity: 'Cafe',
    project: 'Project 1',
    userId: 2,
  },
];

export const users = [
  { id: 1, name: 'Betty' },
  { id: 2, name: 'Wilma' },
];

export const activities = [
  { id: 1, name: 'Cafe' },
  { id: 2, name: 'Running away' },
];

export const projects = [
  { id: 1, name: 'General' },
  { id: 2, name: 'Project 1' },
];
