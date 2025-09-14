import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircleArrowLeft, Calendar, Clock, MapPin, Ticket } from 'lucide-react';

function CinemaSelection({ selectedShow, setSelectedShow }) {
  const { cityName, movieId } = useParams();
  const navigate = useNavigate();
  const [cinemas, setCinemas] = useState([]);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchData();
  }, [cityName, movieId, selectedDate]);

  const fetchData = async () => {
    try {
      const [cinemasResponse, moviesResponse] = await Promise.all([
        axios.get(`/api/movies/${movieId}/cinemas?date=${selectedDate}`),
        axios.get('/api/movies')
      ]);
      
      // Filter cinemas by city and date
      const cityCinemas = cinemasResponse.data.filter(cinema => 
        cinema.location.includes(cityName)
      ).map(cinema => ({
        ...cinema,
        shows: cinema.shows.filter(show => {
          const showDate = new Date(show.show_time).toISOString().split('T')[0];
          return showDate === selectedDate;
        })
      })).filter(cinema => cinema.shows.length > 0);
      
      setCinemas(cityCinemas);
      
      // Find the current movie
      const currentMovie = moviesResponse.data.find(m => m.id == movieId);
      setMovie(currentMovie);
      
    } catch (err) {
      setError('Failed to load cinema information. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (show) => {
    setSelectedShow({
      ...show,
      movie_title: movie.title,
      movie_poster: movie.poster_url
    });
    navigate(`/show/${show.id}/seats`);
  };

  const formatShowTime = (showTime) => {
    const date = new Date(showTime);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const groupShowsByDate = (shows) => {
    const grouped = {};
    shows.forEach(show => {
      const date = new Date(show.show_time).toDateString();
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(show);
    });
    return grouped;
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cinemas and showtimes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <button 
          className="back-button"
          onClick={() => navigate(`/city/${cityName}/movies`)}
        >
          <CircleArrowLeft size={16} />
          Back to Movies
        </button>

      {/* Movie Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '6px',
        border: '1px solid #e1e8ed'
      }}>
        <img 
          src={movie?.poster_url} 
          alt={movie?.title}
          style={{
            width: '80px',
            height: '120px',
            borderRadius: '8px',
            objectFit: 'cover'
          }}
        />
        <div>
          <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>
            {movie?.title}
          </h2>
          <p style={{ color: '#666', margin: '0' }}>
            Select a cinema and showtime in <strong>{cityName}</strong>
          </p>
        </div>
      </div>

      {/* Date Selection */}
      <div style={{
        background: 'white',
        borderRadius: '6px',
        padding: '20px',
        marginBottom: '30px',
        border: '1px solid #e1e8ed'
      }}>
        <h3 style={{ 
          margin: '0 0 15px 0', 
          color: '#333',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <Calendar size={20} />
          Select Date
        </h3>
        
        <div style={{
          display: 'flex',
          gap: '10px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {getAvailableDates().map(date => {
            const isSelected = date === selectedDate;
            const dateObj = new Date(date);
            const isToday = date === new Date().toISOString().split('T')[0];
            
            return (
              <button
                key={date}
                className="date-picker-button"
                onClick={() => setSelectedDate(date)}
                style={{
                  padding: '10px 14px',
                  border: isSelected ? '2px solid #3498db' : '1px solid #bdc3c7',
                  borderRadius: '4px',
                  background: isSelected ? '#3498db' : 'white',
                  color: isSelected ? 'white' : '#333',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease',
                  fontWeight: 'normal',
                  minWidth: '80px',
                  fontSize: '0.9rem'
                }}
              >
                <div style={{ fontSize: '0.8rem', marginBottom: '2px' }}>
                  {dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>
                  {dateObj.getDate()}
                </div>
                <div style={{ fontSize: '0.7rem' }}>
                  {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                </div>
                {isToday && (
                  <div style={{ 
                    fontSize: '0.6rem', 
                    marginTop: '2px',
                    color: '#667eea'
                  }}>
                    Today
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <h3 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🎭 Available Cinemas & Showtimes
      </h3>
      
      {cinemas.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#666'
        }}>
          <h3>No shows available</h3>
          <p>Sorry, there are no shows for this movie in {cityName}.</p>
        </div>
      ) : (
        <div>
          {cinemas.map(cinema => (
            <div key={cinema.id} className="movie-card" style={{
              marginBottom: '25px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '15px',
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: '10px'
              }}>
                <span style={{ 
                  fontSize: '1.5rem', 
                  marginRight: '10px' 
                }}>
                  🏢
                </span>
                <div>
                  <h4 style={{ margin: '0', color: '#333' }}>
                    {cinema.name}
                  </h4>
                  <p style={{ 
                    margin: '5px 0 0 0', 
                    color: '#666',
                    fontSize: '0.9rem'
                  }}>
                    📍 {cinema.location}
                  </p>
                </div>
              </div>
              
              <div>
                <h5 style={{ 
                  color: '#333', 
                  marginBottom: '15px',
                  fontSize: '1rem'
                }}>
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h5>
                
                <div className="shows-grid">
                  {cinema.shows.map(show => (
                    <div 
                      key={show.id} 
                      className={`show-card ${selectedShow?.id === show.id ? 'selected' : ''}`}
                      onClick={() => handleShowSelect(show)}
                    >
                      <div className="show-time">{formatShowTime(show.show_time)}</div>
                      <div className="show-price">₹{show.price}</div>
                      <div className="show-screen">{show.screen_name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

export default CinemaSelection;