import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './client/app/App';
import reportWebVitals from './client/reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
