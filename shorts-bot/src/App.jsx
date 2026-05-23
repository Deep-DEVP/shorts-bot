import { useState, useEffect } from "react";

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

function pickRandom(arr, n) {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── API Key Screen ────────────────────────────────────────────────────────────
function ApiKeyScreen({ onSave }) {
  const [key, setKey] = useState("");
  const [err, setErr] = useState("");

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed.startsWith("sk-ant-")) {
      setErr("Key galat lagti hai. Anthropic key 'sk-ant-' se shuru hoti hai.");
      return;
    }
    localStorage.setItem("anthropic_key", trimmed);
    onSave(trimmed);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#020817", display: "flex",
      flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ maxWidth: 420, width: "100%" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🤖</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 22, fontWeight: 800, marginBottom: 8 }}>
            Pradeep Shorts Bot
          </h1>
          <p style={{ color: "#475569", fontSize: 13, lineHeight: 1.6 }}>
            Apni Anthropic API key daalo.<br />
            Ek baar daalo — hamesha ke liye save ho jaayegi.
          </p>
        </div>

        {/* Step guide */}
        <div style={{
          background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: 12, padding: 16, marginBottom: 20,
        }}>
          <div style={{ fontSize: 11, color: "#e2c97e", fontWeight: 700, letterSpacing: 1, marginBottom: 10 }}>
            🔑 API KEY KAHAN SE MILEGI?
          </div>
          {[
            "1. console.anthropic.com par jao",
            "2. Sign up karo (free hai)",
            "3. 'API Keys' section mein jao",
            "4. 'Create Key' dabao",
            "5. Key copy karo aur yahan paste karo",
          ].map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: "#64748b", marginBottom: 5 }}>{s}</div>
          ))}
          <div style={{
            marginTop: 10, padding: "8px 10px",
            background: "#1e293b", borderRadius: 8,
            fontSize: 11, color: "#94a3b8",
          }}>
            💡 Free tier mein $5 credit milta hai — bahut saare videos ban sakte hain
          </div>
        </div>

        <input
          type="password"
          placeholder="sk-ant-api03-..."
          value={key}
          onChange={(e) => { setKey(e.target.value); setErr(""); }}
          style={{
            width: "100%", background: "#0f172a", border: `1px solid ${err ? "#ef4444" : "#1e293b"}`,
            borderRadius: 10, padding: "13px 14px", color: "#f1f5f9", fontSize: 14,
            outline: "none", fontFamily: "monospace", marginBottom: 8,
          }}
        />
        {err && <p style={{ color: "#ef4444", fontSize: 12, marginBottom: 8 }}>{err}</p>}

        <button
          onClick={handleSave}
          style={{
            width: "100%", padding: "14px",
            background: "linear-gradient(135deg, #e2c97e, #c9a84c)",
            color: "#020817", border: "none", borderRadius: 12,
            fontSize: 15, fontWeight: 800, cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Save Karo & Shuru Karo ⚡
        </button>

        <p style={{ textAlign: "center", fontSize: 11, color: "#334155", marginTop: 12 }}>
          🔒 Key sirf tumhare browser mein save hoti hai. Kisi ko nahi jaati.
        </p>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [apiKey, setApiKey] = useState(() => localStorage.getItem("anthropic_key") || "");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [activeTab, setActiveTab] = useState(null);
  const [copied, setCopied] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [errors, setErrors] = useState({});

  if (!apiKey) return <ApiKeyScreen onSave={setApiKey} />;

  const callAPI = async (topic, retries = 2) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
            "anthropic-dangerous-direct-browser-access": "true",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{
              role: "user",
              content: `You are a YouTube Shorts content creator for "Pradeep Goswami Writes" — a Hindi channel about deep psychology, human emotions, love, heartbreak, loneliness, real-life feelings, attachment, and the hidden psychology of people and relationships. Indian audience, 18-35 age group.

Topic: "${topic}"

Return ONLY a raw valid JSON object. No markdown, no backticks, no explanation. Just the JSON.

{
  "topic": "topic in Hindi/Hinglish",
  "script": "20-30 second spoken script in HINDI (Devanagari script). Emotional hook in first 3 seconds. Deep, poetic, makes people feel seen. End with a thought-provoking line.",
  "video_prompt": "Animated cartoon style video prompt for Kling AI or Runway Gen-3. Style: 2D anime or soft 3D cartoon, warm Indian art style. Show a cartoon character (boy or girl, Indian look) expressing the emotion of this topic. Describe: exact character pose and facial expression, background scene (bedroom at night, rainy window, rooftop, metro station, park bench, college corridor), color palette, animation style (slow zoom, pan, floating thoughts, tears, phone light glow). Make it like a 20-second emotional animated short film. NO real footage. Full cartoon animated style only.",
  "audio_prompt": "ElevenLabs ke liye Hindi mein voice direction likho. Batao: awaaz kaisi ho (dheemi, gehri, dard bhari, sochne wali), speed kya ho (bahut dheere, medium), emotion kya feel karna chahiye sunne wale ko, kahan ruko (pause), kaise shuru karo aur kaise khatam karo. Ek shayar ya storyteller ki tarah describe karo.",
  "title": "YouTube Shorts title in Hinglish or Hindi. Emotional hook. Max 60 characters. Indian trending style like '99% log yeh nahi jaante' or 'Yeh sunke dil bhar aayega'",
  "description": "SEO YouTube description 150-200 words. Hindi and English mix. Indian audience keywords: psychology Hindi, emotional video, love psychology, deep thinking, hindi motivation, rishte ki psychology, dil ki baat, broken heart hindi, attachment theory hindi, hindi shorts psychology. Natural keyword placement. End with channel CTA.",
  "hashtags": "#psychologyinhindi #deepthinking #hindimotivation #emotionalvideo #lovepsychology #rishte #dardebayan #hindishorts #mentalhealth #reallifestories #brokenheart #attachmenttheory #selfawareness #innerpeace #pradeepgoswamiwr #hindipsychology #shortsviral #youtubeshorts #indianyoutuber #feelingsinhindi",
  "tags": "psychology hindi, emotional video hindi, love psychology hindi, deep thinking hindi, hindi motivation, rishte ki psychology, dil ki baat, broken heart hindi, attachment theory, hindi shorts, mental health hindi, self awareness hindi, overthinking hindi, loneliness hindi, indian psychology, feelings hindi, short video psychology, viral shorts india, hindi deep thoughts, real life psychology"
}`,
            }],
          }),
        });

        if (!response.ok) {
          const errData = await response.json();
          if (response.status === 401) {
            localStorage.removeItem("anthropic_key");
            setApiKey("");
            throw new Error("API key galat hai. Dobara daalo.");
          }
          throw new Error(errData?.error?.message || `Error ${response.status}`);
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
      if (i < 2) await sleep(600);
    }
    setVideos(results);
    setActiveTab(0);
    setLoadingIndex(-1);
    setLoading(false);
  };

  const regenSingle = async (index) => {
    const topic = customTopic.trim() && index === 0 ? customTopic : pickRandom(NICHE_TOPICS, 3)[index];
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
      el.value = text;
      el.setAttribute("readonly", "");
      el.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
      document.body.appendChild(el);
      el.focus(); el.select(); el.setSelectionRange(0, 99999);
      document.execCommand("copy");
      document.body.removeChild(el);
      return Promise.resolve();
    };
    doCopy()
      .then(() => { setCopied(key); setTimeout(() => setCopied(""), 2500); })
      .catch(() => alert("Copy failed. Text:\n\n" + text.slice(0, 400)));
  };

  const CopyBtn = ({ text, label }) => (
    <button
      onClick={(e) => { e.stopPropagation(); copyField(text, label); }}
      style={{
        background: copied === label ? "#22c55e" : "#1e293b",
        color: copied === label ? "#fff" : "#94a3b8",
        border: `1px solid ${copied === label ? "#22c55e" : "#334155"}`,
        borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit", flexShrink: 0,
        minWidth: 72, minHeight: 34, WebkitTapHighlightColor: "transparent",
      }}
    >
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
        padding: "10px 12px", fontSize: 13,
        color: value ? "#cbd5e1" : "#334155",
        lineHeight: 1.75, whiteSpace: "pre-wrap", wordBreak: "break-word",
        maxHeight: height || 110, overflowY: "auto",
        fontFamily: label.includes("Script") ? "'Noto Sans Devanagari', 'DM Sans', sans-serif" : "'DM Sans', sans-serif",
      }}>
        {value || "—"}
      </div>
    </div>
  );

  const v = activeTab !== null ? videos[activeTab] : null;

  return (
    <div style={{
      minHeight: "100vh", background: "#020817",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      padding: "20px 14px 60px", maxWidth: 680, margin: "0 auto",
    }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: "#e2c97e", fontWeight: 700, marginBottom: 6 }}>
          PRADEEP GOSWAMI WRITES
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "#f1f5f9", margin: "0 0 6px", lineHeight: 1.2 }}>
          YouTube Shorts<br />
          <span style={{ color: "#e2c97e" }}>Hindi AI Bot 🇮🇳</span>
        </h1>
        <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
          Hindi Script • Animated Prompts • Indian SEO
        </p>
      </div>

      {/* API Key reset */}
      <div style={{ textAlign: "right", marginBottom: 12 }}>
        <button
          onClick={() => { localStorage.removeItem("anthropic_key"); setApiKey(""); }}
          style={{
            background: "none", border: "none", color: "#334155",
            fontSize: 11, cursor: "pointer", fontFamily: "inherit",
          }}
        >
          🔑 API Key change karo
        </button>
      </div>

      {/* Custom Topic */}
      <input
        type="text"
        placeholder="Apna topic likhein Video 1 ke liye (optional)..."
        value={customTopic}
        onChange={(e) => setCustomTopic(e.target.value)}
        style={{
          width: "100%", background: "#0f172a", border: "1px solid #1e293b",
          borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontSize: 13,
          outline: "none", boxSizing: "border-box", fontFamily: "inherit", marginBottom: 12,
        }}
      />

      {/* Generate Button */}
      <button
        onClick={generateVideos}
        disabled={loading}
        style={{
          width: "100%", padding: "14px",
          background: loading ? "#1e293b" : "linear-gradient(135deg, #e2c97e, #c9a84c)",
          color: loading ? "#475569" : "#020817",
          border: "none", borderRadius: 12, fontSize: 15, fontWeight: 800,
          cursor: loading ? "not-allowed" : "pointer", marginBottom: 20,
          fontFamily: "inherit", transition: "all 0.2s",
        }}
      >
        {loading
          ? loadingIndex >= 0 ? `⏳ Short ${loadingIndex + 1}/3 ban raha hai...` : "⏳ Please wait..."
          : "⚡ Aaj ke 3 Hindi Shorts Generate Karo"}
      </button>

      {/* Progress bar */}
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

      {/* Video Tabs */}
      {videos.length > 0 && (
        <>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {videos.map((vid, i) => (
              <button key={i} onClick={() => setActiveTab(i)} style={{
                flex: 1, padding: "10px 6px",
                background: activeTab === i ? "#e2c97e" : "#0f172a",
                color: activeTab === i ? "#020817" : errors[i] ? "#ef4444" : "#64748b",
                border: `1px solid ${activeTab === i ? "#e2c97e" : errors[i] ? "#ef444455" : "#1e293b"}`,
                borderRadius: 10, fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
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
                    borderRadius: 8, padding: "10px 20px", fontSize: 13,
                    fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
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
                    <button
                      onClick={() => {
                        const all = `TOPIC: ${v.topic}\n\nSCRIPT:\n${v.script}\n\nVIDEO PROMPT:\n${v.video_prompt}\n\nAUDIO PROMPT (ElevenLabs):\n${v.audio_prompt}\n\nTITLE:\n${v.title}\n\nDESCRIPTION:\n${v.description}\n\nHASHTAGS:\n${v.hashtags}\n\nTAGS:\n${v.tags}`;
                        copyField(all, `all-${activeTab}`);
                      }}
                      style={{
                        flex: 2, padding: "13px", background: "#1e293b",
                        color: "#e2c97e", border: "1px solid #334155",
                        borderRadius: 10, fontSize: 13, fontWeight: 700,
                        cursor: "pointer", fontFamily: "inherit",
                        WebkitTapHighlightColor: "transparent",
                      }}
                    >
                      {copied === `all-${activeTab}` ? "✓ Sab Copy Ho Gaya!" : "📋 Sab Ek Saath Copy Karo"}
                    </button>
                    <button onClick={() => regenSingle(activeTab)} style={{
                      flex: 1, padding: "13px", background: "#070f1e",
                      color: "#64748b", border: "1px solid #1e293b",
                      borderRadius: 10, fontSize: 13, fontWeight: 700,
                      cursor: "pointer", fontFamily: "inherit",
                    }}>🔄 Dobara</button>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Workflow guide */}
      {videos.length > 0 && !loading && (
        <div style={{ marginTop: 24, background: "#0f172a", border: "1px solid #1e293b", borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#e2c97e", letterSpacing: 1, marginBottom: 10 }}>
            📋 DAILY WORKFLOW
          </div>
          {[
            "1️⃣ Script copy → ElevenLabs → Hindi voice generate karo",
            "2️⃣ Video Prompt → Kling AI ya Runway → animated video banao",
            "3️⃣ CapCut mein dono merge karo → captions add karo",
            "4️⃣ Title + Description + Hashtags paste karo",
            "5️⃣ YouTube par schedule karo",
          ].map((s, i) => (
            <div key={i} style={{ fontSize: 12, color: "#475569", marginBottom: 5 }}>{s}</div>
          ))}
        </div>
      )}
    </div>
  );
}
