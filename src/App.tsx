import React from 'react'
import './App.css'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import EventList from './pages/events/EventList'
import EventForm from './pages/events/EventForm'
import EventDetails from './pages/events/EventDetails'
import { BrowserRouter as Router, Route, Routes, useParams, } from 'react-router-dom';



function App() {
  // const { eventId } = useParams<{ eventId: string }>();
  // // Pastikan eventId ada dan dapat diubah menjadi number
  // const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;
  // console.log(eventId)

  return (
    <Router>
      <Routes>
        <Route path="/users" element={<UserList />} />
        <Route path="/user/new" element={<UserForm />} />
        <Route path="/user/edit/:userId" element={<UserForm />} />
        <Route path="/events" element={<EventList />} />
        <Route path="/event/:eventId" element={<EventDetails />} />
        <Route path="/event/:eventId/edit" element={<EventForm />} />
      </Routes>
    </Router>
  )
}

export default App