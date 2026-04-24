import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function TableReservationRow4({ selectedTable, onSelectTable, dbTables }) {
  const tables = [
    '1D','2D','3D','4D','5D','6D','7D','8D','9D','10D',
    '11D','12D','13D','14D','15D','16D','17D','18D','19D','20D',
    '21D','22D','23D','24D'
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

export default TableReservationRow4