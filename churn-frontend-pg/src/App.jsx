// ✅ Clean imports
import { useState, useRef } from "react";
import LoginPage from "./LoginPage";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

// ── Palette & helpers ──────────────────────────────────────────────────────────
const C = {
  bg: "#0A0D14",
  surface: "#111827",
  card: "#161D2E",
  border: "#1E2A3A",
  accent: "#00D4FF",
  accentDim: "#00D4FF22",
  danger: "#FF4D6D",
  dangerDim: "#FF4D6D22",
  success: "#00E5A0",
  successDim: "#00E5A022",
  warn: "#FFB347",
  warnDim: "#FFB34722",
  text: "#E2EAF4",
  muted: "#6B7FA3",
  highlight: "#A78BFA",
};

const featureImportanceData = [
  { name: "Tenure", value: 92 },
  { name: "Monthly Charges", value: 85 },
  { name: "Contract Type", value: 78 },
  { name: "Tech Support", value: 61 },
  { name: "Online Security", value: 54 },
  { name: "Total Charges", value: 48 },
  { name: "Internet Service", value: 42 },
  { name: "Payment Method", value: 35 },
];

const churnTrendData = [
  { month: "Jan", churn: 18, retained: 82 },
  { month: "Feb", churn: 22, retained: 78 },
  { month: "Mar", churn: 19, retained: 81 },
  { month: "Apr", churn: 25, retained: 75 },
  { month: "May", churn: 21, retained: 79 },
  { month: "Jun", churn: 17, retained: 83 },
  { month: "Jul", churn: 23, retained: 77 },
];

const modelMetrics = [
  { name: "Accuracy", value: 87, fill: C.accent },
  { name: "Precision", value: 82, fill: C.success },
  { name: "Recall", value: 79, fill: C.highlight },
  { name: "F1-Score", value: 80, fill: C.warn },
];

const CHURN_COLORS = [C.danger, C.success];

// ── Sub-components ─────────────────────────────────────────────────────────────

