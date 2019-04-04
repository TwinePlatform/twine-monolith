import React from 'react';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Router } from 'react-router-dom';
import { render } from 'react-testing-library';


export const renderWithHistory = (Component: React.ComponentType<{ history?: MemoryHistory }>, {
  route = '/',
  history = createMemoryHistory({ initialEntries: [route] }),
  ...props
} = {}) => {
  return {
    ...render(
      <Router history={history}>
        <Component {...props} />
      </Router>
    ),
    // adding `history` to the returned utilities to allow us
    // to reference it in our tests (just try to avoid using
    // this to test implementation details).
    history,
  };
};
