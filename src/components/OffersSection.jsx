import React from 'react';
import { Tag, Sparkles, ArrowRight } from 'lucide-react';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export default function OffersSection({ offers }) {
  const defaultOffers = [
    {
      id: 'o1',
      title: 'INTERNATIONAL FLIGHT FEST',
      subtitle: 'Flat 20% OFF on Flights to London & Dubai',
      code: 'FLYPROMO20',
      badge: 'LIMITED TIME',
      bgImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'o2',
      title: 'LUXURY STAYS & RESORTS',
      subtitle: 'Up to $150 Instant Cashback on 5-Star Hotels',
      code: 'LUXURYSTAY',
      badge: 'POPULAR',
      bgImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 'o3',
      title: 'STUDENT TRAVEL SPECIAL',
      subtitle: 'Extra 15kg Baggage Allowance + $40 Off',
      code: 'STUDENTFLY',
      badge: 'EXCLUSIVE',
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
    }
  ];

  const displayOffers = offers && offers.length > 0 ? offers : defaultOffers;

  return (
    <section className="my-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Exclusive Offers & Travel Deals</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">Unlock instant discounts and coupon codes for your next adventure.</p>
        </div>
        <Badge variant="primary" className="hidden sm:inline-flex">
          Updated Today
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {displayOffers.map((offer) => (
          <Card 
            key={offer.id || offer.title}
            className="relative overflow-hidden group border-0 shadow-xl min-h-[220px] flex flex-col justify-end p-6"
          >
            {/* Background Image Container with Overlay */}
            <div className="absolute inset-0 z-0">
              <img 
                src={offer.bgImage || offer.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80"}
                alt={offer.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            </div>

            {/* Content Overlay */}
            <div className="relative z-10 text-white space-y-2">
              <Badge variant="default" className="bg-red-600 text-white border-0 text-[10px]">
                {offer.badge || 'PROMO'}
              </Badge>
              <h3 className="text-lg font-black leading-tight text-white group-hover:text-red-400 transition-colors">
                {offer.title}
              </h3>
              <p className="text-xs text-slate-300 font-medium">
                {offer.subtitle || offer.description}
              </p>
              
              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/20 backdrop-blur-md text-[11px] font-extrabold tracking-wider">
                  <Tag className="w-3 h-3 text-amber-400" />
                  <span>CODE: {offer.code || 'MAKEYOURTRIP'}</span>
                </div>
                <ArrowRight className="w-4 h-4 text-white transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
