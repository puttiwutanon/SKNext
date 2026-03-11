import React from 'react'
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'
import { NavLink, Outlet } from 'react-router-dom';

function Search() {
  return (
    <>
      <div className="SKNextPageContainer">
        <Sidebar />
        <div className="PageItems" style={{width: '100%'}}>
          <div className="SKNextHeader">
            <h1>ค้นหา</h1>
          </div>

          <div className="ProfileContainer">
            <div className="profileSidebar">
              <div>
                {/* to="about-you" will result in /profile/about-you */}
                <NavLink to="searchStudents" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i class="fa-solid fa-child"></i>
                  <p>นักเรียน</p>
                </NavLink>
              </div>

              <div>
                <NavLink to="searchTeachers" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i class="fa-solid fa-chalkboard-user"></i>
                  <p>ครู</p>
                </NavLink>
              </div>

              <div>
                <NavLink to="searchDocuments" className={({ isActive }) => isActive ? 'active' : ''}>
                  <i class="fa-solid fa-file"></i>
                  <p>เอกสาร</p>
                </NavLink>
              </div>
            </div>

            <div className="profileInfo">
              {/* THIS IS WHERE THE SUB-COMPONENTS WILL LOAD */}
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Search