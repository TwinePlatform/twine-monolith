import { downloadCsv } from '../downloadCsv';
import { DurationUnitEnum } from '../../../types';


describe('downloadCsv', () => {
  test('Calls error callback on empty dataset', async () => {
    const onError = jest.fn();
    await downloadCsv({
      data: { groupByX: '', groupByY: '', rows: [] },
      fromDate: new Date,
      toDate: new Date,
      fileName: '',
      unit: DurationUnitEnum.DAYS,
      setErrors: onError,
    });

    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError)
      .toHaveBeenLastCalledWith({ Download: 'There is no data available to download' });
  });
});
