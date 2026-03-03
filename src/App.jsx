import { useState } from 'react';
import Home from './pages/home';
import Scanner from './pages/scanner';
import Library from './pages/library';

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            {currentPage === 'home'    && <Home navigate={setCurrentPage} />}
            {currentPage === 'scanner' && <Scanner navigate={setCurrentPage} />}
            {currentPage === 'library' && <Library navigate={setCurrentPage} />}
        </div>
    );
}