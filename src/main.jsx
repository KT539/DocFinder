/**
 * @file            main.jsx
 * @project         DocFinder
 * @author          Kilian Testard
 * @project_lead    Pascal Hurni
 * @last_modified   24-03-2026
 */


import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root')); // creates a React root tied to div#root, which will manage all rendering ; !! help from AI !!
root.render(<App />); // mounts and renders the App component into div#root