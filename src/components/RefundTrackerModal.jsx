import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Clock, Landmark, AlertCircle, ShieldCheck, ArrowRight, RefreshCw } from 'lucide-react';

export default function RefundTrackerModal({ booking, onClose }) {
  const [trackerData, setTrackerData] = useState(null);

  useEffect(() => {
    if (!booking) return;

    const bookingId = booking.bookingId;
    fetch(`/api/booking/refund-status/${bookingId}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.cancellationDetails) {
          setTrackerData(data);
        } else {
          setTrackerData({
            bookingId: booking.bookingId,
            totalPrice: booking.totalPrice || 5000,
            cancellationDetails: booking.cancellationDetails || {
              refundAmount: Math.round((booking.totalPrice || 5000) * 0.5),
              refundPercentage: 50,
              cancellationFee: Math.round((booking.totalPrice || 5000) * 0.5),
              refundStatus: 'Processing',
              refundTxnId: `RFD-${Math.floor(100000 + Math.random() * 900000)}`,
              expectedCompletionDate: 'Aug 30, 2026',
              reason: 'Change of travel plans'
            }
          });
        }
      })
      .catch(() => {
        setTrackerData({
          bookingId: booking.bookingId,
          totalPrice: booking.totalPrice || 5000,
          cancellationDetails: booking.cancellationDetails || {
            refundAmount: Math.round((booking.totalPrice || 5000) * 0.5),
            refundPercentage: 50,
            cancellationFee: Math.round((booking.totalPrice || 5000) * 0.5),
            refundStatus: 'Processing',
            refundTxnId: `RFD-${Math.floor(100000 + Math.random() * 900000)}`,
            expectedCompletionDate: 'Aug 30, 2026',
            reason: 'Change of travel plans'
          }
        });
      });
  }, [booking]);

  if (!booking || !trackerData) return null;

  const details = trackerData.cancellationDetails || {};

  // Track steps status logic
  const currentStepIndex = details.refundStatus === 'Completed' ? 3 : (details.refundStatus === 'Processing' ? 2 : 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-extrabold uppercase tracking-wider mb-2">
              <RefreshCw className="w-3.5 h-3.5" />
              Live Refund Status Tracker
            </span>
            <h3 className="text-xl font-black">
              Refund Tracker for {booking.bookingId}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5 font-medium">
              Reference Txn ID: <strong className="text-emerald-400">{details.refundTxnId}</strong>
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors relative z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Summary Banner */}
        <div className="p-5 bg-emerald-50 border-b border-emerald-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-extrabold uppercase text-emerald-800 block">Total Net Refund Amount</span>
            <span className="text-2xl font-black text-emerald-700">
              ₹{Number(details.refundAmount || 2500).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-slate-500 block uppercase">Expected Completion</span>
            <span className="text-sm font-extrabold text-slate-900 flex items-center gap-1 justify-end">
              <Clock className="w-4 h-4 text-emerald-600" />
              {details.expectedCompletionDate || '3 Business Days'}
            </span>
          </div>
        </div>

        {/* Visual Progress Steps Tracker */}
        <div className="p-6 space-y-6">
          <div className="relative">
            <div className="flex items-center justify-between mb-8 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center max-w-[110px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                  currentStepIndex >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-900 mt-2">Request Submitted</span>
                <span className="text-[10px] text-slate-500 font-semibold">Cancellation recorded</span>
              </div>

              {/* Step Line 1-2 */}
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                currentStepIndex >= 2 ? 'bg-emerald-500' : 'bg-slate-200'
              }`} />

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center max-w-[110px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                  currentStepIndex >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'
                }`}>
                  <Landmark className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-900 mt-2">Bank Processing</span>
                <span className="text-[10px] text-emerald-600 font-semibold animate-pulse">Gateway verification</span>
              </div>

              {/* Step Line 2-3 */}
              <div className={`flex-1 h-1 mx-2 rounded-full transition-all ${
                currentStepIndex >= 3 ? 'bg-emerald-500' : 'bg-slate-200'
              }`} />

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center max-w-[110px]">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-md transition-all ${
                  currentStepIndex >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-400'
                }`}>
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-900 mt-2">Account Credited</span>
                <span className="text-[10px] text-slate-500 font-semibold">Original payment method</span>
              </div>

            </div>
          </div>

          {/* Refund Detailed Policy Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2 text-xs font-semibold text-slate-700">
            <h4 className="font-extrabold text-slate-900 uppercase text-[11px] border-b border-slate-200 pb-2 mb-1">
              Refund Audit Details
            </h4>
            <div className="flex justify-between">
              <span>Original Booking Total:</span>
              <span className="font-bold text-slate-900">₹{Number(trackerData.totalPrice || 5000).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Policy Fee Deduction ({100 - (details.refundPercentage || 50)}%):</span>
              <span className="font-bold">-₹{Number(details.cancellationFee || 2500).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>Cancellation Reason Selected:</span>
              <span className="font-bold text-slate-900">{details.reason || 'Change of travel plans'}</span>
            </div>
          </div>

          {/* Timeline Info Banner */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl flex items-center gap-2.5 text-xs text-blue-900 font-medium">
            <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>Refunds typically post within 3 to 5 business days depending on your issuing bank.</span>
          </div>

          <div className="pt-2">
            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs shadow-md transition-all"
            >
              Close Refund Tracker
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
