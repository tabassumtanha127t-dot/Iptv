export default async function handler(req, res) {
    // CORS Headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // ⚠️ এখানে আপনার নিজের রেপোর tv.m3u ফাইলের RAW লিংকটি বসান
    const M3U_SOURCE_URL = 'https://raw.githubusercontent.com/tabassumtanha127t-dot/Iptv/main/tv.m3u';

    try {
        const response = await fetch(M3U_SOURCE_URL);
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch IPTV data from source' });
        }

        const data = await response.text();
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
