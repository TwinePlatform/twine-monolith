import React from "react";
import { Route, Redirect } from "react-router-dom";

export default ({ component: Component, auth, ...rest }) => (
  <Route {...rest} render={props =>
    auth
      ? (<Component {...props} />)
      : (<Redirect to={{ pathname: "/", state: { from: props.location } }} />)
  }
  />);
