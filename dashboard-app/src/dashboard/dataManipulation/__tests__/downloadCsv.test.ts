import { downloadCsv } from '../downloadCsv';
import { DurationUnitEnum } from '../../../types';


describe('downloadCsv', () => {
  test('Rejects promise with error on empty dataset', async () => {
    expect.assertions(1);

    try {
      await downloadCsv({
        data: { groupByX: '', groupByY: '', rows: [] },
        fromDate: new Date,
        toDate: new Date,
        fileName: '',
        unit: DurationUnitEnum.DAYS,
      });
    } catch (error) {
      expect(error.message).toBe('There was a problem downloading your data');
    }
  });
});
