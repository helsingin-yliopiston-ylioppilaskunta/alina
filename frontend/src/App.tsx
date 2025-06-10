import { useState, useEffect } from "react";
import './App.css';

import { get_resources } from "./api/resources";

import { ResourceList } from "./components/resources";

function App() {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        get_resources()
            .then(setResources)
            .catch(console.error);
    }, [])

    return (
        <div className="App">
            <h1>Alina</h1>
            <ResourceList resources={resources} />
        </div>
    )
}

export default App
