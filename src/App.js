import { useState } from "react";

const NICHE_TOPICS = [
  "Chup rehne ki psychology — rishton mein khamoshi ka matlab",
  "Log ghost kyun karte hain — bina kuch kahe chale jaate hain",
  "Overthinking ka andheera — dimag khud ko kyun takleef deta hai",
  "Jo log milte nahi unse hi pyaar kyun hota hai",
  "Akela rehna vs tanha hona — farak samjho",
  "Gehre sochne wale log dard mein kyun ziyada rehte hain",
  "Jo dard dete hain unhe miss kyun karte hain hum",
  "Self-awareness ka dard — khud ko jaanna kitna mushkil hai",
  "Attachment aur detachment — kab chhodni chahiye umeed",
  "Rishton mein mirror effect — hum wahi dekhte hain jo hum hain",
  "Emotional unavailability — jo samne hoke bhi nahi hote",
  "Introvert log galat kyun samjhe jaate hain duniya mein",
  "Chhote ishaaron se kisi ko pehchano — psychology of micro expressions",
  "Wrong logon ko romanticize karna — yeh aadat kahan se aati hai",
  "Letting go ka dard — chhorna aur bhoolna alag kyun hota hai",
  "Subconscious mind aur rishte — hum wohi kyun chhunte hain",
  "Deep thinkers aur shallow conversations — andar se toot jaana",
  "Pyaar mein cognitive dissonance — jaante hue bhi kyun rehte hain",
  "Loneliness ka psychology — bheed mein bhi akela kyun lagta hai",
  "Kind logon ko zyada takleef kyun milti hai is duniya mein",
  "Boundaries kya hoti hain — na kehna kyun zaroori hai",
  "Jo log zyada sochte hain unhe neend kyun nahi aati",
  "Toxic positivity — 'sab theek ho jayega' sunna kyun hurt karta hai",
  "Kisi ko truly jaanna kitna mushkil hota hai",
  "Apni feelings hide karna — yeh aadat kahan se aati hai",
];

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const STORAGE_KEY = "pgw_api_key";

