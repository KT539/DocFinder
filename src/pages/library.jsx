export default function Library({ navigate }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('home')}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
            </div>
            <h2 className="text-xl font-semibold mt-6">Bibliothèque</h2>
            <div className="flex flex-col items-center justify-center mt-5 text-center border-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-600 mb-4 mt-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                </svg>
                <p className="text-gray-500 mb-5">Votre bibliothèque ne contient aucun document pour le moment.</p>
            </div>
        </div>
    );
}
