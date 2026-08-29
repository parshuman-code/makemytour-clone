import React, { useState } from 'react';
import { X, AlertCircle, ShieldAlert, CheckCircle2, HelpCircle, ArrowRight, DollarSign } from 'lucide-react';
import { CANCELLATION_REASONS, calculateRefundDetails } from '../utils/refundEngine';

export default function CancellationModal({ booking, onClose, onConfirmCancel }) {
  const [selectedReason, setSelectedReason] = useState(CANCELLATION_REASONS[0].label);
  const [comments, setComments] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [cancellationResult, setCancellationResult] = useState(null);

  if (!booking) return null;

  const totalPrice = Number(booking.totalPrice || booking.totalAmount || 5000);
  const calc = calculateRefundDetails(totalPrice, { hoursSinceBooking: 6 });

  const handleCancelSubmit = async () => {
    setIsSubmitting(true);
    const bookingId = booking.bookingId;

    try {
      const response = await fetch('/api/booking/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: booking.userId || 'demo-user',
          bookingId,
          reason: selectedReason,
          comments
        })
      });

      if (response.ok) {
        const resData = await response.json();
        setCancellationResult(resData.booking?.cancellationDetails || calc);
      } else {
        setCancellationResult({
          cancelledAt: new Date(),
          reason: selectedReason,
          comments,
          refundAmount: calc.refundAmount,
          refundPercentage: calc.refundPercentage,
          cancellationFee: calc.cancellationFee,
          refundStatus: 'Initiated',
          refundTxnId: calc.refundTxnId,
          expectedCompletionDate: calc.expectedCompletionDate
        });
      }
    } catch (err) {
      setCancellationResult({
        cancelledAt: new Date(),
        reason: selectedReason,
        comments,
        refundAmount: calc.refundAmount,
        refundPercentage: calc.refundPercentage,
        cancellationFee: calc.cancellationFee,
        refundStatus: 'Initiated',
        refundTxnId: calc.refundTxnId,
        expectedCompletionDate: calc.expectedCompletionDate
      });
    }

    setIsSubmitting(false);
    setIsSuccess(true);

    if (onConfirmCancel) {
      onConfirmCancel({
        bookingId,
        reason: selectedReason,
        comments,
        cancellationDetails: cancellationResult || calc
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              Cancel Booking Request
            </span>
            <h3 className="text-xl font-black">
              {booking.itemDetails?.title || (booking.type === 'hotel' ? 'Hotel Stay' : 'Flight Booking')}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Booking ID: <strong className="text-white">{booking.bookingId}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isSuccess ? (
          <div className="p-6 space-y-6">
            
            {/* Reason Selection Dropdown */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Select Reason for Cancellation <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-2xl text-xs font-bold text-slate-900 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all cursor-pointer"
              >
                {CANCELLATION_REASONS.map((r) => (
                  <option key={r.id} value={r.label}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Additional Comments optional */}
            <div className="space-y-2">
              <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
                Additional Notes / Feedback (Optional)
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder="Help us improve our service by providing details..."
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
            </div>

            {/* Automated Refund Policy Calculation Breakdown */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-extrabold text-slate-900 pb-2 border-b border-slate-200">
                <span>Automated Refund Policy Preview</span>
                <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-100">
                  {calc.policyTag}
                </span>
              </div>

              <div className="space-y-1.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Original Paid Fare:</span>
                  <span className="text-slate-900 font-bold">₹{calc.bookingTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-rose-600">
                  <span>Cancellation Penalty ({100 - calc.refundPercentage}%):</span>
                  <span className="font-bold">-₹{calc.cancellationFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-black text-sm pt-2 border-t border-slate-200">
                  <span>Estimated Refund Amount:</span>
                  <span>₹{calc.refundAmount.toLocaleString('en-IN')} ({calc.refundPercentage}%)</span>
                </div>
              </div>
            </div>

            {/* Confirm CTA */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-3.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-colors"
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : `Confirm & Refund ₹${calc.refundAmount.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <h4 className="text-2xl font-black text-slate-900">Cancellation Confirmed!</h4>
            <p className="text-xs text-slate-600 font-semibold max-w-sm mx-auto leading-relaxed">
              Your refund of <strong className="text-emerald-600">₹{cancellationResult?.refundAmount?.toLocaleString('en-IN')}</strong> has been initiated to your original payment method.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-1.5 text-xs text-slate-600 font-semibold">
              <div className="flex justify-between">
                <span>Refund Reference ID:</span>
                <span className="font-extrabold text-slate-900">{cancellationResult?.refundTxnId}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="font-extrabold text-amber-600">Initiated (Processing)</span>
              </div>
              <div className="flex justify-between">
                <span>Expected Completion Date:</span>
                <span className="font-extrabold text-slate-900">{cancellationResult?.expectedCompletionDate}</span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
              >
                Done, View Refund Tracker
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
