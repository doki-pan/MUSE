const songs = document.querySelectorAll('.song-row');
const heroSong = document.querySelector('#heroSong');
const heroArtist = document.querySelector('#heroArtist');
const heroProgress = document.querySelector('#heroProgress');
const currentTime = document.querySelector('#currentTime');
const heroPlay = document.querySelector('#heroPlay');
const heroArt = document.querySelector('#heroArt');
const toast = document.querySelector('#toast');
const importSheet = document.querySelector('#importSheet');
const sheetBackdrop = document.querySelector('#sheetBackdrop');
const playlistInput = document.querySelector('#playlistInput');
const homeView = document.querySelector('#homeView');
const learningView = document.querySelector('#learningView');
const learningSong = document.querySelector('#learningSong');
const learningArtist = document.querySelector('#learningArtist');
const globalTopbar = document.querySelector('#globalTopbar');
const audioFile = document.querySelector('#audioFile');
const audioStatus = document.querySelector('#audioStatus');
const lyricPrevious = document.querySelector('#lyricPrevious');
const lyricCurrent = document.querySelector('#lyricCurrent');
const lyricNext = document.querySelector('#lyricNext');
const lyricTranslation = document.querySelector('#lyricTranslation');
const lineCounter = document.querySelector('#lineCounter');
const wordList = document.querySelector('.word-list');
const lessonProgress = document.querySelector('.lesson-progress span');

let isPlaying = false;
let toastTimer;
let audioUrl = '';
let lyricLines = [];
let currentLineIndex = -1;
let synthContext = null;
let synthTimer = null;
let synthStep = 0;
let sentenceTimer = null;
let playbackRate = 1;
let wordUtterance = null;
let wordAudio = null;
let manualSeekUntil = 0;
let sentenceMode = false;
let sentenceAudio = null;
let melody = [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23];
const melodyTracks = {
  yellow: [261.63, 329.63, 392, 329.63, 293.66, 349.23, 440, 349.23],
  lemon: [392, 440, 523.25, 440, 392, 349.23, 293.66, 349.23],
  vienna: [220, 261.63, 293.66, 329.63, 392, 329.63, 293.66, 261.63],
};

