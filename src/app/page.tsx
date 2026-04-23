'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react'


export default function Home() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isIframeLoaded, setIsIframeLoaded] = useState(false)

  // Smooth scrolling for anchor links
  const handleAnchorClick = (e, id) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false) // Close mobile menu after click
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30">
      {/* Header */}
      <header className="fixed w-full bg-white/95 backdrop-blur-md z-50 shadow-lg border-b border-teal-100">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <a href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }} className="cursor-pointer">
                <Image 
                  src="/sticksy_logo.png" 
                  alt="sticksy.ai" 
                  width={320} 
                  height={85}
                  className="h-20 w-auto object-contain"
                  priority
                />
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              <a href="#features" onClick={(e) => handleAnchorClick(e, 'features')} className="text-[#3A1A00] hover:text-teal-700 transition-colors font-semibold">Features</a>
              <a href="#dashboard" onClick={(e) => handleAnchorClick(e, 'dashboard')} className="text-[#3A1A00] hover:text-teal-700 transition-colors font-semibold">Dashboard</a>
              <a href="#contact" onClick={(e) => handleAnchorClick(e, 'contact')} className="text-[#3A1A00] hover:text-teal-700 transition-colors font-semibold">Contact</a>
              <button
                onClick={() => router.push('/dashboard')}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-[#FEA005] to-[#F4B400] text-[#3A1A00] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold hover:from-[#F4B400] hover:to-[#FEA005]"
              >
                Get Started
              </button>
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 rounded-md text-teal-800"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4">
              <div className="flex flex-col space-y-3">
                <a href="#features" onClick={(e) => handleAnchorClick(e, 'features')} className="text-[#3A1A00] hover:text-teal-700 transition-colors font-semibold py-2">Features</a>
                <a href="#dashboard" onClick={(e) => handleAnchorClick(e, 'dashboard')} className="text-[#3A1A00] hover:text-teal-700 transition-colors font-semibold py-2">Dashboard</a>
                <a href="#contact" onClick={(e) => handleAnchorClick(e, 'contact')} className="text-[#3A1A00] hover:text-teal-700 transition-colors font-semibold py-2">Contact</a>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold hover:from-teal-800 hover:to-emerald-700 mt-2"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-[#FEA005] to-[#F4B400] text-[#3A1A00] rounded-full text-lg font-semibold mb-4">
              Introducing Sticksy
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Sticksy: <br/>
            <span className="bg-gradient-to-r from-[#F4B400] to-[#D4920A] bg-clip-text text-transparent">
              Advanced Subscription Intelligence
            </span>
          </h1>
          <p className="text-xl text-[#3A1A00] mb-8 max-w-4xl mx-auto leading-relaxed">
            Sticksy transforms your subscription data into strategic insights with cutting-edge predictive analytics, 
            real-time dashboards, and intelligent recommendations that drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
            onClick={() => router.push('/dashboard')}
            className="px-10 py-4 bg-gradient-to-r from-[#FEA005] to-[#F4B400] text-[#3A1A00] rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-bold hover:from-[#F4B400] hover:to-[#FEA005] transform hover:scale-105 hover:-translate-y-1"
          >
            Experience Sticksy →
          </button>
           <button
  onClick={() => handleAnchorClick({ preventDefault: () => {} }, 'dashboard')}
  className="px-10 py-4 bg-white text-[#D4920A] border border-[#D4920A] rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-lg font-semibold hover:bg-[#FFF3D6] transform hover:scale-105 hover:-translate-y-1"
>
  View Demo
</button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-10 flex flex-col items-center">
            <p className="text-sm text-slate-500 font-medium mb-4">
              Trusted by subscription businesses worldwide
            </p>
            <div className="flex flex-wrap justify-center gap-6 opacity-70">
              {/* Example customer logos - replace with actual customer logos */}
              <div className="flex flex-wrap gap-6 items-center justify-center">
  <Image
    src="/logos/loop.svg"
    alt="Loop"
    width={128}
    height={32}
    className="h-8 w-auto object-contain"
  />
  <Image
    src="/logos/floorp.svg"
    alt="Floorp"
    width={128}
    height={32}
    className="h-8 w-auto object-contain"
  />
  <Image
    src="/logos/keepachangelog.svg"
    alt="Keep a Changelog"
    width={128}
    height={32}
    className="h-8 w-auto object-contain"
  />
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticksy Benefits */}
      <section className="py-16 px-6 bg-gradient-to-r from-[#3A1A00] to-[#FEA005] text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Why Sticksy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-[#3A1A00]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FEA005]/30">
              <div className="w-12 h-12 bg-[#FEA005]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">89%</div>
              <div className="text-lg">Churn Reduction</div>
              <div className="text-sm opacity-80 mt-2">Average improvement with Sticksy insights</div>
            </div>
            <div className="bg-[#3A1A00]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FEA005]/30">
              <div className="w-12 h-12 bg-[#FEA005]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">3.2x</div>
              <div className="text-lg">Revenue Growth</div>
              <div className="text-sm opacity-80 mt-2">Faster growth using Sticksy predictions</div>
            </div>
            <div className="bg-[#3A1A00]/80 backdrop-blur-sm rounded-2xl p-6 border border-[#FEA005]/30">
              <div className="w-12 h-12 bg-[#FEA005]/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg">Actionable Insights</div>
              <div className="text-sm opacity-80 mt-2">Sticksy uses the past to help you shape the future</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#3A1A00] mb-4">Sticksy Core Features</h2>
            <p className="text-xl text-[#3A1A00]">Everything you need to understand your customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-white to-teal-50/30 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100/50 hover:border-teal-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#FEA005] to-[#F4B400] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Sticksy AI Predictions</h3>
              <p className="text-[#3A1A00] leading-relaxed mb-4">Our machine learning engines team up with AI to forecast subscription trends, customer behavior, and revenue patterns with accuracy you have to see to believe.</p>
              <p className="text-brown-700 font-semibold">→ Predict churn before it happens</p>
            </div>

            <div className="group bg-gradient-to-b from-white to-emerald-50/30 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#F4B400] to-[#FEA005] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Sticksy Live Dashboards</h3>
              <p className="text-[#3A1A00] leading-relaxed mb-4">Monitor your subscription metrics intentionally with Sticksy' intelligent dashboards that highlight what matters most to your business.</p>
              <p className="text-brown-700 font-semibold">→ Track KPIs that matter</p>
            </div>

            <div className="group bg-gradient-to-b from-white to-slate-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-[#3A1A00] to-[#FEA005] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Sticksy Smart Insights</h3>
              <p className="text-[#3A1A00] leading-relaxed mb-4">Get actionable recommendations powered by Sticksy AI to reduce churn, optimize pricing, and maximize customer lifetime value.</p>
              <p className="text-brown-700 font-semibold">→ Auto-generate personalized recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 px-6 bg-gradient-to-br from-[#FFF3D6] to-[#FEA005]/10">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">See Sticksy In Action</h2>
          <p className="text-xl text-[#3A1A00] mb-8 max-w-3xl mx-auto">Experience the Sticksy dashboard that transforms how subscription businesses operate.</p>
          <p className="text-slate-500 mb-12 max-w-2xl mx-auto">Monitor key metrics, predict churn, and optimize your subscription business with our interactive dashboard.</p>
          
          <div className="bg-white p-3 rounded-2xl shadow-2xl inline-block w-full max-w-5xl border border-[#FEA005]/30">
            <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3 mb-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-slate-800 rounded-lg px-3 py-1 text-slate-400 text-sm text-left">
                Sticksy-ui.vercel.app/dashboard
              </div>
            </div>
            
        
            
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <div className="hidden md:block">
                <iframe
                  src="https://Sticksy-ui.vercel.app/dashboard/"
                  className="w-full h-[500px] border-none"
                  title="Sticksy Dashboard Preview"
                  loading="lazy"
                />
              </div>
              <div className="block md:hidden bg-gradient-to-br from-[#FFF3D6] to-[#FEA005]/20 p-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Sticksy Dashboard</h3>
                <p className="text-[#3A1A00] mb-6">Best experienced on desktop for full analytics power.</p>
                <a 
                  href="https://Sticksy-ui.vercel.app/dashboard/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-800 hover:to-emerald-700 transition-all duration-300"
                >
                  Open Sticksy →
                </a>
              </div>
            </div>
            <div className="mt-4 hidden md:block">
              <a 
                href="https://Sticksy-ui.vercel.app/dashboard/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-800 font-semibold hover:underline transition-colors"
              >
                Launch Full Sticksy Dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Sticksy Testimonial */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100">
            <div className="text-3xl font-bold text-[#FEA005] mb-4">"Sticksy changed how we do business."</div>
            <p className="text-xl text-[#3A1A00] mb-6">
              "Since implementing Sticksy, we've reduced churn by over 50% and increased our monthly recurring revenue by 240%. 
              The predictive insights from Sticksy changed the game."
            </p>
            <div className="text-lg font-semibold text-slate-800">
              Sarah Whitman, CEO at SubscribeFlow
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 px-6 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-6">Ready for Sticksy?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join the subscription businesses already using Sticksy to drive growth and reduce churn.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">

            
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex-1 border border-white/20 shadow-2xl">
<h3 className="text-2xl font-bold mb-6 text-center text-[#FFF3D6]">Get Started with Sticksy</h3>  <div className="space-y-4">
<button
  className="w-full py-3 bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
  onClick={() => window.location.href = 'mailto:access@sticksy.ai'}
>
  Get Early Access
</button>
    
<button
  className="w-full py-3 bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
  onClick={() => window.location.href = 'mailto:demo@sticksy.ai'}
>
  Request a Demo
</button>
    
<button
  className="w-full py-3 bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
  onClick={() => window.location.href = 'mailto:buzzbuzz@sticksy.ai'}
>
  Learn More
</button>
  </div>
</div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-[#080808] text-white text-center border-t border-[#FEA005]/20">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-400">© {new Date().getFullYear()} Sticksy. A product of RSBR LLC. All rights reserved.</p>
          <p className="text-slate-500 text-sm mt-2">Sticksy is here for you.</p>
        </div>
      </footer>
    </div>
  )
}
