import React from 'react';
import { cleanup, render, waitForElement, fireEvent } from 'react-testing-library';
import { TabGroup } from '../TabGroup';
import 'jest-dom/extend-expect';


describe('TabGroup', () => {
  afterEach(cleanup);

  test('empty TabGroup', async () => {
    const tools = render(<TabGroup titles={[]} />);


  });
});
