// ══════════════════════════════════════════════════════════
// Robin 🐦 (NestAI) — High-Accuracy Intelligent Assistant
// ══════════════════════════════════════════════════════════

const AI_STORAGE_KEY = 'tabnest_ai_config_v1';
let aiConfig = {
  apiKey: '',
  provider: 'gemini', // 'gemini' | 'openai'
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

// Stop words for clean query tokenization
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'my', 'me', 'i', 'you', 'your', 'we', 'our', 'what', 'where', 'which', 'who', 'how', 'when',
  'show', 'find', 'search', 'get', 'give', 'list', 'look', 'tell', 'about', 'saved', 'have',
  'link', 'links', 'website', 'websites', 'site', 'sites', 'tab', 'tabs', 'nest', 'nests',
  'all', 'any', 'some', 'please', 'can', 'could', 'would', 'do', 'did', 'does'
]);

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
  'aiforwork.co': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'aiprep.in': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },
  'stayingahead.com': { name: 'AI & Tools', emoji: '🤖', color: '#8B5CF6' },

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
  'animesalt.link': { name: 'Anime & Manga', emoji: '🎬', color: '#F43F5E' },

  'kisskh.nl': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'kisskh.is': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'kisskh.ovh': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'turkish123.com': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'dramacool9.com.ro': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'net11.cc': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'rivestream.app': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'netflix.com': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },
  'fmhy.vercel.app': { name: 'Drama & Streams', emoji: '🍿', color: '#F59E0B' },

  'youtube.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'youtu.be': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'spotify.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'instagram.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'twitter.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },
  'x.com': { name: 'Music & Social', emoji: '🎵', color: '#F97316' },

  'dribbble.com': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },
  'behance.net': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },
  'figma.com': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },
  'spline.design': { name: 'Design & 3D', emoji: '🎨', color: '#EC4899' },

  'jntuhresults.vercel.app': { name: 'College & Learning', emoji: '🎓', color: '#0EA5E9' },
  'embibe.com': { name: 'College & Learning', emoji: '🎓', color: '#0EA5E9' },
  'skilljar.com': { name: 'College & Learning', emoji: '🎓', color: '#0EA5E9' }
};

// ── Robin Autonomous Engine ───────────────────────────────
const Robin = {
  // 1. High-Precision Token & Fuzzy Search
  smartSearch(query) {
    if (!query || !query.trim()) return { text: "What link or nest are you looking for?", links: [] };

    const raw = query.toLowerCase().trim();
    const tokens = raw
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 1 && !STOP_WORDS.has(t));

    // A. Check if the query specifically refers to a nest
    const matchedGroup = state.groups.find(g => {
      const gName = g.name.toLowerCase();
      return raw.includes(gName) || tokens.some(t => gName.includes(t));
    });

    // If query matches a nest directly (e.g. "anime", "drama", "ai tools", "dev links")
    if (matchedGroup && (tokens.length <= 2 || raw.includes('nest') || raw.includes('group') || raw.includes('in '))) {
      const groupLinks = state.links.filter(l => l.groupId === matchedGroup.id);
      return {
        text: `🪺 **${matchedGroup.emoji || '📁'} ${matchedGroup.name}** contains **${groupLinks.length} link${groupLinks.length !== 1 ? 's' : ''}**:`,
        links: groupLinks.slice(0, 8)
      };
    }

    // B. Token-based Relevance Scoring across all links
    const searchTokens = tokens.length > 0 ? tokens : [raw];
    const scoredLinks = [];

    state.links.forEach(l => {
      let score = 0;
      const title = (l.title || '').toLowerCase();
      const note = (l.note || '').toLowerCase();
      const url = (l.url || '').toLowerCase();
      const group = state.groups.find(g => g.id === l.groupId);
      const groupName = (group?.name || '').toLowerCase();

      let host = '';
      try { host = new URL(l.url).hostname.toLowerCase(); } catch {}

      // Exact full match bonuses
      if (title === raw) score += 100;
      else if (title.includes(raw)) score += 50;

      if (url.includes(raw) || host.includes(raw)) score += 40;
      if (note.includes(raw)) score += 30;
      if (groupName.includes(raw)) score += 25;

      // Token matches
      searchTokens.forEach(token => {
        if (title.includes(token)) score += 20;
        if (host.includes(token)) score += 15;
        if (url.includes(token)) score += 10;
        if (note.includes(token)) score += 8;
        if (groupName.includes(token)) score += 12;
      });

      if (score > 0) {
        scoredLinks.push({ link: l, score, groupName: group?.name || 'Unsorted' });
      }
    });

    scoredLinks.sort((a, b) => b.score - a.score);

    if (!scoredLinks.length) {
      return {
        text: `🔍 I searched through all your links but couldn't find anything matching **"${escHtml(query)}"**.\n\n*Try searching by domain (e.g. \`github\`, \`kisskh\`), topic, or nest name.*`,
        links: []
      };
    }

    const topResults = scoredLinks.slice(0, 5).map(s => s.link);
    return {
      text: `🎯 Found **${scoredLinks.length} matching link${scoredLinks.length > 1 ? 's' : ''}** for **"${escHtml(query)}"**:`,
      links: topResults
    };
  },

