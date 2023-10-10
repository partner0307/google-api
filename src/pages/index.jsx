import React, { useState, useEffect, useRef } from 'react';

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
    <div className='flex flex-col gap-8 pt-24 px-36 h-screen bg-background bg-cover bg-no-repeat'>
      <h1 className='text-center text-5xl'>Google <span className='text-blue-600'>Review Link Generator</span></h1>
      <p className='text-center'>Grow your online reputation with our free Google review link generator. In just a few clicks, generate unique Google review link and effortlessly share it with your customers.</p>
      <div className='flex justify-center'>
        <div className='rounded-md bg-white max-w-[920px] w-full p-11'>
          <form onSubmit={handleSubmit} className='h-full'>
            <div className='flex flex-col h-full justify-between'>
              <label className='text-md'>Select your business</label>
              <div className='flex gap-4'>
                <input ref={inputData} id="autocomplete" placeholder="Enter your address" type="text" className='flex-1 min-h-6 w-full px-2.5 rounded border' />
                <button type='submit' className='w-44 rounded-full bg-indigo-600 text-white p-4'>Generate my Link</button>
              </div>
              <div className='mt-2'>Review Link: {reviewLink && shortLink && <a href={reviewLink}>{shortLink}</a>}</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Home;
