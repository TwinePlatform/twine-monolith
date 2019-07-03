import { downloadCsv } from '../downloadCsv';
import { DurationUnitEnum } from '../../../../types';


describe('downloadCsv', () => {
  test('Throws on empty dataset', async () => {
    expect.assertions(1);

    downloadCsv({
      data: { groupByX: '', groupByY: '', rows: [] },
      fromDate: new Date,
      toDate: new Date,
      fileName: '',
      unit: DurationUnitEnum.DAYS,
      sortBy: 0,
    })
      .catch((error) => {
        expect(error.message).toBe('No data available to download');
      });
  });
});
