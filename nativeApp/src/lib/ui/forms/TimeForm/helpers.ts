export const getTimeLabel = (volunteer: string, forUser: 'admin' | 'volunteer') => {
  switch (forUser) {
    case 'volunteer':
      return 'You volunteered for';
    case 'admin':
    default:
      return `${volunteer || 'Member'} volunteered for`;
  }
};
