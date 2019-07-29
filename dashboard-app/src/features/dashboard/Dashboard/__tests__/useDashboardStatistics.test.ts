import moment from 'moment';
import {
  timeStatsToProps,
  volunteerStatsToProps,
  activityStatsToProps
} from '../useDashboardStatistics';


describe('timeStatsToProps', () => {
  test('no arguments', () => {
    expect(timeStatsToProps()).toEqual({
      topText: ['Over the past ', '12 months'],
      left: { label: 'No data available', data: [] },
      right: { label: 'hours', data: 0 },
    });
  });

  test('zero data points', () => {
    expect(timeStatsToProps({ labels: [], value: 0 })).toEqual({
      topText: ['Over the past ', '12 months'],
      left: { label: 'No data available', data: [], limit: 3, placeholder: '...' },
      right: { label: 'hours', data: 0 },
    });
  });

  test('one data point', () => {
    expect(timeStatsToProps({ labels: ['foo'], value: 10 })).toEqual({
      topText: ['Over the past ', '12 months'],
      left: { label: 'Most volunteer days were in', data: ['foo'], limit: 3, placeholder: '...' },
      right: { label: 'hours', data: 10 },
    });
  });

  test('two data points', () => {
    expect(timeStatsToProps({ labels: ['foo', 'bar'], value: 10 })).toEqual({
      topText: ['Over the past ', '12 months'],
      left: {
        label: 'Most volunteer days were in',
        data: ['foo', 'bar'],
        limit: 3,
        placeholder: '...',
      },
      right: { label: 'hours each', data: 10 },
    });
  });

  test('three data points', () => {
    expect(timeStatsToProps({ labels: ['foo', 'bar', 'woo'], value: 10 })).toEqual({
      topText: ['Over the past ', '12 months'],
      left: {
        label: 'Most volunteer days were in',
        data: ['foo', 'bar', 'woo'],
        limit: 3,
        placeholder: '...',
      },
      right: { label: 'hours each', data: 10 },
    });
  });

  test('four data points', () => {
    expect(timeStatsToProps({ labels: ['foo', 'bar', 'woo', 'war'], value: 10 })).toEqual({
      topText: ['Over the past ', '12 months'],
      left: {
        label: 'Most volunteer days were in',
        data: ['foo', 'bar', 'woo', 'war'],
        limit: 3,
        placeholder: '...',
      },
      right: { label: 'hours each', data: 10 },
    });
  });
});

describe('volunteerStatsToProps', () => {
  test('no arguments', () => {
    expect(volunteerStatsToProps()).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: { label: 'No data available', data: [] },
      right: { label: '0 hours', data: [] },
    });
  });

  test('zero data points', () => {
    expect(volunteerStatsToProps({ labels: [], value: 0 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: { label: 'No data available', data: [] },
      right: { label: '0 hours', data: [], limit: 3, placeholder: '...' },
    });
  });

  test('one data point', () => {
    expect(volunteerStatsToProps({ labels: ['foo'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: { label: 'Top volunteer', data: [] },
      right: { label: '10 hours', data: ['foo'], limit: 3, placeholder: '...' },
    });
  });

  test('two data points', () => {
    expect(volunteerStatsToProps({ labels: ['foo', 'bar'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: {
        label: 'Top volunteers',
        data: [],
      },
      right: {
        label: '10 hours each',
        data: ['foo', 'bar'],
        limit: 3,
        placeholder: '...', },
    });
  });

  test('three data points', () => {
    expect(volunteerStatsToProps({ labels: ['foo', 'bar', 'woo'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: {
        label: 'Top volunteers',
        data: [],
      },
      right: {
        label: '10 hours each',
        data: ['foo', 'bar', 'woo'],
        limit: 3,
        placeholder: '...', },
    });
  });

  test('four data points', () => {
    expect(volunteerStatsToProps({ labels: ['foo', 'bar', 'woo', 'war'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: {
        label: 'Top volunteers',
        data: [],
      },
      right: {
        label: '10 hours each',
        data: ['foo', 'bar', 'woo', 'war'],
        limit: 3,
        placeholder: '...', },
    });
  });
});

describe('activityStatsToProps', () => {
  test('no arguments', () => {
    expect(activityStatsToProps()).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: { label: 'No data available', data: [] },
      right: { label: 'hours', data: 0 },
    });
  });

  test('zero data points', () => {
    expect(activityStatsToProps({ labels: [], value: 0 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: { label: 'No data available', data: [], limit: 2, placeholder: '...' },
      right: { label: 'hours', data: 0 },
    });
  });

  test('one data point', () => {
    expect(activityStatsToProps({ labels: ['foo'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: { label: 'Most popular activity was', data: ['foo'], limit: 2, placeholder: '...' },
      right: { label: 'hours', data: 10 },
    });
  });

  test('two data points', () => {
    expect(activityStatsToProps({ labels: ['foo', 'bar'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: {
        label: 'Most popular activities were',
        data: ['foo', 'bar'],
        limit: 2,
        placeholder: '...',
      },
      right: {
        label: 'hours each',
        data: 10 },
    });
  });

  test('three data points', () => {
    expect(activityStatsToProps({ labels: ['foo', 'bar', 'woo'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: {
        label: 'Most popular activities were',
        data: ['foo', 'bar', 'woo'],
        limit: 2,
        placeholder: '...',
      },
      right: {
        label: 'hours each',
        data: 10 },
    });
  });

  test('four data points', () => {
    expect(activityStatsToProps({ labels: ['foo', 'bar', 'woo', 'war'], value: 10 })).toEqual({
      topText: ['During ', moment().format('MMM YYYY')],
      left: {
        label: 'Most popular activities were',
        data: ['foo', 'bar', 'woo', 'war'],
        limit: 2,
        placeholder: '...',
      },
      right: {
        label: 'hours each',
        data: 10 },
    });
  });
});
