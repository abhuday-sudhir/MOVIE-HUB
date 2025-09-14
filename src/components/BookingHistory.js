import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Calendar, Clock, MapPin, Ticket, CheckCircle, XCircle } from 'lucide-react';

function BookingHistory({ currentUser }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchBookings();
    }
  }, [currentUser]);

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`/api/users/${currentUser.id}/bookings`);
      setBookings(response.data);
    } catch (err) {
      setError('Failed to load booking history. Please try again.');
    } finally {
      setLoading(false);
    }
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

  const formatBookingTime = (bookingTime) => {
    const date = new Date(bookingTime);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const isUpcomingShow = (showTime) => {
    return new Date(showTime) > new Date();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading booking history...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button 
          className="back-button"
          onClick={() => navigate('/')}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>
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
          <ArrowLeft size={16} />
          Back to Home
        </button>

      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>
        My Booking History
      </h2>

      {bookings.length === 0 ? (
        <div className="booking-history">
          <div style={{ 
            textAlign: 'center', 
            padding: '40px',
            color: '#666'
          }}>
            <h3>No bookings found</h3>
            <p>You haven't made any bookings yet.</p>
            <button 
              className="submit-button"
              onClick={() => navigate('/')}
              style={{ marginTop: '20px' }}
            >
              Start Booking Movies!
            </button>
          </div>
        </div>
      ) : (
        <div className="booking-history">
          {bookings.map(booking => (
            <div key={booking.booking_id} className="booking-item">
              <h4>{booking.movie_title}</h4>
              
              <div className="booking-meta">
                <span><strong>Cinema:</strong> {booking.cinema_name}</span>
                <span><strong>Screen:</strong> {booking.screen_name}</span>
                <span><strong>Show Time:</strong> {formatShowTime(booking.show_time)}</span>
                <span><strong>Seats:</strong> {booking.seats.join(', ')}</span>
              </div>
              
              <div className="booking-meta">
                <span><strong>Total Amount:</strong> ₹{booking.total_amount}</span>
                <span><strong>Booking Date:</strong> {formatBookingTime(booking.booking_time)}</span>
                <span 
                  style={{
                    color: isUpcomingShow(booking.show_time) ? '#28a745' : '#6c757d',
                    fontWeight: 'bold'
                  }}
                >
                  {isUpcomingShow(booking.show_time) ? 'Upcoming' : 'Past Show'}
                </span>
              </div>

              {isUpcomingShow(booking.show_time) && (
                <div style={{ 
                  marginTop: '10px',
                  padding: '10px',
                  backgroundColor: '#d4edda',
                  borderRadius: '5px',
                  border: '1px solid #c3e6cb'
                }}>
                  <p style={{ 
                    color: '#155724', 
                    margin: 0,
                    fontSize: '0.9rem'
                  }}>
                    Don't forget to arrive 15 minutes before showtime!
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div style={{ 
        textAlign: 'center', 
        marginTop: '30px',
        color: '#666'
      }}>
        <p>Total Bookings: {bookings.length}</p>
        <p>Total Amount Spent: ₹{bookings.reduce((sum, booking) => sum + booking.total_amount, 0)}</p>
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;