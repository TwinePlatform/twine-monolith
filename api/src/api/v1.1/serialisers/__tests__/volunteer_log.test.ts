import * as Logs from '../volunteer_log';

describe('Serialisers :: Volunteer Log', () => {
  test('defaultProjects', () => {
    expect(Logs.defaultProjects({ project: null })).toEqual({ project: 'General' });
  });
});
