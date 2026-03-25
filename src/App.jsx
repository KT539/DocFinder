/**
 * @file            App.jsx
 * @project         DocFinder
 * @author          Kilian Testard
 * @project_lead    Pascal Hurni
 * @last_modified   24-03-2026
 */


import { useState } from 'react';
import Home from './pages/home';
import Scanner from './pages/scanner';
import Library from './pages/library';

// root component : manages navigation between pages
export default function App() {
    const [currentPage, setCurrentPage] = useState('home'); // tracks the displayed page, with home page by default

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {/* conditionnal rendering of the pages, and pass setCurrentPage as a navigate prop ; !! help from AI !! */}
            {currentPage === 'home'    && <Home navigate={setCurrentPage} />}
            {currentPage === 'scanner' && <Scanner navigate={setCurrentPage} />}
            {currentPage === 'library' && <Library navigate={setCurrentPage} />}
        </div>
    );
}