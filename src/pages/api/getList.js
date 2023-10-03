export default async function handler(req, res) {
  if (req.method !== 'POST') { return res.status(405).end(); }
  const { name } = req.body;

  try {
      const googleResponse = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(name)}&inputtype=textquery&fields=name&key=${process.env.GOOGLE_API_KEY}`)
      const googleData = await googleResponse.json();
      
      if (googleData.status !== 'OK' || !googleData.candidates || googleData.candidates.length === 0) {
        return res.status(404).json({ error: 'Business not found' });
      }
      const list = googleData.candidates;
      console.log(list);
      res.status(200).json({ list });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
}
