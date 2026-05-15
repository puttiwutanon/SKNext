import React from 'react'

function Activities() {
  return (
    <>
        <div className="activitiesContainer">
            <div className="activityItem">
                <h3>การเช็คชื่อเข้าซ้อมเชียร์</h3>
                <a href="/cheerPracticeCheck">ดูการเช็คชื่อ</a>
            </div>

            <div className="activityItem">
                <h3>การเช็คชื่อเข้าช่วยงานกีฬาสี</h3>
                <a href="/sportsDayHelpCheck">ดูการเช็คชื่อ</a>
            </div>

            <div className="activityItem">
                <h3>การจองโต๊ะในโรงอาหาร</h3>
                <a href="/tableRevervation">จองโต๊ะ</a>
            </div>

            <div className="activityItem">
                <h3>การจองห้องใน SKN inspire</h3>
                <a href="/roomReservation">จองห้อง</a>
            </div>
        </div>
    </>
  )
}

export default Activities