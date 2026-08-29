import React from 'react';

const SearchResultCard = ({ flight, onBookNow }) => {
  return (
    <div style={styles.card} className="fade-in">
      <h4 style={styles.flightTitle}>Flight Name: {flight.airline} {flight.code.split('-')[1] || '202'}</h4>
      <p style={styles.routeText}>{flight.from} to {flight.to}</p>
      
      <div style={styles.metaBlock}>
        <p style={styles.metaText}>
          <span style={styles.label}>Departure Time: </span>
          January 21, 2025 at {flight.departureTime}
        </p>
        <p style={styles.metaText}>
          <span style={styles.label}>Arrival Time: </span>
          January 23, 2025 at {flight.arrivalTime}
        </p>
      </div>

      <h3 style={styles.priceText}>₹{flight.price * 10}</h3>

      <button style={styles.bookNowBtn} onClick={() => onBookNow(flight)}>
        Book Now
      </button>
    </div>
  );
};

const styles = {
  card: {
    width: '280px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '10px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  flightTitle: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
    margin: 0
  },
  routeText: {
    fontSize: '14px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '4px'
  },
  metaBlock: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  metaText: {
    fontSize: '12px',
    color: '#475569',
    lineHeight: '1.4'
  },
  label: {
    color: '#64748b'
  },
  priceText: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#0f172a',
    marginTop: '6px',
    marginBottom: '6px'
  },
  bookNowBtn: {
    width: '100%',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '700',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'center'
  }
};

export default SearchResultCard;
