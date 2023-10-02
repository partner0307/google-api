import React, { useState } from 'react';

const Home = () => {
  const [businessName, setBusinessName] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/getLink', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ businessName })
    });
    const data = await response.json();
    if(data.link) {
      console.log(data.link);
    }
  }

  return (
    <div>
      <h1>Google Review Link Generator</h1>
      <form onSubmit={handleSubmit}>
        <label>Business Name: <input type='text' value={businessName} id='businessName' onChange={e => setBusinessName(e.target.value)} /></label>
        <button type='submit'>Generate Link</button>
      </form>
    </div>
  )
}

export default Home;