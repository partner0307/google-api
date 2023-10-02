import React, { useState } from 'react';

const Home = () => {
  const [businessName, setBusinessName] = useState('');
  const [reviewLink, setReviewLink] = useState('');
  const [shortLink, setShortLink] = useState('');
  
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
        'apikey': process.env.REBRANDLY_API_KEY,
      }
    });

    const shortenedData = await shortenedResponse.json();
    setShortLink(shortenedData.shortUrl);
  }

  return (
    <div>
      <h1>Google Review Link Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>Business Name: <input type='text' value={businessName} id='businessName' onChange={e => setBusinessName(e.target.value)} /></label>
        <button type='submit'>Generate Link</button>
      </form>
      {reviewLink && <p>Google Review Link: {reviewLink}</p>}
      {shortLink && <p>Shortened Link: {shortLink}</p>}
    </div>
  )
}

export default Home;