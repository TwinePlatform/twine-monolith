import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../visitors/button';
import { authenticatedPost } from './activitiesLib/admin_helpers';

export class AdminLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      errorMessage: '',
    };
  }

  handleChange = e => this.setState({ [e.target.name]: e.target.value });

  authenticate = e => {
    e.preventDefault();

    authenticatedPost('/isAdminAuthenticated', {
      password: this.state.password,
    })
      .then(response => {
        const { success, token, error } = response;

        if (success && token) {
          return this.props.updateAdminToken(token);
        }

        throw new Error(error || 'Incorrect password');
      })
      .then(() => this.props.history.push('/admin'))
      .catch(error => {
        if (error.message === 'Incorrect password') {
          this.setState({
            errorMessage: 'The password is incorrect. Please try again.',
          });
        } else if (error.message === 'Not logged in') {
          this.props.history.push('/logincb');
        } else {
          console.log(error);
          this.props.history.push('/internalServerError');
        }
      });
  };

  render() {
    return (
      <div>
        <div className="ErrorText">{this.state.errorMessage}</div>
        <form className="Signup" onSubmit={this.authenticate}>
          <label className="Form__Label">
            Please, type your password
            <input
              className="Form__Input"
              type="password"
              name="password"
              onChange={this.handleChange}
              value={this.state.password}
            />
          </label>
          <Button />
        </form>
        <Link to="/pswdresetcb">
          <button className="Button ButtonBack">Reset Password</button>
        </Link>
      </div>
    );
  }
}
