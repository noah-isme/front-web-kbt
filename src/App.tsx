import React from 'react'
import './App.css'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import EventList from './pages/events/EventList'
import EventForm from './pages/events/EventForm'
import EventDetails from './pages/events/EventDetails'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';



function App() {


  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/user/new" element={<UserForm />} />
        <Route path="/user/edit/:userId" element={<UserForm />} />
      </Routes>
    </Router>
  )
}

export default App