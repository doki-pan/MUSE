import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new DatabaseSync(join(__dirname, '../data/muse.db'));

// Create tables first
db.exec(`
  PRAGMA foreign_keys = ON;

  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    artist TEXT NOT NULL,
    album TEXT,
    level TEXT,
    art TEXT,
    audio_url TEXT,
    lyric_url TEXT,
    duration_seconds INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS lyric_lines (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    song_id INTEGER NOT NULL,
    line_index INTEGER NOT NULL,
    start_time_ms INTEGER NOT NULL,
    text TEXT NOT NULL,
    translation TEXT,
    FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE,
    UNIQUE(song_id, line_index)
  );

  CREATE TABLE IF NOT EXISTS line_analysis (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    line_id INTEGER NOT NULL,
    kind TEXT NOT NULL CHECK(kind IN ('word', 'grammar', 'expression')),
    term TEXT NOT NULL,
    meaning TEXT NOT NULL,
    note TEXT,
    audio_url TEXT,
    FOREIGN KEY (line_id) REFERENCES lyric_lines(id) ON DELETE CASCADE,
    UNIQUE(line_id, kind, term)
  );

  CREATE TABLE IF NOT EXISTS daily_learning (
    study_date TEXT PRIMARY KEY,
    minutes INTEGER NOT NULL DEFAULT 0,
    songs_completed INTEGER NOT NULL DEFAULT 0,
    lines_completed INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_lyric_lines_song ON lyric_lines(song_id);
  CREATE INDEX IF NOT EXISTS idx_line_analysis_line ON line_analysis(line_id);
`);