const lineLearning = {
  '어디야 집이야': { translation: '你在哪儿？在家吗？', words: [['어디야', '在哪里', '어디야? · 你在哪儿？'], ['집이야', '是家 / 在家', '집이야 · 在家吗？']] },
  '안 바쁨 나와봐': { translation: '不忙的话，出来见我吧。', words: [['안 바쁨', '不忙', '안 바쁘다 · 不忙'], ['나와봐', '出来看看 / 出来吧', '잠깐 나와봐 · 出来一下']] },
  '너네 집 앞이야': { translation: '我就在你家门口。', words: [['너네 집', '你家', '너네 집 앞 · 你家门前'], ['앞이야', '在前面', '집 앞이야 · 在家门口']] },
  '너에게 하고픈 말이 있어': { translation: '我有话想对你说。', words: [['너에게', '对你', '너에게 말하다 · 对你说'], ['하고픈 말', '想说的话', '하고픈 말이 있어 · 有话想说']] },
  '널 좋아해': { translation: '我喜欢你。', words: [['널', '你（너를 的缩写）', '널 바라보다 · 看着你'], ['좋아해', '喜欢', '정말 좋아해 · 真的喜欢']] },
  '내 맘을 믿어줘': { translation: '请相信我的心意。', words: [['맘', '心意（마음 的口语）', '내 맘 · 我的心意'], ['믿어줘', '请相信我', '나를 믿어줘 · 请相信我']] },
  '멋지게 골인': { translation: '漂亮地到达终点 / 成功告白。', words: [['멋지게', '帅气地、漂亮地', '멋지게 해내다 · 漂亮地完成'], ['골인', '进球、成功', '골인하다 · 成功达成']] },
  '프러포즈 같은 세리머니': { translation: '像求婚一样的庆祝仪式。', words: [['프러포즈', '求婚', '프러포즈를 하다 · 求婚'], ['세리머니', '庆祝仪式、庆祝动作', '우승 세리머니 · 冠军庆祝']] },
  '첫눈에 미끄러지듯이': { translation: '像一见钟情般陷入其中。', words: [['첫눈에', '一见之下', '첫눈에 반하다 · 一见钟情'], ['미끄러지듯이', '像滑进去一样', '미끄러지듯이 빠지다 · 陷入其中']] },
  'Falling in love': { translation: '坠入爱河。', words: [['falling', '正在坠入', 'falling in love · 坠入爱河'], ['in love', '恋爱中', 'be in love · 处于恋爱中']] },
  'A lot of alcohol': { translation: '需要喝很多酒。', words: [['a lot of', '许多', 'a lot of time · 很多时间'], ['alcohol', '酒精、酒', 'a glass of alcohol · 一杯酒']] },
  '혹시라도 내가': { translation: '如果万一我让你……', words: [['혹시라도', '万一、如果', '혹시라도 괜찮다면 · 如果可以的话'], ['내가', '我（作为主语）', '내가 할게 · 我来做']] },
};
const lineGrammar = {
  '어디야 집이야': [['-야?', '口语疑问句：相当于“是……吗？/在……吗？”', '어디야? · 在哪里？']],
  '안 바쁨 나와봐': [['-아/어 봐', '表示建议或请求尝试：“……看看 / ……吧”', '나와봐 · 出来看看']],
  '너네 집 앞이야': [['-이야', '名词后的口语判断句尾：“是…… / 在……”', '집 앞이야 · 在家门口']],
  '너에게 하고픈 말이 있어': [['-고픈', '“想要……”的缩略口语形式', '하고픈 말 · 想说的话']],
  '내 맘을 믿어줘': [['-아/어 줘', '请求对方为自己做某事：“请……”', '믿어줘 · 请相信我']],
  '프러포즈 같은 세리머니': [['같은', '表示比喻或相似：“像……一样”', '프러포즈 같은 · 像求婚一样']],
  '첫눈에 미끄러지듯이': [['-듯이', '表示比喻：“仿佛……一样”', '미끄러지듯이 · 像滑进去一样']],
  '혹시라도 내가': [['-라도', '表示让步或假设：“即使…… / 万一……”', '혹시라도 · 万一']],
};
const lineExpressions = {
  '어디야 집이야': [['어디야?', '你在哪儿？', '日常聊天中很自然的问法']],
  '안 바쁨 나와봐': [['나와봐', '出来见我吧', '比“나오세요”更亲近随意']],
  '너에게 하고픈 말이 있어': [['하고픈 말이 있어', '我有话想对你说', '告白或认真谈话前的铺垫']],
  '널 좋아해': [['널 좋아해', '我喜欢你', '널 = 너를 的口语缩写']],
  '내 맘을 믿어줘': [['내 맘을 믿어줘', '请相信我的心意', '맘是마음的口语说法']],
  '프러포즈 같은 세리머니': [['프러포즈 같은', '像求婚一样的', '같은用于比较和比喻']],
};

function escapeHtml(value) {
  return value.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
}

function getLineLearning(text) {
  const base = lineLearning[text] || { translation: '结合上下文理解这句歌词的语气。', words: [] };
  return { ...base, expressions: lineExpressions[text] || [], grammar: lineGrammar[text] || [] };
}

function renderLineWords(text) {
  const data = getLineLearning(text);
  const card = (item, type) => {
    const [term, meaning, note] = item;
    const playable = type !== 'grammar';
    return `<div class="analysis-row ${type}"><strong>${escapeHtml(term)}</strong><span>${escapeHtml(meaning)}</span><small>${escapeHtml(note)}</small>${playable ? `<button class="analysis-play" data-word="${escapeHtml(term)}" aria-label="播放${escapeHtml(term)}">▶</button>` : ''}</div>`;
  };
  const section = (label, items, type, empty = '暂无') => `<div class="analysis-section"><div class="analysis-section-title"><span>${label}</span><small>${items.length ? `${items.length} 条` : empty}</small></div>${items.length ? items.map((item) => card(item, type)).join('') : `<p class="analysis-empty">${empty}</p>`}</div>`;
  wordList.innerHTML = section('单词', data.words, 'word', '暂无单词') + section('表达', data.expressions, 'expression', '暂无表达') + section('语法', data.grammar, 'grammar', '暂无语法');
}

function renderLyricText(text) {
  const data = getLineLearning(text);
  let html = escapeHtml(text);
  data.words.forEach(([word]) => {
    const safeWord = escapeHtml(word);
    html = html.replace(safeWord, `<button class="word-chip" data-word="${safeWord}">${safeWord}</button>`);
  });
  lyricCurrent.innerHTML = html;
}

