import express from 'express';
import cors from 'cors';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const db = new DatabaseSync(join(__dirname, '../data/muse.db'));

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(join(__dirname, '../assets')));

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

// API Routes

// GET /api/songs - Get all songs
app.get('/api/songs', (req, res) => {
  try {
    const songs = db.prepare('SELECT * FROM songs ORDER BY id').all();
    res.json({ success: true, data: songs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/songs/:id - Get song details with lyrics and analysis
app.get('/api/songs/:id', (req, res) => {
  try {
    const { id } = req.params;
    const song = db.prepare('SELECT * FROM songs WHERE id = ?').get(id);

    if (!song) {
      return res.status(404).json({ success: false, error: 'Song not found' });
    }

    const lines = db.prepare(`
      SELECT * FROM lyric_lines
      WHERE song_id = ?
      ORDER BY line_index
    `).all(id);

    const analyses = db.prepare(`
      SELECT la.*, ll.line_index
      FROM line_analysis la
      JOIN lyric_lines ll ON ll.id = la.line_id
      WHERE ll.song_id = ?
      ORDER BY ll.line_index, la.kind, la.id
    `).all(id);

    res.json({
      success: true,
      data: { song, lines, analyses }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/calendar - Get learning calendar data
app.get('/api/calendar', (req, res) => {
  try {
    const calendar = db.prepare(`
      SELECT * FROM daily_learning
      ORDER BY study_date DESC
      LIMIT 90
    `).all();
    res.json({ success: true, data: calendar });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/calendar - Update daily learning record
app.post('/api/calendar', (req, res) => {
  try {
    const { study_date, minutes, songs_completed, lines_completed } = req.body;

    db.prepare(`
      INSERT INTO daily_learning (study_date, minutes, songs_completed, lines_completed)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(study_date) DO UPDATE SET
        minutes = minutes + excluded.minutes,
        songs_completed = songs_completed + excluded.songs_completed,
        lines_completed = lines_completed + excluded.lines_completed
    `).run(study_date, minutes || 0, songs_completed || 0, lines_completed || 0);

    res.json({ success: true, message: 'Learning record updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/home - Get home page data (songs + recent calendar)
app.get('/api/home', (req, res) => {
  try {
    const songs = db.prepare('SELECT * FROM songs ORDER BY id').all();
    const calendar = db.prepare('SELECT * FROM daily_learning ORDER BY study_date').all();
    res.json({ success: true, data: { songs, calendar } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🎵 MUSE API Server running on http://localhost:${PORT}`);
});
