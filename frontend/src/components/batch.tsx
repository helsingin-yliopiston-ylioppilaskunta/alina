import React, { useState } from 'react';

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
            <input type="file" onChange={handleFileChange} />
            <div>
                {file && (
                    <section>
                        File details:
                        <ul>
                            <li>Name: {file.name}</li>
                            <li>Type: {file.type}</li>
                            <li>Size: {file.size} bytes</li>
                        </ul>
                    </section>
                )}
            </div>
            <input type="button" onClick={handleUpload} value="Upload" />
        </div>
    )
}

export { BatchUpload }
