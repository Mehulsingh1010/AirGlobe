"use client"
// pages/index.tsx
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Earth } from 'lucide-react';
import { ArrowRightIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/mode-toggle';
import screenshot1 from '../../screenshots/screenshot-1.png';
import screenshot2 from '../../screenshots/screenshot-2.png';
import screenshot3 from '../../screenshots/screenshot-3.png';
import screenshot4 from '../../screenshots/screenshot-4.png';
import { fetchWeather, fetchCities } from '@/utils/api';
import { sendEmail } from '@/utils/emailService';
import Chatbot from '@/components/Chatbot';

export default function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [emailList, setEmailList] = useState<{ city: string, email: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [cityError, setCityError] = useState('');
  const [emailError, setEmailError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load saved subscriptions from local storage
    const savedSubscriptions = localStorage.getItem('subscriptions');
    if (savedSubscriptions) {
      setEmailList(JSON.parse(savedSubscriptions));
    }

    // Fetch city suggestions
    fetchCities('').then(data => setCitySuggestions(data));
  }, []);

  useEffect(() => {
    // Save subscriptions to local storage
    localStorage.setItem('subscriptions', JSON.stringify(emailList));
  }, [emailList]);

  const handleSubscribe = async () => {
    setCityError('');
    setEmailError('');

    if (city && email) {
      setLoading(true);
      setSubscribed(false);

      // Validate city
      const weather = await fetchWeather(city);

      if (!weather) {
        setCityError('City not found. Please enter a valid city.');
        setLoading(false);
        return;
      }

      // Validate email
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setEmailError('Invalid email address. Please enter a valid email.');
        setLoading(false);
        return;
      }

      // Send confirmation email
      await sendEmail(email, 'Thanks for subscribing!', {
        user_name: 'Subscriber',
        city_name: weather.city,
        country: weather.country,
        temperature: weather.temperature,
        weather_condition: weather.weather_condition,
        humidity: weather.humidity,
        pressure: weather.pressure,
        wind_speed: weather.wind_speed,
      });

      // Add subscription to the list
      setEmailList([...emailList, { city, email }]);
      setCity('');
      setEmail('');
      setSubscribed(true);
      setLoading(false);

      // Automatically close modal after 2 seconds
      setTimeout(() => setShowModal(false), 2000);
    } else {
      alert('Please enter both city and email.');
    }
  };

  useEffect(() => {
    // Close modal when clicking outside of it
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Mock email sending every hour
  useEffect(() => {
    const interval = setInterval(async () => {
      for (const { city, email } of emailList) {
        const weather = await fetchWeather(city);
        if (weather) {
          await sendEmail(email, `Weather Update for ${city}`, {
            user_name: 'Subscriber',
            city_name: weather.city,
            country: weather.country,
            temperature: weather.temperature,
            weather_condition: weather.weather_condition,
            humidity: weather.humidity,
            pressure: weather.pressure,
            wind_speed: weather.wind_speed,
          });
        }
      }
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }, [emailList]);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
        <div className="container h-14 flex items-center">
          <Link
            href="/"
            className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300"
          >
            <Earth className="w-6 h-6 mr-3" />
            <span className="font-bold">AirGlobe</span>
            <span className="sr-only">AirGlobe</span>
          </Link>
          <nav className="ml-auto flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-8 h-8 bg-background"
              asChild
            >
              <Link href="https://github.com/mehulsingh1010">
                <GitHubLogoIcon className="h-[1.2rem] w-[1.2rem]" />
              </Link>
            </Button>
            <ModeToggle />
          </nav>
        </div>
      </header>
      <main className="flex-1 overflow-hidden">
        <div className="container relative mt-[70px] pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 lg:py-24 lg:pb-6 mt-10 sm:mt-[100px]">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              AirGlobe: Your World, Mapped and Updated
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              Explore interactive global maps and get real-time weather updates.
              Your ultimate resource for geographic insights and weather
              information worldwide.
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button variant="default" asChild>
                <Link href="/dashboard">
                  Dive In!
                  <ArrowRightIcon className="ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                asChild
                onClick={() => setShowModal(true)}
              >
                <span className='cursor-pointer'>Subscribe</span>
              </Button>
            </div>
          </section>
          <div className="w-full flex justify-center relative">
            <Image
              src={screenshot1}
              width={1080}
              height={608}
              alt="demo"
              priority
              className="border rounded-xl shadow-sm dark:hidden"
            />
            <Image
              src={screenshot2}
              width={1080}
              height={608}
              alt="demo-dark"
              priority
              className="border border-zinc-600 rounded-xl shadow-sm hidden dark:block dark:shadow-gray-500/5"
            />
            <Image
              src={screenshot3}
              width={228}
              height={494}
              alt="demo-mobile"
              className="border rounded-xl absolute bottom-0 right-0 hidden lg:block dark:hidden"
            />
            <Image
              src={screenshot4}
              width={228}
              height={494}
              alt="demo-mobile"
              className="border border-zinc-600 rounded-xl absolute bottom-0 right-0 hidden dark:lg:block"
            />
          </div>
        </div>
      </main>

      {/* Modal for subscription */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div
            ref={modalRef}
            className="bg-white dark:bg-black rounded-lg p-6 max-w-sm mx-auto shadow-lg relative"
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors duration-300"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">Subscribe for Updates</h2>
            <div className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
              {cityError && <p className="text-red-500">{cityError}</p>}
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
              {emailError && <p className="text-red-500">{emailError}</p>}
              <Button
                variant="default"
                onClick={handleSubscribe}
                disabled={loading}
                className="mt-2"
              >
                {loading ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {subscribed && (
                <p className="text-green-500 mt-2">Subscription successful!</p>
              )}
            </div>
          </div>
        </div>
      )}
<div className='absolute text-purple-600 right-6 bottom-[100px]  ' >
  <Chatbot />
</div>
      {/* Chatbot component */}
     
    </div>
  );
}

