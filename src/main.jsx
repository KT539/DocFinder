import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // creates a React root tied to div#root, which will manage all rendering ; !! help from AI !!
root.render(<App />); // mounts and renders the App component into div#root