import Flight from '../models/Flight.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import { calculateDynamicPrice, generatePriceHistory } from '../utils/dynamicPricingEngine.js';

// Calculate live dynamic price & transparent breakdown for an item
export const getDynamicPrice = async (req, res) => {
  try {
    const { itemId, type = 'flight', isHoliday = 'true', searchDemand = 'HIGH' } = req.query;

    let item = null;
    if (itemId) {
      if (type === 'hotel') {
        item = await Hotel.findById(itemId).catch(() => null);
      } else {
        item = await Flight.findById(itemId).catch(() => null);
      }
    }

    // Default mock item if not found in DB
    if (!item) {
      item = {
        price: 5500,
        availableSeats: 22
      };
    }

    const options = {
      isHolidaySeason: isHoliday === 'true',
      searchDemand
    };

    const priceDetails = calculateDynamicPrice(item, options);
    res.json({
      success: true,
      itemId,
      type,
      ...priceDetails
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get price history dataset (14 days trend)
export const getPriceHistory = async (req, res) => {
  try {
    const { itemId, type = 'flight' } = req.params;
    let basePrice = 5500;
    let currentDynamicPrice = 6600;

    if (type === 'hotel') {
      const hotel = await Hotel.findById(itemId).catch(() => null);
      if (hotel) {
        basePrice = hotel.pricePerNight;
        const details = calculateDynamicPrice(hotel, { isHolidaySeason: true });
        currentDynamicPrice = details.finalPrice;
      }
    } else {
      const flight = await Flight.findById(itemId).catch(() => null);
      if (flight) {
        basePrice = flight.price;
        const details = calculateDynamicPrice(flight, { isHolidaySeason: true });
        currentDynamicPrice = details.finalPrice;
      }
    }

    const historyData = generatePriceHistory(basePrice, currentDynamicPrice);
    res.json({
      success: true,
      itemId,
      type,
      ...historyData
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Freeze price for a user
export const freezePrice = async (req, res) => {
  try {
    const { userId, email, itemId, itemType = 'flight', title, subtitle, frozenPrice, basePrice, durationHours = 24, lockFee = 0 } = req.body;

    const freezeId = `FREEZE-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (durationHours * 60 * 60 * 1000));

    const newFreeze = {
      freezeId,
      itemId: itemId || 'FL-202',
      itemType,
      title: title || 'Flight Price Freeze',
      subtitle: subtitle || 'Delhi → Mumbai',
      frozenPrice: Number(frozenPrice || 5500),
      basePrice: Number(basePrice || 5500),
      currentDynamicPrice: Number(frozenPrice || 5500),
      lockedAt: now,
      expiresAt,
      lockFee: Number(lockFee),
      status: 'Active'
    };

    if (userId || email) {
      const query = userId ? { _id: userId } : { email };
      const user = await User.findOne(query);
      if (user) {
        user.frozenPrices = user.frozenPrices || [];
        user.frozenPrices.unshift(newFreeze);
        await user.save();
        return res.json({ success: true, message: 'Price frozen successfully!', freeze: newFreeze, user });
      }
    }

    // Return object even if guest/offline user
    res.json({ success: true, message: 'Price frozen locally!', freeze: newFreeze });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get active frozen prices for user
export const getUserFrozenPrices = async (req, res) => {
  try {
    const { identifier } = req.params; // email or userId
    const user = await User.findOne({
      $or: [{ _id: identifier }, { email: identifier }]
    });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Filter out expired locks or mark them
    const now = new Date();
    const activeFrozen = (user.frozenPrices || []).map(lock => {
      const isExpired = new Date(lock.expiresAt) < now;
      return {
        ...lock.toObject(),
        status: isExpired && lock.status === 'Active' ? 'Expired' : lock.status
      };
    });

    res.json({ success: true, frozenPrices: activeFrozen });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Unfreeze or redeem locked price
export const unfreezePrice = async (req, res) => {
  try {
    const { freezeId, email, action = 'redeem' } = req.body;
    const user = await User.findOne({ email });

    if (user && user.frozenPrices) {
      const lockIndex = user.frozenPrices.findIndex(f => f.freezeId === freezeId);
      if (lockIndex !== -1) {
        user.frozenPrices[lockIndex].status = action === 'redeem' ? 'Redeemed' : 'Expired';
        await user.save();
      }
    }

    res.json({ success: true, message: `Price lock ${action === 'redeem' ? 'redeemed' : 'released'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
