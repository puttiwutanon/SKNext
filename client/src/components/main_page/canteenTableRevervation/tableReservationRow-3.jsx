import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'
  
function TableReservationRow3({ selectedTable, onSelectTable, dbTables }) {
  const tables = [
    '1C','2C','3C','4C','5C','6C','7C','8C','9C','10C',
    '11C','12C','13C','14C','15C','16C','17C','18C','19C','20C',
    '21C','22C','23C','24C'
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

export default TableReservationRow3