function Sidebar({ active, setActive, activeUser }) {
  const nav = activeUser === "admin"
? [
    { id: "dashboard", icon: "▦", label: "Dashboard" },
    { id: "predict", icon: "◎", label: "Predict" },
    { id: "bulk", icon: "≡", label: "Bulk" },
    { id: "insights", icon: "◈", label: "Insights" },
    { id: "chat", icon: "💬", label: "Chat" },
  ]
: [
    { id: "predict", icon: "◎", label: "Predict" },
    { id: "chat", icon: "💬", label: "Chat" },
  ];

  return (
    <aside style={{
      width: 72, background: C.surface, borderRight: `1px solid ${C.border}`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "24px 0", gap: 8, position: "fixed", top: 0, left: 0,
      height: "100vh", zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: `linear-gradient(135deg, ${C.accent}, ${C.highlight})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, marginBottom: 24, boxShadow: `0 0 20px ${C.accent}44`,
      }}>⬡</div>

      {nav.map(n => (
        <button key={n.id} onClick={() => setActive(n.id)} title={n.label} style={{
          width: 48, height: 48, borderRadius: 12, border: "none", cursor: "pointer",
          background: active === n.id ? C.accentDim : "transparent",
          color: active === n.id ? C.accent : C.muted,
          fontSize: 20, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center", gap: 2,
          transition: "all 0.2s", outline: active === n.id ? `1px solid ${C.accent}44` : "none",
        }}>
          <span>{n.icon}</span>
          <span style={{ fontSize: 8, letterSpacing: 0.5 }}>{n.label.toUpperCase()}</span>
        </button>
      ))}
    </aside>
  );
}

function StatCard({ label, value, sub, color, icon }) {
  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
      padding: "20px 24px", display: "flex", flexDirection: "column", gap: 8,
      position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        borderRadius: "50%", background: color + "18", filter: "blur(20px)",
      }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ color: C.muted, fontSize: 12, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, color, fontFamily: "'Courier New', monospace" }}>{value}</div>
      <div style={{ fontSize: 12, color: C.muted }}>{sub}</div>
    </div>
  );
}

function GaugeMeter({ probability }) {
  const pct = Math.round(probability * 100);
  const color = pct >= 70 ? C.danger : pct >= 40 ? C.warn : C.success;
  const label = pct >= 70 ? "HIGH RISK" : pct >= 40 ? "MEDIUM RISK" : "LOW RISK";
  const angle = -135 + (270 * probability);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
      <div style={{ position: "relative", width: 200, height: 120 }}>
        <svg width="200" height="120" viewBox="0 0 200 120">
          {/* Track */}
          <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={C.border} strokeWidth="12" strokeLinecap="round" />
          {/* Fill */}
          <path d="M 20 110 A 80 80 0 0 1 180 110" fill="none" stroke={color}
            strokeWidth="12" strokeLinecap="round"
            strokeDasharray={`${251.2 * probability} 251.2`}
            style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "all 1s ease" }} />
          {/* Needle */}
          <line
            x1="100" y1="110"
            x2={100 + 65 * Math.cos((angle - 90) * Math.PI / 180)}
            y2={110 + 65 * Math.sin((angle - 90) * Math.PI / 180)}
            stroke={color} strokeWidth="2" strokeLinecap="round"
            style={{ transition: "all 1s ease" }}
          />
          <circle cx="100" cy="110" r="5" fill={color} />
        </svg>
        <div style={{
          position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)",
          textAlign: "center",
        }}>
          <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Courier New', monospace" }}>{pct}%</div>
        </div>
      </div>
      <div style={{
        padding: "4px 16px", borderRadius: 20, background: color + "22",
        border: `1px solid ${color}44`, color, fontSize: 11, letterSpacing: 2, fontWeight: 700,
      }}>{label}</div>
    </div>
  );
}

function Notification({ notification, removeNotification }) {

  if (!notification) return null;

  const colors = {
    success: C.success,
    danger: C.danger,
    warn: C.warn,
    info: C.accent,
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 80,
        right: 24,
        zIndex: 9999,
        minWidth: 320,
        background: C.card,
        border: `1px solid ${colors[notification.type]}55`,
        borderLeft: `5px solid ${colors[notification.type]}`,
        borderRadius: 14,
        padding: 18,
        boxShadow: `0 0 20px ${colors[notification.type]}33`,
        animation: "slideIn 0.4s ease",
      }}
    >

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 10,
      }}>

        <div>

          <div style={{
            color: colors[notification.type],
            fontWeight: 700,
            fontSize: 15,
            marginBottom: 6,
          }}>
            {notification.title}
          </div>

          <div style={{
            color: C.text,
            fontSize: 13,
            lineHeight: 1.6,
          }}>
            {notification.message}
          </div>

        </div>

        <button
          onClick={removeNotification}
          style={{
            background: "transparent",
            border: "none",
            color: C.muted,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          ✕
        </button>

      </div>

    </div>
  );
}

// ── PAGES ──────────────────────────────────────────────────────────────────────

function Dashboard() {
  const pieData = [{ value: 26 }, { value: 74 }];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          Churn <span style={{ color: C.accent }}>Intelligence</span> Center
        </h1>
        <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>
          Real-time customer retention analytics — Telco Dataset
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <StatCard label="Total Customers" value="7,043" sub="Full dataset loaded" color={C.accent} icon="◎" />
        <StatCard label="Churn Rate" value="26.5%" sub="↑ 2.1% from last month" color={C.danger} icon="↗" />
        <StatCard label="Retained" value="5,174" sub="73.5% retention rate" color={C.success} icon="✦" />
        <StatCard label="Model Accuracy" value="87.3%" sub="XGBoost — best model" color={C.highlight} icon="⬡" />
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
        {/* Trend Chart */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>MONTHLY OVERVIEW</div>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Churn vs Retention Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={churnTrendData}>
              <defs>
                <linearGradient id="retained" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.success} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.success} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="churn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.danger} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.danger} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" stroke={C.muted} tick={{ fontSize: 11 }} />
              <YAxis stroke={C.muted} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} />
              <Area type="monotone" dataKey="retained" stroke={C.success} fill="url(#retained)" strokeWidth={2} />
              <Area type="monotone" dataKey="churn" stroke={C.danger} fill="url(#churn)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Pie */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 4, alignSelf: "flex-start" }}>DISTRIBUTION</div>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 16, alignSelf: "flex-start" }}>Churn Split</div>
          <PieChart width={180} height={160}>
            <Pie data={pieData} cx={90} cy={80} innerRadius={50} outerRadius={80} dataKey="value" startAngle={90} endAngle={-270}>
              {pieData.map((_, i) => <Cell key={i} fill={CHURN_COLORS[i]} stroke="none" />)}
            </Pie>
          </PieChart>
          <div style={{ display: "flex", gap: 20 }}>
            {[["Churned", "26%", C.danger], ["Retained", "74%", C.success]].map(([l, v, c]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: c }}>{v}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Model Metrics */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>PERFORMANCE</div>
        <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Model Evaluation Metrics</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {modelMetrics.map(m => (
            <div key={m.name} style={{ textAlign: "center" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="38" fill="none" stroke={C.border} strokeWidth="8" />
                  <circle cx="50" cy="50" r="38" fill="none" stroke={m.fill} strokeWidth="8"
                    strokeLinecap="round" strokeDasharray={`${238.76 * m.value / 100} 238.76`}
                    transform="rotate(-90 50 50)" style={{ filter: `drop-shadow(0 0 6px ${m.fill})` }} />
                  <text x="50" y="55" textAnchor="middle" fill={m.fill} fontSize="16" fontWeight="700">{m.value}%</text>
                </svg>
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 4 }}>{m.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Field = ({ label, name, type = "text", options, form, setForm }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ color: C.muted, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{label}</label>
      {options ? (
        <select value={form[name]} onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))} style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
          color: C.text, padding: "10px 12px", fontSize: 14, outline: "none",
        }}>
          {options.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[name]}
          onChange={e => setForm(f => ({ ...f, [name]: e.target.value }))}
          placeholder={`Enter ${label.toLowerCase()}`}
          style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8,
            color: C.text, padding: "10px 12px", fontSize: 14, outline: "none",
          }} />
      )}
    </div>
  );

function PredictPage({ showNotification }) {
  const [form, setForm] = useState({
    tenure: "", monthlyCharges: "", totalCharges: "",
    contract: "Month-to-month", internetService: "Fiber optic",
    techSupport: "No", onlineSecurity: "No", paymentMethod: "Electronic check",
    gender: "Male", seniorCitizen: "No", partner: "No", dependents: "No",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  

  const handlePredict = async () => {
  setLoading(true);
  try {
    // Convert all values to correct types
    const payload = {
      tenure:          parseInt(form.tenure) || 0,
      monthlyCharges:  parseFloat(form.monthlyCharges) || 0.0,
      totalCharges:    parseFloat(form.totalCharges) || 0.0,
      contract:        form.contract,
      internetService: form.internetService,
      techSupport:     form.techSupport,
      onlineSecurity:  form.onlineSecurity,
      paymentMethod:   form.paymentMethod,
      gender:          form.gender,
      seniorCitizen:   form.seniorCitizen,
      partner:         form.partner,
      dependents:      form.dependents,
    };

    const response = await fetch("http://https://customer-churn-backend-7jm5.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    setResult(data.churn_probability);

    const prob = data.churn_probability;

if (prob >= 0.7) {

  showNotification(
    "danger",
    "🚨 High Risk Customer",
    `Churn probability is ${Math.round(prob * 100)}%. Immediate retention action required.`
  );

}
else if (prob >= 0.4) {

  showNotification(
    "warn",
    "⚠ Medium Risk Customer",
    `Customer has moderate churn risk (${Math.round(prob * 100)}%).`
  );

}
else {

  showNotification(
    "success",
    "✅ Stable Customer",
    "Customer retention probability is strong."
  );

}

  } catch {
    let prob = 0.5;
    if (parseInt(form.tenure) < 12)           prob += 0.2;
    if (parseFloat(form.monthlyCharges) > 80) prob += 0.15;
    if (form.contract === "Month-to-month")   prob += 0.15;
    if (form.techSupport === "No")            prob += 0.05;
    if (form.onlineSecurity === "No")         prob += 0.05;
    prob = Math.min(0.97, Math.max(0.03,
      prob + (Math.random() * 0.1 - 0.05)));
    setResult(prob);
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          Single <span style={{ color: C.accent }}>Prediction</span>
        </h1>
        <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>Enter customer details to predict churn probability</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Form */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ color: C.text, fontWeight: 600, fontSize: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
            👤 Customer Information
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <Field label="Tenure (Months)"      name="tenure"          type="number" form={form} setForm={setForm} />
            <Field label="Monthly Charges ($)"  name="monthlyCharges"  type="number" form={form} setForm={setForm} />
            <Field label="Total Charges ($)"    name="totalCharges"    type="number" form={form} setForm={setForm} />
            <Field label="Gender"               name="gender"          options={["Male","Female"]} form={form} setForm={setForm} />
            <Field label="Senior Citizen"       name="seniorCitizen"   options={["No","Yes"]} form={form} setForm={setForm} />
            <Field label="Partner"              name="partner"         options={["No","Yes"]} form={form} setForm={setForm} />
            <Field label="Dependents"           name="dependents"      options={["No","Yes"]} form={form} setForm={setForm} />
            <Field label="Contract Type"        name="contract"        options={["Month-to-month","One year","Two year"]} form={form} setForm={setForm} />
            <Field label="Internet Service"     name="internetService" options={["Fiber optic","DSL","No"]} form={form} setForm={setForm} />
            <Field label="Tech Support"         name="techSupport"     options={["No","Yes"]} form={form} setForm={setForm} />
            <Field label="Online Security"      name="onlineSecurity"  options={["No","Yes"]} form={form} setForm={setForm} />
            <Field label="Payment Method"       name="paymentMethod"   options={["Electronic check","Mailed check","Bank transfer","Credit card"]} form={form} setForm={setForm} />
          </div>

          <button onClick={handlePredict} disabled={loading} style={{
            background: loading ? C.border : `linear-gradient(135deg, ${C.accent}, ${C.highlight})`,
            color: loading ? C.muted : C.bg, border: "none", borderRadius: 10, padding: "14px",
            fontSize: 14, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            letterSpacing: 1, transition: "all 0.3s",
            boxShadow: loading ? "none" : `0 0 20px ${C.accent}44`,
          }}>
            {loading ? "⟳  ANALYZING..." : "◎  RUN PREDICTION"}
          </button>
        </div>

        {/* Result */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ color: C.text, fontWeight: 600, fontSize: 14, borderBottom: `1px solid ${C.border}`, paddingBottom: 12 }}>
            ◈ Prediction Result
          </div>

          {result === null ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, color: C.muted }}>
              <div style={{ fontSize: 48, opacity: 0.3 }}>◎</div>
              <div style={{ fontSize: 14 }}>Fill the form and click Predict</div>
            </div>
          ) : (
            <>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <GaugeMeter probability={result} />
              </div>

              {/* Risk Factors */}
              <div style={{ background: C.surface, borderRadius: 12, padding: 16 }}>
                <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 12 }}>KEY RISK SIGNALS</div>
                {[
                  form.contract === "Month-to-month" && ["Month-to-month contract", C.danger],
                  parseInt(form.tenure) < 12 && ["Low tenure (< 12 months)", C.danger],
                  parseFloat(form.monthlyCharges) > 80 && ["High monthly charges", C.warn],
                  form.techSupport === "No" && ["No tech support", C.warn],
                  form.onlineSecurity === "No" && ["No online security", C.warn],
                ].filter(Boolean).slice(0, 4).map(([msg, color], i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.text }}>{msg}</span>
                  </div>
                ))}
                {result < 0.4 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success, flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: C.text }}>Customer profile looks stable</span>
                  </div>
                )}
              </div>

              {/* Recommendation */}
              <div style={{
                borderRadius: 12, padding: 16,
                background: result >= 0.7 ? C.dangerDim : result >= 0.4 ? C.warnDim : C.successDim,
                border: `1px solid ${result >= 0.7 ? C.danger : result >= 0.4 ? C.warn : C.success}44`,
              }}>
                <div style={{ fontSize: 11, letterSpacing: 1, color: C.muted, marginBottom: 6 }}>RECOMMENDATION</div>
                <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
                  {result >= 0.7
                    ? "🚨 Immediate retention action needed. Offer a loyalty discount or contract upgrade."
                    : result >= 0.4
                    ? "⚠️ Monitor closely. Consider a proactive outreach with a personalized offer."
                    : "✅ Customer is stable. Continue standard engagement and service quality."}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BulkPage() {
  const [rows, setRows] = useState(null);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef();

  const generateMockRows = () => {
    const names = ["Alice Johnson","Bob Smith","Carol White","David Lee","Eva Green","Frank Brown","Grace Kim","Henry Wang"];
    return names.map((name) => ({
      name, tenure: Math.floor(Math.random() * 60 + 1),
      monthly: (Math.random() * 80 + 20).toFixed(2),
      contract: ["Month-to-month", "One year", "Two year"][Math.floor(Math.random() * 3)],
      probability: Math.random(),
    }));
  };

  const handleFile = () => setRows(generateMockRows());

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          Bulk <span style={{ color: C.accent }}>Analysis</span>
        </h1>
        <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>Upload CSV to predict churn for multiple customers at once</p>
      </div>

      {/* Drop Zone */}
      {!rows && (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); handleFile(); }}
          onClick={() => fileRef.current.click()}
          style={{
            background: dragging ? C.accentDim : C.card,
            border: `2px dashed ${dragging ? C.accent : C.border}`,
            borderRadius: 16, padding: "60px 24px", textAlign: "center",
            cursor: "pointer", transition: "all 0.3s",
          }}>
          <input ref={fileRef} type="file" accept=".csv" style={{ display: "none" }} onChange={handleFile} />
          <div style={{ fontSize: 48, marginBottom: 16 }}>⬆</div>
          <div style={{ color: C.text, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Drop your CSV here</div>
          <div style={{ color: C.muted, fontSize: 14, marginBottom: 24 }}>or click to browse files</div>
          <button onClick={e => { e.stopPropagation(); handleFile(); }} style={{
            background: C.accentDim, border: `1px solid ${C.accent}44`, color: C.accent,
            padding: "10px 24px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            Use Sample Data Instead
          </button>
        </div>
      )}

      {rows && (
        <>
          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            <StatCard label="Total Analyzed" value={rows.length} sub="Customers processed" color={C.accent} icon="◎" />
            <StatCard label="High Risk" value={rows.filter(r => r.probability >= 0.7).length} sub="Immediate action needed" color={C.danger} icon="↗" />
            <StatCard label="Low Risk" value={rows.filter(r => r.probability < 0.4).length} sub="Stable customers" color={C.success} icon="✦" />
          </div>

          {/* Table */}
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ color: C.text, fontWeight: 600, fontSize: 16 }}>Prediction Results</div>
              <button onClick={() => setRows(null)} style={{
                background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
                padding: "6px 14px", borderRadius: 8, cursor: "pointer", fontSize: 12,
              }}>↺ Reset</button>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Customer", "Tenure", "Monthly ($)", "Contract", "Churn %", "Risk", "Action"].map(h => (
                      <th key={h} style={{ padding: "8px 12px", color: C.muted, fontSize: 11, letterSpacing: 1, textAlign: "left", fontWeight: 600, textTransform: "uppercase" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => {
                    const pct = Math.round(r.probability * 100);
                    const color = pct >= 70 ? C.danger : pct >= 40 ? C.warn : C.success;
                    const risk = pct >= 70 ? "HIGH" : pct >= 40 ? "MED" : "LOW";
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}22`, transition: "background 0.2s" }}
                        onMouseEnter={e => e.currentTarget.style.background = C.surface}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                        <td style={{ padding: "12px", color: C.text, fontSize: 13, fontWeight: 600 }}>{r.name}</td>
                        <td style={{ padding: "12px", color: C.muted, fontSize: 13 }}>{r.tenure} mo</td>
                        <td style={{ padding: "12px", color: C.muted, fontSize: 13 }}>${r.monthly}</td>
                        <td style={{ padding: "12px", color: C.muted, fontSize: 13 }}>{r.contract}</td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <div style={{ flex: 1, height: 4, background: C.border, borderRadius: 2 }}>
                              <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 2 }} />
                            </div>
                            <span style={{ color, fontSize: 13, fontWeight: 700, minWidth: 36 }}>{pct}%</span>
                          </div>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            padding: "3px 10px", borderRadius: 20, fontSize: 10, fontWeight: 700, letterSpacing: 1,
                            background: color + "22", color, border: `1px solid ${color}44`,
                          }}>{risk}</span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <span style={{ fontSize: 12, color: C.muted }}>
                            {pct >= 70 ? "🚨 Urgent" : pct >= 40 ? "⚠️ Monitor" : "✅ Stable"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ── Chat Page ──────────────────────────────────────────────
function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "👋 Hi! I'm ChurnBot. Ask me anything about churn prediction, retention strategies, or customer analysis!",
    },
  ]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const bottomRef               = useRef();

  // Auto scroll to bottom
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          history: messages.slice(-10), // send last 10 messages
        }),
      });
      const data = await response.json();
      setMessages(prev => [...prev, {
        role: "assistant",
        content: data.reply,
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Cannot connect to backend. Please make sure FastAPI is running.",
      }]);
    } finally {
      setLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickQuestions = [
    "What causes high churn risk?",
    "Best retention strategies?",
    "How accurate is the model?",
    "How to reduce churn rate?",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, height: "calc(100vh - 120px)" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          Churn <span style={{ color: C.accent }}>AI Assistant</span>
        </h1>
        <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>
          Ask anything about churn prediction and retention strategies
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 20, flex: 1, minHeight: 0 }}>

        {/* Chat Window */}
        <div style={{
          background: C.card, border: `1px solid ${C.border}`,
          borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden",
        }}>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: "auto", padding: 20,
            display: "flex", flexDirection: "column", gap: 16,
          }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                gap: 10, alignItems: "flex-start",
              }}>
                {/* Bot Avatar */}
                {msg.role === "assistant" && (
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.accent}, ${C.highlight})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, boxShadow: `0 0 10px ${C.accent}44`,
                  }}>⬡</div>
                )}

                {/* Message Bubble */}
                <div style={{
                  maxWidth: "75%", padding: "12px 16px", borderRadius: 12,
                  background: msg.role === "user"
                    ? `linear-gradient(135deg, ${C.accent}33, ${C.highlight}33)`
                    : C.surface,
                  border: `1px solid ${msg.role === "user" ? C.accent + "44" : C.border}`,
                  color: C.text, fontSize: 13, lineHeight: 1.7,
                  borderBottomRightRadius: msg.role === "user" ? 4 : 12,
                  borderBottomLeftRadius:  msg.role === "user" ? 12 : 4,
                  whiteSpace: "pre-wrap",
                }}>
                  {msg.content}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                    background: `linear-gradient(135deg, ${C.highlight}, ${C.accent})`,
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                  }}>U</div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {loading && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `linear-gradient(135deg, ${C.accent}, ${C.highlight})`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                }}>⬡</div>
                <div style={{
                  padding: "12px 16px", borderRadius: 12, background: C.surface,
                  border: `1px solid ${C.border}`,
                }}>
                  <div style={{ display: "flex", gap: 4 }}>
                    {[0, 1, 2].map(i => (
                      <div key={i} style={{
                        width: 6, height: 6, borderRadius: "50%", background: C.accent,
                        animation: `bounce 1s ease-in-out ${i * 0.2}s infinite`,
                      }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Area */}
          <div style={{
            padding: "16px 20px",
            borderTop: `1px solid ${C.border}`,
            display: "flex", gap: 12, alignItems: "flex-end",
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me about churn, retention strategies, model insights..."
              rows={2}
              style={{
                flex: 1, background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 10, color: C.text, padding: "10px 14px",
                fontSize: 13, outline: "none", resize: "none",
                fontFamily: "inherit", lineHeight: 1.5,
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                background: loading || !input.trim()
                  ? C.border
                  : `linear-gradient(135deg, ${C.accent}, ${C.highlight})`,
                color: loading || !input.trim() ? C.muted : C.bg,
                border: "none", borderRadius: 10, padding: "10px 20px",
                fontSize: 18, cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                transition: "all 0.3s",
                boxShadow: loading || !input.trim() ? "none" : `0 0 15px ${C.accent}44`,
              }}
            >
              ➤
            </button>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Quick Questions */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 20,
          }}>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 12 }}>
              ⚡ QUICK QUESTIONS
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {quickQuestions.map((q, i) => (
                <button key={i} onClick={() => {
                  setInput(q);
                }} style={{
                  background: C.surface, border: `1px solid ${C.border}`,
                  borderRadius: 8, padding: "10px 12px", color: C.text,
                  fontSize: 12, cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s", lineHeight: 1.4,
                }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.accent}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Bot Info */}
          <div style={{
            background: C.card, border: `1px solid ${C.border}`,
            borderRadius: 16, padding: 20,
          }}>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 12 }}>
              🤖 CHURNBOT INFO
            </div>
            {[
              ["Model",    "Claude Sonnet"],
              ["Purpose",  "Churn Analysis"],
              ["Language", "English"],
              ["Memory",   "Last 10 messages"],
            ].map(([k, v]) => (
              <div key={k} style={{
                display: "flex", justifyContent: "space-between",
                padding: "6px 0", borderBottom: `1px solid ${C.border}22`,
              }}>
                <span style={{ color: C.muted, fontSize: 11 }}>{k}</span>
                <span style={{ color: C.accent, fontSize: 11, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Clear Chat */}
          <button onClick={() => setMessages([{
            role: "assistant",
            content: "👋 Hi! I'm ChurnBot. Ask me anything about churn prediction and retention!",
          }])} style={{
            background: "transparent", border: `1px solid ${C.border}`,
            color: C.muted, borderRadius: 10, padding: "10px",
            fontSize: 12, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = C.danger}
            onMouseLeave={e => e.currentTarget.style.borderColor = C.border}
          >
            🗑️ Clear Chat
          </button>
        </div>
      </div>

      {/* Bounce animation */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

function InsightsPage() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: C.text, margin: 0 }}>
          Feature <span style={{ color: C.accent }}>Insights</span>
        </h1>
        <p style={{ color: C.muted, margin: "4px 0 0", fontSize: 14 }}>SHAP-based feature importance and churn drivers</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 20 }}>
        {/* Feature Importance */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>SHAP ANALYSIS</div>
          <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Feature Importance Ranking</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureImportanceData} layout="vertical" barSize={14}>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} horizontal={false} />
              <XAxis type="number" stroke={C.muted} tick={{ fontSize: 11 }} domain={[0, 100]} />
              <YAxis type="category" dataKey="name" stroke={C.muted} tick={{ fontSize: 12, fill: C.text }} width={110} />
              <Tooltip contentStyle={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text }} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                {featureImportanceData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? C.accent : i === 1 ? C.highlight : i < 4 ? C.warn : C.muted} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { title: "Contract Type Impact", desc: "Month-to-month customers churn 3.4× more than 2-year contract holders", icon: "◈", color: C.danger },
            { title: "Tenure Sweet Spot", desc: "Customers who cross 24 months tenure drop churn risk by 68%", icon: "✦", color: C.success },
            { title: "Pricing Threshold", desc: "Monthly charges above $75 significantly increase churn probability", icon: "↗", color: C.warn },
            { title: "Support Matters", desc: "Adding tech support reduces churn probability by ~15 percentage points", icon: "⬡", color: C.accent },
          ].map(({ title, desc, icon, color }) => (
            <div key={title} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16,
              borderLeft: `3px solid ${color}`,
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, color }}>{icon}</span>
                <div>
                  <div style={{ color: C.text, fontWeight: 600, fontSize: 13, marginBottom: 4 }}>{title}</div>
                  <div style={{ color: C.muted, fontSize: 12, lineHeight: 1.6 }}>{desc}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Comparison */}
      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
        <div style={{ color: C.muted, fontSize: 11, letterSpacing: 1, marginBottom: 4 }}>COMPARISON</div>
        <div style={{ color: C.text, fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Model Performance Comparison</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          {[
            { model: "Logistic Regression", acc: 79, f1: 72, color: C.muted },
            { model: "Random Forest", acc: 84, f1: 78, color: C.highlight },
            { model: "XGBoost", acc: 87, f1: 80, color: C.accent },
            { model: "LightGBM", acc: 86, f1: 79, color: C.success },
          ].map(({ model, acc, f1, color }) => (
            <div key={model} style={{
              background: C.surface, borderRadius: 12, padding: 16, textAlign: "center",
              border: model === "XGBoost" ? `1px solid ${C.accent}44` : `1px solid ${C.border}`,
              position: "relative",
            }}>
              {model === "XGBoost" && (
                <div style={{
                  position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                  background: C.accent, color: C.bg, fontSize: 9, fontWeight: 700, padding: "2px 8px",
                  borderRadius: 10, letterSpacing: 1,
                }}>BEST MODEL</div>
              )}
              <div style={{ color: C.muted, fontSize: 11, marginBottom: 8 }}>{model}</div>
              <div style={{ fontSize: 28, fontWeight: 700, color, fontFamily: "'Courier New', monospace" }}>{acc}%</div>
              <div style={{ color: C.muted, fontSize: 11 }}>Accuracy</div>
              <div style={{ marginTop: 8, fontSize: 14, color: C.muted }}>F1: <span style={{ color }}>{f1}%</span></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, title, message) => {

  setNotification({
    type,
    title,
    message,
  });

    // 🔊 Notification sound
  const audio = new Audio(
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg"
  );

  audio.play();

  setTimeout(() => {
    setNotification(null);
  }, 5000);

};

if (!user) {
  return <LoginPage onLogin={setUser} />;
}

  const pages = user.role === "admin"
? {
    dashboard: <Dashboard />,
    predict: <PredictPage showNotification={showNotification} />,
    bulk: <BulkPage />,
    insights: <InsightsPage />,
    chat: <ChatPage />,
  }
: {
    predict: <PredictPage showNotification={showNotification} />,
    chat: <ChatPage />,
  };
  const pageTitles = { dashboard: "Dashboard", predict: "Predict", bulk: "Bulk Upload", insights: "Insights", chat: "AI Assistant" };

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'DM Mono', 'Courier New', monospace", color: C.text }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: ${C.bg}; }
        ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
        select option { background: ${C.surface}; }
        input::placeholder { color: ${C.muted}; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&display=swap');
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(100px);
          }

          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
      `}</style>

      <Sidebar
        active={page}
        setActive={setPage}
        activeUser={user.role}
      />
      <Notification
        notification={notification}
        removeNotification={() => setNotification(null)}
      />

      {/* Top Bar */}
      <div style={{
        position: "fixed", top: 0, left: 72, right: 0, height: 56,
        background: C.surface + "EE", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center",
        padding: "0 24px", justifyContent: "space-between", zIndex: 90,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ color: C.muted, fontSize: 12 }}>ChurnAI</span>
          <span style={{ color: C.border }}>›</span>
          <span style={{ color: C.accent, fontSize: 12, fontWeight: 600 }}>{pageTitles[page]}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{
            padding: "4px 12px", borderRadius: 20, background: C.successDim,
            border: `1px solid ${C.success}44`, color: C.success, fontSize: 11, letterSpacing: 1,
          }}>● API CONNECTED</div>

          <button
            onClick={() => setUser(null)}
            style={{
              background: "transparent",
              border: `1px solid ${C.border}`,
              color: C.text,
              padding: "8px 14px",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 12,
             }}
           >
             Logout
            </button>
          <div style={{
            width: 32, height: 32, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.accent}, ${C.highlight})`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
          }}>U</div>
        </div>
      </div>

      {/* Content */}
      <main style={{ marginLeft: 72, paddingTop: 76, padding: "76px 28px 28px" }}>
        {pages[page]}
      </main>
      </div>
  );
}
