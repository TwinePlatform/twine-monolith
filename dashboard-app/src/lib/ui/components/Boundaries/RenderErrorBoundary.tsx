import React from 'react';
import BaseErrorBoundary from './BaseErrorBoundary';


class RenderErrorBoundary<T extends {}> extends BaseErrorBoundary<T> {
  renderError () {
    return (
      <div>
        <div>
          {
            this.state.isHttpError
              ? 'There was a problem fetching your data'
              : 'There was a problem with this component'
          }
        </div>
        <div>
          {
            this.state.message
          }
        </div>
        <div>
          {
            this.state.isHttpError && <span>Status Code: {this.state.statusCode}</span>
          }
        </div>
      </div>
    );
  }
}

export default RenderErrorBoundary;
