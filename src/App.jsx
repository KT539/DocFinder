import { useState } from 'react'; // react hook to trigger a re-render of a component when a set variable is modified

export default function App() {
    const [path, setPath] = useState('');

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-2xl font-bold">DocFlow</h1>

            <div className="mt-6">
                <input
                    type="text"
                    value={path} // path stores up the input provided by the user
                    onChange={(e) => setPath(e.target.value)} // setPath updates the path value ; with onChange, each keystroke calls setPath with a new input value, updatating path et re-rendering the page
                    placeholder="Chemin vers un dossier de PDF..."
                    className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
            </div>
        </div>
    )
}