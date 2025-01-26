import React from 'react'; // Needed in React versions prior to 17, but not for 17+ with the new JSX transform
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
