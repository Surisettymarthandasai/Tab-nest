// ══════════════════════════════════════════════════════════
// Robin 🐦 (NestAI) — Autonomous Assistant & Action Engine
// ══════════════════════════════════════════════════════════

const AI_STORAGE_KEY = 'tabnest_ai_config_v1';
let aiConfig = {
  apiKey: '',
  provider: 'gemini', // 'gemini' | 'openai' | 'groq'
  model: 'gemini-1.5-flash',
  autoOrganizeOnPaste: true
};

function loadAiConfig() {
  try {
    const c = localStorage.getItem(AI_STORAGE_KEY);
    if (c) aiConfig = Object.assign(aiConfig, JSON.parse(c));
  } catch {}
}

function saveAiConfig() {
  try {
    localStorage.setItem(AI_STORAGE_KEY, JSON.stringify(aiConfig));
  } catch {}
}

// Undo history stack for AI actions
let undoStack = [];

function pushUndo(description, stateSnapshot) {
  undoStack.push({ description, snapshot: JSON.stringify(stateSnapshot) });
  if (undoStack.length > 10) undoStack.shift();
}

function undoLastAction() {
  if (!undoStack.length) {
    toast('Nothing to undo');
    return false;
  }
  const last = undoStack.pop();
  try {
    state = JSON.parse(last.snapshot);
    save();
    render(document.getElementById('searchInput')?.value || '');
    toast(`Undone: ${last.description} ↺`);
    return true;
  } catch {
    toast('Failed to undo action');
    return false;
  }
}

// ── Built-in Natural Language & Heuristic Engine ──────────

const DOMAIN_CATEGORY_MAP = {
  'github.com': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'gitlab.com': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'stackoverflow.com': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'developer.mozilla.org': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'geeksforgeeks.org': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'uiverse.io': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'render.com': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },
  'vercel.com': { name: 'Dev & Tech', emoji: '💻', color: '#14B8A6' },

  'chatgpt.com': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'claude.ai': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'gemini.google.com': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'perplexity.ai': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'aistudio.google.com': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'napkin.ai': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'creao.ai': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'huggingface.co': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },

  'anikoto.cz': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'anikoto.site': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'gogoanimes.cv': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'mangadex.org': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'mangafire.to': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'myanimelist.net': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'enma.lol': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'toonverse.net': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'everythingmoe.com': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },
  'comix.ws': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },

  'kisskh.nl': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'kisskh.is': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'kisskh.ovh': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'turkish123.com': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'dramacool9.com.ro': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'netflix.com': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'youtube.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'youtu.be': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'spotify.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'instagram.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'twitter.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'x.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },

  'dribbble.com': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },
  'behance.net': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },
  'figma.com': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },
  'spline.design': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' }
};

