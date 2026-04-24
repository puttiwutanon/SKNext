import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import SKNext from './components/main_page/SKNext';
import News from './components/main_page/news';
import Classroom from './components/main_page/classroom';
import Profile from './components/main_page/profilePage/profile';
import Search from './components/main_page/searchPage/search';
import AboutYou from './components/main_page/profilePage/aboutYou';
import Contacts from './components/main_page/profilePage/contacts';
import Awards from './components/main_page/profilePage/awards';
import TableRevervation from './components/main_page/canteenTableRevervation/tableRevervation';
import CheerPracticeCheck from './components/main_page/cheerPracticeCheck/cheerPracticeCheck';
import SportsDayHelpCheck from './components/main_page/sportsDayhelpCheck/sportsDayHelpCheck';
import SearchStudents from './components/main_page/searchPage/searchStudents';
import SearchTeachers from './components/main_page/searchPage/searchTeachers';
import SearchDocuments from './components/main_page/searchPage/searchDocuments';
import LoginPage from './components/auth/login/loginPage';
import ProtectedRoute from './components/auth/protectedRoutes';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage/>,
  },
  {
    path: "/sknext",
    element: 
    <ProtectedRoute>
      <SKNext/>
    </ProtectedRoute>,
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
    children: [
      {
        path: "searchStudents", // Results in /profile/about-you
        element: <SearchStudents/>, // Create this component
      },
      {
        path: "searchTeachers", // Results in /profile/contact
        element: <SearchTeachers/>, // Create this component
      },
      {
        path: "searchDocuments", // Results in /profile/awards
        element: <SearchDocuments/>, // Create this component
      },
    ],
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
  {
    path: "/sportsDayHelpCheck",
    element: <SportsDayHelpCheck/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)