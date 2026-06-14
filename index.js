export default async function handler(req, res) {
    // CORS Headers সেট করা যেন আপনার সাইট এটি ব্লক না করে
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // ডিরেক্ট আপনার এই প্রজেক্টেরই স্ট্যাটিক tv.m3u ফাইলের রুট থেকে ফেচ করবে
        const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `http://${req.headers.host}`;
        const response = await fetch(`${baseUrl}/tv.m3u`);
        
        if (!response.ok) {
            return res.status(500).json({ error: 'tv.m3u file could not be fetched statically.' });
        }

        const data = await response.text();
        
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