// ── Robin Assistant Engine ────────────────────────────────
const Robin = {
  // 1. Clean duplicates
  cleanDuplicates() {
    pushUndo('Remove duplicate links', state);
    const seen = new Set();
    const uniqueLinks = [];
    let dupCount = 0;

    state.links.forEach(l => {
      // Normalize URL (strip trailing slash & protocol casing)
      const norm = (l.url || '').trim().replace(/\/+$/, '').toLowerCase();
      if (seen.has(norm)) {
        dupCount++;
      } else {
        seen.add(norm);
        uniqueLinks.push(l);
      }
    });

    if (dupCount === 0) {
      return {
        text: '✨ **No duplicate links found!** Your nests are already squeaky clean.',
        action: null
      };
    }

    state.links = uniqueLinks;
    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: `🧹 **Cleaned up ${dupCount} duplicate link${dupCount > 1 ? 's' : ''}!** Your collection is now deduplicated.`,
      canUndo: true
    };
  },

  // 2. Auto-organize unsorted links
  autoOrganizeUnsorted() {
    pushUndo('Auto-organize links', state);
    const unassigned = state.links.filter(l => !l.groupId || !state.groups.some(g => g.id === l.groupId));
    if (!unassigned.length) {
      return {
        text: '🪺 **All links are already safely nested!** You don\'t have any unsorted links.',
        action: null
      };
    }

    let organizedCount = 0;
    const movedDetails = [];

    unassigned.forEach(l => {
      let host = '';
      try { host = new URL(l.url).hostname.replace(/^www\./, ''); } catch {}
      
      // Match against domain mapping or existing nest names
      let targetGroup = null;
      
      // Check known domain map
      if (DOMAIN_CATEGORY_MAP[host]) {
        const cat = DOMAIN_CATEGORY_MAP[host];
        targetGroup = state.groups.find(g => g.name.toLowerCase() === cat.name.toLowerCase());
        if (!targetGroup) {
          targetGroup = { id: uid(), name: cat.name, color: cat.color, emoji: cat.emoji, order: state.groups.length + 1 };
          state.groups.push(targetGroup);
        }
      }

      // If not in domain map, fuzzy match against existing nest names
      if (!targetGroup) {
        const titleLower = (l.title || host).toLowerCase();
        targetGroup = state.groups.find(g => titleLower.includes(g.name.toLowerCase()) || (g.name.toLowerCase().includes('imported')));
      }

      // Default fallback: create or use "Unsorted Archive"
      if (!targetGroup) {
        targetGroup = state.groups.find(g => g.name.toLowerCase() === 'unsorted archive');
        if (!targetGroup) {
          targetGroup = { id: uid(), name: 'Unsorted Archive', color: '#6366F1', emoji: '📦', order: state.groups.length + 1 };
          state.groups.push(targetGroup);
        }
      }

      l.groupId = targetGroup.id;
      organizedCount++;
      movedDetails.push(`• **${escHtml(l.title || host)}** → *${targetGroup.emoji || '📁'} ${targetGroup.name}*`);
    });

    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: `🪄 **Organized ${organizedCount} link${organizedCount > 1 ? 's' : ''} into nests:**\n\n${movedDetails.slice(0, 8).join('\n')}${movedDetails.length > 8 ? `\n*...and ${movedDetails.length - 8} more.*` : ''}`,
      canUndo: true
    };
  },

  // 3. Sort links in nests
  sortNests(mode = 'alphabetical') {
    pushUndo('Sort links', state);
    state.groups.forEach(g => {
      const groupLinks = state.links.filter(l => l.groupId === g.id);
      groupLinks.sort((a, b) => {
        const ta = (a.title || a.url).toLowerCase();
        const tb = (b.title || b.url).toLowerCase();
        return ta.localeCompare(tb);
      });
      groupLinks.forEach((l, idx) => { l.order = idx + 1; });
    });

    // Also sort groups alphabetically
    state.groups.sort((a, b) => a.name.localeCompare(b.name));
    state.groups.forEach((g, idx) => { g.order = idx + 1; });

    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: '🔤 **All nests and links have been sorted alphabetically (A-Z)!**',
      canUndo: true
    };
  },

  // 4. Stale link health check
  checkStaleLinks(days = 14) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const stale = state.links.filter(l => !l.lastOpenedAt || l.lastOpenedAt < cutoff);

    if (!stale.length) {
      return {
        text: '🔥 **Great habit!** You have interacted with all your links recently.',
        action: null
      };
    }

    const sample = stale.slice(0, 5).map(l => {
      const daysAgo = l.lastOpenedAt ? Math.floor((Date.now() - l.lastOpenedAt) / (1000 * 60 * 60 * 24)) : 'Never opened';
      return `• [${escHtml(l.title || l.url)}](${l.url}) — *(${daysAgo === 'Never opened' ? 'Never opened' : `${daysAgo}d ago`})*`;
    }).join('\n');

    return {
      text: `🪶 **Found ${stale.length} quiet link${stale.length > 1 ? 's' : ''} (unopened in ${days}+ days):**\n\n${sample}${stale.length > 5 ? `\n\n*+ ${stale.length - 5} more quiet links.*` : ''}\n\n*Tip: Say "release unopened links" or review them to keep your nest clutter-free.*`,
      links: stale.slice(0, 4)
    };
  },

  // 5. Get statistics
  getStats() {
    const totalNests = state.groups.length;
    const totalLinks = state.links.length;
    const unassigned = state.links.filter(l => !l.groupId).length;
    const opened = state.links.filter(l => l.lastOpenedAt).length;

    let mostVisitedGroup = null;
    let maxVisits = -1;

    state.groups.forEach(g => {
      const gLinks = state.links.filter(l => l.groupId === g.id && l.lastOpenedAt);
      if (gLinks.length > maxVisits) {
        maxVisits = gLinks.length;
        mostVisitedGroup = g;
      }
    });

    return {
      text: `📊 **TabNest Health & Statistics:**\n\n` +
            `• 🪺 **Total Nests:** ${totalNests}\n` +
            `• 🔗 **Total Links:** ${totalLinks}\n` +
            `• 🌐 **Unsorted Links:** ${unassigned}\n` +
            `• ⚡ **Active Links Opened:** ${opened} / ${totalLinks} (${totalLinks ? Math.round((opened / totalLinks) * 100) : 0}%)\n` +
            (mostVisitedGroup ? `• 🏆 **Most Active Nest:** ${mostVisitedGroup.emoji || '📁'} ${mostVisitedGroup.name}` : '')
    };
  },

  // 6. Search links & answer queries
  searchLinks(query) {
    const q = query.toLowerCase().trim();
    const results = state.links.filter(l =>
      (l.title || '').toLowerCase().includes(q) ||
      (l.url || '').toLowerCase().includes(q) ||
      (l.note || '').toLowerCase().includes(q) ||
      state.groups.some(g => g.id === l.groupId && g.name.toLowerCase().includes(q))
    );

    if (!results.length) {
      return {
        text: `🔍 I couldn't find any links matching **"${escHtml(query)}"** in your nests. Would you like me to create a link or nest for this?`,
        links: []
      };
    }

    return {
      text: `🎯 Found **${results.length} link${results.length > 1 ? 's' : ''}** for **"${escHtml(query)}"**:`,
      links: results.slice(0, 5)
    };
  },

  // 7. Create nest command
  createNest(name, emoji = '📁', color = '#F59E0B') {
    pushUndo(`Create nest "${name}"`, state);
    const existing = state.groups.find(g => g.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      return { text: `ℹ️ A nest named **"${escHtml(name)}"** already exists (${existing.emoji || '📁'}).` };
    }
    const newGroup = { id: uid(), name, color, emoji, order: state.groups.length + 1 };
    state.groups.push(newGroup);
    save();
    confetti(color);
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: `🎉 **Created new nest:** ${emoji} **${escHtml(name)}**! You can now move links into it.`,
      canUndo: true
    };
  },

  // 8. Process natural language query
  async processQuery(userInput) {
    const input = userInput.trim();
    if (!input) return { text: "How can I help with your nests today? Try asking me to *clean duplicates*, *organize unsorted*, or *find links*." };

    const lower = input.toLowerCase();

    // Undo command
    if (lower === 'undo' || lower === 'revert' || lower.includes('undo that') || lower.includes('undo last')) {
      if (undoLastAction()) {
        return { text: "↺ **Action undone!** Restored previous state." };
      } else {
        return { text: "There are no previous actions to undo." };
      }
    }

    // Duplicate cleanup
    if (lower.includes('duplicate') || lower.includes('clean up') || lower.includes('dedup') || lower.includes('remove duplicates')) {
      return this.cleanDuplicates();
    }

    // Auto-organize
    if (lower.includes('organize') || lower.includes('categorize') || lower.includes('auto organize') || lower.includes('sort unsorted') || lower.includes('fix unsorted')) {
      return this.autoOrganizeUnsorted();
    }

    // Sort nests
    if (lower.includes('sort a-z') || lower.includes('sort a to z') || lower.includes('sort alphabet') || lower.includes('alphabetical')) {
      return this.sortNests('alphabetical');
    }

    // Stats
    if (lower.includes('stat') || lower.includes('statistic') || lower.includes('analytics') || lower.includes('summary') || lower.includes('overview') || lower.includes('how many') || lower.includes('metric') || lower.includes('health') || lower.includes('total')) {
      return this.getStats();
    }

    // Stale links / detox
    if (lower.includes('stale') || lower.includes('unopened') || lower.includes('quiet') || lower.includes('detox') || lower.includes('old link') || lower.includes('inactive') || lower.includes('tab')) {
      return this.checkStaleLinks(14);
    }

    // Export trigger
    if (lower.includes('export') || lower.includes('backup') || lower.includes('download data')) {
      exportData();
      return { text: "✈️ **Export started!** Your TabNest backup is downloading now." };
    }

    // Themes
    if (lower.includes('theme') || lower.includes('dark mode') || lower.includes('matrix') || lower.includes('cyber')) {
      cycleTheme();
      return { text: "🎨 **Theme cycled!** Tap again to cycle to the next style." };
    }

    // Create nest command: "create nest <name>" or "new nest <name>"
    const createMatch = input.match(/(?:create|new|add)\s+(?:a\s+)?nest\s+(?:named|called\s+)?["']?([^"']+)["']?/i);
    if (createMatch && createMatch[1]) {
      const nestName = createMatch[1].trim();
      return this.createNest(nestName, '📁', '#F59E0B');
    }

    // Direct search for links
    if (lower.startsWith('find ') || lower.startsWith('search ') || lower.startsWith('where is ') || lower.startsWith('show me ')) {
      const cleanQ = input.replace(/^(find|search|where is|show me|look for)\s+/i, '').trim();
      return this.searchLinks(cleanQ);
    }

    // If URL pasted directly:
    if (/^https?:\/\//i.test(input)) {
      let host = '';
      try { host = new URL(input).hostname.replace(/^www\./, ''); } catch {}
      const mapped = DOMAIN_CATEGORY_MAP[host];
      let assignedGroup = null;
      if (mapped) {
        assignedGroup = state.groups.find(g => g.name.toLowerCase() === mapped.name.toLowerCase());
      }
      return {
        text: `🔗 **Detected URL:** \`${input}\`\n\nWould you like me to save this to **${assignedGroup ? `${assignedGroup.emoji || '📁'} ${assignedGroup.name}` : 'Unsorted'}**?`,
        suggestedLink: {
          url: input,
          title: titleFromUrl(input),
          groupId: assignedGroup ? assignedGroup.id : ''
        }
      };
    }

    // If Gemini/LLM API Key is configured, use LLM for deep reasoning
    if (aiConfig.apiKey && aiConfig.provider === 'gemini') {
      try {
        return await this.callGeminiLLM(input);
      } catch (err) {
        console.error('LLM error:', err);
      }
    }

    // Default search fallback
    const fallbackResults = this.searchLinks(input);
    if (fallbackResults.links && fallbackResults.links.length > 0) {
      return fallbackResults;
    }

    return {
      text: `🤖 I'm **Robin**, your link companion! Here is what I can do:\n\n` +
            `• 🧹 **"Clean duplicates"** — remove identical links\n` +
            `• 🪄 **"Organize unsorted"** — categorize links into nests\n` +
            `• 🔤 **"Sort A-Z"** — alphabetical sort for all nests\n` +
            `• 📊 **"Show stats"** — nest insights & activity\n` +
            `• 🔍 **"Find <topic>"** — search through all your bookmarks\n` +
            `• 🪶 **"Check stale links"** — find unopened tabs to detox\n\n` +
            `*You can also connect your free Gemini API key in Settings for conversational reasoning!*`
    };
  },

  // 9. Optional Gemini LLM Engine
  async callGeminiLLM(userPrompt) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model || 'gemini-1.5-flash'}:generateContent?key=${aiConfig.apiKey}`;
    const context = {
      groups: state.groups.map(g => ({ id: g.id, name: g.name, emoji: g.emoji })),
      totalLinks: state.links.length,
      sampleLinks: state.links.slice(0, 30).map(l => ({ title: l.title, url: l.url, group: state.groups.find(g => g.id === l.groupId)?.name || 'Unsorted' }))
    };

    const systemInstruction = `You are Robin, an intelligent and concise link manager assistant for TabNest.
