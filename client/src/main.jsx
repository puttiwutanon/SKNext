import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import SKNext from './components/main_page/sidebar/SKNext';
import News from './components/main_page/sidebar/news';
import Classroom from './components/main_page/sidebar/classroom';
import Services from './components/main_page/sidebar/services';
import Profile from './components/main_page/sidebar/profile';

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
    path: "/services",
    element: <Services/>,
  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/SKNext",
    element: <SKNext/>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)