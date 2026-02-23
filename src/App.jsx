// react hook to trigger a re-render of a component when a set variable is modified
// so when setPath, setPdfs ou setError is called, React automatically synchronises the UI with the new value
import { useState } from 'react'; 

export default function App() {
    const [pdfPath, setPdfPath] = useState('');
    const [docxPath, setDocxPath] = useState('');
    const [pdfs, setPdfs] = useState([]);
    const [docxs, setDocxs] = useState([]);
    const [error, setError] = useState('');

    const handlePdfScan = async () => {
        setError(''); // reinitialize the error state before launching a new scan

        // call the function exposed by electron/preload.js, and set the result variable to the JSON object returned by PHP
        const result = await window.electronAPI.scanPdfs(pdfPath);

        if (result.error) {
            setError(result.error); // display the error message
            setPdfs([]); // empty the PDFs list
        } else {
            setPdfs(result.pdfs || []); // display the PDFs list, or an empty table if no PDF was found
        }
    };
    const handleDocxScan = async () => {
        setError('');
        const result = await window.electronAPI.scanDocxs(docxPath);
        if (result.error) {
            setError(result.error);
            setDocxs([]);
        } else {
            setDocxs(result.docxs || []);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold">DocFlow</h1>

            <h2 className="text-xl font-semibold mt-6">PDFs scanner</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={pdfPath} // path stores up the input provided by the user
                    onChange={(e) => setPdfPath(e.target.value)} // setPath updates the path value ; with onChange, each keystroke calls setPath with a new input value, updating path et re-rendering the page
                    placeholder="Veuillez insérer votre path..."
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handlePdfScan}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium">
                    Lancer le scan
                </button>
            </div>

            <h2 className="text-xl font-semibold mt-6">DOCXs scanner</h2>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={docxPath} 
                    onChange={(e) => setDocxPath(e.target.value)}
                    placeholder="Veuillez insérer votre path..."
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
                <button
                    onClick={handleDocxScan}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded font-medium">
                    Lancer le scan
                </button>
            </div>

            {error && ( // conditionnal rendering : if the condition is true, display the jsx ; string = true, emty string = false
                <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded">
                    {error}
                </div>
            )}

            {pdfs.length > 0 && ( // conditionnal rendering : only display the list if pdfs.length > 0
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">PDFs trouvés :</h2>
                    <ul className="space-y-2">
                        {pdfs.map((pdf) => ( // map method turns the table into a table of React elements
                            // React needs a unique id for each element of the list, to know which ones have changed when a re-render occurs
                            <li key={pdf.path} className="p-3 bg-gray-800 rounded"> 
                                {pdf.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {docxs.length > 0 && (
                <div className="mt-6">
                    <h2 className="text-xl font-semibold mb-3">DOCXs trouvés :</h2>
                    <ul className="space-y-2">
                        {docxs.map((docx) => (
                            <li key={docx.path} className="p-3 bg-gray-800 rounded">
                                {docx.name}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}