import MockAdapter from 'axios-mock-adapter';
import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import { renderWithHistory } from '../../../util/tests';
import { axios } from '../../../api';
import ResetPassword from '../ResetPassword';
import 'jest-dom/extend-expect';


describe.skip('ResetPassword Page', () => {
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

    const password = 'wgioregoined';
    const token = 'goo';
    const email = 'fake@example.com';

    mock
      .onPost(
        '/v1/users/password/reset'
        // TODO: Cannot match on payload, because "token" will be null,
        //       because "props.match" is "{}" since component is rendered
        //       without <Route /> wrapper (and so "path" prop is undefined)
        // { email, password, passwordConfirm: password, token }
      )
      .reply(200, {});

    // tslint:disable-next-line:max-line-length
    const tools = renderWithHistory(ResetPassword, { route: `/password/reset/${token}?email=${email}` });

    const [pwdInput, pwdConfirmInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('Password'),
      tools.getByLabelText('Confirm password'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(pwdInput, { target: { value: password } });
    fireEvent.change(pwdConfirmInput, { target: { value: password } });
    fireEvent.click(submitBtn);

    await wait(() => expect(tools.history.location.pathname).toEqual('/login'));
  });

  test('Navigate back to login', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(ResetPassword);

    const [backLink] = await waitForElement(async () => [
      tools.getByText('Back to login'),
    ]);

    fireEvent.click(backLink);

    await wait(() => expect(tools.history.location.pathname).toEqual('/login'));
  });

  test('Client-side validation :: Invalid password', async () => {
    expect.assertions(1);

    const password = 'wgior';
    const token = 'goo';
    const email = 'fake@example.com';

    // tslint:disable-next-line:max-line-length
    const tools = renderWithHistory(ResetPassword, { route: `/password/reset/${token}?email=${email}` });

    const [pwdInput, pwdConfirmInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('Password'),
      tools.getByLabelText('Confirm password'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(pwdInput, { target: { value: password } });
    fireEvent.change(pwdConfirmInput, { target: { value: password } });
    fireEvent.click(submitBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [passwordLabel] = await waitForElement(async () => [
      tools.getByText(/"password" length must be at least 8 characters/),
    ]);

    expect(passwordLabel).toHaveTextContent('"password" length must be at least 8 characters long');
  });

  test('Server-side validation :: Invalid token', async () => {
    expect.assertions(1);

    mock
      .onPost('/v1/users/password/reset')
      .reply(401, { error: { message: 'Invalid token' } });

    const password = 'wgidfhgwrwefor';
    const token = 'goo';
    const email = 'fake@example.com';

    // tslint:disable-next-line:max-line-length
    const tools = renderWithHistory(ResetPassword, { route: `/password/reset/${token}?email=${email}` });

    const [pwdInput, pwdConfirmInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('Password'),
      tools.getByLabelText('Confirm password'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(pwdInput, { target: { value: password } });
    fireEvent.change(pwdConfirmInput, { target: { value: password } });
    fireEvent.click(submitBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [passwordLabel] = await waitForElement(async () => [
      tools.getByText(/Invalid token/),
    ]);

    expect(passwordLabel).toHaveTextContent('Invalid token');
  });

  test('Server-side validation :: Unrecognised e-mail', async () => {
    expect.assertions(1);

    mock
      .onPost('/v1/users/password/reset')
      .reply(403, { error: { message: 'User does not exist' } });

    const password = 'wgidfhgwrwefor';
    const token = 'goo';
    const email = 'fake@example.com';

    // tslint:disable-next-line:max-line-length
    const tools = renderWithHistory(ResetPassword, { route: `/password/reset/${token}?email=${email}` });

    const [pwdInput, pwdConfirmInput, submitBtn] = await waitForElement(async () => [
      tools.getByLabelText('Password'),
      tools.getByLabelText('Confirm password'),
      tools.getByText('SUBMIT'),
    ]);

    fireEvent.change(pwdInput, { target: { value: password } });
    fireEvent.change(pwdConfirmInput, { target: { value: password } });
    fireEvent.click(submitBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [passwordLabel] = await waitForElement(async () => [
      tools.getByText(/User does not exist/),
    ]);

    expect(passwordLabel).toHaveTextContent('User does not exist');
  });
});
