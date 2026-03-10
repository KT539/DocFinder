// react hook to trigger a re-render of a component when a set variable is modified
// so when setPath, setPdfs ou setError is called, React automatically synchronises the UI with the new value
import { useState } from 'react'; 

export default function Scanner({ navigate }) {
    const [pdfPath, setPdfPath] = useState('');
    const [pdfs, setPdfs] = useState([]);
    const [error, setError] = useState('');
    const [hasScanned, setHasScanned] = useState(false);

    const handlePdfScan = async () => {
        setError(''); // reinitialize the error state before launching a new scan

        // call the function exposed by electron/preload.js, and set the result variable to the JSON object returned by PHP
        const result = await window.electronAPI.scanPdfs(pdfPath);
        setHasScanned(true);
        if (result.error) {
            setError(result.error); // display the error message
            setPdfs([]); // empty the PDFs list
        } else {
            setPdfs(result.pdfs || []); // display the PDFs list, or an empty table if no PDF was found
        }
    };

    const handlePdfDirectorySelection = async () => {
        const result = await window.electronAPI.selectDirectory();
        if (result === null) {
            setPdfPath('');
        } else {
            setPdfPath(result);
        }
    };

    const handleAddToLibrary = async (pdf) => {
        await window.electronAPI.addToLibrary(pdf);
    };

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
            <h2 className="text-xl font-semibold mt-6">PDFs scanner</h2>
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
                    readOnly
                    value={pdfPath} // path stores up the input provided by the user
                    placeholder="Veuillez insérer votre path..."
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handlePdfScan}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded font-medium">
                    Lancer le scan
                </button>
            </div>

            {error && ( // conditionnal rendering : if the condition is true, display the jsx ; string = true, emty string = false
                <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded">
                    {error}
                </div>
            )}

            {pdfs.length > 0 ? ( // conditionnal rendering : only display the list if pdfs.length > 0
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">PDFs trouvés :</h2>
                    <ul className="space-y-2">
                        {pdfs.map((pdf) => ( // map method turns the table into a table of React elements
                            // React needs a unique id for each element of the list, to know which ones have changed when a re-render occurs
                            <li key={pdf.path} className="p-3 bg-gray-800 rounded flex justify-between items-center"> 
                                {pdf.name}
                                <button onClick={() => handleAddToLibrary(pdf)}
                                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm">
                                    +
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) :  hasScanned && (
                <div className="mt-6">
                    <h3 className="text-sm mb-3">Aucun fichier PDF trouvé</h3>
                </div>
            )}
        </div>
    )
}