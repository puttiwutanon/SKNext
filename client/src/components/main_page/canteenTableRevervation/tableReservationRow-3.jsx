import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function TableReservationRow3({ selectedTable, onSelectTable }) {
  const tables = [
    '1C','2C','3C','4C','5C','6C','7C','8C','9C','10C',
    '11C','12C','13C','14C','15C','16C','17C','18C','19C','20C',
    '21C','22C','23C','24C'
  ];

  return (
    <div className="table-grid">
      {tables.map((code) => (
        <div
          key={code}
          className={`table-slot ${selectedTable === code ? 'selected' : ''}`}
          onClick={() => onSelectTable(selectedTable === code ? null : code)}
        >
          <button>
            <p>{code}</p>
          </button>
        </div>
      ))}
    </div>
  )
}

export default TableReservationRow3