/**
 * Predefined Cancellation Reasons & Automated Refund Calculator
 */

export const CANCELLATION_REASONS = [
  { id: 'PLAN_CHANGE', label: 'Change of travel plans / Rescheduled' },
  { id: 'CHEAPER_ALT', label: 'Found cheaper flight or hotel alternative' },
  { id: 'SCHEDULE_CHANGE', label: 'Flight / Hotel schedule changed by operator' },
  { id: 'MEDICAL_EMERGENCY', label: 'Personal or medical emergency' },
  { id: 'WEATHER_UNFORESEEN', label: 'Severe weather or unforeseen circumstances' },
  { id: 'MISTAKE_BOOKING', label: 'Booked wrong date or passenger by mistake' },
  { id: 'OTHER', label: 'Other reasons' }
];

export function calculateRefundDetails(totalPrice, options = {}) {
  const amount = Number(totalPrice) || 5000;
  const { hoursSinceBooking = 4 } = options;

  let refundPercentage = 50; // Policy default: 50% within 24 hours of reservation
  let policyTag = "Standard 24h Policy (50% Refund)";

  if (hoursSinceBooking <= 24) {
    refundPercentage = 50;
    policyTag = "Cancelled within 24h of reservation (50% Refund)";
  } else if (hoursSinceBooking <= 48) {
    refundPercentage = 75;
    policyTag = "Cancelled >24h to 48h before travel (75% Refund)";
  } else {
    refundPercentage = 85;
    policyTag = "Advance cancellation policy (85% Refund)";
  }

  const refundAmount = Math.round((amount * refundPercentage) / 100);
  const cancellationFee = amount - refundAmount;

  const expectedDate = new Date();
  expectedDate.setDate(expectedDate.getDate() + 3);
  const expectedCompletionDate = expectedDate.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return {
    bookingTotal: amount,
    refundPercentage,
    refundAmount,
    cancellationFee,
    policyTag,
    expectedCompletionDate,
    refundTxnId: `RFD-${Math.floor(100000 + Math.random() * 900000)}`
  };
}