async function loadWinnerTrack() {
  audioUrl = 'assets/winner-really-really.mp3';
  window.currentAudio = new Audio(audioUrl);
  window.currentAudio.preload = 'metadata';
  window.currentAudio.playbackRate = playbackRate;
  window.currentAudio.addEventListener('loadedmetadata', () => {
    const duration = window.currentAudio.duration;
    if (Number.isFinite(duration)) document.querySelector('#durationTime').textContent = formatTime(duration);
  });
  window.currentAudio.addEventListener('timeupdate', syncLyrics);
  window.currentAudio.addEventListener('play', () => syncPlayButtons(true));
  window.currentAudio.addEventListener('pause', () => syncPlayButtons(false));
  try {
    const lrcText = await fetch('assets/winner-really-really.lrc').then((res) => res.text());
    lyricLines = parseLrc(lrcText);
    renderLyricLine(0, false);
  } catch {
    if (lyricTranslation) lyricTranslation.textContent = 'LRC 文件读取失败，但仍可播放音频';
  }
  if (audioStatus) audioStatus.textContent = '本地音频 · WINNER - REALLY REALLY';
}

function parseLrc(text) {
  return text.split(/\r?\n/).flatMap((line) => {
    // 跳过 JSON 格式的元数据行
    if (line.trim().startsWith('{')) return [];
    const match = line.match(/^\[(\d+):(\d+(?:\.\d+)?)\](.*)$/);
    if (!match || !match[3].trim()) return [];
    return [{ time: Number(match[1]) * 60 + Number(match[2]), text: match[3].trim() }];
  }).sort((a, b) => a.time - b.time).filter((line, index, lines) => index === 0 || line.time > lines[index - 1].time);
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

function renderLyricLine(index, animate = true) {
  if (!lyricLines.length) return;
  currentLineIndex = Math.max(0, Math.min(index, lyricLines.length - 1));
  lyricPrevious.textContent = lyricLines[currentLineIndex - 1]?.text || '开头';
  lyricPrevious.dataset.lineIndex = String(currentLineIndex - 1);
  lyricPrevious.disabled = currentLineIndex <= 0;
  if (animate) {
    lyricCurrent.classList.remove('line-enter');
    void lyricCurrent.offsetWidth;
    lyricCurrent.classList.add('line-enter');
  }
  renderLyricText(lyricLines[currentLineIndex].text);
  lyricCurrent.classList.add('is-syncing');
  lyricNext.textContent = lyricLines[currentLineIndex + 1]?.text || '歌曲结束';
  lyricNext.dataset.lineIndex = String(currentLineIndex + 1);
  lyricNext.disabled = currentLineIndex >= lyricLines.length - 1;
  lineCounter.textContent = `第 ${currentLineIndex + 1} 句`;
  if (lyricTranslation) lyricTranslation.textContent = getLineLearning(lyricLines[currentLineIndex].text).translation;
  renderLineWords(lyricLines[currentLineIndex].text);
  lessonProgress.style.width = `${((currentLineIndex + 1) / lyricLines.length) * 100}%`;
}

function syncLyrics() {
  const audio = window.currentAudio;
  if (!audio) return;
  const time = audio.currentTime;
  if (performance.now() < manualSeekUntil) return;
  const nextIndex = lyricLines.reduce((acc, line, index) => (line.time <= time ? index : acc), -1);
  // 逐句播放时，保持界面停留在用户点选的句子，避免 timeupdate 抢先切换到下一句。
  const displayIndex = sentenceMode ? currentLineIndex : nextIndex;
  if (!sentenceMode) {
    if (nextIndex < 0) {
      if (currentLineIndex !== 0) renderLyricLine(0, false);
      else {
        lyricPrevious.textContent = '开头';
        lyricNext.textContent = lyricLines[1]?.text || '歌曲结束';
        lyricPrevious.disabled = true;
        lyricNext.disabled = lyricLines.length <= 1;
        lineCounter.textContent = '第 1 句';
      }
    }
    if (nextIndex >= 0 && nextIndex !== currentLineIndex) renderLyricLine(nextIndex);
  }
  if (displayIndex >= 0 && lyricLines.length) {
    const nextTime = lyricLines[displayIndex + 1]?.time || audio.duration || (time + 1);
    const lineStart = lyricLines[displayIndex].time;
    const withinLine = Math.max(0, Math.min(1, (time - lineStart) / Math.max(0.25, nextTime - lineStart)));
    lessonProgress.style.width = `${Math.min(100, ((displayIndex + withinLine) / lyricLines.length) * 100)}%`;
  }
  const duration = audio.duration || 1;
  heroProgress.style.width = `${Math.min(100, (time / duration) * 100)}%`;
  currentTime.textContent = formatTime(time);
}

function syncPlayButtons(playing) {
  isPlaying = playing;
  heroPlay.classList.toggle('is-playing', playing);
  heroPlay.textContent = playing ? 'Ⅱ' : '▶';
  const lessonButton = document.querySelector('#playLesson');
  if (lessonButton) {
    lessonButton.classList.toggle('is-playing', playing);
    lessonButton.textContent = playing ? 'Ⅱ' : '▶';
  }
}

function clearSentenceTimer() {
  if (sentenceTimer) window.clearInterval(sentenceTimer);
  sentenceTimer = null;
  if (sentenceAudio) sentenceAudio.onended = null;
}

function sentenceEndTime(index) {
  const next = lyricLines[index + 1]?.time;
  const duration = window.currentAudio?.duration;
  return Math.min(next ?? (duration || lyricLines[index].time + 3), lyricLines[index].time + 7);
}

function playCurrentSentence() {
  const audio = window.currentAudio;
  if (!audio || !audioUrl || !lyricLines.length) {
    showToast('音频还没有准备好');
    return;
  }
  if (currentLineIndex < 0) currentLineIndex = 0;
  clearSentenceTimer();
  sentenceMode = true;
  const line = lyricLines[currentLineIndex];
  const end = sentenceEndTime(currentLineIndex);
  // 复用已加载的主音频对象：这样播放调用仍处于用户点击手势内，
  // 同时保证歌词时间戳和听到的内容使用同一条音轨。
  audio.pause();
  audio.playbackRate = playbackRate;
  renderLyricLine(currentLineIndex, false);
  // currentTime 必须在 metadata 就绪后设置；主音频通常已预加载，
  // 若还未就绪则等待一次 loadedmetadata 后再补跳转。
  const start = () => {
    audio.currentTime = line.time;
    audio.playbackRate = playbackRate;
    audio.play().then(() => syncPlayButtons(true)).catch(() => {
      sentenceMode = false;
      syncPlayButtons(false);
      showToast('音频播放失败，请再次点击播放');
    });
  };
  if (audio.readyState >= 1) start();
  else audio.addEventListener('loadedmetadata', start, { once: true });
  sentenceAudio = audio;
  sentenceTimer = window.setInterval(() => {
    if (!sentenceAudio || sentenceAudio.paused || sentenceAudio.currentTime < line.time) return;
    const elapsed = sentenceAudio.currentTime;
    const duration = Math.max(0.25, end - line.time);
    lessonProgress.style.width = `${Math.min(100, ((currentLineIndex + Math.min(1, (elapsed - line.time) / duration)) / lyricLines.length) * 100)}%`;
    currentTime.textContent = formatTime(elapsed);
    if (elapsed >= end - 0.04) {
      sentenceAudio.pause();
      clearSentenceTimer();
      sentenceMode = false;
      syncPlayButtons(false);
    }
  }, 50);
}

function seekToLine(index) {
  if (!lyricLines.length) return;
  const target = Math.max(0, Math.min(index, lyricLines.length - 1));
  if (target === currentLineIndex && !window.currentAudio) return;
  const wasPlaying = window.currentAudio && !window.currentAudio.paused;
  clearSentenceTimer();
  sentenceMode = false;
  manualSeekUntil = performance.now() + 350;
  renderLyricLine(target);
  if (window.currentAudio) {
    window.currentAudio.currentTime = lyricLines[target].time;
    const audio = window.currentAudio;
    const restore = () => {
      manualSeekUntil = 0;
      renderLyricLine(target, false);
      if (wasPlaying) audio.play().catch(() => {});
    };
    if (audio.readyState >= 1) window.setTimeout(restore, 80);
    else audio.addEventListener('loadedmetadata', restore, { once: true });
  }
}

loadWinnerTrack();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function playWordAudio(word) {
  const lang = /[가-힣]/.test(word) ? 'ko' : 'en';
  if (wordAudio) wordAudio.pause();
  document.querySelectorAll('.analysis-play, .word-chip').forEach((item) => item.classList.toggle('is-speaking', item.dataset.word === word));
  const clearSpeaking = () => document.querySelectorAll('.analysis-play, .word-chip').forEach((item) => item.classList.remove('is-speaking'));
  wordAudio = new Audio(`https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${lang}&q=${encodeURIComponent(word)}`);
  wordAudio.preload = 'auto';
  wordAudio.onended = clearSpeaking;
  wordAudio.onerror = () => {
    clearSpeaking();
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    wordUtterance = new SpeechSynthesisUtterance(word);
    wordUtterance.lang = lang === 'ko' ? 'ko-KR' : 'en-US';
    wordUtterance.rate = 0.78;
    const voices = window.speechSynthesis.getVoices();
    wordUtterance.voice = voices.find((voice) => voice.lang.toLowerCase().startsWith(lang)) || null;
    wordUtterance.onend = clearSpeaking;
    window.speechSynthesis.speak(wordUtterance);
  };
  wordAudio.play().catch(() => wordAudio.dispatchEvent(new Event('error')));
  showToast(`正在播放“${word}”的发音`);
}

function setSong(row) {
  stopPlayback();
  songs.forEach((item) => item.classList.remove('active'));
  row.classList.add('active');
  heroSong.textContent = row.dataset.song;
  heroArtist.textContent = row.dataset.artist;
  currentTime.textContent = row.dataset.time;
  heroProgress.style.width = `${row.dataset.progress}%`;
  heroArt.className = `album-art large-art art-${row.dataset.art}`;
  melody = melodyTracks[row.dataset.art] || melodyTracks.yellow;
  synthStep = 0;
  isPlaying = false;
  heroPlay.classList.remove('is-playing');
  heroPlay.textContent = '▶';
}

function stopPlayback() {
  if (window.currentAudio) window.currentAudio.pause();
  clearSentenceTimer();
  sentenceMode = false;
  if (synthTimer) window.clearInterval(synthTimer);
  synthTimer = null;
  isPlaying = false;
  heroPlay.classList.remove('is-playing');
  heroPlay.textContent = '▶';
  const lessonButton = document.querySelector('#playLesson');
  if (lessonButton) {
    lessonButton.classList.remove('is-playing');
    lessonButton.textContent = '▶';
  }
}

function openLearning() {
  learningSong.textContent = heroSong.textContent;
  learningArtist.textContent = heroArtist.textContent.split('·')[0].trim();
  homeView.hidden = true;
  learningView.hidden = false;
  globalTopbar.hidden = true;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closeLearning() {
  learningView.hidden = true;
  homeView.hidden = false;
  globalTopbar.hidden = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

songs.forEach((row) => row.addEventListener('click', () => {
  if (row.dataset.art !== 'yellow') {
    showToast('这首歌还没有导入音频和歌词');
    return;
  }
  setSong(row);
  showToast(`已切换到《${row.dataset.song}》`);
  openLearning();
}));

document.querySelector('#openLesson').addEventListener('click', openLearning);
document.querySelector('#backHome').addEventListener('click', closeLearning);

heroPlay.addEventListener('click', () => {
  togglePlayback().then((playing) => showToast(playing ? '开始播放真实音频' : '已暂停'));
});

function playSynthNote() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  if (!synthContext) synthContext = new AudioContext();
  synthContext.resume();
  const oscillator = synthContext.createOscillator();
  const gain = synthContext.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.value = melody[synthStep % melody.length];
  gain.gain.setValueAtTime(0.0001, synthContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.12, synthContext.currentTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, synthContext.currentTime + 0.42);
  oscillator.connect(gain).connect(synthContext.destination);
  oscillator.start();
  oscillator.stop(synthContext.currentTime + 0.45);
  synthStep += 1;
}

async function togglePlayback() {
  sentenceMode = false;
  clearSentenceTimer();
  if (audioUrl) {
    if (window.currentAudio?.paused) {
      await window.currentAudio.play();
      isPlaying = true;
    } else {
      window.currentAudio.pause();
      isPlaying = false;
    }
  } else {
    if (!isPlaying) {
      playSynthNote();
      synthTimer = window.setInterval(playSynthNote, Math.round(500 / playbackRate));
      isPlaying = true;
    } else {
      window.clearInterval(synthTimer);
      synthTimer = null;
      isPlaying = false;
    }
  }
  heroPlay.classList.toggle('is-playing', isPlaying);
  heroPlay.textContent = isPlaying ? 'Ⅱ' : '▶';
  const lessonButton = document.querySelector('#playLesson');
  if (lessonButton) {
    lessonButton.classList.toggle('is-playing', isPlaying);
    lessonButton.textContent = isPlaying ? 'Ⅱ' : '▶';
  }
  return isPlaying;
}

if (audioFile) audioFile.addEventListener('change', () => {
  const file = audioFile.files?.[0];
  if (!file) return;
  if (window.currentAudio) window.currentAudio.pause();
  if (audioUrl) URL.revokeObjectURL(audioUrl);
  audioUrl = URL.createObjectURL(file);
  window.currentAudio = new Audio(audioUrl);
  window.currentAudio.loop = true;
  window.currentAudio.playbackRate = playbackRate;
  window.currentAudio.addEventListener('timeupdate', syncLyrics);
  window.currentAudio.addEventListener('play', () => syncPlayButtons(true));
  window.currentAudio.addEventListener('pause', () => syncPlayButtons(false));
  if (audioStatus) audioStatus.textContent = `本地音频 · ${file.name}`;
  isPlaying = false;
  heroPlay.classList.remove('is-playing');
  heroPlay.textContent = '▶';
  showToast('已加载本地音频，点击播放即可试听');
});

const lessonButton = document.querySelector('#lessonButton');
if (lessonButton) lessonButton.addEventListener('click', openLearning);
document.querySelector('#profileButton').addEventListener('click', openCalendar);

function openSheet() {
  importSheet.hidden = false;
  sheetBackdrop.hidden = false;
  requestAnimationFrame(() => playlistInput.focus());
}
function closeSheet() {
  importSheet.hidden = true;
  sheetBackdrop.hidden = true;
}

document.querySelector('#importButton').addEventListener('click', openSheet);
document.querySelector('#cancelImport').addEventListener('click', closeSheet);
sheetBackdrop.addEventListener('click', closeSheet);
document.querySelector('#confirmImport').addEventListener('click', () => {
  const value = playlistInput.value.trim();
  if (!value) {
    document.querySelector('#inputHint').textContent = '先粘贴一个歌单链接或输入歌单 ID';
    document.querySelector('#inputHint').style.color = 'var(--accent)';
    playlistInput.focus();
    return;
  }
  closeSheet();
  playlistInput.value = '';
  showToast('已收到歌单，正在准备学习内容');
});

document.querySelectorAll('.nav-item').forEach((item) => item.addEventListener('click', () => {
  document.querySelectorAll('.nav-item').forEach((nav) => nav.classList.remove('active'));
  item.classList.add('active');
  const tab = item.dataset.tab;
  if (tab === 'me') openCalendar();
  else if (tab === 'home') closeCalendar();
  else showToast(`${item.querySelector('span:last-child').textContent}页面还在准备中`);
}));

wordList.addEventListener('click', (event) => {
  const item = event.target.closest('.analysis-play');
  if (!item) return;
  event.stopPropagation();
  playWordAudio(item.dataset.word);
});
lyricCurrent.addEventListener('click', (event) => {
  const item = event.target.closest('.word-chip');
  if (!item) {
    playCurrentSentence();
    return;
  }
  event.stopPropagation();
  const related = [...wordList.querySelectorAll('.analysis-play')].find((word) => word.dataset.word === item.dataset.word);
  related?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  playWordAudio(item.dataset.word);
});

document.querySelector('#listenLine').addEventListener('click', () => {
  if (audioUrl && window.currentAudio) {
    playCurrentSentence();
  } else {
    playSynthNote();
  }
  showToast('正在播放这一句');
});
document.querySelector('#slowButton').addEventListener('click', (event) => {
  playbackRate = playbackRate === 1 ? 0.75 : 1;
  event.currentTarget.textContent = playbackRate === 1 ? '0.75× 慢速' : '1.0× 正常';
  if (window.currentAudio) window.currentAudio.playbackRate = playbackRate;
  if (isPlaying && !audioUrl) {
    window.clearInterval(synthTimer);
    synthTimer = window.setInterval(playSynthNote, Math.round(500 / playbackRate));
  }
  showToast(playbackRate === 1 ? '已恢复正常速度' : '已切换为 0.75 倍速');
});
document.querySelector('#playLesson').addEventListener('click', (event) => {
  togglePlayback().then((playing) => showToast(playing ? '开始播放当前句' : '已暂停'));
});
document.querySelector('#prevLine').addEventListener('click', () => {
  seekToLine(currentLineIndex - 1);
});
document.querySelector('#nextLine').addEventListener('click', () => {
  seekToLine(currentLineIndex + 1);
});
lyricPrevious.addEventListener('click', () => seekToLine(currentLineIndex - 1));
lyricNext.addEventListener('click', () => seekToLine(currentLineIndex + 1));
document.querySelector('#saveSong').addEventListener('click', (event) => {
  event.currentTarget.textContent = event.currentTarget.textContent === '♡' ? '♥' : '♡';
  showToast(event.currentTarget.textContent === '♥' ? '已收藏这首歌' : '已取消收藏');
});

const calendarView = document.querySelector('#calendarView');
const calendarGrid = document.querySelector('#calendarGrid');
const monthLabel = document.querySelector('#monthLabel');
const selectedDateLabel = document.querySelector('#selectedDateLabel');
const selectedDayTitle = document.querySelector('#selectedDayTitle');
const selectedDayCopy = document.querySelector('#selectedDayCopy');
const selectedMinutes = document.querySelector('#selectedMinutes');
let calendarCursor = new Date(2026, 8, 1);
let selectedDate = new Date(2026, 8, 6);
const studyMinutes = { 1: 8, 2: 22, 3: 5, 4: 31, 5: 16, 6: 18, 8: 42, 9: 12, 11: 6, 14: 28, 16: 9, 18: 35, 21: 14, 23: 7, 25: 26, 27: 18, 29: 4 };

function openCalendar() {
  homeView.hidden = true;
  learningView.hidden = true;
  calendarView.hidden = false;
  globalTopbar.hidden = true;
  renderCalendar();
}

function closeCalendar() {
  calendarView.hidden = true;
  homeView.hidden = false;
  globalTopbar.hidden = false;
}

function heatLevel(minutes) {
  if (!minutes) return 0;
  if (minutes < 10) return 1;
  if (minutes < 20) return 2;
  if (minutes < 35) return 3;
  return 4;
}

function renderCalendar() {
  const year = calendarCursor.getFullYear();
  const month = calendarCursor.getMonth();
  monthLabel.textContent = `${year}年${month + 1}月`;
  calendarGrid.innerHTML = '';
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let i = 0; i < firstDay; i += 1) calendarGrid.insertAdjacentHTML('beforeend', '<span class="day-cell is-empty"></span>');
  for (let day = 1; day <= daysInMonth; day += 1) {
    const minutes = year === 2026 && month === 8 ? (studyMinutes[day] || 0) : 0;
    const cell = document.createElement('button');
    cell.className = `day-cell heat-${heatLevel(minutes)}`;
    cell.textContent = day;
    cell.dataset.day = day;
    if (day === 6 && month === 8 && year === 2026) cell.classList.add('is-today');
    if (selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === day) cell.classList.add('is-selected');
    cell.title = minutes ? `${minutes} 分钟` : '暂无学习记录';
    cell.addEventListener('click', () => selectCalendarDay(new Date(year, month, day), minutes));
    calendarGrid.appendChild(cell);
  }
}

function selectCalendarDay(date, minutes) {
  selectedDate = date;
  const label = date.getFullYear() === 2026 && date.getMonth() === 8 && date.getDate() === 6 ? '今天' : `${date.getMonth() + 1}月${date.getDate()}日`;
  selectedDateLabel.textContent = `${label} · 学习记录`;
  selectedMinutes.textContent = minutes;
  selectedDayTitle.textContent = minutes ? (minutes >= 30 ? '今天的专注力很棒' : '今天也学了一点') : '这一天还没有记录';
  selectedDayCopy.textContent = minutes ? `听歌学习 ${Math.max(1, Math.round(minutes / 6))} 句 · 完成 1 个练习` : '选择其他日期，或者现在开始学习一首歌';
  renderCalendar();
}

document.querySelector('#backCalendar').addEventListener('click', closeCalendar);
document.querySelector('#calendarToday').addEventListener('click', () => { calendarCursor = new Date(2026, 8, 1); selectCalendarDay(new Date(2026, 8, 6), studyMinutes[6]); });
document.querySelector('#prevMonth').addEventListener('click', () => { calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1); renderCalendar(); });
document.querySelector('#nextMonth').addEventListener('click', () => { calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1); renderCalendar(); });
document.querySelector('#calendarStart').addEventListener('click', () => { closeCalendar(); openLearning(); });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !importSheet.hidden) closeSheet();
});

