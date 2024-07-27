import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Context from './context/context';
import { ToastContainer, toast } from 'react-toastify';

ReactDOM.render(
  <Context>
    <App />
    <ToastContainer 
      position="top-center"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </Context>,
  document.getElementById('root')
);


