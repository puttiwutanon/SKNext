import React from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; 

function SetupDatabase() {

    const generateTables = async () => {
        const rows = ['A','B','C','D','E','F'];
        let count = 0;

        console.log("Starting database generation...");

        for (let num = 1; num <= 24; num++) {
            for (const row of rows) {
                const tableId = `${num}${row}`;
                
                await setDoc(doc(db, "tables", tableId), {
                    tableId: tableId,
                    status: "available", 
                    reservedBy: null,
                    timerStartsAt: null
                });
                count++;
            }
        }
        alert(`Successfully created ${count} tables in Firestore!`);
    };

    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h2>Admin Setup: Initialize Database</h2>
            <p>Only click this once to generate the 144 tables in Firebase.</p>
            <button onClick={generateTables} style={{ padding: '10px 20px', background: 'red', color: 'white' }}>
                Generate Tables
            </button>
        </div>
    );
}

export default SetupDatabase;