import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(root, 'muse.sqlite'));
db.exec(`
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS songs (id INTEGER PRIMARY KEY, title TEXT NOT NULL, artist TEXT NOT NULL, album TEXT, level TEXT, art TEXT, audio_url TEXT, lyric_url TEXT, duration_seconds INTEGER DEFAULT 0);
  CREATE TABLE IF NOT EXISTS lyric_lines (id INTEGER PRIMARY KEY, song_id INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE, line_index INTEGER NOT NULL, start_time_ms INTEGER NOT NULL, text TEXT NOT NULL, translation TEXT, UNIQUE(song_id, line_index));
  CREATE TABLE IF NOT EXISTS line_analysis (id INTEGER PRIMARY KEY, line_id INTEGER NOT NULL REFERENCES lyric_lines(id) ON DELETE CASCADE, kind TEXT NOT NULL, term TEXT NOT NULL, meaning TEXT NOT NULL, note TEXT NOT NULL, audio_url TEXT, UNIQUE(line_id, kind, term));
  CREATE TABLE IF NOT EXISTS daily_learning (study_date TEXT PRIMARY KEY, minutes INTEGER NOT NULL DEFAULT 0, songs_completed INTEGER NOT NULL DEFAULT 0, lines_completed INTEGER NOT NULL DEFAULT 0);
`);

const seedSong = db.prepare('INSERT OR IGNORE INTO songs (id,title,artist,album,level,art,audio_url,lyric_url,duration_seconds) VALUES (?,?,?,?,?,?,?,?,?)');
seedSong.run(1, 'REALLY REALLY', 'WINNER', 'EVERYD4Y', 'B1', 'yellow', '/assets/winner-really-really.mp3', '/assets/winner-really-really.lrc', 204);
seedSong.run(2, 'Ditto', 'NewJeans', 'OMG', 'A2', 'lemon', '', '', 0);
seedSong.run(3, 'Love Lee', 'AKMU', 'LOVE EPISODE', 'B2', 'vienna', '', '', 0);

