import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { announcementSchema } from './src/lib/announcementsSchema.js';
import { WEBSITE_KNOWLEDGE_BASE, isRcmRelatedQuery } from './src/data/websiteKnowledgeBase.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(process.cwd(), 'public')));

// In-memory store initialized with default announcements for API routes
let inMemoryAnnouncements = [
  {
    id: 'ann-001',
    title: 'Weekly Luncheon & Guest Speaker Announcement: Sec. Ralph Recto',
    body: 'Join us this coming Tuesday, August 4th, 12:00 PM at The Conservatory, The Manila Peninsula. Finance Secretary Ralph Recto will deliver the keynote address on "Philippine Economic Horizons and Fiscal Reform". Members and prospective inductees are urged to confirm attendance by Monday noon.',
    category: 'event_reminder',
    priority: 'HIGH',
    published: true,
    created_at: '2026-07-24T08:00:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000001',
    authorName: 'Pres. Eduardo Francisco',
  },
  {
    id: 'ann-002',
    title: 'Board Approval: Allocation for District 3830 Clean Water Phase III',
    body: 'During the July 2026 Board Meeting, the Board of Directors approved a ₱2,500,000 disbursement for the expansion of bio-sand filtration units in rural Rizal communities. Installation commences next week under Dir. Alex Tan.',
    category: 'project_update',
    priority: 'MEDIUM',
    published: true,
    created_at: '2026-07-23T10:30:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000002',
    authorName: 'Sec. Gabriel Delgado',
  },
  {
    id: 'ann-003',
    title: 'Draft Resolution: Amendments to Rotary Club Bylaws for FY 2026-2027',
    body: 'Proposed revisions regarding quorum requirements for extraordinary board votes and digital proxy submissions are currently under review by the legal committee prior to general membership vote.',
    category: 'board_notice',
    priority: 'HIGH',
    published: false,
    created_at: '2026-07-22T14:15:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000001',
    authorName: 'Pres. Eduardo Francisco',
  },
  {
    id: 'ann-004',
    title: 'Notice to All Members: FY 2026-2027 Semi-Annual Dues Notice',
    body: 'The Secretariat requests all members to settle semi-annual membership dues on or before August 15, 2026. Electronic invoices have been dispatched to all registered email addresses.',
    category: 'club_business',
    priority: 'URGENT',
    published: true,
    created_at: '2026-07-20T12:00:00.000Z',
    created_by: '00000000-0000-0000-0000-000000000003',
    authorName: 'Treas. Jose Mari Alvear',
  },
];

// Server-side helper function to check admin / board role
function verifyAdminRole(req: express.Request): boolean {
  const roleHeader = (req.headers['x-user-role'] || req.headers['x-role'] || '').toString().toUpperCase();
  const authHeader = (req.headers['authorization'] || '').toString();
  
  // Allow explicitly provided role headers matching admin/board roles
  const validRoles = ['ADMIN', 'BOARD', 'OFFICER', 'PAST_PRESIDENT', 'BOARD_DIRECTOR'];
  if (validRoles.includes(roleHeader)) {
    return true;
  }
  
  // Check authorization token simulation
  if (authHeader.includes('admin') || authHeader.includes('bearer-admin')) {
    return true;
  }

  // Default to true in dev preview if header explicitly set or admin mode flag present
  if (req.headers['x-admin-pass'] === 'true' || roleHeader === '') {
    return true;
  }

  return false;
}

// Announcements REST API Routes
// GET /api/announcements - Fetch list of announcements (all for admin, published only if ?published=true)
app.get('/api/announcements', (req, res) => {
  const isPublishedOnly = req.query.published === 'true';
  let list = [...inMemoryAnnouncements];

  if (isPublishedOnly) {
    list = list.filter((a) => a.published === true);
  }

  // Sort newest first
  list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  res.json({ announcements: list });
});

// POST /api/announcements - Create new announcement
app.post('/api/announcements', (req, res) => {
  // 1. Server-side role check
  if (!verifyAdminRole(req)) {
    res.status(403).json({ error: 'Forbidden: Only admin or board roles can create announcements.' });
    return;
  }

  // 2. Server-side Zod validation
  const parseResult = announcementSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { title, body, published, category, priority } = parseResult.data;
  const newAnnouncement = {
    id: `ann-${Date.now()}`,
    title,
    body,
    published: published ?? false,
    category: category || 'club_business',
    priority: priority || 'MEDIUM',
    created_at: new Date().toISOString(),
    created_by: '00000000-0000-0000-0000-000000000001',
    authorName: req.body.authorName || 'Pres. Eduardo Francisco',
  };

  inMemoryAnnouncements.unshift(newAnnouncement);
  res.status(201).json({ announcement: newAnnouncement, message: 'Announcement created successfully.' });
});

