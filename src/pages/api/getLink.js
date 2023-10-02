export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { businessName } = req.body;
  const mockPlaceId = 'AIzaSyCKgGs2_MctTb9Cf4MqTyP9vyU7Q6FnMFw';

  const googleReviewLink = `https://search.google.com/local/writereview?placeid=${mockPlaceId}`;
  res.status(200).json({ link: googleReviewLink });
}