// First-run flow: Chinese UI, Korean as the initial learning language.
const onboardingView = document.querySelector('#onboardingView');
const splashScreen = document.querySelector('#splashScreen');
const welcomeScreen = document.querySelector('#welcomeScreen');
const setupScreen = document.querySelector('#setupScreen');
const setupSteps = [...document.querySelectorAll('.setup-step')];
const setupProgressBar = document.querySelector('#setupProgressBar');
const setupNext = document.querySelector('#setupNext');
let setupStep = 1;
const onboardingState = { language: '韩语', level: 'A1', genre: ['K-POP'], goal: '听力' };

function showOnboardingScreen(screen) {
  [splashScreen, welcomeScreen, setupScreen].forEach((item) => { item.hidden = item !== screen; });
}

function showSetupStep(step) {
  setupStep = Math.max(1, Math.min(4, step));
  setupSteps.forEach((item) => { item.hidden = Number(item.dataset.step) !== setupStep; });
  setupProgressBar.style.width = `${setupStep * 25}%`;
  setupNext.innerHTML = setupStep === 4 ? '开始学习 <span>→</span>' : '下一步 <span>→</span>';
}

function finishOnboarding() {
  try {
    localStorage.setItem('muse-onboarding-complete', '1');
    localStorage.setItem('muse-onboarding-state', JSON.stringify(onboardingState));
  } catch { /* storage may be unavailable in private mode */ }
  onboardingView.hidden = true;
  homeView.hidden = false;
  globalTopbar.hidden = false;
}

