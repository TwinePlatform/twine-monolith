import MockAdapter from 'axios-mock-adapter';
import {
  fireEvent,
  cleanup,
  waitForElement,
  wait,
} from 'react-testing-library';
import { renderWithHistory } from '../../../../util/tests';
import { axios } from '../../../../api';
import Login from '../Login';
import 'jest-dom/extend-expect';

describe.skip('Login Page', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterAll(() => {
    mock.restore();
  });

  afterEach(cleanup);

  test('Successful login', async () => {
    expect.assertions(1);

    mock.onPost('/v1/users/login').reply(200, {});

    const tools = renderWithHistory(Login);
    const email = 'fake@example.com';
    const password = 'fakepassword';

    const [emailInput, passwordInput, loginBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByLabelText('Password'),
      tools.getByText('LOGIN'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(loginBtn);

    await wait(() => expect(tools.history.location.pathname).toEqual('/'));
  });

  test('Client-side validation :: Invalid e-mail', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Login);
    const email = 'this_aint_an_email';
    const password = 'fakepassword';

    const [emailInput, passwordInput, loginBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByLabelText('Password'),
      tools.getByText('LOGIN'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(loginBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [emailLabel] = await waitForElement(async () => [
      tools.getByText(/"email" must be a valid email/),
    ]);

    expect(emailLabel).toHaveTextContent('"email" must be a valid email');
  });

  test('Client-side validation :: Invalid password', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Login);
    const email = 'email@example.com';
    const password = 'short';

    const [emailInput, passwordInput, loginBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByLabelText('Password'),
      tools.getByText('LOGIN'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(loginBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [passwordLabel] = await waitForElement(async () => [
      tools.getByText(/length must be at least/),
    ]);

    expect(passwordLabel).toHaveTextContent('"password" length must be at least 8 characters long');
  });

  test('Server-side validation :: Invalid e-mail', async () => {
    expect.assertions(1);

    mock
      .onPost('/v1/users/login')
      .reply(400, {
        error: {
          validation: {
            password: '"email" must be a valid email',
          },
        },
      });

    const tools = renderWithHistory(Login);
    const email = 'email@example.com'; // has to actually be valid to by-pass client-side validation
    const password = 'fakepassword';

    const [emailInput, passwordInput, loginBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByLabelText('Password'),
      tools.getByText('LOGIN'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(loginBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [emailLabel] = await waitForElement(async () => [
      tools.getByText(/"email" must be a valid email/),
    ]);

    expect(emailLabel).toHaveTextContent('"email" must be a valid email');
  });

  test('Server-side validation :: Invalid password', async () => {
    expect.assertions(1);

    mock
      .onPost('/v1/users/login')
      .reply(400, {
        error: {
          validation: {
            password: '"password" length must be at least 8 characters long',
          },
        },
      });

    const tools = renderWithHistory(Login);
    const email = 'email@example.com';
    const password = 'okaypassword(ish)';

    const [emailInput, passwordInput, loginBtn] = await waitForElement(async () => [
      tools.getByLabelText('E-mail'),
      tools.getByLabelText('Password'),
      tools.getByText('LOGIN'),
    ]);

    fireEvent.change(emailInput, { target: { value: email } });
    fireEvent.change(passwordInput, { target: { value: password } });
    fireEvent.click(loginBtn);

    // Have to wait till next tick before checking for text
    await wait();

    const [passwordLabel] = await waitForElement(async () => [
      tools.getByText(/length must be at least/),
    ]);

    expect(passwordLabel).toHaveTextContent('"password" length must be at least 8 characters long');
  });

  test('Click on "Forgot Password" link', async () => {
    expect.assertions(1);

    const tools = renderWithHistory(Login);

    const [forgotLink] = await waitForElement(async () => [
      tools.getByText(/Forgot/),
    ]);

    fireEvent.click(forgotLink);

    await wait(() => expect(tools.history.location.pathname).toEqual('/password/forgot'));
  });
});
