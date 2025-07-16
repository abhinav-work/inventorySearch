'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const ImportCSV = () => {
    const [parsedData, setParsedData] = useState<any[]>([]);
    const [headers, setHeaders] = useState<string[]>([]);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/uploadProducts', {
            method: 'POST',
            body: formData,
            cache: 'no-cache'
        });
        const json: { message: string, success: boolean } = await res.json();
        console.log('Upload response:', json);
        if (json.success) {
            toast.success(json.message);
        } else {
            toast.error('Upload failed');
        }
        console.log('Parsing file')
        event.target.value = '';
    };

    const deleteAllDocuments = async () => {
        console.log('Delete button clicked')
        const res = await fetch('/api/deleteAllProducts', {
            method: 'DELETE',
            cache: 'no-cache'
        });
        const json: { message: string, success: boolean } = await res.json();
        if (json.success) {
            toast.success(json.message);
        } else {
            toast.error('Upload failed');
        }
        console.log('Upload response:', json);
        console.log('Parsing file')
    };

    return (
        <div>
            <h2>Import CSV</h2>
            <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ marginBottom: '1rem' }}
            />

            <h2>Delete Products</h2>
            <button onClick={deleteAllDocuments}>Delete All Products</button>
        </div>
    );
};

export default ImportCSV;
