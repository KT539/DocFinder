import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // sets my div#root as anchor point
root.render(<App />); // render tells React to load the App component inside this div#root