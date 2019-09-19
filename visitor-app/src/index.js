import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Modal from 'react-modal';
import 'normalize.css';
import './styles/index.css';
import './styles/DatePicker.css';
import './styles/ReactPagination.css';
import App from './App';
import { unregister } from './registerServiceWorker';

const appRoot = document.getElementById('root');

Modal.setAppElement(appRoot);

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  appRoot,
);
unregister();
