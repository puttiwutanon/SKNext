import React from 'react'

function Rooms({ selectedRoom, onSelectRoom, dbRooms }) {
  const rooms = ['R1', 'R2', 'R3', 'R4'];

  return (
    <div className="room-grid">
        {rooms.map((code) => {
                return (
                <div
                    key={code}
                    className={`room-slot ${status} ${selectedRoom === code ? 'selected' : ''}`}
                    onClick={() => {
                        // กันคนพิเรนเลือกโต๊ะที่มีคนใช้
                        if(status === 'available') {
                            onSelectRoom(selectedRoom === code ? null : code);
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

export default Rooms