function normalizeUrl(url = '') {
  try {
    const u = new URL(url.trim());
    return (u.hostname.replace(/^www\./, '') + u.pathname.replace(/\/+$/, '') + u.search).toLowerCase();
  } catch {
    return url.trim().replace(/^https?:\/\//i, '').replace(/^www\./i, '').replace(/\/+$/, '').toLowerCase();
  }
}

  // 2. Clean Duplicate Links
  cleanDuplicates() {
    pushUndo('Remove duplicate links', state);
    const seen = new Set();
    const uniqueLinks = [];
    let dupCount = 0;
    const dupNames = [];

    state.links.forEach(l => {
      const norm = normalizeUrl(l.url);
      if (seen.has(norm)) {
        dupCount++;
        dupNames.push(l.title || l.url);
      } else {
        seen.add(norm);
        uniqueLinks.push(l);
      }
    });

    if (dupCount === 0) {
      return {
        text: '✨ **No duplicate links found!** All your links are unique across all nests.'
      };
    }

    state.links = uniqueLinks;
    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: `🧹 **Cleaned up ${dupCount} duplicate link${dupCount > 1 ? 's' : ''}!**\n\n*Removed: ${dupNames.slice(0, 3).map(n => `\`${escHtml(n)}\``).join(', ')}${dupNames.length > 3 ? ` + ${dupNames.length - 3} more` : ''}*`,
      canUndo: true
    };
  },

  // 3. Auto-Organize Unassigned Links
  autoOrganizeUnsorted() {
    pushUndo('Auto-organize links', state);
    const unassigned = state.links.filter(l => !l.groupId || !state.groups.some(g => g.id === l.groupId));
    if (!unassigned.length) {
      return {
        text: '🪺 **All links are already organized into nests!** You have 0 unassigned links.'
      };
    }

    let organizedCount = 0;
    const movedDetails = [];

    unassigned.forEach(l => {
      let host = '';
      try { host = new URL(l.url).hostname.replace(/^www\./, '').toLowerCase(); } catch {}

      let targetGroup = null;

      // 1. Check known domain map
      if (DOMAIN_CATEGORY_MAP[host]) {
        const cat = DOMAIN_CATEGORY_MAP[host];
        targetGroup = state.groups.find(g => g.name.toLowerCase() === cat.name.toLowerCase());
        if (!targetGroup) {
          targetGroup = { id: uid(), name: cat.name, color: cat.color, emoji: cat.emoji, order: state.groups.length + 1 };
          state.groups.push(targetGroup);
        }
      }

      // 2. Keyword heuristic on title & url
      if (!targetGroup) {
        const text = `${l.title || ''} ${l.note || ''} ${host}`.toLowerCase();
        if (/anime|manga|webtoon|manhwa|toon|comic/i.test(text)) {
          targetGroup = state.groups.find(g => /anime|manga/i.test(g.name));
        } else if (/drama|movie|stream|watch|episode|series|cinema/i.test(text)) {
          targetGroup = state.groups.find(g => /drama|stream/i.test(g.name));
        } else if (/ai|gpt|llm|prompt|claude|gemini|bot|openai|agent/i.test(text)) {
          targetGroup = state.groups.find(g => /ai|tool/i.test(g.name));
        } else if (/dev|code|github|stack|api|program|tech|css|html|js/i.test(text)) {
          targetGroup = state.groups.find(g => /dev|tech/i.test(g.name));
        } else if (/music|song|video|youtube|instagram|spotify|social/i.test(text)) {
          targetGroup = state.groups.find(g => /music|social/i.test(g.name));
        } else if (/college|university|result|exam|course|learn|study/i.test(text)) {
          targetGroup = state.groups.find(g => /college|learn/i.test(g.name));
        }
      }

      // 3. Fallback to existing or new "General Archive"
      if (!targetGroup) {
        targetGroup = state.groups.find(g => g.name.toLowerCase() === 'general archive') || state.groups[0];
        if (!targetGroup) {
          targetGroup = { id: uid(), name: 'General Archive', color: '#6366F1', emoji: '📦', order: state.groups.length + 1 };
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
      text: `🪄 **Auto-organized ${organizedCount} link${organizedCount > 1 ? 's' : ''} into their respective nests:**\n\n${movedDetails.slice(0, 8).join('\n')}${movedDetails.length > 8 ? `\n*...and ${movedDetails.length - 8} more.*` : ''}`,
      canUndo: true
    };
  },

  // 4. Sort Nests & Links Alphabetically
  sortAlphabetical() {
    pushUndo('Sort links alphabetically', state);
    state.groups.forEach(g => {
      const gLinks = state.links.filter(l => l.groupId === g.id);
      gLinks.sort((a, b) => (a.title || a.url).localeCompare(b.title || b.url, undefined, { sensitivity: 'base' }));
      gLinks.forEach((l, i) => { l.order = i + 1; });
    });

    state.groups.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
    state.groups.forEach((g, i) => { g.order = i + 1; });

    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: '🔤 **All nests and their links have been sorted alphabetically (A-Z)!**',
      canUndo: true
    };
  },

  // 5. Comprehensive Stats & Digest
  getStats() {
    const totalNests = state.groups.length;
    const totalLinks = state.links.length;
    const unassigned = state.links.filter(l => !l.groupId).length;
    const opened = state.links.filter(l => l.lastOpenedAt).length;

    const nestBreakdown = state.groups.map(g => {
      const count = state.links.filter(l => l.groupId === g.id).length;
      return `• ${g.emoji || '📁'} **${g.name}**: ${count} link${count !== 1 ? 's' : ''}`;
    }).join('\n');

    return {
      text: `📊 **TabNest Overview & Stats:**\n\n` +
            `• 🪺 **Total Nests:** ${totalNests}\n` +
            `• 🔗 **Total Links:** ${totalLinks}\n` +
            `• 🌐 **Unsorted Links:** ${unassigned}\n` +
            `• ⚡ **Opened at least once:** ${opened} / ${totalLinks} (${totalLinks ? Math.round((opened / totalLinks) * 100) : 0}%)\n\n` +
            `**Nest Breakdown:**\n${nestBreakdown}`
    };
  },

  // 6. Stale / Unopened Links Health Check
  checkStaleLinks(days = 14) {
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
    const stale = state.links.filter(l => !l.lastOpenedAt || l.lastOpenedAt < cutoff);

    if (!stale.length) {
      return {
        text: '🔥 **Zero stale tabs!** All your links have been opened recently.'
      };
    }

    const sample = stale.slice(0, 5).map(l => {
      const timeStr = l.lastOpenedAt ? `${Math.floor((Date.now() - l.lastOpenedAt) / (1000 * 60 * 60 * 24))}d ago` : 'Never opened';
      return `• **${escHtml(l.title || l.url)}** *(${timeStr})*`;
    }).join('\n');

    return {
      text: `🪶 **Found ${stale.length} quiet link${stale.length > 1 ? 's' : ''} (unopened in ${days}+ days):**\n\n${sample}${stale.length > 5 ? `\n*+ ${stale.length - 5} more links*` : ''}\n\n*Review them below or keep your nest clutter-free.*`,
      links: stale.slice(0, 5)
    };
  },

  // 7. Delete a specific link
  deleteSpecificLink(linkQuery) {
    const match = this.smartSearch(linkQuery);
    if (!match.links || !match.links.length) {
      return { text: `⚠️ Couldn't find any link matching **"${escHtml(linkQuery)}"** to delete.` };
    }
    const target = match.links[0];
    pushUndo(`Delete link "${target.title}"`, state);
    state.links = state.links.filter(l => l.id !== target.id);
    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: `🗑️ **Deleted link:** \`${escHtml(target.title || target.url)}\` from your nest.`,
      canUndo: true
    };
  },

  // 8. Move a link to another nest
  moveLink(linkQuery, targetNestName) {
    const match = this.smartSearch(linkQuery);
    if (!match.links || !match.links.length) {
      return { text: `⚠️ Couldn't find any link matching **"${escHtml(linkQuery)}"** to move.` };
    }
    const targetLink = match.links[0];
    const targetGroup = state.groups.find(g => g.name.toLowerCase().includes(targetNestName.toLowerCase().trim()));

    if (!targetGroup) {
      return { text: `⚠️ Couldn't find a nest named **"${escHtml(targetNestName)}"**. Please check the name or create it first.` };
    }

    pushUndo(`Move "${targetLink.title}" to ${targetGroup.name}`, state);
    targetLink.groupId = targetGroup.id;
    save();
    render(document.getElementById('searchInput')?.value || '');
    return {
      text: `📦 **Moved** \`${escHtml(targetLink.title || targetLink.url)}\` → **${targetGroup.emoji || '📁'} ${targetGroup.name}**!`,
      canUndo: true
    };
  },

  // 9. Create a new Nest
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
      text: `🎉 **Created new nest:** ${emoji} **${escHtml(name)}**!`,
      canUndo: true
    };
  },

  // 10. Proactive JARVIS Nest Audit
  runAudit() {
    pushUndo('JARVIS Nest Audit', state);
    const suggestions = [];

    // A. Detect Misclassified links
    state.links.forEach(l => {
      let host = '';
      try { host = new URL(l.url).hostname.replace(/^www\./, '').toLowerCase(); } catch {}
      const mapped = DOMAIN_CATEGORY_MAP[host];
      if (mapped) {
        const currentGroup = state.groups.find(g => g.id === l.groupId);
        if (currentGroup && currentGroup.name.toLowerCase() !== mapped.name.toLowerCase()) {
          const targetGroup = state.groups.find(g => g.name.toLowerCase() === mapped.name.toLowerCase());
          if (targetGroup) {
            suggestions.push({
              type: 'move',
              linkId: l.id,
              targetGroupId: targetGroup.id,
              text: `Move **${escHtml(l.title || host)}** from *${currentGroup.name}* → *${targetGroup.emoji || '📁'} ${targetGroup.name}*`
            });
          }
        }
      }
    });

    // B. Detect Duplicate links
    const seen = new Set();
    const dups = [];
    state.links.forEach(l => {
      const norm = normalizeUrl(l.url);
      if (seen.has(norm)) dups.push(l);
      else seen.add(norm);
    });

    if (dups.length > 0) {
      suggestions.push({
        type: 'dedup',
        text: `Purge ${dups.length} duplicate link${dups.length > 1 ? 's' : ''}`
      });
    }

    // C. Detect Unsorted links
    const unassigned = state.links.filter(l => !l.groupId || !state.groups.some(g => g.id === l.groupId));
    if (unassigned.length > 0) {
      suggestions.push({
        type: 'organize',
        text: `Auto-categorize ${unassigned.length} unsorted link${unassigned.length > 1 ? 's' : ''}`
      });
    }

    // D. Stale links check (> 30 days)
    const staleCutoff = Date.now() - (30 * 24 * 60 * 60 * 1000);
    const stale = state.links.filter(l => !l.lastOpenedAt || l.lastOpenedAt < staleCutoff);

    if (!suggestions.length && !stale.length) {
      return {
        text: `🎩 **Good day, sir.** I have conducted a thorough diagnostic scan across all **${state.groups.length} nests** and **${state.links.length} links**.\n\nEverything is in immaculate order. No duplicates, no misplaced links, and all systems are running at peak efficiency.`
      };
    }

    return {
      text: `🎩 **At your service, sir.** I have completed a full diagnostic audit of your **${state.links.length} links** across **${state.groups.length} nests**.\n\n` +
            `**Diagnostic Observations:**\n` +
            (suggestions.length ? suggestions.map(s => `• ${s.text}`).join('\n') + '\n\n' : '') +
            (stale.length ? `• 🪶 **${stale.length} links** have remained unopened for 30+ days.\n\n` : '') +
            `*Shall I execute the automated optimizations for you, sir?*`,
      auditSuggestions: suggestions,
      canUndo: true
    };
  },

  // 11. Main Natural Language Intent Processor
  async processQuery(userInput) {
    const input = userInput.trim();
    if (!input) return { text: "🎩 **At your service, sir.** Ask me to *audit your nests*, *clean duplicates*, *organize unsorted*, *sort A-Z*, or *find any link*." };

    const lower = input.toLowerCase();

    // ── A. JARVIS Audit & Scan ──
    if (/(audit|scan|diagnostic|analyze|check nest|jarvis|butler|inspect)/i.test(lower)) {
      return this.runAudit();
    }

    // ── B. Confirmation / Execution Commands ("yes", "do it", "apply", "execute") ──
    if (/^(yes|do it|execute|apply|apply all|go ahead|sure|proceed|ok|okay|fix it|optimize)$/i.test(lower)) {
      pushUndo('Apply All JARVIS Optimizations', state);
      const audit = this.runAudit();
      if (audit.auditSuggestions && audit.auditSuggestions.length) {
        audit.auditSuggestions.forEach(s => {
          if (s.type === 'move') {
            const l = state.links.find(x => x.id === s.linkId);
            if (l) l.groupId = s.targetGroupId;
          } else if (s.type === 'dedup') {
            this.cleanDuplicates();
          } else if (s.type === 'organize') {
            this.autoOrganizeUnsorted();
          }
        });
        save();
        render(document.getElementById('searchInput')?.value || '');
        confetti('#8B5CF6');
        return {
          text: `🎩 **All optimizations executed flawlessly, sir.** Your nests are in pristine order.`,
          canUndo: true
        };
      } else {
        return {
          text: `🎩 **Everything is already in pristine order, sir.** No further actions required.`
        };
      }
    }

    // ── C. Undo Commands ──
    if (/(undo|revert)/i.test(lower)) {
      if (undoLastAction()) {
        return { text: "↺ **Action undone, sir.** Restored previous nest state." };
      } else {
        return { text: "There are no previous actions in history to undo, sir." };
      }
    }

    // ── D. Duplicate Cleanup ──
    if (/(duplicate|dedup|clean up|remove duplicate|delete duplicate)/i.test(lower)) {
      return this.cleanDuplicates();
    }

    // ── D. Auto-Organize Links ──
    if (/(auto.?organize|organize|categorize|sort unsorted|fix unsorted)/i.test(lower)) {
      return this.autoOrganizeUnsorted();
    }

    // ── E. Alphabetical Sort ──
    if (/(sort.*(a.?z|alphabet|name)|alphabetical|sort nests)/i.test(lower)) {
      return this.sortAlphabetical();
    }

    // ── F. Stats & Digest ──
    if (/(stat|statistic|analytic|summary|overview|breakdown|how many links|health|metrics)/i.test(lower)) {
      return this.getStats();
    }

    // ── G. Stale Links / Health ──
    if (/(stale|unopened|quiet|detox|old link|inactive link|unvisited)/i.test(lower)) {
      return this.checkStaleLinks(14);
    }

    // ── H. Export Data ──
    if (/(export|backup|download data|save backup)/i.test(lower)) {
      exportData();
      return { text: "✈️ **Export initialized, sir.** Your TabNest JSON backup is downloading." };
    }

    // ── I. Theme Change ──
    if (/(change theme|cycle theme|switch theme|dark mode|matrix|cyberpunk|crt)/i.test(lower)) {
      cycleTheme();
      return { text: "🎨 **Theme cycled, sir!**" };
    }

    // ── J. Delete Link Command: "delete link <X>" or "remove link <X>" ──
    const deleteMatch = input.match(/(?:delete|remove)\s+(?:the\s+)?(?:link\s+)?["']?([^"']+)["']?/i);
    if (deleteMatch && deleteMatch[1] && !deleteMatch[1].includes('duplicate') && !deleteMatch[1].includes('nest')) {
      return this.deleteSpecificLink(deleteMatch[1].trim());
    }

    // ── K. Move Link Command: "move <X> to <Y>" ──
    const moveMatch = input.match(/move\s+["']?(.+?)["']?\s+to\s+["']?(.+?)["']?$/i);
    if (moveMatch && moveMatch[1] && moveMatch[2]) {
      return this.moveLink(moveMatch[1].trim(), moveMatch[2].trim());
    }

    // ── L. Create Nest Command: "create nest <X>" ──
    const createMatch = input.match(/(?:create|new|add)\s+(?:a\s+)?nest\s+(?:named|called\s+)?["']?([^"']+)["']?/i);
    if (createMatch && createMatch[1]) {
      return this.createNest(createMatch[1].trim(), '📁', '#F59E0B');
    }

    // ── M. URL Pasted Directly ──
    if (/^https?:\/\//i.test(input)) {
      let host = '';
      try { host = new URL(input).hostname.replace(/^www\./, '').toLowerCase(); } catch {}
      const mapped = DOMAIN_CATEGORY_MAP[host];
      let assignedGroup = null;
      if (mapped) {
        assignedGroup = state.groups.find(g => g.name.toLowerCase() === mapped.name.toLowerCase());
      }
      return {
        text: `🔗 **Detected URL:** \`${input}\`\n\nWould you like me to store this in **${assignedGroup ? `${assignedGroup.emoji || '📁'} ${assignedGroup.name}` : 'Unsorted'}**, sir?`,
        suggestedLink: {
          url: input,
          title: titleFromUrl(input),
          groupId: assignedGroup ? assignedGroup.id : ''
        }
      };
    }

    // ── N. Optional Gemini LLM Fallback ──
    if (aiConfig.apiKey && aiConfig.provider === 'gemini') {
      try {
        return await this.callGeminiLLM(input);
      } catch (err) {
        console.warn('Gemini API call error:', err);
      }
    }

    // ── O. Default Smart Search ──
    return this.smartSearch(input);
  },

  // 12. LLM Engine with full Context
  async callGeminiLLM(userPrompt) {
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${aiConfig.model || 'gemini-1.5-flash'}:generateContent?key=${aiConfig.apiKey}`;

    const context = {
      nests: state.groups.map(g => ({ id: g.id, name: g.name, emoji: g.emoji })),
      links: state.links.map(l => ({
        id: l.id,
        title: l.title,
        url: l.url,
        note: l.note,
        nest: state.groups.find(g => g.id === l.groupId)?.name || 'Unsorted'
      }))
    };

    const systemInstruction = `You are Robin, the intelligent AI assistant for TabNest.
You have direct access to the user's link database:
- Nests: ${JSON.stringify(context.nests)}
- Links (${context.links.length} total): ${JSON.stringify(context.links)}

Answer questions accurately, find links, summarize bookmarks, and explain why links were saved. If recommending links, give the exact title and URL. Keep answers concise, clear, and nicely formatted in markdown.`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemInstruction}\n\nUser Request: ${userPrompt}` }] }
        ]
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API Error: ${res.statusText}`);
    }

    const data = await res.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't process that response.";

    // Check if the reply mentions any specific links to render cards
    const mentionedLinks = state.links.filter(l =>
      replyText.toLowerCase().includes(l.title.toLowerCase()) ||
      replyText.includes(l.url)
    ).slice(0, 4);

    return {
      text: replyText,
      links: mentionedLinks.length > 0 ? mentionedLinks : undefined
    };
  }
};

// ── UI Controller for Robin Modal ─────────────────────────
function openRobinChat(initialPrompt = '') {
  const modal = document.getElementById('robinModal');
  const messages = document.getElementById('robinMessages');
  const input = document.getElementById('robinInput');

  if (modal) {
    modal.classList.add('open');
    if (messages && messages.children.length === 0) {
      appendRobinMessage('bot',
        `🎩 **Good day, sir. I am Robin, your TabNest Butler.**\n\n` +
        `I continuously monitor your link ecosystem. Tap **🎙️ JARVIS Audit** to diagnose your nests, or ask me to find, organize, move, or clean any tab.`
      );
    }
    setTimeout(() => input?.focus(), 300);
  }
}

function appendRobinMessage(sender, markdownText, extras = {}) {
  const container = document.getElementById('robinMessages');
  if (!container) return;

  const msgDiv = document.createElement('div');
  msgDiv.className = `robin-msg robin-msg-${sender}`;

  let html = markdownText
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br/>');

  msgDiv.innerHTML = `<div class="robin-bubble">${html}</div>`;

  // Render JARVIS Audit Batch Actions
  if (extras.auditSuggestions && extras.auditSuggestions.length) {
    const auditDiv = document.createElement('div');
    auditDiv.className = 'jarvis-audit-box';
    auditDiv.innerHTML = `
      <div class="jarvis-header">
        <span>⚡ Diagnostic Actions Available</span>
      </div>
      <button class="jarvis-apply-all">✨ Execute All Optimizations</button>
    `;

    auditDiv.querySelector('.jarvis-apply-all').addEventListener('click', () => {
      pushUndo('Apply All JARVIS Optimizations', state);
      extras.auditSuggestions.forEach(s => {
        if (s.type === 'move') {
          const l = state.links.find(x => x.id === s.linkId);
          if (l) l.groupId = s.targetGroupId;
        } else if (s.type === 'dedup') {
          Robin.cleanDuplicates();
        } else if (s.type === 'organize') {
          Robin.autoOrganizeUnsorted();
        }
      });
      save();
      render(document.getElementById('searchInput')?.value || '');
      confetti('#8B5CF6');
      auditDiv.remove();
      appendRobinMessage('bot', `🎩 **All optimizations executed flawlessly, sir.** Your nests are in pristine order.`, { canUndo: true });
    });

    msgDiv.appendChild(auditDiv);
  }

  // Render link cards with favicons & 1-tap open
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

  // Undo button
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

  // Suggested link quick save button
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
      appendRobinMessage('bot', `✓ Stored **${escHtml(sl.title)}** in nest, sir.`);
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
      suggestedLink: res.suggestedLink,
      auditSuggestions: res.auditSuggestions
    });
  } catch (err) {
    typingDiv.remove();
    appendRobinMessage('bot', `⚠️ Something went wrong: ${err.message || 'Unknown error'}`);
  }
}

// ── Initialize AI Config ──────────────────────────────────
loadAiConfig();
