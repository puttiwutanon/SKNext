import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function TableReservationRow5({ selectedTable, onSelectTable, dbTables }) {
  const tables = [
    '1E','2E','3E','4E','5E','6E','7E','8E','9E','10E',
    '11E','12E','13E','14E','15E','16E','17E','18E','19E','20E',
    '21E','22E','23E','24E'
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

export default TableReservationRow5