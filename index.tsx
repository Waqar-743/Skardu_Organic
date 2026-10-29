
import React from 'react';
import ReactDOM from 'react-dom/client';
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/instrument-sans";
import App from './App';
import LoadBoundary from './components/LoadBoundary';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <LoadBoundary><App /></LoadBoundary>
  </React.StrictMode>
);
