import React from 'react'
import ReactDOM from 'react-dom/client'
import Login from './pages/Login.tsx'
import Home from './pages/Home.tsx'
import CreateTask from './pages/CreateTask.tsx'
import EditTask from './pages/EditTask.tsx'
import Settings from './pages/Settings.tsx'
import EditSettings from './pages/EditSettings.tsx'
import SimpleSelect from './components/Sample.tsx'

import { BrowserRouter, Routes, Route  } from 'react-router-dom'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/home/:id' element={<Home />} />
      <Route path='/create-task/' element={<CreateTask />} />
      <Route path='edit-task/:id' element={<EditTask />} />
      <Route path='settings/:id' element={<Settings />} />
      <Route path='edit-settings/:id' element={<EditSettings />} />
    </Routes>
  </BrowserRouter>
)