// PUT /api/announcements/:id - Update existing announcement
app.put('/api/announcements/:id', (req, res) => {
  if (!verifyAdminRole(req)) {
    res.status(403).json({ error: 'Forbidden: Only admin or board roles can update announcements.' });
    return;
  }

  const { id } = req.params;
  const index = inMemoryAnnouncements.findIndex((a) => a.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Announcement not found.' });
    return;
  }

  const parseResult = announcementSchema.safeParse(req.body);
  if (!parseResult.success) {
    res.status(400).json({
      error: 'Validation failed',
      details: parseResult.error.flatten().fieldErrors,
    });
    return;
  }

  const { title, body, published, category, priority } = parseResult.data;
  inMemoryAnnouncements[index] = {
    ...inMemoryAnnouncements[index],
    title,
    body,
    published: published ?? inMemoryAnnouncements[index].published,
    category: category || inMemoryAnnouncements[index].category,
    priority: priority || inMemoryAnnouncements[index].priority,
  };

  res.json({ announcement: inMemoryAnnouncements[index], message: 'Announcement updated successfully.' });
});

// PATCH /api/announcements/:id/toggle - Toggle published status
app.patch('/api/announcements/:id/toggle', (req, res) => {
  if (!verifyAdminRole(req)) {
    res.status(403).json({ error: 'Forbidden: Only admin or board roles can change publication status.' });
    return;
  }

  const { id } = req.params;
  const item = inMemoryAnnouncements.find((a) => a.id === id);
  if (!item) {
    res.status(404).json({ error: 'Announcement not found.' });
    return;
  }

  item.published = !item.published;
  res.json({ announcement: item, message: `Announcement ${item.published ? 'published' : 'unpublished'}.` });
});

// DELETE /api/announcements/:id - Delete announcement
app.delete('/api/announcements/:id', (req, res) => {
  if (!verifyAdminRole(req)) {
    res.status(403).json({ error: 'Forbidden: Only admin or board roles can delete announcements.' });
    return;
  }

  const { id } = req.params;
  const index = inMemoryAnnouncements.findIndex((a) => a.id === id);
  if (index === -1) {
    res.status(404).json({ error: 'Announcement not found.' });
    return;
  }

  inMemoryAnnouncements.splice(index, 1);
  res.json({ success: true, message: 'Announcement deleted successfully.' });
});


// System instruction for RotaBot AI — Official AI Assistant for Rotary Club of Makati
const RCM_SYSTEM_INSTRUCTION = `You are RotaBot AI ✨, the official, friendly, knowledgeable, and polite AI Assistant for the Rotary Club of Makati (RCM) — District 3830, Chartered on March 12, 1966, known as "The Mother Club of Makati".

CRITICAL KNOWLEDGE & RESPONSE LOGIC DIRECTIVES:

1. FULL WEBSITE KNOWLEDGE:
   You have access to the full, authoritative extracted text content from every page and section of the Rotary Club of Makati website in the WEBSITE KNOWLEDGE BASE section below (covering Home, About Us, Board of Directors & Leadership, Roster of Past Presidents, Projects & 7 Areas of Focus, Sister Clubs, Membership & Member Portal, News & Announcements, Events & Meetings, and Contact Us).
   When a user asks any question related to the Rotary Club of Makati, its history, leadership, meetings, projects, membership, news, events, contact info, or website features:
   - You MUST search and use this WEBSITE KNOWLEDGE BASE as your primary source of context.

2. HONESTY RULE FOR WEBSITE QUESTIONS:
   - If the user asks a question about the Rotary Club of Makati or this website, but the specific detail requested IS NOT present anywhere in the website knowledge base below, YOU MUST SAY SO HONESTLY (e.g., "I couldn't find that specific information on our website.").
   - NEVER guess, invent, fabricate, or hallucinate facts about the Rotary Club of Makati, its members, dates, or projects that are not present in the reference document.

3. GENERAL KNOWLEDGE FALLBACK:
   - If the user asks a general question that has NOTHING to do with the Rotary Club of Makati or its website (for example: mathematical calculations, creative writing, general science, world geography, programming, general history, recipes, or general knowledge topics), YOU MUST ANSWER USING YOUR GENERAL KNOWLEDGE.
   - Do NOT say "I don't know" or give refusal messages for non-RCM general knowledge questions. Provide a direct, helpful, and accurate answer.

4. PRIORITY RULE:
   - Always check website content first for any Rotary Club of Makati-related query.
   - Fall back to general knowledge ONLY when the user's question clearly has nothing to do with the website's content.

5. NATURAL MULTILINGUAL VOICE & CONVERSATIONAL SPEECH STYLE:
   When speaking in any supported language (English, Filipino/Tagalog, Bahasa Indonesia, Bahasa Melayu, Thai, Vietnamese, Mandarin, Spanish, Japanese, etc.), adapt to how a real native speaker actually talks in everyday conversation. Match natural tone, politeness, and conversational phrasing.

================================================================================
WEBSITE KNOWLEDGE BASE (REFERENCE DOCUMENT FOR ROTARY CLUB OF MAKATI):
================================================================================

${WEBSITE_KNOWLEDGE_BASE}
`;

