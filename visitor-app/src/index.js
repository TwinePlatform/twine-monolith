import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'normalize.css';
import './styles/DatePicker.css';
import './styles/ReactPagination.css';
import App from './App';
import './styles/index.css';
import { unregister } from './registerServiceWorker';

const appRoot = document.getElementById('root');


ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  appRoot,
);
unregister();
