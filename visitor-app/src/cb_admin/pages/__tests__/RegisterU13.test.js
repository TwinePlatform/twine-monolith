import 'jest-dom/extend-expect';
import { cleanup, waitForElement, wait, fireEvent } from 'react-testing-library';
import MockAdapter from 'axios-mock-adapter';
import { renderWithRouter } from '../../../tests';
import RegisterU13 from '../RegisterU13';
import { axios } from '../../../api';

describe('RegisterU13 Component', () => {
  let mock;

  beforeAll(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(cleanup);

  test(':: succesful load displays cbs details on page', async () => {
    expect.assertions(1);

    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });
    mock.onGet('/community-businesses/me')
      .reply(200, { result: { id: 3, name: 'Frog Finders', logoUrl: null } });

    const { getByText } = renderWithRouter({ route: '/admin/visitors/u-13' })(RegisterU13);
    const name = await waitForElement(() => getByText('Frog Finders', { exact: false }));

    expect(name).toHaveTextContent('Frog Finders');
  });

  test(':: unauthorised request redirects to login', async () => {
    expect.assertions(1);

    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });
    mock.onGet('/community-businesses/me')
      .reply(401, { result: null });

    const { history } = renderWithRouter({ route: '/admin/visitors/u-13' })(RegisterU13);

    await wait(() => expect(history.location.pathname).toEqual('/login'));
  });

  test(':: register u-13 visitor', async () => {
    const qrCode = 'data:png/base64;foo';

    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });
    mock.onGet('/community-businesses/me')
      .reply(200, { result: { id: 3, name: 'Frog Finders', logoUrl: null } });
    mock.onPost('/users/register/visitors')
      .reply(200, { result: { qrCode } });

    const tools = renderWithRouter({ route: '/admin/visitors/u-13' })(RegisterU13);

    await waitForElement(() => tools.getByText('Frog Finders', { exact: false }));

    const inputs = await waitForElement(() => ({
      fullName: tools.getByLabelText('Child\'s Full Name'),
      email: tools.getByLabelText('Parent/Guardian\'s Email Address'),
      phoneNumber: tools.getByLabelText('Parent/Guardian\'s Phone Number'),
      postCode: tools.getByLabelText('Post Code'),
      gender: tools.getByLabelText('Child\'s Gender'),
      birthYear: tools.getByLabelText('Child\'s Year of Birth'),
      ageCheck: tools.getByTestId('ageCheck'),
      submit: tools.getByText('CONTINUE'),
    }));

    fireEvent.change(inputs.fullName, { target: { value: 'Timmy' } });
    fireEvent.change(inputs.email, { target: { value: 'timmy@tommy.com' } });
    fireEvent.change(inputs.phoneNumber, { target: { value: '07777777777' } });
    fireEvent.change(inputs.postCode, { target: { value: 'w34nr' } });
    fireEvent.change(inputs.gender, { target: { value: 'prefer not to say' } });
    fireEvent.change(inputs.birthYear, { target: { value: 2010 } });
    fireEvent.click(inputs.ageCheck);
    fireEvent.click(inputs.submit);

    await wait(() => expect(tools.history.location.pathname).toEqual('/admin/visitors/u-13/thankyou'));

    const [title, instruction, qrCodeEl] = await waitForElement(() => [
      tools.getByText('Here is your QR code'),
      tools.getByText('Please print this page', { exact: false }),
      tools.getByAltText('This is your QR code'),
    ]);

    expect(title).toBeDefined();
    expect(instruction).toHaveTextContent('Please print this page');
    expect(qrCodeEl.src).toEqual(qrCode);
  });

  test(':: display message when checkbox for age-check not ticked', async () => {
    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });
    mock.onGet('/community-businesses/me')
      .reply(200, { result: { id: 3, name: 'Frog Finders', logoUrl: null } });

    const tools = renderWithRouter({ route: '/admin/visitors/u-13' })(RegisterU13);

    await waitForElement(() => tools.getByText('Frog Finders', { exact: false }));

    const inputs = await waitForElement(() => ({
      fullName: tools.getByLabelText('Child\'s Full Name'),
      email: tools.getByLabelText('Parent/Guardian\'s Email Address'),
      phoneNumber: tools.getByLabelText('Parent/Guardian\'s Phone Number'),
      postCode: tools.getByLabelText('Post Code'),
      gender: tools.getByLabelText('Child\'s Gender'),
      birthYear: tools.getByLabelText('Child\'s Year of Birth'),
      ageCheck: tools.getByTestId('ageCheck'),
      submit: tools.getByText('CONTINUE'),
    }));

    fireEvent.change(inputs.fullName, { target: { value: 'Timmy' } });
    fireEvent.change(inputs.email, { target: { value: 'timmy@tommy.com' } });
    fireEvent.change(inputs.phoneNumber, { target: { value: '07777777777' } });
    fireEvent.change(inputs.postCode, { target: { value: 'w34nr' } });
    fireEvent.change(inputs.gender, { target: { value: 'prefer not to say' } });
    fireEvent.change(inputs.birthYear, { target: { value: 2010 } });
    fireEvent.click(inputs.submit);

    const validationMsg = await waitForElement(() =>
      tools.getByText('You must confirm parental consent as been given'));

    expect(validationMsg).toHaveTextContent('You must confirm parental consent as been given');
    await wait(() => expect(tools.history.location.pathname).toEqual('/admin/visitors/u-13'));
  });

  test(':: message displayed when neither phone number nor email provided', async () => {
    mock.onGet('/genders')
      .reply(200, { result: [{ id: 1, name: 'male' }, { id: 2, name: 'female' }, { id: 3, name: 'prefer not to say' }] });
    mock.onGet('/community-businesses/me')
      .reply(200, { result: { id: 3, name: 'Frog Finders', logoUrl: null } });

    const tools = renderWithRouter({ route: '/admin/visitors/u-13' })(RegisterU13);

    await waitForElement(() => tools.getByText('Frog Finders', { exact: false }));

    const inputs = await waitForElement(() => ({
      fullName: tools.getByLabelText('Child\'s Full Name'),
      postCode: tools.getByLabelText('Post Code'),
      gender: tools.getByLabelText('Child\'s Gender'),
      birthYear: tools.getByLabelText('Child\'s Year of Birth'),
      ageCheck: tools.getByTestId('ageCheck'),
      submit: tools.getByText('CONTINUE'),
    }));

    fireEvent.change(inputs.fullName, { target: { value: 'Timmy' } });
    fireEvent.change(inputs.postCode, { target: { value: 'sw34nr' } });
    fireEvent.change(inputs.gender, { target: { value: 'prefer not to say' } });
    fireEvent.change(inputs.birthYear, { target: { value: 2010 } });
    fireEvent.click(inputs.submit);

    const validationMsg = await waitForElement(() =>
      tools.getByText('You must supply a phone number or email address'));

    expect(validationMsg).toHaveTextContent('You must supply a phone number or email address');
    await wait(() => expect(tools.history.location.pathname).toEqual('/admin/visitors/u-13'));
  });

});
