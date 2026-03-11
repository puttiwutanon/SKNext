import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function TableReservationRow2({ selectedTable, onSelectTable }) {
  const tables = [
    '1B','2B','3B','4B','5B','6B','7B','8B','9B','10B',
    '11B','12B','13B','14B','15B','16B','17B','18B','19B','20B',
    '21B','22B','23B','24B'
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

export default TableReservationRow2