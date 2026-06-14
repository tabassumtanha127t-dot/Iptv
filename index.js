import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // CORS Headers যেন আপনার পোর্টফোলিও এটি রিড করতে পারে
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // একদম সামনে থাকা লোকাল tv.m3u ফাইলটি রিড করছে
        const filePath = path.join(process.cwd(), 'tv.m3u');
        const data = fs.readFileSync(filePath, 'utf8');
        
        res.setHeader('Content-Type', 'text/plain');
        return res.status(200).send(data);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error. File not found.' });
    }
}
