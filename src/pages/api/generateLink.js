export default async function handler(req, res) {
    if (req.method !== 'POST') { return res.status(405).end(); }
    const { businessName } = req.body;
    try {
        const googleResponse = await fetch(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(businessName)}&inputtype=textquery&fields=place_id&key=${process.env.GOOGLE_API_KEY}`)
        const googleData = await googleResponse.json();
        console.log(googleData)

        if (googleData.status !== 'OK' || !googleData.candidates || googleData.candidates.length === 0) {
            return res.status(404).json({ error: 'Business not found' });
        }
        const placeId = googleData.candidates[0].place_id;
        const googleReviewLink = `https://search.google.com/local/writereview?placeid=${placeId}`;
        res.status(200).json({ link: googleReviewLink })
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}