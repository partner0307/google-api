import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';

import Arrow from '@/assets/images/arrow.png';

const Home = () => {
  const inputData = useRef('');
  let autocomplete = null;
  const [reviewLink, setReviewLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [businessName, setBusinessName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/generateLink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessName })
    });
    const data = await response.json();
    setReviewLink(data.link);
    
    const shortenedResponse = await fetch('/api/getShortLink', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ link: data.link })
    });

    const shortLinkData = await shortenedResponse.json();
    setShortLink(shortLinkData.url);
  }

  const handlePlaceChanged = () => {
    const place = autocomplete.getPlace();
    if (place && place.name) {
      const businessNameWithAddress = place.name + ', ' + place.formatted_address;
      setBusinessName(businessNameWithAddress);
    }
  }

  useEffect(() => {
    const loadScript = () => {
      const script = document.createElement('script');
      script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCKgGs2_MctTb9Cf4MqTyP9vyU7Q6FnMFw&libraries=places';
      script.async = true;
      script.onload = () => setMapsLoaded(true);
      document.head.appendChild(script);
    };

    loadScript();

    return () => {
      // Cleanup if necessary
      const script = document.querySelector(
        `script[src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCKgGs2_MctTb9Cf4MqTyP9vyU7Q6FnMFw&libraries=places"]`
      );
      if (script) {
        script.remove();
      }
    };
  }, []);

  useEffect(() => {
    if (mapsLoaded && typeof window.google !== 'undefined') {
      autocomplete = new window.google.maps.places.Autocomplete(inputData.current, { types: ['restaurant', 'store', 'supermarket', 'university', 'cafe'] });
      autocomplete.addListener('place_changed', handlePlaceChanged);
    }
  }, [mapsLoaded]);

  return (
    <div className='flex justify-center bg-background bg-cover bg-no-repeat h-screen pt-24 xs:px-6 sm:px-12 md:px-36'>
      <div className='relative flex flex-col gap-10 max-w-[920px]'>
        <h1 className='text-center text-5xl'>Google <span className='text-blue-600'>Review Link Generator</span></h1>
        <div className='flex justify-center w-full'>
          <p className='text-center'>Grow your online reputation with our free Google review link generator. In just a few clicks, generate unique Google review link and effortlessly share it with your customers.</p>
        </div>
        <div className='flex justify-center'>
          <div className='rounded-md bg-white w-full md:p-11 sm:p-8 xs:p-6'>
            <form onSubmit={handleSubmit} className='h-full'>
              <div className='flex flex-col h-full justify-between'>
                <label className='text-md'>Select your business</label>
                <div className='flex xs:flex-col sm:flex-col md:flex-row gap-4'>
                  <input ref={inputData} id="autocomplete" placeholder="Enter your address" type="text" className='md:flex-1 xs:h-12 sm:h-12 px-2.5 rounded border' />
                  <button type='submit' className='sm:self-center xs:self-center w-44 rounded-full bg-indigo-600 text-white p-4'>Generate my Link</button>
                </div>
                <div className='mt-2'>Review Link: {reviewLink && shortLink && <a href={reviewLink}>{shortLink}</a>}</div>
              </div>
            </form>
          </div>
        </div>
        <div className='absolute -left-24 top-10 md:block sm:hidden xs:hidden'>
          <Image src={Arrow} width={90} height={150} />
        </div>
        </div>
    </div>
  )
}

export default Home;
