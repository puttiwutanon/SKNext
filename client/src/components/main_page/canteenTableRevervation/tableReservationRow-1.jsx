import React from 'react'

function TableReservationRow1({ selectedTable, onSelectTable }) {
  const tables = [
    '1A','2A','3A','4A','5A','6A','7A','8A','9A','10A',
    '11A','12A','13A','14A','15A','16A','17A','18A','19A','20A',
    '21A','22A','23A','24A'
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

export default TableReservationRow1