import React, { useState } from 'react';

import "./batch.css";

function BatchUpload() {
    const [file, setFile] = useState<File | null>(null);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files) {
            setFile(e.target.files[0])
        }
    }

    function handleUpload() {
        console.log(file);
    }

    return (
        <div className="BatchUpload">
            <input type="file" className="file" onChange={handleFileChange} />
            <input type="button" className="upload" onClick={handleUpload} value="Upload" />
        </div>
    )
}

export { BatchUpload }