const lineCount = db.prepare('SELECT COUNT(*) AS count FROM lyric_lines WHERE song_id=1').get().count;
if (!lineCount) {
  const lrc = fs.readFileSync(path.join(root, 'assets', 'winner-really-really.lrc'), 'utf8');
  const insertLine = db.prepare('INSERT INTO lyric_lines (song_id,line_index,start_time_ms,text,translation) VALUES (?,?,?,?,?)');
  const translations = { '어디야 집이야': '你在哪儿？在家吗？', '안 바쁨 나와봐': '不忙的话，出来见我吧。', '너네 집 앞이야': '我就在你家门口。', '너에게 하고픈 말이 있어': '我有话想对你说。', '널 좋아해': '我喜欢你。', '내 맘을 믿어줘': '请相信我的心意。', '멋지게 골인': '漂亮地到达终点 / 成功告白。', '프러포즈 같은 세리머니': '像求婚一样的庆祝仪式。', '첫눈에 미끄러지듯이': '像一见钟情般陷入其中。', 'Falling in love': '坠入爱河。', 'A lot of alcohol': '需要喝很多酒。', '혹시라도 내가': '如果万一我让你……' };
  let index = 0;
  for (const raw of lrc.split(/\r?\n/)) {
    const match = raw.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
    if (!match || !match[3].trim()) continue;
    const text = match[3].trim();
    insertLine.run(1, index++, Math.round((Number(match[1]) * 60 + Number(match[2])) * 1000), text, translations[text] || '结合上下文理解这句歌词的语气。');
  }
  const analysis = db.prepare('INSERT OR IGNORE INTO line_analysis (line_id,kind,term,meaning,note,audio_url) VALUES (?,?,?,?,?,?)');
  const lines = db.prepare('SELECT id,text FROM lyric_lines WHERE song_id=1').all();
  const add = (text, kind, term, meaning, note) => { const line = lines.find((item) => item.text === text); if (line) analysis.run(line.id, kind, term, meaning, note, ''); };
  add('어디야 집이야','word','어디야','在哪里','어디야? · 你在哪儿？'); add('어디야 집이야','word','집이야','是家 / 在家','집이야 · 在家吗？'); add('어디야 집이야','grammar','-야?','口语疑问句','相当于“是……吗？/在……吗？”');
  add('안 바쁨 나와봐','word','안 바쁨','不忙','안 바쁘다 · 不忙'); add('안 바쁨 나와봐','word','나와봐','出来看看 / 出来吧','잠깐 나와봐 · 出来一下'); add('안 바쁨 나와봐','grammar','-아/어 봐','建议或请求尝试','表示“……看看 / ……吧”');
  add('너네 집 앞이야','word','너네 집','你家','너네 집 앞 · 你家门前'); add('너네 집 앞이야','grammar','-이야','口语判断句尾','表示“是…… / 在……”');
  add('너에게 하고픈 말이 있어','word','너에게','对你','너에게 말하다 · 对你说'); add('너에게 하고픈 말이 있어','expression','하고픈 말이 있어','我有话想对你说','告白或认真谈话前的铺垫'); add('너에게 하고픈 말이 있어','grammar','-고픈','想要……的缩略口语','하고픈 말 · 想说的话');
  add('널 좋아해','word','널','你（너를 的缩写）','널 바라보다 · 看着你'); add('널 좋아해','expression','널 좋아해','我喜欢你','日常告白表达');
  add('내 맘을 믿어줘','word','맘','心意（마음 的口语）','내 맘 · 我的心意'); add('내 맘을 믿어줘','grammar','-아/어 줘','请为我做……','믿어줘 · 请相信我');
  add('프러포즈 같은 세리머니','word','프러포즈','求婚','프러포즈를 하다 · 求婚'); add('프러포즈 같은 세리머니','word','세리머니','庆祝仪式','우승 세리머니 · 冠军庆祝'); add('프러포즈 같은 세리머니','grammar','같은','像……一样','表示比较和比喻');
  add('첫눈에 미끄러지듯이','grammar','-듯이','仿佛……一样','미끄러지듯이 · 像滑进去一样');
  add('Falling in love','expression','Falling in love','坠入爱河','英语固定表达'); add('A lot of alcohol','expression','A lot of alcohol','很多酒','数量表达');
}
for (let day = 1; day <= 29; day += 1) db.prepare('INSERT OR IGNORE INTO daily_learning (study_date,minutes,songs_completed,lines_completed) VALUES (?,?,?,?)').run(`2026-09-${String(day).padStart(2,'0')}`, [8,22,5,31,16,18,0,42,12,0,6,0,0,28,0,9,0,35,0,0,14,0,7,0,26,0,18,0,4][day - 1] || 0, day % 4 === 0 ? 1 : 0, day % 5 === 0 ? 3 : 0);

function json(res, data, status = 200) { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)); }
function songPayload(id) { const song = db.prepare('SELECT * FROM songs WHERE id=?').get(id); if (!song) return null; const lines = db.prepare('SELECT * FROM lyric_lines WHERE song_id=? ORDER BY line_index').all(id); const analyses = db.prepare('SELECT la.*, ll.line_index FROM line_analysis la JOIN lyric_lines ll ON ll.id=la.line_id WHERE ll.song_id=? ORDER BY ll.line_index, la.kind, la.id').all(id); return { song, lines, analyses }; }
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.mp3':'audio/mpeg', '.lrc':'text/plain; charset=utf-8' };
const server = http.createServer((req, res) => { const url = new URL(req.url, 'http://localhost'); if (url.pathname === '/api/home') return json(res, { songs: db.prepare('SELECT * FROM songs ORDER BY id').all(), calendar: db.prepare('SELECT * FROM daily_learning ORDER BY study_date').all() }); const match = url.pathname.match(/^\/api\/songs\/(\d+)$/); if (match) { const payload = songPayload(Number(match[1])); return payload ? json(res, payload) : json(res, { error: 'Song not found' }, 404); } const requested = url.pathname === '/' ? '/index.html' : url.pathname; const file = path.normalize(path.join(root, requested)); if (!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, { error: 'Not found' }, 404); res.writeHead(200, { 'Content-Type': mime[path.extname(file)] || 'application/octet-stream' }); fs.createReadStream(file).pipe(res); });
server.listen(4173, '127.0.0.1', () => console.log('MUSE server running at http://127.0.0.1:4173'));