function initOnboarding() {
  let completed = false;
  try { completed = localStorage.getItem('muse-onboarding-complete') === '1'; } catch { /* use first-run view */ }
  if (completed) {
    onboardingView.hidden = true;
    homeView.hidden = false;
    globalTopbar.hidden = false;
    return;
  }
  homeView.hidden = true;
  learningView.hidden = true;
  globalTopbar.hidden = true;
  onboardingView.hidden = false;
  showOnboardingScreen(splashScreen);
  window.setTimeout(() => showOnboardingScreen(welcomeScreen), 1050);
}

document.querySelector('#startOnboarding').addEventListener('click', () => {
  showOnboardingScreen(setupScreen);
  showSetupStep(1);
});
document.querySelector('#skipOnboarding').addEventListener('click', finishOnboarding);
document.querySelector('#setupSkip').addEventListener('click', finishOnboarding);
document.querySelector('#setupBack').addEventListener('click', () => {
  if (setupStep === 1) showOnboardingScreen(welcomeScreen);
  else showSetupStep(setupStep - 1);
});
setupNext.addEventListener('click', () => {
  if (setupStep < 4) {
    showSetupStep(setupStep + 1);
    return;
  }
  finishOnboarding();
  showToast('设置完成，今天从一首歌开始');
});

document.querySelectorAll('.option-card:not(.is-disabled)').forEach((option) => option.addEventListener('click', () => {
  const group = option.closest('[data-group]');
  if (!group) return;
  group.querySelectorAll('.option-card').forEach((item) => {
    item.classList.remove('selected');
    const marker = item.querySelector('b');
    if (marker) marker.textContent = '○';
  });
  option.classList.add('selected');
  const marker = option.querySelector('b');
  if (marker) marker.textContent = '✓';
  onboardingState[group.dataset.group] = option.dataset.value;
}));

