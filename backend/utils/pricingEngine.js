/**
 * Dynamic Pricing Engine Utility
 * Calculates real-time prices based on demand, seat availability, seasonal multipliers, and proximity.
 */

export function calculateDynamicPrice(basePrice, options = {}) {
  const {
    seatsAvailable = 60,
    totalSeats = 60,
    isHolidaySeason = false,
    daysToDeparture = 14,
    demandMultiplierOverride = null
  } = options;

  let base = Number(basePrice) || 5000;
  
  // 1. Demand & Seat Availability Factor
  // Fewer seats left -> higher demand multiplier
  let seatRatio = seatsAvailable / totalSeats;
  let demandMultiplier = 1.0;
  
  if (seatRatio < 0.15) {
    demandMultiplier = 1.25; // 25% surge for critical scarcity
  } else if (seatRatio < 0.30) {
    demandMultiplier = 1.15; // 15% surge for high demand
  } else if (seatRatio < 0.50) {
    demandMultiplier = 1.08; // 8% surge for moderate demand
  } else if (seatRatio > 0.85) {
    demandMultiplier = 0.95; // 5% discount for early bird/low demand
  }

  if (demandMultiplierOverride) {
    demandMultiplier = demandMultiplierOverride;
  }

  // 2. Seasonal / Holiday Factor (e.g., Peak travel periods add 20%)
  let seasonalMultiplier = isHolidaySeason ? 1.20 : 1.0;

  // 3. Days to Departure Factor (Booking urgency)
  let urgencyMultiplier = 1.0;
  if (daysToDeparture <= 2) {
    urgencyMultiplier = 1.18;
  } else if (daysToDeparture <= 7) {
    urgencyMultiplier = 1.10;
  } else if (daysToDeparture >= 45) {
    urgencyMultiplier = 0.92; // Advance booking discount
  }

  // Final Price Calculation
  const finalPrice = Math.round(base * demandMultiplier * seasonalMultiplier * urgencyMultiplier);
  const surgeAmount = finalPrice - base;
  const percentageChange = Math.round(((finalPrice - base) / base) * 100);

  return {
    basePrice: base,
    finalPrice,
    surgeAmount,
    percentageChange,
    breakdown: {
      demandFactor: Math.round((demandMultiplier - 1) * 100),
      seasonalFactor: isHolidaySeason ? 20 : 0,
      urgencyFactor: Math.round((urgencyMultiplier - 1) * 100)
    },
    isSurging: finalPrice > base,
    surgeLabel: isHolidaySeason 
      ? 'Holiday Peak (+20%)' 
      : (demandMultiplier > 1.1 ? 'High Demand Surge' : (urgencyMultiplier > 1.05 ? 'Last Minute Fare' : 'Standard Fare'))
  };
}

/**
 * Generate 30-day realistic historical price trend points for a flight
 */
export function generatePriceHistory(flightId, basePrice = 5000) {
  const history = [];
  const base = Number(basePrice) || 5000;
  const today = new Date();
  
  // Seed pseudo-random variations based on flightId length/chars for consistent trends per flight
  const seed = (String(flightId || 'FL').charCodeAt(0) % 10) + 1;

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    
    // Simulate trend wave
    const wave = Math.sin((30 - i + seed) * 0.4) * 0.12;
    const noise = (( (i * seed * 17) % 11 ) - 5) / 100;
    
    // Near departure spike
    const proximitySpike = i < 5 ? (5 - i) * 0.04 : 0;
    
    const factor = 1.0 + wave + noise + proximitySpike;
    const price = Math.round(base * factor);
    
    history.push({
      date: d.toISOString().split('T')[0],
      displayDate: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      price,
      isLowest: false,
      isHighest: false
    });
  }

  // Mark min and max
  let minPrice = Infinity;
  let maxPrice = -Infinity;
  
  history.forEach(item => {
    if (item.price < minPrice) minPrice = item.price;
    if (item.price > maxPrice) maxPrice = item.price;
  });

  history.forEach(item => {
    if (item.price === minPrice) item.isLowest = true;
    if (item.price === maxPrice) item.isHighest = true;
  });

  const avgPrice = Math.round(history.reduce((acc, h) => acc + h.price, 0) / history.length);
  const currentPrice = history[history.length - 1].price;
  
  let recommendation = "GREAT_PRICE";
  let recommendationText = "Great time to buy! Prices are below average.";
  
  if (currentPrice > avgPrice * 1.1) {
    recommendation = "HIGH_PRICE";
    recommendationText = "Prices are currently higher than usual. Freeze price to protect against further spikes!";
  } else if (currentPrice > avgPrice) {
    recommendation = "MODERATE_PRICE";
    recommendationText = "Price is moderate. Expecting slight increase over the next 48 hours.";
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
