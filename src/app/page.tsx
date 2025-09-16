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
                  src="/plan-alytics_logo.png" 
                  alt="Plan-alytics" 
                  width={320} 
                  height={85}
                  className="h-20 w-auto object-contain"
                  priority
                />
              </a>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 items-center">
              <a href="#features" onClick={(e) => handleAnchorClick(e, 'features')} className="text-slate-600 hover:text-teal-700 transition-colors font-semibold">Features</a>
              <a href="#dashboard" onClick={(e) => handleAnchorClick(e, 'dashboard')} className="text-slate-600 hover:text-teal-700 transition-colors font-semibold">Dashboard</a>
              <a href="#contact" onClick={(e) => handleAnchorClick(e, 'contact')} className="text-slate-600 hover:text-teal-700 transition-colors font-semibold">Contact</a>
              <button
                onClick={() => router.push('/dashboard')}
                className="ml-4 px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 font-semibold hover:from-teal-800 hover:to-emerald-700"
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
                <a href="#features" onClick={(e) => handleAnchorClick(e, 'features')} className="text-slate-600 hover:text-teal-700 transition-colors font-semibold py-2">Features</a>
                <a href="#dashboard" onClick={(e) => handleAnchorClick(e, 'dashboard')} className="text-slate-600 hover:text-teal-700 transition-colors font-semibold py-2">Dashboard</a>
                <a href="#contact" onClick={(e) => handleAnchorClick(e, 'contact')} className="text-slate-600 hover:text-teal-700 transition-colors font-semibold py-2">Contact</a>
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
            <span className="inline-block px-6 py-2 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-full text-lg font-semibold mb-4">
              Introducing Plan-alytics
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-slate-900 mb-6 leading-tight">
            Plan-alytics: <br/>
            <span className="bg-gradient-to-r from-teal-700 to-emerald-600 bg-clip-text text-transparent">
              Advanced Subscription Intelligence
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
            Plan-alytics transforms your subscription data into strategic insights with cutting-edge predictive analytics, 
            real-time dashboards, and intelligent recommendations that drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-10 py-4 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-bold hover:from-teal-800 hover:to-emerald-700 transform hover:scale-105 hover:-translate-y-1"
            >
              Experience Plan-alytics →
            </button>
            <button
              onClick={() => handleAnchorClick({ preventDefault: () => {} }, 'dashboard')}
              className="px-10 py-4 bg-white text-teal-700 border border-teal-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 text-lg font-semibold hover:bg-teal-50 transform hover:scale-105 hover:-translate-y-1"
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

      {/* Plan-alytics Benefits */}
      <section className="py-16 px-6 bg-gradient-to-r from-teal-700 to-emerald-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Why Plan-alytics?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">89%</div>
              <div className="text-lg">Churn Reduction</div>
              <div className="text-sm opacity-80 mt-2">Average improvement with Plan-alytics insights</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">3.2x</div>
              <div className="text-lg">Revenue Growth</div>
              <div className="text-sm opacity-80 mt-2">Faster growth using Plan-alytics predictions</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-lg">Actionable Insights</div>
              <div className="text-sm opacity-80 mt-2">Plan-alytics uses the past to help you shape the future</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Plan-alytics Core Features</h2>
            <p className="text-xl text-slate-600">Everything you need to understand your customers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-b from-white to-teal-50/30 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100/50 hover:border-teal-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Plan-alytics AI Predictions</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Our machine learning engines team up with AI to forecast subscription trends, customer behavior, and revenue patterns with accuracy you have to see to believe.</p>
              <p className="text-teal-700 font-semibold">→ Predict churn before it happens</p>
            </div>

            <div className="group bg-gradient-to-b from-white to-emerald-50/30 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-100/50 hover:border-emerald-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Plan-alytics Live Dashboards</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Monitor your subscription metrics intentionally with Plan-alytics' intelligent dashboards that highlight what matters most to your business.</p>
              <p className="text-teal-700 font-semibold">→ Track KPIs that matter</p>
            </div>

            <div className="group bg-gradient-to-b from-white to-slate-50/50 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-slate-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-700 to-teal-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Plan-alytics Smart Insights</h3>
              <p className="text-slate-600 leading-relaxed mb-4">Get actionable recommendations powered by Plan-alytics AI to reduce churn, optimize pricing, and maximize customer lifetime value.</p>
              <p className="text-teal-700 font-semibold">→ Auto-generate personalized recommendations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 px-6 bg-gradient-to-br from-teal-50/50 to-emerald-50/30">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">See Plan-alytics In Action</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">Experience the Plan-alytics dashboard that transforms how subscription businesses operate.</p>
          <p className="text-slate-500 mb-12 max-w-2xl mx-auto">Monitor key metrics, predict churn, and optimize your subscription business with our interactive dashboard.</p>
          
          <div className="bg-white p-3 rounded-2xl shadow-2xl inline-block w-full max-w-5xl border border-teal-100">
            <div className="bg-slate-900 rounded-xl p-4 flex items-center gap-3 mb-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 bg-slate-800 rounded-lg px-3 py-1 text-slate-400 text-sm text-left">
                plan-alytics-ui.vercel.app/dashboard
              </div>
            </div>
            
        
            
            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <div className="hidden md:block">
                <iframe
                  src="https://plan-alytics-ui.vercel.app/dashboard/"
                  className="w-full h-[500px] border-none"
                  title="Plan-alytics Dashboard Preview"
                  loading="lazy"
                />
              </div>
              <div className="block md:hidden bg-gradient-to-br from-teal-50 to-emerald-50 p-10 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-700 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">Plan-alytics Dashboard</h3>
                <p className="text-slate-600 mb-6">Best experienced on desktop for full analytics power.</p>
                <a 
                  href="https://plan-alytics-ui.vercel.app/dashboard/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-teal-700 to-emerald-600 text-white rounded-xl font-semibold hover:from-teal-800 hover:to-emerald-700 transition-all duration-300"
                >
                  Open Plan-alytics →
                </a>
              </div>
            </div>
            <div className="mt-4 hidden md:block">
              <a 
                href="https://plan-alytics-ui.vercel.app/dashboard/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal-700 hover:text-teal-800 font-semibold hover:underline transition-colors"
              >
                Launch Full Plan-alytics Dashboard →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Plan-alytics Testimonial */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-8 border border-teal-100">
            <div className="text-3xl font-bold text-teal-800 mb-4">"Plan-alytics changed how we do business."</div>
            <p className="text-xl text-slate-600 mb-6">
              "Since implementing Plan-alytics, we've reduced churn by over 50% and increased our monthly recurring revenue by 240%. 
              The predictive insights from Plan-alytics changed the game."
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
            <h2 className="text-4xl font-bold mb-6">Ready for Plan-alytics?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Join the subscription businesses already using Plan-alytics to drive growth and reduce churn.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex-1 border border-white/20 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 text-center">Contact Us</h3>
              <div className="space-y-5">
                <div className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-emerald-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                  </div>
                  <a href="tel:347-573-2125" className="hover:text-emerald-300 transition-colors">347-573-2125</a>
                </div>
                
                <div className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                  </div>
                  <a href="mailto:rebecca@lbs.ventures" className="hover:text-emerald-300 transition-colors">rebecca@lbs.ventures</a>
                </div>
                
                <div className="flex items-center gap-4 hover:bg-white/5 p-3 rounded-xl transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-600 to-slate-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03-3-9s1.343-9 3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path>
                    </svg>
                  </div>
                  <a href="https://www.lbs.ventures" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-300 transition-colors">www.lbs.ventures</a>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="font-semibold text-lg">Rebecca Schlachter</p>
                <p className="text-sm opacity-75 mt-1">Subscription Analytics Expert</p>
              </div>
            </div>
            
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 flex-1 border border-white/20 shadow-2xl">
  <h3 className="text-2xl font-bold mb-6 text-center">Get Started with Plan-alytics</h3>
  <div className="space-y-4">
    <button
      className="w-full py-3 bg-gradient-to-r from-teal-600 to-emerald-500 text-white rounded-xl font-semibold hover:from-teal-700 hover:to-emerald-600 transition-all duration-300"
      onClick={() => window.open('https://www.lbs.ventures/pl-access', '_blank')}
    >
      Get Early Access
    </button>
    
    <button
      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all duration-300"
      onClick={() => window.open('https://www.lbs.ventures/pl-info', '_blank')}
    >
      Request a Demo
    </button>
    
    <button
      className="w-full py-3 bg-white/20 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/30 transition-all duration-300"
      onClick={() => window.open('https://www.lbs.ventures/pl-info', '_blank')}
    >
      Learn More
    </button>
  </div>
</div>
            
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-slate-900 text-white text-center border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <p className="text-slate-400">© {new Date().getFullYear()} Plan-alytics. A product of LBS Ventures. All rights reserved.</p>
          <p className="text-slate-500 text-sm mt-2">Plan-alytics is here for you.</p>
        </div>
      </footer>
    </div>
  )
}