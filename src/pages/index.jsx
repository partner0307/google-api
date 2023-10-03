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
    const shortenedResponse = await fetch('https://api.rebrandly.com/v1/links', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': 'f0965eec5d2549298769d8182d4e49c2',
      },
      body: JSON.stringify({ destination: data.link })
    });

    const shortenedData = await shortenedResponse.json();
    setShortLink(shortenedData.shortUrl);
  }

  const handlePlaceChanged = () => {
    const place = autocomplete.getPlace();
    if (place && place.name) {
      console.log(place.name);
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
    <div>
      <h1>Google Review Link Generator</h1>
      <form onSubmit={handleSubmit}>
        <input ref={inputData} id="autocomplete" placeholder="Enter your address" type="text" />
        <button type='submit'>Generate Link</button>
      </form>
      {reviewLink && shortLink && <a href={reviewLink}>Review Link: trustjoy.link/{shortLink.split('/')[1]}</a>}
    </div>
  )
}

export default Home;
