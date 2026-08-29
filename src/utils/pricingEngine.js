/**
 * Client-side Dynamic Pricing & Price Freeze Utility
 */

export function calculateDynamicPrice(basePrice, options = {}) {
  const {
    seatsAvailable = 30,
    totalSeats = 60,
    isHolidaySeason = false,
    daysToDeparture = 14,
  } = options;

  const base = Number(basePrice) || 5000;
  
  // Seat demand multiplier
  const seatRatio = seatsAvailable / totalSeats;
  let demandMultiplier = 1.0;
  
  if (seatRatio < 0.15) {
    demandMultiplier = 1.25;
  } else if (seatRatio < 0.30) {
    demandMultiplier = 1.15;
  } else if (seatRatio < 0.50) {
    demandMultiplier = 1.08;
  } else if (seatRatio > 0.85) {
    demandMultiplier = 0.95;
  }

  // Seasonal surge (20% during holiday peak)
  const seasonalMultiplier = isHolidaySeason ? 1.20 : 1.0;

  // Proximity factor
  let urgencyMultiplier = 1.0;
  if (daysToDeparture <= 2) {
    urgencyMultiplier = 1.18;
  } else if (daysToDeparture <= 7) {
    urgencyMultiplier = 1.10;
  }

  const finalPrice = Math.round(base * demandMultiplier * seasonalMultiplier * urgencyMultiplier);
  const surgeAmount = finalPrice - base;

  return {
    basePrice: base,
    finalPrice,
    surgeAmount,
    breakdown: {
      demandFactorPct: Math.round((demandMultiplier - 1) * 100),
      seasonalFactorPct: isHolidaySeason ? 20 : 0,
      urgencyFactorPct: Math.round((urgencyMultiplier - 1) * 100)
    },
    isSurging: finalPrice > base,
    surgeLabel: isHolidaySeason 
      ? 'Holiday Peak (+20%)' 
      : (demandMultiplier > 1.1 ? 'High Demand Surge' : (urgencyMultiplier > 1.05 ? 'Last-minute Surge' : 'Standard Fare'))
  };
}

export function generatePriceHistoryData(flightId, basePrice = 5500) {
  const base = Number(basePrice) || 5500;
  const history = [];
  const today = new Date();
  
  // Deterministic seed for consistency per flightId
  let seedSum = 0;
  const strId = String(flightId || 'FL-202');
  for (let i = 0; i < strId.length; i++) {
    seedSum += strId.charCodeAt(i);
  }
  const seed = (seedSum % 7) + 1;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    const wave = Math.sin((30 - i + seed) * 0.35) * 0.14;
    const noise = (((i * seed * 19) % 13) - 6) / 100;
    const spike = i < 4 ? (4 - i) * 0.05 : 0;
    
    const factor = 1.0 + wave + noise + spike;
    const price = Math.round(base * Math.max(0.75, factor));

    history.push({
      date: d.toISOString().split('T')[0],
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price,
      isLowest: false,
      isHighest: false
    });
  }

  let minPrice = Infinity;
  let maxPrice = -Infinity;

  history.forEach(h => {
    if (h.price < minPrice) minPrice = h.price;
    if (h.price > maxPrice) maxPrice = h.price;
  });

  history.forEach(h => {
    if (h.price === minPrice) h.isLowest = true;
    if (h.price === maxPrice) h.isHighest = true;
  });

  const avgPrice = Math.round(history.reduce((a, b) => a + b.price, 0) / history.length);
  const currentPrice = history[history.length - 1].price;

  let recommendation = "GREAT_BUY";
  let recommendationText = "Prices are currently 12% below average. Great time to book!";
  
  if (currentPrice > avgPrice * 1.1) {
    recommendation = "HIGH_PRICE";
    recommendationText = "Prices are higher than 30-day average. Consider freezing price for 24h to lock it in!";
  } else if (currentPrice > avgPrice) {
    recommendation = "MODERATE_PRICE";
    recommendationText = "Fair fare. Expect prices to rise in peak travel windows.";
  }

  return {
    flightId,
    history,
    summary: {
      minPrice,
      maxPrice,
      avgPrice,
      currentPrice,
      recommendation,
      recommendationText
    }
  };
}

// Local Storage Price Freeze Manager
const FREEZE_KEY = 'mmt_frozen_prices';

export function getFrozenPrices() {
  try {
    const raw = localStorage.getItem(FREEZE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    const now = Date.now();
    // Return non-expired freezes
    return list.filter(item => item.expiresAt > now);
  } catch (err) {
    return [];
  }
}

export function savePriceFreeze(flight, lockedPrice, durationHours = 24) {
  const list = getFrozenPrices();
  const now = Date.now();
  const expiresAt = now + durationHours * 60 * 60 * 1000;
  
  const flightId = flight._id || flight.id || flight.code || 'FL-202';
  
  const newFreeze = {
    freezeId: `FRZ-${Math.floor(100000 + Math.random() * 900000)}`,
    flightId,
    flightCode: flight.code || flight.flightNumber || 'FL-202',
    airline: flight.airline || flight.flightName || 'SkyHigh',
    from: flight.from,
    to: flight.to,
    departureTime: flight.departureTime,
    arrivalTime: flight.arrivalTime,
    lockedPrice: Number(lockedPrice),
    originalPrice: Number(flight.basePrice || flight.price),
    createdAt: now,
    expiresAt,
    flight
  };

  // Replace existing freeze for same flight if any
  const filtered = list.filter(f => f.flightId !== flightId);
  filtered.push(newFreeze);

  localStorage.setItem(FREEZE_KEY, JSON.stringify(filtered));
  return newFreeze;
}

export function removePriceFreeze(freezeId) {
  const list = getFrozenPrices();
  const filtered = list.filter(f => f.freezeId !== freezeId);
  localStorage.setItem(FREEZE_KEY, JSON.stringify(filtered));
}

export function isFlightPriceFrozen(flightId) {
  const freezes = getFrozenPrices();
  return freezes.find(f => f.flightId === String(flightId));
}
