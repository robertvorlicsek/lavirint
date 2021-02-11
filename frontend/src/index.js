import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { ComicsProvider } from './contexts/comicsContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <ComicsProvider>
        <App />
      </ComicsProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
