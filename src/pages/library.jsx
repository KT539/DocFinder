/**
 * @file            pages/library.jsx
 * @project         DocFinder
 * @author          Kilian Testard
 * @project_lead    Pascal Hurni
 * @last_modified   24-03-2026
 */


import { useState, useEffect } from 'react';

export default function Library({ navigate }) {
    const [library, setLibrary] = useState([]); // full list of saved PDFs from the store
    const [loading, setLoading] = useState(true); // true while the library is loading
    const [search, setSearch] = useState(''); // current value of the search filter

    // fetch the library from the persistent store
    useEffect(() => {
        const loadLibrary = async () => {
            const data = await window.electronAPI.getLibrary();
            setLibrary(data);
            setLoading(false);
        };
        loadLibrary().catch(console.error);
    }, []);

    // filters library in real time based on the search input
    const filteredLibrary = library.filter(pdf =>
        pdf.name.toLowerCase().includes(search.toLowerCase())
    )

    // calls the IPC handler to remove the PDF from the store, then updates the local state
    const handleRemoveFromLibrary = async (pdfPath) => {
        const updated = await window.electronAPI.removeFromLibrary(pdfPath);
        setLibrary(updated);
    };


    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            {/* back button */}
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate('home')}
                    className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                </button>
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-6">Bibliothèque</h2>
            
            {/* only show the search bar once loading is done and the library has at least one entry */}
            {!loading && library.length > 0 && (
                <>      
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filtrer par nom de fichier..."
                        className="w-full p-3 rounded bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
                    />
                    {/* display filtered count vs total */}
                    <p className="text-gray-500 text-sm mb-3">
                        {filteredLibrary.length} / {library.length} fichier(s)
                    </p>
                </>
            )}
            {loading ? (
                <div className="flex items-center justify-center mt-20 text-gray-500">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 animate-spin">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                    Chargement...
                </div>

            ) : library.length === 0 ? (
                // empty state shown when the library has no entries
                <div className="flex flex-col items-center justify-center mt-16 text-center border-2 border-dashed border-gray-700 rounded-xl py-16 px-8">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-16 h-16 text-gray-600 mb-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                    </svg>
                    <p className="text-gray-500 mb-2">Votre bibliothèque est vide.</p>
                    <p className="text-gray-600 text-sm">Ajoutez des PDFs depuis le scanner.</p>
                </div>
            ) : (
                // render the filtered list of saved PDFs
                <div className="mt-6">
                    <ul className="space-y-2">
                        {filteredLibrary.map((pdf) => (
                            // clicking the row opens the PDF with the OS default viewer
                            <li key={pdf.path} onClick={() => window.electronAPI.openPdf(pdf.path)} className="p-3 bg-gray-800 cursor-pointer select-none hover:bg-gray-700 rounded flex justify-between items-center gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400 shrink-0">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                                    </svg>
                                    <div className="min-w-0">
                                        <p className="truncate font-medium">{pdf.name}</p>
                                        <p className="text-gray-500 text-xs truncate">{pdf.path}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* stopPropagation allows the diffirentiate the clicks on the button and the clicks on the files ; !! help from AI !! */}
                                    <button onClick={async (e) => { e.stopPropagation(); await handleRemoveFromLibrary(pdf.path); }} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 cursor-pointer select-none rounded text-sm">
                                    -
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}
            

  