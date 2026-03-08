import React from 'react'
import Sidebar from './sidebar/sidebar'
import '../../styles.scss'

function SKNext() {
  return (
    <>
      <div className="SKNextPageContainer">
        <Sidebar />
        <div className="PageItems">
          <div className="SKNextHeader">
            <h1>SKNext</h1>
          </div>

          <div class="schedule-container">
            <h2>ตารางเรียน (Class Schedule)</h2>
            
            <div class="schedule-grid">
              <div class="corner"></div>
              
              <div class="time-header">1 <span>08:30-09:20</span></div>
              <div class="time-header">2 <span>09:20-10:10</span></div>
              <div class="time-header">3 <span>10:10-11:00</span></div>
              <div class="time-header">4 <span>11:00 -11:50</span></div>
              <div class="time-header">5 <span>11:50 -12:40</span></div>
              <div class="time-header">6 <span>12:40 -13:30</span></div>
              <div class="time-header">7 <span>13:30 -14:20</span></div>
              <div class="time-header">8 <span>14:20 -15:10</span></div>
              <div class="time-header">9 <span>15:10 -16:00</span></div>
              <div class="time-header">10 <span>16:00 -16:50</span></div>

              <div class="day-label">วันจันทร์ <span>9 มีนาคม</span></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 

              <div class="day-label">วันอังคาร <span>10 มีนาคม</span></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div>

              <div class="day-label">วันพุธ <span>11 มีนาคม</span></div> 
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div>

              <div class="day-label">วันพฤหัสบดี <span>12 มีนาคม</span></div>
                <div class="slot"></div>  
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>
                <div class="slot"></div>

              <div class="day-label">วันศุกร์ <span>13 มีนาคม</span></div>
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
                <div class="slot"></div> 
             </div>
            </div> 

            <div className="subjects">
              <h2>รายชื่อวิชา</h2>
            </div>

            <div className="activities">
              <h2>รายชื่อกิจกรรม</h2>

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
              </div>
            </div>
          </div>

      </div>
    </>
  )
}

export default SKNext