Current user state:
- Nests: ${JSON.stringify(context.groups)}
- Sample links: ${JSON.stringify(context.sampleLinks)}
- Total links: ${context.totalLinks}

Help the user organize, query, summarize, or manage their links. Give friendly, concise responses with markdown formatting.`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser request: ${userPrompt}` }] }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.statusText}`);
    }

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I processed your request.";
    return { text: replyText };
  }
};

// ── UI Controller for Robin Assistant ─────────────────────
function openRobinChat(initialPrompt = '') {
  const modal = document.getElementById('robinModal');
  if (!modal) return;
  closeAllCtx();
  closeAllModals();
  openModal('robinModal');

  const chatContainer = document.getElementById('robinMessages');
  if (chatContainer && chatContainer.children.length === 0) {
    // Initial welcome message
    appendRobinMessage('bot', `👋 Hi! I'm **Robin**, your personal Nest Assistant. How can I help organize your links today?`);
  }

  const input = document.getElementById('robinInput');
  if (input) {
    if (initialPrompt) {
      input.value = initialPrompt;
      handleRobinSend();
    } else {
      setTimeout(() => input.focus(), 300);
    }
  }
}

function appendRobinMessage(sender, markdownText, extras = {}) {
  const container = document.getElementById('robinMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `robin-msg robin-msg-${sender}`;

  // Simple markdown to HTML format
  let html = markdownText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');

  msgDiv.innerHTML = `<div class="robin-bubble">${html}</div>`;

  // If there are link preview cards
  if (extras.links && extras.links.length) {
    const cardsDiv = document.createElement('div');
    cardsDiv.className = 'robin-link-cards';
    cardsDiv.innerHTML = extras.links.map(l => `
      <div class="robin-link-card" data-lid="${l.id}">
        ${faviconImg(l.url, 'robin-card-favicon')}
        <div class="robin-card-info">
          <div class="robin-card-title">${escHtml(l.title || l.url)}</div>
          <div class="robin-card-url">${escHtml(l.url)}</div>
        </div>
        <button class="robin-card-open" data-url="${escHtml(l.url)}">Open</button>
      </div>`).join('');

    cardsDiv.querySelectorAll('.robin-card-open').forEach(b => {
      b.addEventListener('click', e => {
        e.stopPropagation();
        haptic([10]);
        window.open(b.dataset.url, '_blank', 'noopener');
      });
    });

    cardsDiv.querySelectorAll('.robin-link-card').forEach(c => {
      c.addEventListener('click', () => {
        openLink(c.dataset.lid);
      });
    });

    msgDiv.appendChild(cardsDiv);
  }

  // If there is an undo button
  if (extras.canUndo) {
    const undoBtn = document.createElement('button');
    undoBtn.className = 'robin-undo-btn';
    undoBtn.innerHTML = `↺ Undo action`;
    undoBtn.addEventListener('click', () => {
      undoLastAction();
      undoBtn.remove();
    });
    msgDiv.appendChild(undoBtn);
  }

  // If there is a suggested link action
  if (extras.suggestedLink) {
    const saveBtn = document.createElement('button');
    saveBtn.className = 'robin-action-btn';
    saveBtn.innerHTML = `➕ Save to nest`;
    saveBtn.addEventListener('click', () => {
      const sl = extras.suggestedLink;
      state.links.push({
        id: uid(),
        groupId: sl.groupId,
        url: sl.url,
        title: sl.title,
        note: 'Added via Robin Assistant',
        faviconUrl: FAVICON(sl.url),
        createdAt: Date.now(),
        lastOpenedAt: null,
        order: state.links.length + 1
      });
      save();
      render(document.getElementById('searchInput')?.value || '');
      toast('Link saved to nest 🪺');
      saveBtn.remove();
      appendRobinMessage('bot', `✓ Saved **${escHtml(sl.title)}**!`);
    });
    msgDiv.appendChild(saveBtn);
  }

  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

async function handleRobinSend() {
  const input = document.getElementById('robinInput');
  const text = input.value.trim();
  if (!text) return;

  input.value = '';
  appendRobinMessage('user', text);

  // Typing indicator
  const container = document.getElementById('robinMessages');
  const typingDiv = document.createElement('div');
  typingDiv.className = 'robin-msg robin-msg-bot robin-typing';
  typingDiv.innerHTML = `<div class="robin-bubble"><span class="dot"></span><span class="dot"></span><span class="dot"></span></div>`;
  container.appendChild(typingDiv);
  container.scrollTop = container.scrollHeight;

  try {
    const res = await Robin.processQuery(text);
    typingDiv.remove();
    appendRobinMessage('bot', res.text, {
      links: res.links,
      canUndo: res.canUndo,
      suggestedLink: res.suggestedLink
    });
  } catch (err) {
    typingDiv.remove();
    appendRobinMessage('bot', `⚠️ Something went wrong: ${err.message || 'Unknown error'}`);
  }
}

// ── Initialize AI Config & Listeners ───────────────────────
loadAiConfig();
