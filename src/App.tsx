import React from 'react'
import './App.css'
import UserList from './pages/users/UserList'
import UserForm from './pages/users/UserForm'
import EventList from './pages/events/EventList'
import EventForm from './pages/events/EventForm'
import EventDetails from './pages/events/EventDetails'
import LocationMap from './components/LocationMap'
import { BrowserRouter as Router, Route, Routes, } from 'react-router-dom';
import LiveLocationMap from './components/LiveLocationMap'



function App() {
  // const { eventId } = useParams<{ eventId: string }>();
  // // Pastikan eventId ada dan dapat diubah menjadi number
  // const eventIdNumber = eventId ? parseInt(eventId, 10) : 0;
  // console.log(eventId)

  return (
    // <Router>
    //   <Routes>
    //     <Route path="/users" element={<UserList />} />
    //     <Route path="/user/new" element={<UserForm />} />
    //     <Route path="/user/edit/:userId" element={<UserForm />} />
    //     <Route path="/events" element={<EventList />} />
    //     <Route path="/event/:eventId" element={<EventDetails />} />
    //     <Route path="/event/:eventId/edit" element={<EventForm />} />
    //     <Route path="/maps" element={<LocationMap />} />
    //   </Routes>
    // </Router>
    <div>
      <h1>Live Location Simulation</h1>
      <LiveLocationMap />
    </div>
  )
}

export default App