document.querySelectorAll('.taste-tag').forEach((option) => option.addEventListener('click', () => {
  option.classList.toggle('selected');
  const values = [...option.parentElement.querySelectorAll('.taste-tag.selected')].map((item) => item.dataset.value);
  onboardingState.genre = values.length ? values : ['K-POP'];
}));

initOnboarding();

async function hydrateFromApi() {
  if (!['http:', 'https:'].includes(window.location.protocol)) return;
  try {
    const home = await fetch('/api/home').then((res) => res.json());
    home.songs.forEach((song, index) => {
      const row = document.querySelectorAll('.song-row')[index];
      if (!row) return;
      row.dataset.song = song.title;
      row.dataset.artist = `${song.artist} · ${song.album || ''}`.replace(/ · $/, '');
      row.dataset.art = song.art;
      row.querySelector('.song-copy strong').textContent = song.title;
      row.querySelector('.song-copy small').textContent = song.artist;
      row.querySelector('.song-level').textContent = song.level;
    });
    const active = home.songs[0];
    if (active) {
      heroSong.textContent = active.title;
      heroArtist.textContent = `${active.artist} · ${active.album || ''}`.replace(/ · $/, '');
    }
    home.calendar.forEach((entry) => { const day = Number(entry.study_date.slice(-2)); if (entry.minutes) studyMinutes[day] = entry.minutes; });
    const detail = await fetch('/api/songs/1').then((res) => res.json());
    lyricLines = detail.lines.map((line) => ({ time: line.start_time_ms / 1000, text: line.text }));
    detail.lines.forEach((line) => {
      const rows = detail.analyses.filter((item) => item.line_id === line.id);
      lineLearning[line.text] = {
        translation: line.translation,
        words: rows.filter((item) => item.kind === 'word').map((item) => [item.term, item.meaning, item.note]),
        expressions: rows.filter((item) => item.kind === 'expression').map((item) => [item.term, item.meaning, item.note]),
        grammar: rows.filter((item) => item.kind === 'grammar').map((item) => [item.term, item.meaning, item.note]),
      };
    });
    renderLyricLine(Math.max(0, currentLineIndex), false);
  } catch (error) {
    console.warn('API hydration unavailable; using local preview data.', error);
  }
}
hydrateFromApi();
