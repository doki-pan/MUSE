import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const db = new DatabaseSync(path.join(root, 'muse.sqlite'));

console.log('=== 检查数据库中的歌词数据 ===\n');

const lineCount = db.prepare('SELECT COUNT(*) as count FROM lyric_lines WHERE song_id=1').get();
console.log(`数据库中的歌词行数: ${lineCount.count}`);

if (lineCount.count > 0) {
  console.log('\n前 10 行歌词:');
  const lines = db.prepare('SELECT line_index, start_time_ms, text, translation FROM lyric_lines WHERE song_id=1 ORDER BY line_index LIMIT 10').all();
  lines.forEach(line => {
    const time = (line.start_time_ms / 1000).toFixed(2);
    console.log(`  [${time}s] ${line.text}`);
  });
} else {
  console.log('\n❌ 数据库中没有歌词数据！');
}

db.close();
