import { aggregatedToCsv } from '../aggregatedToCsv';

describe('aggregatedToCsv', () => {
  test('SUCCESS - returns string in csv format', async () => {
    const data = {
      headers: ['Activity', 'Total Hours', 'February 18', 'March 18', 'April 18'],
      rows: [
        {
          Activity: 'Digging Holes',
          'February 18': 0,
          'April 18': 0,
          'March 18': 0.03,
          'Total Hours': 0.03,
        },
        {
          Activity: 'Outdoor and practical work',
          'February 18': 0,
          'April 18': 2,
          'March 18': 2.38,
          'Total Hours': 4.38,
        },
      ]};
    const expected = await aggregatedToCsv(data);
    expect(expected).toEqual(`Activity,February 18,April 18,March 18,Total Hours
Digging Holes,0,0,0.03,0.03
Outdoor and practical work,0,2,2.38,4.38`);
  });
});