// Seed initial song data
const seedSong = db.prepare(`
  INSERT OR IGNORE INTO songs (id, title, artist, album, level, art, audio_url, lyric_url, duration_seconds)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

seedSong.run(1, 'REALLY REALLY', 'WINNER', 'EVERYD4Y', 'B1', 'yellow', '/assets/winner-really-really.mp3', '/assets/winner-really-really.lrc', 204);
seedSong.run(2, 'Ditto', 'NewJeans', 'OMG', 'A2', 'lemon', '', '', 0);
seedSong.run(3, 'Love Lee', 'AKMU', 'LOVE EPISODE', 'B2', 'vienna', '', '', 0);

// Parse and insert lyrics
const lineCount = db.prepare('SELECT COUNT(*) AS count FROM lyric_lines WHERE song_id = 1').get().count;

if (!lineCount) {
  const lrcPath = join(__dirname, '../assets/winner-really-really.lrc');
  const lrcContent = readFileSync(lrcPath, 'utf8');

  const translations = {
    '어디야 집이야': '你在哪儿？在家吗？',
    '안 바쁨 나와봐': '不忙的话，出来见我吧。',
    '너네 집 앞이야': '我就在你家门口。',
    '너에게 하고픈 말이 있어': '我有话想对你说。',
    '널 좋아해': '我喜欢你。',
    '내 맘을 믿어줘': '请相信我的心意。',
    '멋지게 골인': '漂亮地到达终点 / 成功告白。',
    '프러포즈 같은 세리머니': '像求婚一样的庆祝仪式。',
    '첫눈에 미끄러지듯이': '像一见钟情般陷入其中。',
    'Falling in love': '坠入爱河。',
    'A lot of alcohol': '需要喝很多酒。',
    '혹시라도 내가': '如果万一我让你……'
  };

  const insertLine = db.prepare(`
    INSERT INTO lyric_lines (song_id, line_index, start_time_ms, text, translation)
    VALUES (?, ?, ?, ?, ?)
  `);

  let lineIndex = 0;
  for (const rawLine of lrcContent.split(/\r?\n/)) {
    const match = rawLine.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
    if (!match || !match[3].trim()) continue;

    const text = match[3].trim();
    const timeMs = Math.round((Number(match[1]) * 60 + Number(match[2])) * 1000);
    const translation = translations[text] || '结合上下文理解这句歌词的语气。';

    insertLine.run(1, lineIndex++, timeMs, text, translation);
  }

  // Insert word/grammar/expression analysis
  const insertAnalysis = db.prepare(`
    INSERT OR IGNORE INTO line_analysis (line_id, kind, term, meaning, note, audio_url)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const lines = db.prepare('SELECT id, text FROM lyric_lines WHERE song_id = 1').all();

  const addAnalysis = (text, kind, term, meaning, note) => {
    const line = lines.find(l => l.text === text);
    if (line) insertAnalysis.run(line.id, kind, term, meaning, note, '');
  };

  // Word analysis
  addAnalysis('어디야 집이야', 'word', '어디야', '在哪里', '어디야? · 你在哪儿？');
  addAnalysis('어디야 집이야', 'word', '집이야', '是家 / 在家', '집이야 · 在家吗？');
  addAnalysis('어디야 집이야', 'grammar', '-야?', '口语疑问句', '相当于"是……吗？/在……吗？"');

  addAnalysis('안 바쁨 나와봐', 'word', '안 바쁨', '不忙', '안 바쁘다 · 不忙');
  addAnalysis('안 바쁨 나와봐', 'word', '나와봐', '出来看看 / 出来吧', '잠깐 나와봐 · 出来一下');
  addAnalysis('안 바쁨 나와봐', 'grammar', '-아/어 봐', '建议或请求尝试', '表示"……看看 / ……吧"');

  addAnalysis('너네 집 앞이야', 'word', '너네 집', '你家', '너네 집 앞 · 你家门前');
  addAnalysis('너네 집 앞이야', 'grammar', '-이야', '口语判断句尾', '表示"是…… / 在……"');

  addAnalysis('너에게 하고픈 말이 있어', 'word', '너에게', '对你', '너에게 말하다 · 对你说');
  addAnalysis('너에게 하고픈 말이 있어', 'expression', '하고픈 말이 있어', '我有话想对你说', '告白或认真谈话前的铺垫');
  addAnalysis('너에게 하고픈 말이 있어', 'grammar', '-고픈', '想要……的缩略口语', '하고픈 말 · 想说的话');

  addAnalysis('널 좋아해', 'word', '널', '你（너를 的缩写）', '널 바라보다 · 看着你');
  addAnalysis('널 좋아해', 'expression', '널 좋아해', '我喜欢你', '日常告白表达');

  addAnalysis('내 맘을 믿어줘', 'word', '맘', '心意（마음 的口语）', '내 맘 · 我的心意');
  addAnalysis('내 맘을 믿어줘', 'grammar', '-아/어 줘', '请为我做……', '믿어줘 · 请相信我');

  addAnalysis('프러포즈 같은 세리머니', 'word', '프러포즈', '求婚', '프러포즈를 하다 · 求婚');
  addAnalysis('프러포즈 같은 세리머니', 'word', '세리머니', '庆祝仪式', '우승 세리머니 · 冠军庆祝');
  addAnalysis('프러포즈 같은 세리머니', 'grammar', '같은', '像……一样', '表示比较和比喻');

  addAnalysis('첫눈에 미끄러지듯이', 'grammar', '-듯이', '仿佛……一样', '미끄러지듯이 · 像滑进去一样');

  addAnalysis('Falling in love', 'expression', 'Falling in love', '坠入爱河', '英语固定表达');
  addAnalysis('A lot of alcohol', 'expression', 'A lot of alcohol', '很多酒', '数量表达');

  console.log('✅ Lyrics and analysis data seeded successfully');
}

// Seed calendar data
for (let day = 1; day <= 29; day++) {
  const minutes = [8,22,5,31,16,18,0,42,12,0,6,0,0,28,0,9,0,35,0,0,14,0,7,0,26,0,18,0,4][day - 1] || 0;
  db.prepare(`
    INSERT OR IGNORE INTO daily_learning (study_date, minutes, songs_completed, lines_completed)
    VALUES (?, ?, ?, ?)
  `).run(`2026-09-${String(day).padStart(2, '0')}`, minutes, day % 4 === 0 ? 1 : 0, day % 5 === 0 ? 3 : 0);
}

console.log('✅ Database seeded successfully');
db.close();
