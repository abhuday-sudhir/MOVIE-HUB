import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MovieList({ selectedShow, setSelectedShow }) {
  const { cinemaId } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [cinemaId]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get(`/api/cinemas/${cinemaId}/movies`);
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleShowSelect = (show) => {
    setSelectedShow(show);
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

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading movies...</div>
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
    <div className="container">
      <button 
        className="back-button"
        onClick={() => navigate('/')}
      >
        <span style={{ 
          transition: 'transform 0.3s ease',
          display: 'inline-block'
        }}>
          🎭
        </span>
        Back to Cinemas
      </button>
      
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        🎬 Movies & Showtimes
      </h2>
      
      {movies.length === 0 ? (
        <div className="loading">No movies available at this cinema.</div>
      ) : (
        <div>
          {movies.map(movie => (
            <div key={movie.id} className="movie-card">
              <div className="movie-info">
                <div className="movie-details">
                  <h3>{movie.title}</h3>
                  <p><strong>Genre:</strong> {movie.genre}</p>
                  <p><strong>Duration:</strong> {movie.duration} minutes</p>
                  <p><strong>Rating:</strong> ⭐ {movie.rating}/10</p>
                  <p><strong>Description:</strong> {movie.description}</p>
                </div>
              </div>
              
              <h4 style={{ marginBottom: '15px', color: '#333' }}>Available Shows:</h4>
              <div className="shows-grid">
                {movie.shows.map(show => (
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
          ))}
        </div>
      )}
    </div>
  );
}

export default MovieList;