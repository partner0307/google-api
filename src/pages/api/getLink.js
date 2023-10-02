export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { businessName } = req.body;
  const mockPlaceId = 'ChIJQ9MPHF5YwokRNOs38qSxDM8';

  const googleReviewLink = `https://search.google.com/local/writereview?placeid=${mockPlaceId}`;
  res.status(200).json({ link: googleReviewLink });
}