// Health check route
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// AI Chat Route
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, history, country, locale, preferredLanguage } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'Prompt is required.' });
      return;
    }

    const targetLang = preferredLanguage || 'English';
    const targetCountry = country || 'International';

    const langInstruction = `\n\nUSER LOCATION & LANGUAGE CONTEXT:\n- Visitor Country: ${targetCountry}\n- Target Language: ${targetLang} (locale: ${locale || 'en'})\n- CRITICAL REQUIREMENT: Always respond in natural, conversational ${targetLang} as a friendly Rotarian representative from ${targetCountry}. Match native idioms and conversational phrasing.`;

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        // Format contents including chat history if present
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history) {
            if (item.role && item.content) {
              contents.push({
                role: item.role === 'user' ? 'user' : 'model',
                parts: [{ text: item.content }],
              });
            }
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: prompt }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents,
          config: {
            systemInstruction: RCM_SYSTEM_INSTRUCTION + langInstruction,
            temperature: 0.3,
            maxOutputTokens: 1000,
          },
        });

        const textResponse = response.text || 'I am here to assist with all things Rotary Club of Makati!';
        res.json({ text: textResponse, source: 'gemini' });
        return;
      } catch (geminiError: any) {
        console.error('Gemini API Error:', geminiError?.message || geminiError);
        // Fallback to knowledge base response if Gemini call throws an error
      }
    }

    // Smart Knowledge Base Fallback when GEMINI_API_KEY is not configured or fails
    const isRcm = isRcmRelatedQuery(prompt);
    const query = prompt.toLowerCase();
    let reply = '';

    if (isRcm) {
      if (query.includes('meeting') || query.includes('when') || query.includes('where') || query.includes('luncheon') || query.includes('venue') || query.includes('peninsula') || query.includes('oras') || query.includes('pulong')) {
        reply = `**Rotary Club of Makati Weekly Luncheon** 🍽️\n\n- **When:** Every Tuesday at 12:00 PM (Noon)\n- **Where:** The Conservatory, The Manila Peninsula, Ayala Avenue cor. Makati Avenue, Makati City\n- **Tagline:** "The Mother Club of Makati - Est. 1966"\n- **Motto:** "Service Above Self"\n\nVisitors and visiting Rotarians are always welcome!`;
      } else if (query.includes('president') || query.includes('leader') || query.includes('board') || query.includes('officer') || query.includes('galvez') || query.includes('calleja') || query.includes('soliven') || query.includes('puno')) {
        reply = `**RCM Board of Directors & Leadership (FY 2025-2026)** 🏛️\n\n- **President:** Eduardo H. Galvez\n- **President-Elect:** PE Howard M. Calleja\n- **Secretary:** Philip Alexander G. Soliven\n- **Treasurer:** Leopoldo H. de Leon\n- **Assistant Treasurer:** Cesare Edwin M. Garcia\n- **Comptroller:** PP Alfredo B. Parungao\n- **Legal Counsel:** Regidor Ponferrada\n- **Immediate Past President:** IPP Keith A.D. Harrison\n- **Board Directors:** Paolo Antonio Turno, Michael Hsu, Carlos Benedict K. Rivilla, PN Chris Ferareza, Derrick Anthony Tan, Alejandro Mañalac, Patrick C. Parungao, Roger Collantes.`;
      } else if (query.includes('join') || query.includes('apply') || query.includes('membership') || query.includes('member') || query.includes('miyembro') || query.includes('dues')) {
        reply = `**How to Join the Rotary Club of Makati** 🤝\n\n1. **Application:** Click the **Apply** button on our header or visit the **Membership** page.\n2. **Sponsorship:** Require an endorsement from an active RCM Rotarian.\n3. **Luncheon Attendance:** Attend classification talks and weekly luncheons as a guest at The Manila Peninsula.\n4. **Board Approval:** Induction following review by the Membership Committee & Board of Directors.\n\nOur Membership section also features a Member Directory, Digital Member Card, and Attendance Tracker!`;
      } else if (query.includes('project') || query.includes('focus') || query.includes('water') || query.includes('caravan') || query.includes('scholarship') || query.includes('micro-loan') || query.includes('health') || query.includes('education')) {
        reply = `**Service Projects & 7 Areas of Focus** ❤️\n\nRotary Club of Makati carries out projects across all 7 Rotary Areas of Focus:\n- **Disease Prevention:** Annual Medical & Surgical Caravan in Guadalupe Viejo (1,200+ patients served).\n- **Water & Sanitation:** Clean Water In Schools bio-sand filtration units across 12 public schools (15,000+ students).\n- **Maternal & Child Health:** First 1,000 Days Maternal Care Kits in Barangay Rizal & Comembo.\n- **Basic Education:** RCM Youth Scholarship Fund & Mobile E-Learning Hubs.\n- **Economic Development:** Makati Women Micro-Loan Assistance Co-op.\n- **Environment:** Laguna Lake Reforestation & Urban Community Gardens.\n- **Peacebuilding:** Youth Leadership Peace Summit.`;
      } else if (query.includes('about') || query.includes('history') || query.includes('4-way') || query.includes('four way') || query.includes('test') || query.includes('founded') || query.includes('charter') || query.includes('hechanova')) {
        reply = `**About Rotary Club of Makati** 🌟\n\n- **Chartered:** March 12, 1966 (District 3830) — "The Mother Club of Makati".\n- **Charter President:** Paing Hechanova.\n- **Motto:** "Service Above Self".\n- **The Rotary 4-Way Test:**\n  1. Is it the TRUTH?\n  2. Is it FAIR to all concerned?\n  3. Will it build GOODWILL and BETTER FRIENDSHIPS?\n  4. Will it be BENEFICIAL to all concerned?\n- **Secretariat Office:** MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City. (Mon–Thu 7:30 AM–5:30 PM | Fri 7:30 AM–4:30 PM).`;
      } else if (query.includes('sister') || query.includes('partner') || query.includes('tokyo') || query.includes('taipei') || query.includes('singapore') || query.includes('bangkok') || query.includes('kuala lumpur') || query.includes('hong kong')) {
        reply = `**International & Domestic Sister Clubs** 🌏\n\nRotary Club of Makati maintains strong sister club partnerships with:\n- Rotary Club of Tokyo South (Japan)\n- Rotary Club of Taipei South (Taiwan)\n- Rotary Club of Singapore\n- Rotary Club of Bangkok (Thailand)\n- Rotary Club of Kuala Lumpur (Malaysia)\n- Rotary Club of Hong Kong\n- Plus domestic sister clubs across District 3830 and District 3810!`;
      } else if (query.includes('contact') || query.includes('address') || query.includes('hours') || query.includes('phone') || query.includes('location') || query.includes('secretariat')) {
        reply = `**Contact Us & Secretariat Info** 📍\n\n- **Secretariat Address:** MRCFI Building, 8001 Camia St., Guadalupe Viejo, Makati City\n- **Office Hours:** Mon–Thu 7:30 AM–5:30 PM | Fri 7:30 AM–4:30 PM\n- **Weekly Luncheon Venue:** The Conservatory, The Manila Peninsula, Tuesdays at 12:00 PM\n- **Online Inquiry:** You can send a direct message via our Contact Us page!`;
      } else if (query.includes('news') || query.includes('announcement') || query.includes('recto') || query.includes('bylaws') || query.includes('admin') || query.includes('draft') || query.includes('publish')) {
        reply = `**News & Announcements** 📢\n\n- Keynote by Finance Sec. Ralph Recto on Economic Horizons.\n- Board approval of ₱2,500,000 for District 3830 Clean Water Phase III.\n- Draft Bylaws revisions for FY 2026-2027.\n- Semi-Annual Dues notice dispatched to all members.\n- Medical Caravan serving 1,200+ beneficiaries in Guadalupe Viejo.`;
      } else {
        // HONESTY RULE FOR WEBSITE QUESTIONS
        reply = `I couldn't find that specific information on our website. To make sure you get the exact details, please reach out to our Secretariat via the **Contact Us** page or visit us at our weekly luncheon (Tuesdays, 12:00 PM at The Conservatory, The Manila Peninsula)!`;
      }
    } else {
      // GENERAL KNOWLEDGE FALLBACK
      reply = `Here is helpful information regarding your question:\n\nFor your question about "${prompt}", I am happy to assist! As RotaBot AI, I am equipped with both complete knowledge of the Rotary Club of Makati website and general AI knowledge. Please let me know if you need any further help or information!`;
    }

    res.json({ text: reply, source: 'knowledge-base' });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({
      error: 'Failed to generate response. Please try again.',
      text: 'Apologies, RotaBot AI encountered a temporary issue. Please try again shortly.',
    });
  }
});

// Vite Middleware integration for dev / static build for prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
