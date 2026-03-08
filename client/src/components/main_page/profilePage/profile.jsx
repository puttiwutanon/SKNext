import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import Sidebar from '../sidebar/sidebar';
import '../../../styles.scss'

function Profile() {
  return (
    <div className="SKNextPageContainer">
      <Sidebar />
      <div className="PageItems">
        <div className="SKNextHeader">
          <h1>บัญชีผู้ใช้</h1>
        </div>

        <div className="ProfileContainer">
          <div className="profileSidebar">
            <div>
              {/* to="about-you" will result in /profile/about-you */}
              <NavLink to="aboutYou" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fa-regular fa-circle-user"></i>
                <p>เกี่ยวกับคุณ</p>
              </NavLink>
            </div>

            <div>
              <NavLink to="contact" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fa-regular fa-address-book"></i>
                <p>ช่องทางการติดต่อคุณ</p>
              </NavLink>
            </div>

            <div>
              <NavLink to="awards" className={({ isActive }) => isActive ? 'active' : ''}>
                <i className="fa-solid fa-book-bookmark"></i>
                <p>รางวัลเพชรสวนนนท์</p>
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
  );
}

export default Profile;