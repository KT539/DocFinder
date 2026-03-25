/**
 * @file            pages/scanner.jsx
 * @project         DocFinder
 * @author          Kilian Testard
 * @project_lead    Pascal Hurni
 * @last_modified   24-03-2026
 */


import { useState } from 'react'; // useState triggers a re-render whenever its setter is called, keeping the UI reactive

export default function Scanner({ navigate }) {
    const [pdfPath, setPdfPath] = useState(''); // folder path typed or selected by the user
    const [pdfs, setPdfs] = useState([]); // list of PDFs returned by the last scan
    const [error, setError] = useState(''); // error message returned by the backend
    const [hasScanned, setHasScanned] = useState(false); // true if the user has launched at least one scan
    const [addedPaths, setAddedPaths] = useState(new Set()); // set of PDF path already added to the library
    const [search, setSearch] = useState(''); // current value of the search filter

    // filters pdfs in real time based on the search input
    const filteredPdfs = pdfs.filter(pdf =>
        pdf.name.toLowerCase().includes(search.toLowerCase())
    )

    // sends the folder path to the IPC handler, which calls the PHP backend and returns the list of PDFs
    const handlePdfScan = async () => {
        setError(''); // reinitialize the error state before launching a new scan
        const result = await window.electronAPI.scanPdfs(pdfPath);
        setHasScanned(true);
        if (result.error) {
            setError(result.error); // display the error message
            setPdfs([]); // clears the PDFs list
        } else {
            setPdfs(result.pdfs || []); // display the PDFs list, or an empty table if no PDF was found
        }
    };

    // opens windows file explorer and updates pdfPath with the selected directory
    const handlePdfDirectorySelection = async () => {
        const result = await window.electronAPI.selectDirectory();
        if (result === null) {
            setPdfPath(''); // reset the path if user closes the dialog without selecting a folder
        } else {
            setPdfPath(result);
        }
    };

    // calls the IPC handler to save the PDF to the store, then marks it as added locally
    const handleAddToLibrary = async (pdf) => {
        await window.electronAPI.addToLibrary(pdf);
        setAddedPaths(prev => new Set(prev).add(pdf.path)); // create a new Set to trigger a re-render
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
            <h2 className="text-xl font-semibold mt-6">PDFs scanner</h2>
            {/* path input row : folder picker button, text input, and scan button */}
            <div className="flex gap-2">
                <button 
                    onClick={handlePdfDirectorySelection}
                    className="p-3 bg-gray-700 hover:bg-gray-600 rounded font-medium flex items-center justify-center transition-colors"
                    title="Parcourir les dossiers">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.31c-.195 0-.387-.078-.531-.22l-1.66-1.66a1.5 1.5 0 0 0-1.06-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.31c-.195 0-.387-.078-.531-.22Z" />
                    </svg>
                </button>
                <input
                    type="text"
                    value={pdfPath}
                    onChange={(e) => setPdfPath(e.target.value)}
                    placeholder="Veuillez insérer votre path..."
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"/>
                <button
                    onClick={handlePdfScan}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded font-medium">
                    Lancer le scan
                </button>
            </div>

            {error && ( // conditional rendering : if the condition is true, display the jsx ; string = true, empty string = false
                <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded">
                    {error}
                </div>
            )}

            {pdfs.length > 0 ? ( // conditional rendering : only display the list if pdfs.length > 0
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">PDFs trouvés :</h2>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Filtrer par nom de fichier..."
                        className="w-full p-3 rounded bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
                    />
                    {/* display filtered count vs total */}
                    <p className="text-gray-500 text-sm mb-3">
                        {filteredPdfs.length} / {pdfs.length} fichier(s)
                    </p>
                    <ul className="space-y-2">
                        {filteredPdfs.map((pdf) => (
                            // key={pdf.path} lets React identify which items changed on re-render
                            // stopPropagation allows to differentiate between clicks on the button and cliks on the files ; !! help from AI !!
                            <li key={pdf.path} onClick={() => window.electronAPI.openPdf(pdf.path)} className="p-3 bg-gray-800 cursor-pointer select-none hover:bg-gray-700 rounded flex justify-between items-center">
                                {pdf.name}
                                <button onClick={async (e) => { e.stopPropagation(); await handleAddToLibrary(pdf); }} className="px-3 py-1 bg-gray-600 hover:bg-gray-500 cursor-pointer select-none rounded text-sm">
                                    {addedPaths.has(pdf.path) ? '✓' : '+'}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) :  hasScanned && (
                // only shown if a scan was run but returned no PDFs
                <div className="mt-6">
                    <h3 className="text-sm mb-3">Aucun fichier PDF trouvé</h3>
                </div>
            )}
        </div>
    )
}