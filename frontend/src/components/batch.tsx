import React, { useState } from 'react';
import * as Papa from "papaparse";

import type { APIRow } from './../schemas/BatchUpload';

import "./batch.css";

interface BatchUploadProps {
    handleSubmit: (rows: APIRow[]) => void;
}

function BatchUpload(props: BatchUploadProps) {
    const [file, setFile] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    function handleUpload() {
        if (!file) {
            return;
        }

        Papa.parse(file, {
            header: false,
            skipEmptyLines: true,
            complete: (results: Papa.ParseResult<string[]>) => {
                const data = results.data.slice(1);

                const formatted = data.map((row: string[]) => {
                    return {
                        "org_name": row[0],
                        "contact_person": row[1],
                        "contact_email": row[2],
                        "contact_phone": row[3],
                        "event": row[8],
                        "description": row[9],
                        "participants": row[10],
                        "checked": row[17] === "Kyllä",
                        "alina_dates": [row[5], row[6], row[7]],
                        "sivistys_dates": [row[12], row[13], row[14]]
                    };
                });

                console.log(formatted);

                props.handleSubmit(formatted);
            }
        });
    }

    return (
        <div className="BatchUpload">
            <input type="file" className="file" onChange={handleFileChange} />
            <input type="button" className="upload" onClick={handleUpload} value="Upload" />
        </div>
    )
}

export { BatchUpload }
