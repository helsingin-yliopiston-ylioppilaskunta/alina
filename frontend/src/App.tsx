import { useState, useEffect } from "react";
import './App.css';

import { get_resources } from "./api/resources";
import { get_orgs } from "./api/orgs";
import { send_batch } from "./api/batch";

import { ResourceList } from "./components/resources";
import { OrgList } from "./components/orgs";
import { BatchUpload } from "./components/batch";

import type { APIRows } from "./schemas/BatchUpload";

function App() {
    const [resources, setResources] = useState([]);
    const [orgs, setOrgs] = useState([]);

    useEffect(() => {
        get_resources()
            .then(setResources)
            .catch(console.error);

        get_orgs()
            .then(setOrgs)
            .catch(console.error);
    }, [])

    function handleSubmit(rows: APIRows[]) {
        send_batch(rows)
            .then(console.log)
            .catch(console.error);
    }

    return (
        <div className="App">
            <h1>Alina</h1>
            <ResourceList resources={resources} />
            <OrgList orgs={orgs} />
            <BatchUpload handleSubmit={handleSubmit} />
        </div>
    )
}

export default App
