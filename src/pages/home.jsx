export default function Home({ navigate }) {
    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col p-8">
            <h1 className="text-4xl font-bold text-center mt-4">DocFinder</h1>
            <h3 className="text-gray-300 text-lg text-center mt-3">Gestion de documents PDFs</h3>
            <div className="grow flex items-center justify-center">
                <div className="grid grid-cols-2 gap-12 w-full max-w-2xl mx-auto">
                    <div className="flex flex-col items-center gap-4 mb-20">
                        <label className="text-lg">Accédez au scanner :</label>
                        <button
                            onClick={() => navigate('scanner')}
                            className="w-full px-8 py-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-lg transition-colors flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            Scanner
                        </button>
                    </div>
                    <div className="flex flex-col items-center gap-4 mb-20">
                        <label className="text-lg">Accédez à votre bibliothèque :</label>
                        <button
                            onClick={() => navigate('library')}
                            className="w-full px-8 py-6 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold text-lg transition-colors flex flex-col items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                            </svg>
                            Bibliothèque
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
