import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import SKNext from './components/main_page/SKNext';
import News from './components/main_page/news';
import Classroom from './components/main_page/classroom';
import Profile from './components/main_page/profilePage/profile';
import Search from './components/main_page/search';
import AboutYou from './components/main_page/profilePage/aboutYou';
import Contacts from './components/main_page/profilePage/contacts';
import Awards from './components/main_page/profilePage/awards';
import TableRevervation from './components/main_page/canteenTableRevervation/tableRevervation';
import CheerPracticeCheck from './components/main_page/cheerPracticeCheck/cheerPracticeCheck';

const router = createBrowserRouter([
  {
    path: "/",
    element: <SKNext/>,
  },
  {
    path: "/news",
    element: <News/>,
  },
  {
    path: "/classroom",
    element: <Classroom/>,
  },
  {
    path: "/search",
    element: <Search/>,
  },
  {
    path: "/profile",
    element: <Profile/>,
    children: [
      {
        path: "aboutYou", // Results in /profile/about-you
        element: <AboutYou />, // Create this component
      },
      {
        path: "contact", // Results in /profile/contact
        element: <Contacts/>, // Create this component
      },
      {
        path: "awards", // Results in /profile/awards
        element: <Awards/>, // Create this component
      },
    ],
  },
  {
    path: "/SKNext",
    element: <SKNext/>,
  },
  {
    path: "/tableRevervation",
    element: <TableRevervation/>,
  },
  {
    path: "/cheerPracticeCheck",
    element: <CheerPracticeCheck/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)