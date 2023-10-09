export default async function handler(req, res) {
    if (req.method !== 'POST') { return res.status(405).end(); }
    const { link } = req.body;
    const shortenedResponse = await fetch('https://api.dub.co/links?slug=Trustjoy', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 42ay4mZJ6YbrZbSZlgqs4iDe',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ domain: 'trustjoy.app', url: link })
    });

    const shortenedData = await shortenedResponse.json();
    res.json({ url: shortenedData.domain + '/' + shortenedData.key});
}