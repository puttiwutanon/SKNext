import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function TableReservationRow6({ selectedTable, onSelectTable, dbTables }) {
  const tables = [
    '1F','2F','3F','4F','5F','6F','7F','8F','9F','10F',
    '11F','12F','13F','14F','15F','16F','17F','18F','19F','20F',
    '21F','22F','23F','24F'
  ];

  return (
    <div className="table-grid">
      {tables.map((code) => {
              const status = dbTables[code]?.status || 'available';
              return (
                <div
                  key={code}
                  className={`table-slot ${status} ${selectedTable === code ? 'selected' : ''}`}
                  onClick={() => {
                      // กันคนพิเรนเลือกโต๊ะที่มีคนใช้
                      if(status === 'available') {
                        onSelectTable(selectedTable === code ? null : code);
                      }
                  }}
                >
                  <button className={`status-${status}`}>
                    <p>{code}</p>
                  </button>
                </div>
              );
        })}
    </div>
  )
}

export default TableReservationRow6