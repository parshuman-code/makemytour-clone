import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plane, Luggage, Clock, ShieldCheck, Tag, ArrowLeft, CheckCircle2, AlertCircle, Info, Sparkles, TrendingUp, Lock 
} from 'lucide-react';
import PriceHistoryModal from '../components/PriceHistoryModal';
import PriceFreezeModal from '../components/PriceFreezeModal';
import { calculateDynamicPrice, isFlightPriceFrozen } from '../utils/pricingEngine';

const availableCoupons = [
  { code: 'MMTCURE', title: 'Flat 20% Discount', discount: 0.20, desc: 'Applicable on all international & domestic routes' },
  { code: 'SPECIALUPI', title: 'Flat ₹500 Off', discount: 500, isFixed: true, desc: 'Instant savings with UPI or Card payments' },
  { code: 'HOLIDAYFUN', title: 'Super Saver ₹1000', discount: 1000, isFixed: true, desc: 'Special promo for holiday season bookings' }
];

const FlightDetailsPage = ({ flights, onBookFlight }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  const flight = flights.find(f => (f.id === id || f._id === id || f.code === id)) || flights[0];

  const flightId = flight._id || flight.id || flight.code || 'FL-202';
  const frozenObj = isFlightPriceFrozen(flightId);

  // Dynamic pricing calculation
  const dynamic = flight.dynamicPricing || calculateDynamicPrice(flight.price || 5500, {
    seatsAvailable: flight.availableSeats || flight.seatsAvailable || 20,
    isHolidaySeason: false
  });

  const activePrice = frozenObj ? frozenObj.lockedPrice : dynamic.finalPrice;
  const baseFare = frozenObj ? frozenObj.lockedPrice : dynamic.basePrice;
  const surgeAmount = frozenObj ? 0 : dynamic.surgeAmount;

  const taxes = Math.round(activePrice * 0.12);
  const otherServices = 250;
  
  let discountAmount = 0;
  if (selectedCoupon) {
    if (selectedCoupon.isFixed) {
      discountAmount = selectedCoupon.discount;
    } else {
      discountAmount = Math.round(activePrice * selectedCoupon.discount);
    }
  }

  const finalTotal = Math.max(0, activePrice + taxes + otherServices - discountAmount);

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Back Link */}
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={18} />
          <span>Back to Search Results</span>
        </button>

        {/* Header Title Card */}
        <div style={styles.heroCard}>
          <div style={styles.heroLeft}>
            <div style={styles.flightIcon}>{flight.logo || '✈️'}</div>
            <div>
              <div className="flex items-center gap-2">
                <h2 style={styles.flightTitle}>{flight.airline || flight.flightName} ({flight.code || flight.flightNumber})</h2>
                {frozenObj && (
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Price Frozen
                  </span>
                )}
              </div>
              <p style={styles.routeSubtitle}>
                {flight.from.replace('_', ', ')} ➔ {flight.to.replace('_', ', ')} • {flight.duration} ({flight.stops})
              </p>
            </div>
          </div>

          <div style={styles.heroRight}>
            <button
              onClick={() => setShowHistoryModal(true)}
              className="px-3.5 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
            >
              <TrendingUp className="w-4 h-4 text-slate-600" />
              Price Graph
            </button>

            {!frozenObj && (
              <button
                onClick={() => setShowFreezeModal(true)}
                className="px-3.5 py-2 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-extrabold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-rose-600" />
                Freeze Price (₹199)
              </button>
            )}

            <span style={styles.ratingBadge}>★ {flight.rating || 4.8} / 5</span>
          </div>
        </div>

        {/* Dynamic Pricing Alert Widget */}
        <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between border border-indigo-900/40 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-extrabold uppercase text-indigo-300 tracking-wider">
                Real-Time Dynamic Pricing Engine
              </h4>
              <p className="text-xs text-slate-300 font-semibold mt-0.5">
                {frozenObj ? (
                  `Price locked at ₹${frozenObj.lockedPrice.toLocaleString('en-IN')}. Protected against demand fluctuations.`
                ) : (
                  `Dynamic surge breakdown: Base fare ₹${baseFare.toLocaleString('en-IN')}${surgeAmount > 0 ? ` + Dynamic demand multiplier ₹${surgeAmount.toLocaleString('en-IN')}` : ' (Standard Fare)'}`
                )}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-slate-400 block font-medium">Effective Passenger Fare</span>
            <span className="text-xl font-black text-white">₹{activePrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Main Grid: Left Detailed Itinerary & Right Fare Breakdown */}
        <div style={styles.mainGrid}>
          {/* Left Panel */}
          <div style={styles.leftPanel}>
            {/* Tabs for Itinerary, Baggage, Policy */}
            <div style={styles.tabHeader}>
              <button 
                style={{
                  ...styles.tabBtn,
                  borderBottom: activeTab === 'itinerary' ? '3px solid var(--accent-red)' : '3px solid transparent',
                  color: activeTab === 'itinerary' ? 'var(--accent-red)' : '#64748b'
                }}
                onClick={() => setActiveTab('itinerary')}
              >
                Flight Itinerary
              </button>
              <button 
                style={{
                  ...styles.tabBtn,
                  borderBottom: activeTab === 'baggage' ? '3px solid var(--accent-red)' : '3px solid transparent',
                  color: activeTab === 'baggage' ? 'var(--accent-red)' : '#64748b'
                }}
                onClick={() => setActiveTab('baggage')}
              >
                Baggage Policy
              </button>
              <button 
                style={{
                  ...styles.tabBtn,
                  borderBottom: activeTab === 'cancellation' ? '3px solid var(--accent-red)' : '3px solid transparent',
                  color: activeTab === 'cancellation' ? 'var(--accent-red)' : '#64748b'
                }}
                onClick={() => setActiveTab('cancellation')}
              >
                Cancellation Rules
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'itinerary' && (
              <div style={styles.cardContent} className="fade-in">
                <div style={styles.routeTimeline}>
                  <div style={styles.timelineNode}>
                    <div style={styles.timeBox}>
                      <span style={styles.timeBig}>{flight.departureTime}</span>
                      <span style={styles.terminalText}>{flight.terminalDep || 'Terminal 2E'}</span>
                    </div>
                    <div style={styles.cityBox}>
                      <h4 style={styles.cityTitle}>{flight.from.replace('_', ', ')}</h4>
                      <span style={styles.airportSub}>International Airport</span>
                    </div>
                  </div>

                  <div style={styles.timelineMiddle}>
                    <div style={styles.durationLine}>
                      <Clock size={14} color="#64748b" />
                      <span>{flight.duration} • Direct Flight</span>
                    </div>
                  </div>

                  <div style={styles.timelineNode}>
                    <div style={styles.timeBox}>
                      <span style={styles.timeBig}>{flight.arrivalTime}</span>
                      <span style={styles.terminalText}>{flight.terminalArr || 'Terminal 3'}</span>
                    </div>
                    <div style={styles.cityBox}>
                      <h4 style={styles.cityTitle}>{flight.to.replace('_', ', ')}</h4>
                      <span style={styles.airportSub}>Destination Airport</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'baggage' && (
              <div style={styles.cardContent} className="fade-in">
                <div style={styles.policyRow}>
                  <Luggage size={24} color="var(--accent-red)" />
                  <div>
                    <h5 style={styles.policyTitle}>Cabin Baggage</h5>
                    <p style={styles.policyDesc}>{flight.baggage?.cabin || '7 Kgs'} per passenger allowed in overhead bin</p>
                  </div>
                </div>
                <div style={{ ...styles.policyRow, borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <Luggage size={24} color="var(--primary-navy)" />
                  <div>
                    <h5 style={styles.policyTitle}>Check-in Baggage</h5>
                    <p style={styles.policyDesc}>{flight.baggage?.checkIn || '15 Kgs'} per passenger included in fare</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'cancellation' && (
              <div style={styles.cardContent} className="fade-in">
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <ShieldCheck size={26} color="#16a34a" />
                  <div>
                    <h5 style={styles.policyTitle}>Cancellation Policy</h5>
                    <p style={styles.policyDesc}>{flight.cancellation || 'Refundable fare with standard cancellation fee'}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Promo Codes Selector Widget */}
            <div style={styles.promoWidget}>
              <h4 style={styles.promoTitle}>
                <Sparkles size={16} color="var(--accent-red)" />
                PROMO CODES & COUPONS
              </h4>

              <div style={styles.couponList}>
                {availableCoupons.map((coupon) => {
                  const isApplied = selectedCoupon?.code === coupon.code;
                  return (
                    <div 
                      key={coupon.code}
                      style={{
                        ...styles.couponCard,
                        border: isApplied ? '2px solid var(--accent-red)' : '1px solid #e2e8f0',
                        backgroundColor: isApplied ? 'rgba(229, 57, 53, 0.04)' : '#ffffff'
                      }}
                    >
                      <div>
                        <div style={styles.couponCodeHeader}>
                          <span style={styles.couponCodeTag}>{coupon.code}</span>
                          <span style={styles.couponTitle}>{coupon.title}</span>
                        </div>
                        <p style={styles.couponDesc}>{coupon.desc}</p>
                      </div>

                      <button 
                        style={{
                          ...styles.applyBtn,
                          backgroundColor: isApplied ? '#16a34a' : 'var(--primary-navy)',
                          color: '#ffffff'
                        }}
                        onClick={() => setSelectedCoupon(isApplied ? null : coupon)}
                      >
                        {isApplied ? 'APPLIED ✓' : 'APPLY'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Panel: Fare Summary */}
          <div style={styles.rightPanel}>
            <div style={styles.fareCard}>
              <h3 style={styles.fareTitle}>Fare Summary</h3>

              <div style={styles.fareList}>
                <div style={styles.fareRow}>
                  <span>Base Fare</span>
                  <span>₹{baseFare.toLocaleString('en-IN')}</span>
                </div>

                {surgeAmount > 0 && !frozenObj && (
                  <div style={{ ...styles.fareRow, color: '#e53935' }}>
                    <span>Dynamic Demand Surge</span>
                    <span>+₹{surgeAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                {frozenObj && (
                  <div style={{ ...styles.fareRow, color: '#16a34a' }}>
                    <span>Price Freeze Guarantee</span>
                    <span>LOCKED</span>
                  </div>
                )}

                <div style={styles.fareRow}>
                  <span>Taxes & Surcharges (12%)</span>
                  <span>₹{taxes.toLocaleString('en-IN')}</span>
                </div>
                <div style={styles.fareRow}>
                  <span>Seat & Services Fee</span>
                  <span>₹{otherServices.toLocaleString('en-IN')}</span>
                </div>

                {selectedCoupon && (
                  <div style={{ ...styles.fareRow, color: '#16a34a', fontWeight: '700' }}>
                    <span>Promo Discount ({selectedCoupon.code})</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div style={styles.totalRow}>
                  <span>Total Amount</span>
                  <span style={styles.totalPrice}>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button 
                style={styles.bookNowBtn}
                onClick={() => onBookFlight({ ...flight, price: activePrice }, 1)}
              >
                Book Now (₹{finalTotal.toLocaleString('en-IN')})
              </button>

              <div style={styles.secureBadge}>
                <ShieldCheck size={14} color="#16a34a" />
                <span>100% Safe & Secure Booking</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showHistoryModal && (
        <PriceHistoryModal
          flight={flight}
          onClose={() => setShowHistoryModal(false)}
          onFreezePrice={() => setShowFreezeModal(true)}
        />
      )}

      {showFreezeModal && (
        <PriceFreezeModal
          flight={flight}
          onClose={() => setShowFreezeModal(false)}
          onConfirmFreeze={() => {
            setShowFreezeModal(false);
          }}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: 'var(--bg-main)',
    padding: '32px 24px'
  },
  wrapper: {
    maxWidth: '1200px',
    margin: '0 auto'
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: 'transparent',
    color: 'var(--text-muted)',
    fontSize: '14px',
    fontWeight: '700',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  heroCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    padding: '24px 32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: 'var(--shadow-sm)',
    marginBottom: '24px',
    border: '1px solid var(--border-color)',
    flexWrap: 'wrap',
    gap: '16px'
  },
  heroLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  flightIcon: {
    fontSize: '32px',
    backgroundColor: '#f1f5f9',
    width: '54px',
    height: '54px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  flightTitle: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--text-dark)'
  },
  routeSubtitle: {
    fontSize: '14px',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  heroRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  ratingBadge: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
    fontWeight: '800',
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '20px'
  },
  seatsBadge: {
    backgroundColor: '#fee2e2',
    color: '#e53935',
    fontWeight: '700',
    fontSize: '13px',
    padding: '6px 14px',
    borderRadius: '20px'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '24px',
    alignItems: 'flex-start'
  },
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  tabHeader: {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
    borderBottom: '1px solid #e2e8f0',
    padding: '0 20px'
  },
  tabBtn: {
    backgroundColor: 'transparent',
    padding: '16px 20px',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer'
  },
  cardContent: {
    backgroundColor: '#ffffff',
    borderRadius: '0 0 var(--radius-md) var(--radius-md)',
    padding: '28px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)',
    marginTop: '-24px'
  },
  routeTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  timelineNode: {
    display: 'flex',
    alignItems: 'center',
    gap: '30px'
  },
  timeBox: {
    minWidth: '130px'
  },
  timeBig: {
    fontSize: '22px',
    fontWeight: '800',
    color: 'var(--text-dark)',
    display: 'block'
  },
  terminalText: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  cityBox: {},
  cityTitle: {
    fontSize: '18px',
    fontWeight: '700'
  },
  airportSub: {
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  timelineMiddle: {
    paddingLeft: '40px',
    borderLeft: '2px dashed var(--accent-red)',
    margin: '4px 0 4px 60px'
  },
  durationLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '13px',
    color: 'var(--text-muted)',
    fontWeight: '600'
  },
  policyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '8px 0'
  },
  policyTitle: {
    fontSize: '15px',
    fontWeight: '700'
  },
  policyDesc: {
    fontSize: '13px',
    color: 'var(--text-muted)'
  },
  promoWidget: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-sm)',
    border: '1px solid var(--border-color)'
  },
  promoTitle: {
    fontSize: '15px',
    fontWeight: '800',
    color: 'var(--text-dark)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  couponList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  couponCard: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    borderRadius: 'var(--radius-md)',
    transition: 'all 0.2s ease'
  },
  couponCodeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '4px'
  },
  couponCodeTag: {
    backgroundColor: '#f1f5f9',
    color: 'var(--primary-navy)',
    fontWeight: '800',
    fontSize: '12px',
    padding: '2px 8px',
    borderRadius: '4px',
    border: '1px dashed #cbd5e1'
  },
  couponTitle: {
    fontSize: '14px',
    fontWeight: '700'
  },
  couponDesc: {
    fontSize: '12px',
    color: 'var(--text-muted)'
  },
  applyBtn: {
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.5px'
  },
  rightPanel: {
    position: 'sticky',
    top: '90px'
  },
  fareCard: {
    backgroundColor: '#ffffff',
    borderRadius: 'var(--radius-lg)',
    padding: '24px',
    boxShadow: 'var(--shadow-md)',
    border: '1px solid var(--border-color)'
  },
  fareTitle: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--text-dark)',
    marginBottom: '18px',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '12px'
  },
  fareList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '20px'
  },
  fareRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#475569',
    fontWeight: '600'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1px solid #cbd5e1',
    paddingTop: '14px',
    fontWeight: '800',
    fontSize: '16px',
    marginTop: '6px'
  },
  totalPrice: {
    fontSize: '24px',
    fontWeight: '800',
    color: 'var(--accent-red)'
  },
  bookNowBtn: {
    width: '100%',
    backgroundColor: 'var(--accent-red)',
    color: '#ffffff',
    padding: '14px',
    borderRadius: '30px',
    fontSize: '15px',
    fontWeight: '800',
    boxShadow: '0 6px 18px rgba(229, 57, 53, 0.35)',
    transition: 'all 0.2s ease',
    marginBottom: '12px'
  },
  secureBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#16a34a'
  }
};

export default FlightDetailsPage;
