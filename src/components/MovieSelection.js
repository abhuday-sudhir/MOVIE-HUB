import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CircleArrowLeft, Star, Clock, Ticket, Play } from 'lucide-react';

function MovieSelection() {
  const { cityName } = useParams();
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMovies();
  }, [cityName]);

  const fetchMovies = async () => {
    try {
      const response = await axios.get('/api/movies');
      setMovies(response.data);
    } catch (err) {
      setError('Failed to load movies. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMovieSelect = (movieId) => {
    navigate(`/city/${cityName}/movie/${movieId}/cinemas`);
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
    <div className="main-content">
      <div className="container">
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <CircleArrowLeft size={16} />
          Back to Cities
        </button>

        <h2 style={{ 
          textAlign: 'center', 
          marginBottom: '8px', 
          color: '#333',
          fontSize: '2rem',
          fontWeight: '600'
        }}>
          Top movies near you
        </h2>
        
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          color: '#666',
          fontSize: '1rem'
        }}>
          Select a movie to see available cinemas and showtimes
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          marginBottom: '30px',
          maxWidth: '100%',
          margin: '0 auto 30px auto'
        }}>
        {movies.map(movie => (
          <div key={movie.id} className="movie-card" style={{
            cursor: 'pointer',
            display: 'flex',
            gap: '20px',
            alignItems: 'flex-start',
            padding: '20px'
          }}
          onClick={() => handleMovieSelect(movie.id)}>
            <div style={{
              display: 'flex',
              gap: '20px',
              alignItems: 'flex-start',
              width: '100%'
            }}>
              <div style={{
                flexShrink: 0,
                width: '100px',
                height: '150px',
                borderRadius: '10px',
                overflow: 'hidden',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
              }}>
                <img 
                  src={movie.poster_url} 
                  alt={movie.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: '#f8f9fa',
                  display: 'none',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '1.2rem',
                  border: '2px dashed #ddd'
                }}>
                  No Image
                </div>
              </div>
              
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  color: '#333', 
                  marginBottom: '10px', 
                  fontSize: '1.4rem',
                  lineHeight: '1.3'
                }}>
                  {movie.title}
                </h3>
                
                <div style={{ marginBottom: '15px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '12px'
                }}>
                  <span style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={12} fill="white" />
                    {movie.rating}/10
                  </span>
                  <span style={{
                    background: '#f3f4f6',
                    color: '#374151',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.85rem',
                    fontWeight: '500'
                  }}>
                    {movie.language}
                  </span>
                </div>
                  
                  <p style={{ 
                    color: '#666', 
                    margin: '5px 0',
                    fontSize: '0.9rem'
                  }}>
                    <strong>Genre:</strong> {movie.genre}
                  </p>
                  <p style={{ 
                    color: '#666', 
                    margin: '5px 0',
                    fontSize: '0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Clock size={14} />
                    <strong>Duration:</strong> {movie.duration} minutes
                  </p>
                </div>
                
                <p style={{ 
                  color: '#666', 
                  marginBottom: '20px',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  {movie.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                  <button 
                    className="cinema-button"
                    style={{
                      padding: '12px 24px',
                      fontSize: '1rem',
                      fontWeight: '600',
                      minWidth: '150px',
                      background: '#8b5cf6',
                      border: 'none',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Ticket size={18} />
                    Book Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

export default MovieSelection;