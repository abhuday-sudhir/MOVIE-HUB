import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import './index.css';

// Components
import Header from './components/Header';
import CitySelection from './components/CitySelection';
import MovieSelection from './components/MovieSelection';
import CinemaSelection from './components/CinemaSelection';
import SeatSelection from './components/SeatSelection';
import BookingConfirmation from './components/BookingConfirmation';
import BookingHistory from './components/BookingHistory';
import UserForm from './components/UserForm';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUserLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <div className="App">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout}
        />
        
        <Routes>
          <Route 
            path="/" 
            element={
              currentUser ? 
                <CitySelection /> : 
                <UserForm onUserLogin={handleUserLogin} />
            } 
          />
          <Route 
            path="/city/:cityName/movies" 
            element={
              currentUser ? 
                <MovieSelection /> : 
                <UserForm onUserLogin={handleUserLogin} />
            } 
          />
          <Route 
            path="/city/:cityName/movie/:movieId/cinemas" 
            element={
              currentUser ? 
                <CinemaSelection 
                  selectedShow={selectedShow}
                  setSelectedShow={setSelectedShow}
                /> : 
                <UserForm onUserLogin={handleUserLogin} />
            } 
          />
          <Route 
            path="/show/:showId/seats" 
            element={
              currentUser ? 
                <SeatSelection 
                  selectedSeats={selectedSeats}
                  setSelectedSeats={setSelectedSeats}
                  selectedShow={selectedShow}
                  setSelectedShow={setSelectedShow}
                  currentUser={currentUser}
                /> : 
                <UserForm onUserLogin={handleUserLogin} />
            } 
          />
          <Route 
            path="/booking/confirmation" 
            element={
              currentUser ? 
                <BookingConfirmation 
                  selectedSeats={selectedSeats}
                  selectedShow={selectedShow}
                  setSelectedSeats={setSelectedSeats}
                  setSelectedShow={setSelectedShow}
                /> : 
                <UserForm onUserLogin={handleUserLogin} />
            } 
          />
          <Route 
            path="/bookings" 
            element={
              currentUser ? 
                <BookingHistory currentUser={currentUser} /> : 
                <UserForm onUserLogin={handleUserLogin} />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;