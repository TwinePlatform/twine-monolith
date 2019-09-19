import React from 'react';
import PropTypes from 'prop-types';
import { assocPath } from 'ramda';
import { redirectOnError, status } from '../../../util';
import { ErrorUtils } from '../../../api';


const withRegistration = opts => (Child) => {
  class RegisterVisitor extends React.Component {
    state = {
      form: {},
      errors: {},
      status: null,
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

      return opts.onSubmit(this.state.form, this.state.other)
        .then((res) => {
          const [result, url] = opts.onSuccess(res);
          this.setState({ result, status: status.SUCCESS }, () => this.props.history.push(url));
        })
        .catch((err) => {
          if (ErrorUtils.errorStatusEquals(err, 400)) {
            this.setState({
              status: status.FAILURE,
              errors: ErrorUtils.getValidationErrors(err),
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

    render() {
      const props = {
        ...this.props,
        ...this.state,
        onSubmit: this.onSubmit,
        onChange: this.onChange,
        onClickPrint: this.onClickPrint,
        hoist: x => this.setState({ other: x }),
      };

      return <Child {...props} />;
    }
  }

  RegisterVisitor.propTypes = {
    history: PropTypes.shape({ push: PropTypes.func }).isRequired,
  };

  return RegisterVisitor;
};

export default withRegistration;
