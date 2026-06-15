<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Saif Live TV</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <link rel="stylesheet" href="https://vjs.zencdn.net/8.10.0/video-js.css">
    <style>
        :root {
            --bg: #0a0a0c;
            --card: #121214;
            --gold: #ffd700;
            --fire1: #ff4500;
            --fire2: #ff8c00;
            --text: #ffffff;
            --danger: #ff3333;
            --success: #25D366;
        }
        * { margin:0; padding:0; box-sizing:border-box; }
        body {
            background: var(--bg);
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            color: var(--text);
            min-height: 100vh;
            overflow-x: hidden;
            position: relative;
        }
        body::before {
            content: '';
            position: fixed;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle at 50% 50%, rgba(255,140,0,0.06) 0%, transparent 70%),
                        radial-gradient(circle at 80% 20%, rgba(255,215,0,0.04) 0%, transparent 60%);
            animation: bgRotate 30s linear infinite;
            z-index: 0;
            pointer-events: none;
        }
        @keyframes bgRotate { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .tv-container { position: relative; z-index: 1; max-width: 900px; margin: 0 auto; padding: 20px; }
        .header {
            display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px;
            margin-bottom: 25px; background: rgba(18,18,20,0.8); backdrop-filter: blur(15px);
            border: 1px solid rgba(255,215,0,0.12); border-radius: 20px; padding: 15px 25px;
        }
        .logo-area { display: flex; align-items: center; gap: 12px; }
        .logo-img { width: 45px; height: 45px; border-radius: 12px; object-fit: contain; background: #1a1a22; padding: 5px; }
        .logo-text { font-size: 1.8rem; font-weight: 900; color: var(--gold); }
        .live-status { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--success); background: rgba(37,211,102,0.1); padding: 8px 15px; border-radius: 25px; border: 1px solid rgba(37,211,102,0.2); }
        .live-status i { animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }
        .server-down-banner {
            text-align: center; padding: 10px; margin-top: -10px; margin-bottom: 15px;
            background: rgba(255,51,51,0.15); border: 1px solid rgba(255,51,51,0.3);
            border-radius: 12px; font-weight: 700; font-size: 0.9rem; color: var(--danger);
            display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .server-down-banner i { font-size: 1.1rem; }
        .player-wrapper { width: 100%; aspect-ratio: 16 / 9; border-radius: 20px; overflow: hidden; border: 2px solid rgba(255,215,0,0.2); background: #000; margin-bottom: 25px; box-shadow: 0 15px 40px rgba(0,0,0,0.8); }
        .video-js { width: 100% !important; height: 100% !important; }
        .video-js .vjs-big-play-button { background: linear-gradient(135deg, var(--fire1), var(--fire2)) !important; border: none !important; color: #000 !important; border-radius: 50% !important; width: 70px !important; height: 70px !important; line-height: 70px !important; margin-left: -35px !important; margin-top: -35px !important; box-shadow: 0 0 25px rgba(255,102,0,0.8); }
        .video-js .vjs-big-play-button:hover { transform: scale(1.1); }
        .section-title { font-size: 0.95rem; color: var(--gold); margin: 18px 0 10px; font-weight: 800; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 1px; }
        .hot-channels, .recent-channels { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 15px; }
        .hot-channels::-webkit-scrollbar, .recent-channels::-webkit-scrollbar { height: 4px; }
        .hot-channels::-webkit-scrollbar-thumb, .recent-channels::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }
        .mini-card { background: rgba(255,215,0,0.05); border: 1px solid rgba(255,215,0,0.15); border-radius: 14px; padding: 10px 14px; cursor: pointer; white-space: nowrap; min-width: 100px; transition: all 0.25s; font-weight: 700; font-size: 0.8rem; text-align: center; }
        .mini-card:hover { border-color: var(--gold); background: rgba(255,215,0,0.1); transform: translateY(-3px); }
        .search-wrapper { position: relative; margin-bottom: 20px; }
        .search-wrapper i { position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: rgba(255,215,0,0.5); }
        .search-box { width: 100%; padding: 14px 20px 14px 45px; border-radius: 14px; border: 1px solid rgba(255,215,0,0.15); background: #1a1a22; color: #fff; outline: none; font-size: 0.95rem; }
        .search-box:focus { border-color: var(--gold); }
        .search-box::placeholder { color: rgba(255,255,255,0.4); }
        .category-tabs { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 20px; }
        .category-tabs::-webkit-scrollbar { height: 3px; }
        .category-tabs::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }
        .tab-btn { padding: 8px 18px; border-radius: 20px; border: 1px solid rgba(255,215,0,0.2); background: rgba(255,215,0,0.03); color: #ccc; cursor: pointer; font-size: 0.8rem; font-weight: 700; white-space: nowrap; transition: all 0.3s; }
        .tab-btn.active { background: linear-gradient(135deg, var(--fire1), var(--fire2)); color: #000; border-color: var(--fire2); box-shadow: 0 4px 15px rgba(255,102,0,0.4); }
        .channel-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 12px; max-height: 500px; overflow-y: auto; padding-right: 5px; }
        .channel-grid::-webkit-scrollbar { width: 5px; }
        .channel-grid::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 10px; }
        .channel-card { background: var(--card); border: 1.5px solid rgba(255,215,0,0.1); border-radius: 16px; padding: 14px 10px; text-align: center; cursor: pointer; transition: all 0.25s; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .channel-card:hover { border-color: var(--gold); background: rgba(255,215,0,0.06); transform: translateY(-4px); }
        .channel-card.active { border-color: var(--fire2); background: rgba(255,140,0,0.2); box-shadow: 0 0 15px rgba(255,102,0,0.4); }
