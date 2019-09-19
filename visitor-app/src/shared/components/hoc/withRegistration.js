import React from 'react';
import PropTypes from 'prop-types';
import { assocPath } from 'ramda';
import { redirectOnError, status, toCancellable } from '../../../util';
import { ErrorUtils } from '../../../api';


const withRegistration = opts => (Child) => {
  class RegistrationFormWrapper extends React.Component {
    state = {
      form: {},
      errors: {},
      hoisted: null,
      result: null,
      status: null,
    }

    submission = null // eslint-disable-line react/sort-comp

    componentWillUnmount() {
      if (this.submission) {
        this.submission.cancel();
        this.submission = null;
      }
    }

    onClickPrint = () => window.print()

    onChange = (e) => {
      switch (e.target.type) {
        case 'checkbox':
          return this.setState(assocPath(['form', e.target.name], e.target.checked));
        default:
          return this.setState(assocPath(['form', e.target.name], e.target.value));
      }
    }

    onSubmit = (e) => {
      e.preventDefault();

      const errors = opts.validateForm(this.state.form);
      if (errors) {
        return this.setState({ errors });
      }

      this.setState({ status: status.PENDING });

      this.submission = toCancellable(opts.onSubmit(this.state.form, this.state.hoisted));

      return this.submission
        .then((res) => {
          const [result, url] = opts.onSuccess(res);
          this.setState({ result, status: status.SUCCESS }, () => this.props.history.push(url));
        })
        .catch((err) => {
          if (ErrorUtils.errorStatusEquals(err, 400)) {
            this.setState({
              status: status.FAILURE,
              errors: ErrorUtils.getFirstValidationErrors(err),
            });
          } else if (ErrorUtils.errorStatusEquals(err, 409)) {
            this.setState({
              status: status.FAILURE,
              errors: { email: ErrorUtils.getErrorMessage(err) },
            });
          } else {
            redirectOnError(this.props.history.push, err);
          }
        });
    }

    hoist = x => this.setState({ hoisted: x })

    render() {
      const props = {
        ...this.props,
        ...this.state,
        onSubmit: this.onSubmit,
        onChange: this.onChange,
        onClickPrint: this.onClickPrint,
        hoist: this.hoist,
      };

      return <Child {...props} />;
    }
  }

  RegistrationFormWrapper.propTypes = {
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };

  return RegistrationFormWrapper;
};

export default withRegistration;
