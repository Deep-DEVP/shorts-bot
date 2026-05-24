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
  "Narcissist ko pehchanne ke signs — toxic log kaise behave karte hain",
  "Khamosh logo ki andar ki duniya — jo bolte nahi woh mehsoos karte hain",
  "Trauma bonding kya hota hai — dard dene wale se pyaar kyun",
  "People pleasing ki bimari — na bolna kyun itna mushkil lagta hai",
  "Emotional intelligence kya hai aur iske bina kya hota hai",
];

const pickRandom = (arr, n) => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API Key Screen ─────────────────────────────────────────────────────────────
function ApiKeyScreen({ onSave }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");

  const handleSave = () => {
    const trimmed = key.trim();
    if (trimmed.length < 20) {
      setErr("Key bahut chhoti hai. Sahi key paste karo.");
      return;
    }
    localStorage.setItem("gemini_key", trimmed);
    onSave(trimmed);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#020817", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "sans-serif",
    }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 44, marginBottom: 10 }}>🤖</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Pradeep Shorts Bot
          </h1>
          <div style={{
            display: "inline-block", background: "#14532d", color: "#86efac",
            borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700, marginBottom: 10,
          }}>✅ 100% FREE — Google Gemini</div>
          <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
            Google Gemini API key daalo.<br />Bilkul free hai — koi card nahi chahiye.
          </p>
        </div>

        <div style={{ background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16, marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: "#e2c97e", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
            🔑 FREE API KEY KAISE MILEGI?
          </div>
          {[
            "1. aistudio.google.com pe jao",
            "2. Google account se login karo",
            "3. 'Get API Key' button dabao",
            "4. 'Create API key' dabao",
            "5. Key copy karo — yahan paste karo",
          ].map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{s}</div>
          ))}
          <div style={{ marginTop: 10, padding: "8px 10px", background: "#1e293b", borderRadius: 8, fontSize: 11, color: "#86efac" }}>
            💚 Free tier: 1500 requests/day — daily 3 shorts ke liye bahut zyada!
          </div>
        </div>

        <input
          type="password"
          placeholder="AIzaSy..."
          value={key}
          onChange={(e) => { setKey(e.target.value); setErr(""); }}
          style={{
            width: "100%", background: "#0f172a", border: `1px solid ${err ? "#ef4444" : "#1e293b"}`,
            borderRadius: 10, padding: "13px 14px", color: "#f1f5f9", fontSize: 14,
            outline: "none", fontFamily: "monospace", marginBottom: 8, boxSizing: "border-box",
          }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{err}</p>}

        <button onClick={handleSave} style={{
          width: "100%", padding: "14px",
          background: "linear-gradient(135deg, #e2c97e, #c9a84c)",
          color: "#020817", border: "none", borderRadius: 12,
          fontSize: 15, fontWeight: 800, cursor: "pointer", fontFamily: "inherit",
        }}>
          Save Karo & Shuru Karo ⚡
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 12 }}>
          🔒 Key sirf tumhare browser mein save hoti hai.
        </p>
      </div>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_key") || "");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [errors, setErrors] = useState({});

  if (!apiKey) return <ApiKeyScreen onSave={setApiKey} />;

  const PROMPT = (topic) => `You are a YouTube Shorts content creator for "Pradeep Goswami Writes" — a Hindi channel about deep psychology, human emotions, love, heartbreak, loneliness, real-life feelings, attachment, and the hidden psychology between people. Indian audience, 18-35 age group.

Topic: "${topic}"

Return ONLY a raw valid JSON object. No markdown, no backticks, no preamble. Just the JSON.

{
  "topic": "topic in Hindi/Hinglish",
  "script": "20-30 second spoken script in HINDI Devanagari script. Emotional hook in first 3 seconds. Deep poetic style. Makes people feel seen. End with thought-provoking line.",
  "video_prompt": "Animated cartoon style prompt for Kling AI or Runway. Style: 2D anime or soft 3D cartoon, warm Indian art style. Show Indian cartoon character expressing the emotion. Describe: character pose, facial expression, background scene like bedroom at night or rainy window or rooftop or metro station, color palette, animation movement like slow zoom or floating thoughts or tears. Like a 20-second emotional animated short film. NO real footage. Full cartoon only.",
  "audio_prompt": "ElevenLabs ke liye Hindi mein voice direction. Awaaz kaisi ho, speed kya ho, emotion kya feel ho, kahan pause lena hai, kaise deliver karna hai. Ek shayar ki tarah describe karo.",
  "title": "YouTube Shorts title in Hinglish or Hindi. Emotional hook. Max 60 characters. Indian trending style.",
  "description": "SEO YouTube description 150-200 words. Hindi and English keyword mix. Indian audience. Keywords: psychology Hindi emotional video love psychology deep thinking hindi motivation rishte dil ki baat broken heart hindi attachment theory hindi shorts. End with channel CTA.",
  "hashtags": "#psychologyinhindi #deepthinking #hindimotivation #emotionalvideo #lovepsychology #rishte #dardebayan #hindishorts #mentalhealth #reallifestories #brokenheart #attachmenttheory #selfawareness #innerpeace #pradeepgoswamiwr #hindipsychology #shortsviral #youtubeshorts #indianyoutuber #feelingsinhindi",
  "tags": "psychology hindi, emotional video hindi, love psychology hindi, deep thinking hindi, hindi motivation, rishte ki psychology, dil ki baat, broken heart hindi, attachment theory, hindi shorts, mental health hindi, self awareness hindi, overthinking hindi, loneliness hindi, indian psychology, feelings hindi, short video psychology, viral shorts india, hindi deep thoughts, real life psychology"
}`;

  const callAPI = async (topic, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: PROMPT(topic) }] }],
              generationConfig: { temperature: 0.9, maxOutputTokens: 1500 },
            }),
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          const msg = errData?.error?.message || `Error ${res.status}`;
          if (res.status === 400 || res.status === 403) {
            localStorage.removeItem("gemini_key");
            setApiKey("");
            throw new Error("API key galat hai. Dobara daalo.");
          }
          throw new Error(msg);
        }

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
        let jsonStr = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/g, "").trim();
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
    setLoading(true); setVideos([]); setErrors({}); setActiveTab(null);
    const topics = pickRandom(NICHE_TOPICS, 3);
    if (customTopic.trim()) topics[0] = customTopic.trim();
    const results = [];
    for (let i = 0; i < 3; i++) {
      setLoadingIndex(i);
      const result = await callAPI(topics[i]);
      results.push(result.success ? result.data : {
        topic: topics[i], _error: result.error,
        script: "", video_prompt: "", audio_prompt: "", title: "", description: "", hashtags: "", tags: "",
      });
      if (!result.success) setErrors(prev => ({ ...prev, [i]: result.error }));
      if (i < 2) await sleep(600);
    }
    setVideos(results); setActiveTab(0); setLoadingIndex(-1); setLoading(false);
  };

  const regenSingle = async (index) => {
    const topic = customTopic.trim() && index === 0 ? customTopic : pickRandom(NICHE_TOPICS, 1)[0];
    setErrors(prev => { const n = { ...prev }; delete n[index]; return n; });
    const nv = [...videos];
    nv[index] = { topic, _loading: true, script: "", video_prompt: "", audio_prompt: "", title: "", description: "", hashtags: "", tags: "" };
    setVideos(nv);
    const result = await callAPI(topic);
    const fv = [...nv];
    fv[index] = result.success ? result.data : { topic, _error: result.error, script: "", video_prompt: "", audio_prompt: "", title: "", description: "", hashtags: "", tags: "" };
    setVideos(fv);
  };

  const copyField = (text, key) => {
    const doCopy = () => {
      if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
      const el = document.createElement("textarea");
      el.value = text; el.setAttribute("readonly", "");
      el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
      document.body.appendChild(el);
      el.focus(); el.select(); el.setSelectionRange(0, 99999);
      document.execCommand("copy"); document.body.removeChild(el);
      return Promise.resolve();
    };
    doCopy().then(() => { setCopied(key); setTimeout(() => setCopied(""), 2500); })
      .catch(() => alert("Copy failed:\n\n" + text.slice(0, 300)));
  };

  const CopyBtn = ({ text, label }) => (
    <button onClick={(e) => { e.stopPropagation(); copyField(text, label); }} style={{
      background: copied === label ? "#22c55e" : "#1e293b",
      color: copied === label ? "#fff" : "#94a3b8",
      border: `1px solid ${copied === label ? "#22c55e" : "#334155"}`,
      borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700,
      cursor: "pointer", fontFamily: "inherit", flexShrink: 0, minWidth: 72, minHeight: 34,
      WebkitTapHighlightColor: "transparent",
    }}>
      {copied === label ? "✓ Done" : "Copy"}
    </button>
  );

  const Field = ({ icon, label, value, fieldKey, height }) => (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, color: "#e2c97e", textTransform: "uppercase" }}>
          {icon} {label}
        </span>
        <CopyBtn text={value} label={fieldKey} />
      </div>
      <div style={{
        background: "#070f1e", border: "1px solid #1e293b", borderRadius: 8,
        padding: "10px 12px", fontSize: 13, color: value ? "#cbd5e1" : "#334155",
        lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word",
        maxHeight: height || 110, overflowY: "auto",
      }}>
        {value || "—"}
      </div>
    </div>
  );

  const v = activeTab !== null ? videos[activeTab] : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#020817", fontFamily: "sans-serif",
      padding: "20px 14px 60px", maxWidth: 680, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#e2c97e", fontWeight: 700, marginBottom: 6 }}>
          PRADEEP GOSWAMI WRITES
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.2 }}>
          YouTube Shorts<br />
          <span style={{ color: "#e2c97e" }}>Hindi AI Bot 🇮🇳</span>
        </h1>
        <div style={{ display: "inline-block", background: "#14532d", color: "#86efac", borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700 }}>
          ✅ FREE — Gemini Powered
        </div>
      </div>

      {/* API Key reset */}
      <div style={{ textAlign: "right", marginBottom: 10 }}>
        <button onClick={() => { localStorage.removeItem("gemini_key"); setApiKey(""); }} style={{
          background: "none", border: "none", color: "#334155", fontSize: 11, cursor: "pointer",
        }}>🔑 API Key change karo</button>
      </div>

      {/* Custom Topic */}
      <input type="text" placeholder="Apna topic likhein Video 1 ke liye (optional)..."
        value={customTopic} onChange={(e) => setCustomTopic(e.target.value)}
        style={{
          width: "100%", background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 13,
          outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 12,
        }}
      />

      {/* Generate Button */}
      <button onClick={generateVideos} disabled={loading} style={{
        width: "100%", padding: "14px",
        background: loading ? "#1e293b" : "linear-gradient(135deg, #e2c97e, #c9a84c)",
        color: loading ? "#475569" : "#020817",
        border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800,
        cursor: loading ? "not-allowed" : "pointer", marginBottom: 20, fontFamily: "inherit",
      }}>
        {loading ? (loadingIndex >= 0 ? `⏳ Short ${loadingIndex + 1}/3 ban raha hai...` : "⏳ Please wait...") : "⚡ Aaj ke 3 Hindi Shorts Generate Karo"}
      </button>

      {/* Progress */}
      {loading && (
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              flex: 1, height: 4, borderRadius: 4,
              background: i < loadingIndex ? "#e2c97e" : i === loadingIndex ? "#e2c97e88" : "#1e293b",
              transition: "all 0.5s",
            }} />
          ))}
        </div>
      )}

      {/* Tabs */}
      {videos.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {videos.map((_, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                flex: 1, padding: "10px 6px",
                background: activeTab === i ? "#e2c97e" : "#0f172a",
                color: activeTab === i ? "#020817" : errors[i] ? "#ef4444" : "#64748b",
                border: `1px solid ${activeTab === i ? "#e2c97e" : errors[i] ? "#ef444455" : "#1e293b"}`,
                borderRadius: 10, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>
                {errors[i] ? "⚠️" : "📹"} Short {i + 1}
              </button>
            ))}
          </div>

          {v && (
            <div style={{ background: "#0c1628", border: "1px solid #1e293b", borderRadius: 16, padding: 18 }}>
              {v._error ? (
                <div style={{ textAlign: "center", padding: 24 }}>
                  <div style={{ fontSize: 28, marginBottom: 10 }}>⚠️</div>
                  <p style={{ color: "#ef4444", fontSize: 13, marginBottom: 16 }}>{v._error}</p>
                  <button onClick={() => regenSingle(activeTab)} style={{
                    background: "#e2c97e", color: "#020817", border: "none",
                    borderRadius: 8, padding: "10px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                  }}>🔄 Dobara Try Karo</button>
                </div>
              ) : v._loading ? (
                <div style={{ textAlign: "center", padding: 40 }}>
                  <div style={{ fontSize: 28 }}>⏳</div>
                  <p style={{ color: "#64748b", fontSize: 13, marginTop: 10 }}>Generate ho raha hai...</p>
                </div>
              ) : (
                <>
                  <div style={{
                    background: "#1e293b", borderRadius: 8, padding: "7px 12px",
                    fontSize: 12, color: "#e2c97e", fontWeight: 700, marginBottom: 18,
                    display: "inline-block", maxWidth: "100%", wordBreak: "break-word",
                  }}>🎯 {v.topic}</div>

                  <Field icon="🎙️" label="Script (Hindi)" value={v.script} fieldKey={`sc-${activeTab}`} height={180} />
                  <Field icon="🎨" label="Animated Video Prompt (Kling/Runway)" value={v.video_prompt} fieldKey={`vp-${activeTab}`} height={160} />
                  <Field icon="🔊" label="Audio Prompt — ElevenLabs (Hindi)" value={v.audio_prompt} fieldKey={`ap-${activeTab}`} height={110} />
                  <Field icon="📌" label="Title (Hinglish/Hindi)" value={v.title} fieldKey={`ti-${activeTab}`} />
                  <Field icon="📝" label="Description — Indian SEO" value={v.description} fieldKey={`de-${activeTab}`} height={160} />
                  <Field icon="#️⃣" label="Hashtags" value={v.hashtags} fieldKey={`ht-${activeTab}`} />
                  <Field icon="🏷️" label="Tags (Indian SEO)" value={v.tags} fieldKey={`tg-${activeTab}`} />

                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button onClick={() => {
                      const all = `TOPIC: ${v.topic}\n\nSCRIPT:\n${v.script}\n\nVIDEO PROMPT:\n${v.video_prompt}\n\nAUDIO PROMPT:\n${v.audio_prompt}\n\nTITLE:\n${v.title}\n\nDESCRIPTION:\n${v.description}\n\nHASHTAGS:\n${v.hashtags}\n\nTAGS:\n${v.tags}`;
                      copyField(all, `all-${activeTab}`);
                    }} style={{
                      flex: 2, padding: "13px", background: "#1e293b", color: "#e2c97e",
                      border: "1px solid #334155", borderRadius: 10, fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit", WebkitTapHighlightColor: "transparent",
                    }}>
                      {copied === `all-${activeTab}` ? "✓ Sab Copy Ho Gaya!" : "📋 Sab Ek Saath Copy Karo"}
                    </button>
                    <button onClick={() => regenSingle(activeTab)} style={{
                      flex: 1, padding: "13px", background: "#070f1e", color: "#64748b",
                      border: "1px solid #1e293b", borderRadius: 10, fontSize: 13,
                      fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
                    }}>🔄 Dobara</button>
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
          <div style={{ fontSize: 10, fontWeight: 700, color: "#e2c97e", letterSpacing: 1, marginBottom: 10 }}>📋 DAILY WORKFLOW</div>
          {[
            "1️⃣ Script copy → ElevenLabs → Hindi voice generate karo",
            "2️⃣ Video Prompt → Kling AI ya Runway → animated video banao",
            "3️⃣ CapCut mein dono merge karo → captions add karo",
            "4️⃣ Title + Description + Hashtags paste karo",
            "5️⃣ YouTube par schedule karo",
          ].map((s, i) => <div key={i} style={{ fontSize: 12, color: "#475569", marginBottom: 5 }}>{s}</div>)}
        </div>
      )}
    </div>
  );
}
