import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom';
import { SettingsProvider } from './contexts/settings/settingsContext';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
