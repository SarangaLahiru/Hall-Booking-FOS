import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPanel from './pages/AdminPanel';
import Calendar from './pages/calender';
import BookingForm from './pages/bookingForm';
import BookingCalendar from './pages/calender2';
import Home from './pages/home';
import Calender3 from './pages/calender3';
import Admin from './pages/Admin';
import Card from './components/card';

function App() {
  return (
    <Router>
      <div>

        <Routes>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin2" element={<AdminPanel />} />
          <Route path="/calendar" element={<Card />} />
          <Route path="/booking" element={<BookingForm />} />
          <Route path="/calendar2" element={<BookingCalendar />} />
          <Route path="/calendar3" element={<Calender3 />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
