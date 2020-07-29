export const getTimeLabel = (forUser: 'admin' | 'volunteer', volunteer?: string) => {
  switch (forUser) {
    case 'volunteer':
      return 'You volunteered for';
    case 'admin':
    default:
      return `${volunteer || 'Member'} volunteered for`;
  }
};
