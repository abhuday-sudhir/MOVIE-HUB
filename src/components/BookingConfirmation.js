import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function BookingConfirmation({ selectedSeats, selectedShow, setSelectedSeats, setSelectedShow }) {
  const navigate = useNavigate();
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    // If no seats or show selected, redirect to home
    if (!selectedSeats || selectedSeats.length === 0 || !selectedShow) {
      navigate('/');
      return;
    }

    // Create booking details for display
    setBookingDetails({
      seats: selectedSeats,
      show: selectedShow,
      totalAmount: selectedSeats.length * selectedShow.price,
      bookingTime: new Date().toLocaleString()
    });

    // Clear selections after 10 seconds or when user navigates away
    const timer = setTimeout(() => {
      setSelectedSeats([]);
      setSelectedShow(null);
    }, 10000);

    return () => clearTimeout(timer);
  }, [selectedSeats, selectedShow, navigate, setSelectedSeats, setSelectedShow]);

  const handleNewBooking = () => {
    setSelectedSeats([]);
    setSelectedShow(null);
    navigate('/');
  };

  const handleViewBookings = () => {
    navigate('/bookings');
  };

  if (!bookingDetails) {
    return (
      <div className="container">
        <div className="loading">Processing booking...</div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="container">
        <div className="confirmation">
        <h2>Booking Confirmed!</h2>
        <p>Your movie tickets have been successfully booked.</p>
        
        <div className="booking-details">
          <h3 style={{ marginBottom: '15px', color: '#333' }}>Booking Details</h3>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Movie:</strong> {bookingDetails.show.movie_title}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Show Time:</strong> {new Date(bookingDetails.show.show_time).toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit'
            })}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Screen:</strong> {bookingDetails.show.screen_name}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Seats:</strong> {bookingDetails.seats.join(', ')}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Number of Seats:</strong> {bookingDetails.seats.length}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Total Amount:</strong> ₹{bookingDetails.totalAmount}
          </div>
          
          <div style={{ marginBottom: '10px' }}>
            <strong>Booking Time:</strong> {bookingDetails.bookingTime}
          </div>
        </div>

        <p style={{ marginTop: '30px', marginBottom: '20px', color: '#666' }}>
          Enjoy your movie! Don't forget to arrive 15 minutes before showtime.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            className="submit-button"
            onClick={handleNewBooking}
          >
            Book Another Movie
          </button>
          
          <button 
            className="submit-button"
            onClick={handleViewBookings}
          >
            View All Bookings
          </button>
        </div>

        <p style={{ 
          marginTop: '20px', 
          fontSize: '0.9rem', 
          color: '#999' 
        }}>
          This booking will be automatically saved to your booking history.
        </p>
        </div>
      </div>
    </div>
  );
}

export default BookingConfirmation;