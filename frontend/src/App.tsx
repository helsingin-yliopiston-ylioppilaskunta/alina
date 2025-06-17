import { useState, useEffect } from "react";
import './App.css';

import { get_resources } from "./api/resources";
import { get_orgs } from "./api/orgs";
import { send_batch } from "./api/batch";
import { get_dates, patch_dates } from "./api/dates";
import { get_org_resource_dates } from "./api/org_resource_dates";

import { ResourceList } from "./components/resources";
import { OrgList } from "./components/orgs";
import { BatchUpload } from "./components/batch";
import { DateList } from "./components/dates";
import { Allocate } from "./components/allocation";

import type { APIRow } from "./schemas/BatchUpload";

function App() {
    const [resources, setResources] = useState([]);
    const [orgs, setOrgs] = useState([]);
    const [dates, setDates] = useState([]);
    const [orgResourceDates, setOrgResourceDates] = useState([]);

    useEffect(() => {
        get_resources()
            .then(setResources)
            .catch(console.error);

        get_orgs()
            .then(setOrgs)
            .catch(console.error);

        get_dates()
            .then(setDates)
            .catch(console.error);

        // get_org_resource_dates(1)
        //     .then(setOrgResourceDates)
        //     .catch(console.error);
    }, [])

    function handleSubmit(rows: APIRow[]) {
        send_batch(rows)
            .then(console.log)
            .catch(console.error);
    }

    const [selectedResource, selectResource] = useState<number | undefined>();

    useEffect(() => {
        if (!selectedResource) {
            return;
        }

        get_org_resource_dates(selectedResource)
            .then(setOrgResourceDates)
            .catch(console.error);
    }, [selectedResource])

    function handleSelect(id: number) {
        selectResource(id);
    }

    return (
        <div className="App">
            <h1>Alina</h1>
            <ResourceList resources={resources} selected={selectedResource ? selectedResource : 0} handleSelect={handleSelect} />
            <Allocate
                orgResourceDates={orgResourceDates}
                onSubmit={patch_dates}
            />
            <OrgList orgs={orgs} />
            <BatchUpload handleSubmit={handleSubmit} />
            <DateList dates={dates} />
        </div>
    )
}

export default App
