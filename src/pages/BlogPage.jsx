import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, User, Tag, Sparkles, ArrowRight } from 'lucide-react';
import Footer from '../components/Footer';

export default function BlogPage() {
  const [blogs, setBlogs] = useState([
    {
      _id: 'b1',
      title: '10 Hidden Gems in Himachal Pradesh to Visit This Summer',
      slug: 'hidden-gems-himachal',
      content: 'Discover offbeat valleys, tranquil pine forests, and charming hill villages away from the crowded tourist trails. From Shangarh in Sainj Valley to Jibhi and Shoja, experience serene mountain retreats with breathtaking views of the Himalayas.',
      author: 'MakeMyTour Editorial',
      category: 'Travel Guide',
      coverImage: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      featured: true,
      publishedAt: '2026-08-20'
    },
    {
      _id: 'b2',
      title: 'Top Luxury Beach Resorts in Goa for a Relaxing Getaway',
      slug: 'luxury-resorts-goa',
      content: 'Explore 5-star beachfront properties with private cabanas, sunset lounges, and authentic Goan seafood dining. Whether you prefer South Goa serenity or North Goa nightlife, find your ideal beach stay.',
      author: 'Ananya Roy',
      category: 'Destination Tips',
      coverImage: 'https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800&q=80',
      featured: false,
      publishedAt: '2026-08-22'
    },
    {
      _id: 'b3',
      title: 'Monsoon Travel Hacks: How to Pack & Plan for Rainy Escapes',
      slug: 'monsoon-travel-hacks',
      content: 'Essential tips for monsoon road trips, choosing quick-dry travel gear, securing waterproof luggage covers, and booking monsoon discounted hotel deals across Western Ghats.',
      author: 'Karan Verma',
      category: 'Travel Guide',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
      featured: false,
      publishedAt: '2026-08-25'
    }
  ]);

  useEffect(() => {
    fetch('/api/blogs')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setBlogs(data);
        }
      })
      .catch(err => console.log('Blog fetch notice:', err.message));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* Blog Hero Container */}
      <div className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold border border-blue-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            MakeMyTour Insights & Travel Stories
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Explore Guides, Destination Tips & Announcements
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Discover expert travel advice, curated itineraries, and exclusive holiday announcements from our travel editors.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog._id || blog.slug}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={blog.coverImage || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'} 
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-blue-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {blog.category || 'Travel Guide'}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {blog.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {blog.publishedAt}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-blue-600 transition-colors mb-2">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
                    {blog.content}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button className="text-blue-600 font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Full Story <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
