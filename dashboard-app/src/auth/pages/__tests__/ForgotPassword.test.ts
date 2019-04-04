import MockAdapter from 'axios-mock-adapter';
import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import { renderWithHistory } from '../../../util/tests';
import { axios } from '../../../api';
import ForgotPassword from '../ForgotPassword';
import 'jest-dom/extend-expect';


describe.skip('ForgotPassword Page', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  afterEach(cleanup);

  test('Submit e-mail', async () => {
    expect.assertions(1);

    mock.onPost('/v1/users/password/forgot').reply(200, {});

    const tools = renderWithHistory(ForgotPassword);
    const email = 'fake@example.com';

    const [emailInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.click(submitBtn);

    await wait(() => expect(tools.history.location.pathname).toEqual('/login'));
  });

  test('Navigate back to login', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(ForgotPassword);

    const [backLink] = await waitForElement(async () => [
      tools.getByText('Back to login'),
    ]);

    fireEvent.click(backLink);

    await wait(() => expect(tools.history.location.pathname).toEqual('/login'));
  });

  test('Client-side validation :: Invalid e-mail', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(ForgotPassword);
    const email = 'Not_an_email';

    const [emailInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.click(submitBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [emailLabel] = await waitForElement(async () => [
      tools.getByText(/"email" must be a valid email/),
    ]);

    expect(emailLabel).toHaveTextContent('"email" must be a valid email');
  });

  test('Server-side validation :: Invalid e-mail', async () => {
    expect.assertions(1);

    mock
      .onPost('/v1/users/password/forgot')
      .reply(400, { error: { message: 'E-mail not recognised' } });

    const tools = renderWithHistory(ForgotPassword);
    const email = 'foo@bar.com';

    const [emailInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.click(submitBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [emailLabel] = await waitForElement(async () => [
      tools.getByText(/E-mail not recognised/),
    ]);

    expect(emailLabel).toHaveTextContent('E-mail not recognised');
  });
});