export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [showSetup, setShowSetup] = useState(() => !localStorage.getItem(STORAGE_KEY));
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [errors, setErrors] = useState({});

  const saveApiKey = () => {
    const key = apiKeyInput.trim();
    if (!key.startsWith("sk-ant-")) {
      alert("API key galat lag rahi hai. 'sk-ant-' se shuru honi chahiye.");
      return;
    }
    localStorage.setItem(STORAGE_KEY, key);
    setApiKey(key);
    setShowSetup(false);
  };

  const callAPI = async (topic, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-calls": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [
              {
                role: "user",
                content: `You are a YouTube Shorts content creator for "Pradeep Goswami Writes" — a Hindi channel about deep psychology, human emotions, love, heartbreak, loneliness, real-life feelings, attachment, and the hidden psychology of people and relationships. Indian audience, 18-35 age group.

Topic: "${topic}"

Return ONLY a raw valid JSON object. No markdown, no backticks, no explanation. Just the JSON.

{
  "topic": "topic in Hindi/Hinglish",
  "script": "20-30 second spoken script in HINDI (Devanagari script). Emotional hook in first 3 seconds. Deep, poetic, makes people feel seen. End with a thought-provoking line.",
  "video_prompt": "Animated cartoon style video prompt for Kling AI or Runway. Style: 2D anime or soft 3D cartoon, warm Indian art style, emotional motion graphic. Show cartoon character expressing the emotion — boy/girl sitting alone, two people talking, character overthinking with thought bubbles, walking in rain, staring at phone, looking at sky. Describe: character pose, facial expression, background scene (bedroom at night, rooftop, park, rainy street, metro, café), color palette (warm pastels or moody blues/purples), camera movement (slow zoom, pan, close-up on eyes). Full animated style, NO real footage.",
  "audio_prompt": "ElevenLabs ke liye Hindi mein voice direction: awaaz kaisi honi chahiye (dheemi, gehri, dard bhari), speed (dheere dheere, beech beech mein ruko), emotion kya hona chahiye (udaas, sochne wali, shant lekin gehri), kahan pause lena hai, overall feel (jaise koi apna dost dil ki baat kar raha ho ya ek shayar bol raha ho).",
  "title": "YouTube Shorts title in Hinglish or Hindi, emotional hook, max 60 characters, Indian trending style",
  "description": "SEO YouTube description 150-200 words. Mix of Hindi and English keywords. Target Indian audience. Include: psychology Hindi, emotional video, love psychology, deep thinking, hindi motivation, rishte, dil ki baat, broken heart, self awareness. Natural placement.",
  "hashtags": "#psychologyinhindi #deepthinking #hindimotivation #emotionalvideo #lovepsychology #rishte #dardebayan #hindishorts #mentalhealth #reallifestories #brokenheart #attachmenttheory #selfawareness #innerpeace #pradeepgoswamiw",
  "tags": "20 YouTube tags in Hindi/English mix, comma separated, targeting Indian search behavior"
}`,
              },
            ],
          }),
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${response.status}`);
        }

        const data = await response.json();
        const text = data.content?.[0]?.text || "";
        let jsonStr = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim();
        const start = jsonStr.indexOf("{");
        const end = jsonStr.lastIndexOf("}");
        if (start !== -1 && end !== -1) jsonStr = jsonStr.slice(start, end + 1);
        const parsed = JSON.parse(jsonStr);
        return { success: true, data: parsed };
      } catch (err) {
        if (attempt < retries) { await sleep(1500); continue; }
        return { success: false, error: err.message, topic };
      }
    }
  };

  const generateVideos = async () => {
    setLoading(true);
    setVideos([]);
    setErrors({});
    setActiveTab(null);
    const topics = pickRandom(NICHE_TOPICS, 3);
    if (customTopic.trim()) topics[0] = customTopic.trim();
    const results = [];
    for (let i = 0; i < 3; i++) {
      setLoadingIndex(i);
      const result = await callAPI(topics[i]);
      if (result.success) {
        results.push(result.data);
      } else {
        results.push({ topic: topics[i], _error: result.error, script: "", video_prompt: "", audio_prompt: "", title: "", description: "", hashtags: "", tags: "" });
        setErrors(prev => ({ ...prev, [i]: result.error }));
      }
      if (i < 2) await sleep(800);
    }
    setVideos(results);
    setActiveTab(0);
    setLoadingIndex(-1);
    setLoading(false);
  };

  const regenSingle = async (index) => {
    const topic = customTopic.trim() && index === 0 ? customTopic : pickRandom(NICHE_TOPICS, 3)[index];
    setErrors(prev => { const n = { ...prev }; delete n[index]; return n; });
    const newVideos = [...videos];
    newVideos[index] = { topic, _loading: true, script: "", video_prompt: "", audio_prompt: "", title: "", description: "", hashtags: "", tags: "" };
    setVideos(newVideos);
    const result = await callAPI(topic);
    const finalVideos = [...newVideos];
    finalVideos[index] = result.success ? result.data : { topic, _error: result.error, script: "", video_prompt: "", audio_prompt: "", title: "", description: "", hashtags: "", tags: "" };
    setVideos(finalVideos);
  };

  const copyField = (text, key) => {
    const doCopy = () => {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
      const el = document.createElement("textarea");
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
      document.body.appendChild(el);
      el.focus(); el.select(); el.setSelectionRange(0, el.value.length);
      document.execCommand("copy");
      document.body.removeChild(el);
      return Promise.resolve();
    };
    doCopy().then(() => { setCopied(key); setTimeout(() => setCopied(""), 2500); }).catch(() => {});
  };

  const s = {
    page: { minHeight: "100vh", background: "#020817", fontFamily: "'DM Sans','Segoe UI',sans-serif", padding: "20px 14px 60px", maxWidth: 680, margin: "0 auto" },
    gold: "#e2c97e",
    goldDark: "#c9a84c",
    card: { background: "#0c1628", border: "1px solid #1e293b", borderRadius: 16, padding: 18 },
  };

  const CopyBtn = ({ text, label }) => (
    <button onClick={(e) => { e.stopPropagation(); copyField(text, label); }} style={{ background: copied === label ? "#22c55e" : "#1e293b", color: copied === label ? "#fff" : "#94a3b8", border: `1px solid ${copied === label ? "#22c55e" : "#334155"}`, borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, minWidth: 68, minHeight: 34, WebkitTapHighlightColor: "transparent" }}>
      {copied === label ? "✓ Done" : "Copy"}
    </button>
  );

  const Field = ({ icon, label, value, fieldKey, height }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: s.gold, textTransform: "uppercase" }}>{icon} {label}</span>
        <CopyBtn text={value} label={fieldKey} />
      </div>
      <div style={{ background: "#070f1e", border: "1px solid #1e293b", borderRadius: 8, padding: "10px 12px", fontSize: 13, color: value ? "#cbd5e1" : "#334155", lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight: height || 110, overflowY: "auto" }}>
        {value || "—"}
      </div>
    </div>
  );

  const v = activeTab !== null ? videos[activeTab] : null;

  // ── SETUP SCREEN ──
  if (showSetup) {
    return (
      <div style={s.page}>
        <div style={{ textAlign: "center", marginBottom: 32, paddingTop: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: s.gold, fontWeight: 700, marginBottom: 8 }}>PRADEEP GOSWAMI WRITES</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#f1f5f9", margin: "0 0 8px" }}>Shorts Bot Setup</h1>
          <p style={{ fontSize: 13, color: "#475569" }}>Ek baar API key daalo — hamesha ke liye save ho jayegi</p>
        </div>

        <div style={{ ...s.card, marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: s.gold, fontWeight: 700, marginBottom: 16 }}>📋 STEP BY STEP</div>
          {[
            ["1", "console.anthropic.com par jao"],
            ["2", "Account banao (free hai)"],
            ["3", "API Keys section mein jao"],
            ["4", "New key banao, copy karo"],
            ["5", "Neeche paste karo"],
          ].map(([n, t]) => (
            <div key={n} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
              <div style={{ background: s.gold, color: "#020817", borderRadius: "50%", width: 22, height: 22, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{n}</div>
              <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{t}</div>
            </div>
          ))}
        </div>

        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, color: s.gold, fontWeight: 700, marginBottom: 8 }}>🔑 ANTHROPIC API KEY</div>
          <input
            type="password"
            placeholder="sk-ant-api03-..."
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            style={{ width: "100%", background: "#070f1e", border: "1px solid #1e293b", borderRadius: 8, padding: "12px", color: "#f1f5f9", fontSize: 13, outline: "none", fontFamily: "monospace", boxSizing: "border-box" }}
          />
          <div style={{ fontSize: 11, color: "#475569", marginTop: 6 }}>🔒 Sirf aapke browser mein save hogi. Kahi nahi jayegi.</div>
        </div>

        <button onClick={saveApiKey} style={{ width: "100%", padding: "14px", background: `linear-gradient(135deg, ${s.gold}, ${s.goldDark})`, color: "#020817", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit" }}>
          ✅ Save Karo aur Shuru Karo
        </button>

        <div style={{ marginTop: 20, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 11, color: "#e2c97e", fontWeight: 700, marginBottom: 8 }}>💰 COST KITNA AAYEGA?</div>
          <div style={{ fontSize: 12, color: "#475569", lineHeight: 1.7 }}>
            Anthropic free credits deta hai new account pe ($5 free).<br />
            3 shorts generate karna ≈ $0.01 (1 paisa se bhi kam).<br />
            Matlab mahine mein hazaron shorts free mein!
          </div>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <div style={s.page}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: s.gold, fontWeight: 700, marginBottom: 6 }}>PRADEEP GOSWAMI WRITES</div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.2 }}>
          YouTube Shorts<br /><span style={{ color: s.gold }}>Hindi AI Bot 🇮🇳</span>
        </h1>
        <p style={{ fontSize: 12, color: "#475569", margin: "0 0 4px" }}>Hindi Script • Animated Prompts • Indian SEO</p>
        <button onClick={() => { setShowSetup(true); setApiKeyInput(""); }} style={{ background: "none", border: "none", color: "#334155", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>API key change karo</button>
      </div>

      {/* Custom Topic */}
      <input type="text" placeholder="Apna topic likhein Video 1 ke liye (optional)..." value={customTopic} onChange={(e) => setCustomTopic(e.target.value)}
        style={{ width: "100%", background: "#0f172a", border: "1px solid #1e293b", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 13, outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 12 }} />

      {/* Generate Button */}
      <button onClick={generateVideos} disabled={loading}
        style={{ width: "100%", padding: "14px", background: loading ? "#1e293b" : `linear-gradient(135deg, ${s.gold}, ${s.goldDark})`, color: loading ? "#475569" : "#020817", border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800, cursor: loading ? "not-allowed" : "pointer", marginBottom: 24, fontFamily: "inherit", transition: "all 0.2s" }}>
        {loading ? loadingIndex >= 0 ? `⏳ Short ${loadingIndex + 1}/3 generate ho raha hai...` : "⏳ Generating..." : "⚡ Aaj ke 3 Hindi Shorts Generate Karo"}
      </button>

      {/* Progress bar */}
      {loading && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ flex: 1, height: 4, borderRadius: 4, background: i < loadingIndex ? s.gold : i === loadingIndex ? s.gold + "88" : "#1e293b", transition: "all 0.5s" }} />
          ))}
        </div>
      )}

      {/* Tabs + Content */}
      {videos.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {videos.map((_, i) => (
              <button key={i} onClick={() => setActiveTab(i)}
                style={{ flex: 1, padding: "10px 6px", background: activeTab === i ? s.gold : "#0f172a", color: activeTab === i ? "#020817" : errors[i] ? "#ef4444" : "#64748b", border: `1px solid ${activeTab === i ? s.gold : errors[i] ? "#ef444455" : "#1e293b"}`, borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>
                {errors[i] ? "⚠️" : "📹"} Short {i + 1}
              </button>
            ))}
          </div>

          {v && (
            <div style={s.card}>
              {v._error ? (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
                  <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>Error: {v._error}</p>
                  <button onClick={() => regenSingle(activeTab)} style={{ background: s.gold, color: "#020817", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>🔄 Dobara Try Karo</button>
                </div>
              ) : v._loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 28 }}>⏳</div>
                  <p style={{ color: "#64748b", fontSize: 13, marginTop: 10 }}>Generate ho raha hai...</p>
                </div>
              ) : (
                <>
                  <div style={{ background: "#1e293b", borderRadius: 8, padding: "7px 12px", fontSize: 12, color: s.gold, fontWeight: 700, marginBottom: 18, display: "inline-block", maxWidth: "100%", wordBreak: "break-word" }}>
                    🎯 {v.topic}
                  </div>
                  <Field icon="🎙️" label="Script (Hindi)" value={v.script} fieldKey={`sc-${activeTab}`} height={180} />
                  <Field icon="🎨" label="Animated Video Prompt (Kling/Runway)" value={v.video_prompt} fieldKey={`vp-${activeTab}`} height={160} />
                  <Field icon="🔊" label="Audio Prompt — ElevenLabs (Hindi)" value={v.audio_prompt} fieldKey={`ap-${activeTab}`} height={120} />
                  <Field icon="📌" label="Title (Hinglish/Hindi)" value={v.title} fieldKey={`ti-${activeTab}`} />
                  <Field icon="📝" label="Description — Indian SEO" value={v.description} fieldKey={`de-${activeTab}`} height={160} />
                  <Field icon="#️⃣" label="Hashtags" value={v.hashtags} fieldKey={`ht-${activeTab}`} />
                  <Field icon="🏷️" label="Tags (Indian SEO)" value={v.tags} fieldKey={`tg-${activeTab}`} />

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button
                      onClick={() => {
                        const all = `TOPIC: ${v.topic}\n\nSCRIPT:\n${v.script}\n\nVIDEO PROMPT:\n${v.video_prompt}\n\nAUDIO PROMPT (ElevenLabs):\n${v.audio_prompt}\n\nTITLE:\n${v.title}\n\nDESCRIPTION:\n${v.description}\n\nHASHTAGS:\n${v.hashtags}\n\nTAGS:\n${v.tags}`;
                        copyField(all, `all-${activeTab}`);
                      }}
                      style={{ flex: 2, padding: "13px", background: "#1e293b", color: s.gold, border: "1px solid #334155", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      {copied === `all-${activeTab}` ? "✓ Copied!" : "📋 Sab Copy Karo"}
                    </button>
                    <button onClick={() => regenSingle(activeTab)} style={{ flex: 1, padding: "13px", background: "#070f1e", color: "#64748b", border: "1px solid #1e293b", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>
                      🔄 Dobara
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Workflow */}
      {videos.length > 0 && !loading && (
        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: s.gold, letterSpacing: 1, marginBottom: 10 }}>📋 DAILY WORKFLOW</div>
          {["1️⃣ Script copy → ElevenLabs → Hindi voice generate", "2️⃣ Video Prompt → Kling AI / Runway → animated video banao", "3️⃣ CapCut mein merge → captions add karo", "4️⃣ Title + Description + Hashtags paste karo", "5️⃣ YouTube par schedule karo"].map((step, i) => (
            <div key={i} style={{ fontSize: 12, color: "#475569", marginBottom: 5 }}>{step}</div>
          ))}
        </div>
      )}
    </div>
  );
}
