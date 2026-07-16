import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, Route, Routes } from "react-router-dom";
import type { AdminCategory, AdminMaterial, AdminState } from "./adminData";
import { loadAdminState, saveAdminState } from "./adminData";
import { fetchMetalState, refreshMetalState, saveMetalSettings } from "./metalsService";
import type { MetalServiceState } from "./metalsService";
import type { MetalPriceSettings } from "./metalsPrice";

const adminStyles = {
  page: {
    minHeight: "100vh",
    background: "#f7f4eb",
    color: "#171717",
    fontFamily: "Arial, Helvetica, sans-serif",
  } as const,
  shell: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "24px",
  } as const,
  card: {
    background: "#fff",
    border: "1px solid #e5dcc6",
    borderRadius: 16,
    padding: 24,
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
  } as const,
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #d8cda8",
    marginTop: 6,
    marginBottom: 12,
    fontSize: 14,
  } as const,
  button: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "none",
    cursor: "pointer",
    fontWeight: 700,
  } as const,
};

function AdminLoginPage({ onLogin }: { onLogin: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (password.trim()) {
      onLogin(password.trim());
    } else {
      setError("कृपया सही पासवर्ड दर्ज करें।");
    }
  };

  return (
    <div style={adminStyles.page}>
      <div style={{ ...adminStyles.shell, maxWidth: 520, paddingTop: 80 }}>
        <div style={{ ...adminStyles.card, textAlign: "center" }}>
          <h1 style={{ marginBottom: 8, color: "#b17b08" }}>Admin Login</h1>
          <p style={{ marginBottom: 24, color: "#666" }}>NIYARE WALA Admin Panel</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="password" style={{ display: "block", textAlign: "left", fontWeight: 700 }}>
              पासवर्ड
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin API token"
              style={adminStyles.input}
            />

            {error ? <p style={{ color: "#c0392b", marginBottom: 12 }}>{error}</p> : null}

            <button type="submit" style={{ ...adminStyles.button, background: "#171717", color: "#fff", width: "100%" }}>
              लॉगिन
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard({ adminToken }: { adminToken: string }) {
  const [state, setState] = useState<AdminState>(() => loadAdminState());
  const [draftMaterial, setDraftMaterial] = useState<AdminMaterial | null>(null);
  const [draftHomepage, setDraftHomepage] = useState(state.homepage);
  const [draftContact, setDraftContact] = useState(state.contact);
  const [draftRates, setDraftRates] = useState(state.rates);
  const [metalState, setMetalState] = useState<MetalServiceState | null>(null);
  const [metalDraft, setMetalDraft] = useState<MetalPriceSettings | null>(null);
  const [metalLoading, setMetalLoading] = useState(false);
  const [metalError, setMetalError] = useState<string | null>(null);

  useEffect(() => {
    saveAdminState(state);
  }, [state]);

  const saveConfig = () => {
    saveAdminState(state);
    alert("सहेजा गया");
  };

  useEffect(() => {
    let active = true;
    setMetalLoading(true);
    fetchMetalState()
      .then((data) => {
        if (!active) return;
        setMetalState(data);
        setMetalDraft(data);
        setMetalError(null);
      })
      .catch((error) => {
        if (!active) return;
        setMetalError(error?.message || "Unable to load live price settings.");
      })
      .finally(() => {
        if (!active) return;
        setMetalLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateMetalDraft = (changes: Partial<MetalPriceSettings>) => {
    setMetalDraft((current) =>
      current
        ? {
            ...current,
            ...changes,
            manualPrices: {
              ...current.manualPrices,
              ...(changes.manualPrices ?? {}),
            },
          }
        : null,
    );
  };

  const updateManualPrice = (field: keyof MetalPriceSettings["manualPrices"], value: number) => {
    setMetalDraft((current) =>
      current
        ? {
            ...current,
            manualPrices: {
              ...current.manualPrices,
              [field]: value,
            },
          }
        : null,
    );
  };

  const handleSaveMetalSettings = async () => {
    if (!metalDraft) return;
    setMetalLoading(true);

    try {
      const updated = await saveMetalSettings({
        gold999Adjustment: metalDraft.gold999Adjustment,
        gold995Adjustment: metalDraft.gold995Adjustment,
        silver999Adjustment: metalDraft.silver999Adjustment,
        manualPriceMode: metalDraft.manualPriceMode,
        manualPrices: metalDraft.manualPrices,
      }, adminToken);

      setMetalState(updated);
      setMetalDraft(updated);
      alert("लाइव भाव सेटिंग्स सेव हो गईं");
    } catch (error: any) {
      alert(error?.message || "Unable to save live price settings.");
    } finally {
      setMetalLoading(false);
    }
  };

  const handleRefreshMetalState = async () => {
    if (!window.confirm("क्या आप लाइव भाव को तुरंत रिफ्रेश करना चाहते हैं?")) {
      return;
    }

    setMetalLoading(true);
    try {
      const refreshed = await refreshMetalState(adminToken);
      setMetalState(refreshed);
      setMetalDraft(refreshed);
      alert("लाइव भाव रीफ्रेश हो गए हैं");
    } catch (error: any) {
      alert(error?.message || "Unable to refresh live metal prices.");
    } finally {
      setMetalLoading(false);
    }
  };

  const updateMaterial = (id: string, changes: Partial<AdminMaterial>) => {
    setState((current) => ({
      ...current,
      materials: current.materials.map((item) => (item.id === id ? { ...item, ...changes } : item)),
    }));
  };

  const updateCategory = (id: string, changes: Partial<AdminCategory>) => {
    setState((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.id === id ? { ...category, ...changes } : category,
      ),
    }));
  };

  const addMaterial = () => {
    const nextMaterial: AdminMaterial = {
      id: `material-${Date.now()}`,
      title: "नई सामग्री",
      description: "नई सामग्री का वर्णन",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    };

    setState((current) => ({ ...current, materials: [...current.materials, nextMaterial] }));
    setDraftMaterial(nextMaterial);
  };

  const addCategory = () => {
    const nextCategory: AdminCategory = {
      id: `category-${Date.now()}`,
      slug: `custom-category-${Date.now()}`,
      symbol: "★",
      title: "नई श्रेणी",
      description: "नई श्रेणी का संक्षिप्त विवरण",
      heroText: "नई श्रेणी का हीरो टेक्स्ट",
      image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      items: [
        {
          name: "नई आइटम",
          description: "नई सामग्री विवरण",
          image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80",
        },
      ],
    };

    setState((current) => ({ ...current, categories: [...current.categories, nextCategory] }));
  };

  const deleteMaterial = (id: string) => {
    setState((current) => ({ ...current, materials: current.materials.filter((item) => item.id !== id) }));
  };

  const deleteCategory = (id: string) => {
    setState((current) => ({ ...current, categories: current.categories.filter((category) => category.id !== id) }));
  };

  const updateHomepage = () => {
    setState((current) => ({ ...current, homepage: draftHomepage }));
  };

  const updateContact = () => {
    setState((current) => ({ ...current, contact: draftContact }));
  };

  const updateRates = () => {
    setState((current) => ({ ...current, rates: draftRates }));
  };

  const materialPreview = useMemo(() => draftMaterial, [draftMaterial]);

  return (
    <div style={adminStyles.page}>
      <div style={adminStyles.shell}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ margin: 0, color: "#b17b08" }}>Admin Dashboard</h1>
            <p style={{ margin: "6px 0 0", color: "#666" }}>NIYARE WALA कंट्रोल पैनल</p>
          </div>
          <Link to="/" style={{ color: "#171717", fontWeight: 700 }}>
            वेबसाइट पर जाएँ
          </Link>
        </div>

        <div style={{ display: "grid", gap: 20 }}>
          <section style={adminStyles.card}>
            <h2 style={{ marginTop: 0 }}>आज का भाव</h2>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {Object.entries(draftRates).map(([key, value]) => (
                <div key={key}>
                  <label style={{ fontWeight: 700 }}>{key === "gold" ? "Gold Rate" : key === "silver" ? "Silver Rate" : key === "platinum" ? "Platinum Rate" : "Palladium Rate"}</label>
                  <input
                    style={adminStyles.input}
                    value={value}
                    onChange={(event) => setDraftRates((current) => ({ ...current, [key]: event.target.value }))}
                  />
                </div>
              ))}
            </div>
            <button style={{ ...adminStyles.button, background: "#171717", color: "#fff", marginTop: 8 }} onClick={updateRates}>
              भाव सेव करें
            </button>
          </section>

          <section style={adminStyles.card}>
            <h2 style={{ marginTop: 0 }}>हम क्या खरीदते हैं / Material Management</h2>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
              <button style={{ ...adminStyles.button, background: "#b17b08", color: "#fff" }} onClick={addMaterial}>
                Add Material
              </button>
              <button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} onClick={addCategory}>
                Add Category
              </button>
              <button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} onClick={saveConfig}>
                Save All
              </button>
            </div>

            <div style={{ display: "grid", gap: 16 }}>
              {state.materials.map((item) => (
                <div key={item.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "grid", gap: 10 }}>
                    <label style={{ fontWeight: 700 }}>Title</label>
                    <input
                      style={adminStyles.input}
                      value={item.title}
                      onChange={(event) => updateMaterial(item.id, { title: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Hindi Description</label>
                    <textarea
                      style={{ ...adminStyles.input, minHeight: 90, resize: "vertical" }}
                      value={item.description}
                      onChange={(event) => updateMaterial(item.id, { description: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Image URL</label>
                    <input
                      style={adminStyles.input}
                      value={item.image}
                      onChange={(event) => updateMaterial(item.id, { image: event.target.value })}
                    />

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} onClick={() => updateMaterial(item.id, {})}>
                        Edit Material
                      </button>
                      <button style={{ ...adminStyles.button, background: "#c0392b", color: "#fff" }} onClick={() => deleteMaterial(item.id)}>
                        Delete Material
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {materialPreview ? (
              <div style={{ marginTop: 16, borderTop: "1px solid #eee", paddingTop: 16 }}>
                <h3>सहेजे जाने वाला सामग्री प्रीव्यू</h3>
                <p><strong>{materialPreview.title}</strong></p>
                <p>{materialPreview.description}</p>
                <img src={materialPreview.image} alt={materialPreview.title} style={{ width: 220, height: 140, objectFit: "cover", borderRadius: 10 }} />
              </div>
            ) : null}
          </section>

          <section style={adminStyles.card}>
            <h2 style={{ marginTop: 0 }}>Categories Management</h2>
            <div style={{ display: "grid", gap: 18 }}>
              {state.categories.map((category) => (
                <div key={category.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 14 }}>
                  <div style={{ display: "grid", gap: 10 }}>
                    <label style={{ fontWeight: 700 }}>Slug</label>
                    <input
                      style={adminStyles.input}
                      value={category.slug}
                      onChange={(event) => updateCategory(category.id, { slug: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Symbol</label>
                    <input
                      style={adminStyles.input}
                      value={category.symbol}
                      onChange={(event) => updateCategory(category.id, { symbol: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Title</label>
                    <input
                      style={adminStyles.input}
                      value={category.title}
                      onChange={(event) => updateCategory(category.id, { title: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Description</label>
                    <textarea
                      style={{ ...adminStyles.input, minHeight: 90, resize: "vertical" }}
                      value={category.description}
                      onChange={(event) => updateCategory(category.id, { description: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Hero Text</label>
                    <textarea
                      style={{ ...adminStyles.input, minHeight: 80, resize: "vertical" }}
                      value={category.heroText}
                      onChange={(event) => updateCategory(category.id, { heroText: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Image URL</label>
                    <input
                      style={adminStyles.input}
                      value={category.image}
                      onChange={(event) => updateCategory(category.id, { image: event.target.value })}
                    />

                    <label style={{ fontWeight: 700 }}>Note (optional)</label>
                    <textarea
                      style={{ ...adminStyles.input, minHeight: 70, resize: "vertical" }}
                      value={category.note ?? ""}
                      onChange={(event) => updateCategory(category.id, { note: event.target.value || undefined })}
                    />

                    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                      <button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} onClick={() => updateCategory(category.id, {})}>
                        Update Category
                      </button>
                      <button style={{ ...adminStyles.button, background: "#c0392b", color: "#fff" }} onClick={() => deleteCategory(category.id)}>
                        Delete Category
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section style={adminStyles.card}>
            <h2 style={{ marginTop: 0 }}>Metals / API Rates</h2>
            {metalLoading && !metalState ? <p>Loading saved snapshot…</p> : null}
            {metalError ? <p style={{ color: "#c0392b" }}>{metalError}</p> : null}
            {metalState && metalDraft ? <>
              <p><strong>API status:</strong> {metalState.apiStatus.status} · <strong>Last successful:</strong> {metalState.apiStatus.lastSuccessfulUpdate ?? "-"} · <strong>Next refresh:</strong> {metalState.apiStatus.nextScheduledUpdate} ({metalState.timezone})</p>
              <p style={{ color: "#666" }}>Automatic schedule: {metalState.schedule} Asia/Kolkata. Prices refresh every 60 minutes.</p>
              <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
                {[["Gold 999 (₹ / 10g)", "gold999", metalState.gold999Price, metalState.previousSnapshot?.gold999Price, metalState.gold999Change], ["Gold 995 (₹ / 10g)", "gold995", metalState.gold995Price, metalState.previousSnapshot?.gold995Price, metalState.gold995Change], ["Silver 999 (₹ / kg)", "silver999", metalState.silver999Price, metalState.previousSnapshot?.silver999Price, metalState.silver999Change]].map(([label, key, current, previous, change]) => {
                  const adjustmentKey = `${key}Adjustment` as "gold999Adjustment" | "gold995Adjustment" | "silver999Adjustment";
                  const adjustment = metalDraft[adjustmentKey]; const movement = change as MetalServiceState["gold999Change"]; const currentRate = typeof current === "number" ? current : null; const previousRate = typeof previous === "number" ? previous : null;
                  return <div key={String(key)} style={{ border: "1px solid #e5dcc6", borderRadius: 12, padding: 14 }}><strong>{String(label)}</strong><p>Current: ₹{currentRate ?? "-"}<br />Previous: ₹{previousRate ?? "-"}<br />Difference: {movement.direction === "neutral" ? "—" : `${movement.direction === "up" ? "↑" : "↓"} ₹${movement.difference} (${movement.percentage}%)`}</p><div style={{ display: "flex", gap: 8 }}><select style={adminStyles.input} value={adjustment.mode} onChange={(event) => updateMetalDraft({ [adjustmentKey]: { ...adjustment, mode: event.target.value as "fixed" | "percentage" } } as Partial<MetalPriceSettings>)}><option value="fixed">₹ fixed</option><option value="percentage">%</option></select><input style={adminStyles.input} type="number" value={adjustment.value} onChange={(event) => updateMetalDraft({ [adjustmentKey]: { ...adjustment, value: Number(event.target.value) } } as Partial<MetalPriceSettings>)} /></div></div>;
                })}
              </div>
              <label style={{ display: "block", marginTop: 12 }}><input type="checkbox" checked={metalDraft.manualPriceMode} onChange={(event) => updateMetalDraft({ manualPriceMode: event.target.checked })} /> Use manual current rates</label>
              {metalDraft.manualPriceMode ? <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 12 }}>{(["gold999", "gold995", "silver999"] as const).map((field) => <label key={field}>{field}<input style={adminStyles.input} type="number" value={metalDraft.manualPrices[field]} onChange={(event) => updateManualPrice(field, Number(event.target.value))} /></label>)}</div> : null}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}><button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} disabled={metalLoading} onClick={handleSaveMetalSettings}>Save rate settings</button><button style={{ ...adminStyles.button, background: "#b17b08", color: "#fff" }} disabled={metalLoading} onClick={handleRefreshMetalState}>Manual API refresh</button></div>
            </> : null}
          </section>

          <section style={adminStyles.card}>
            <h2 style={{ marginTop: 0 }}>Contact Information</h2>
            <label style={{ fontWeight: 700 }}>Mobile Number</label>
            <input
              style={adminStyles.input}
              value={draftContact.mobile}
              onChange={(event) => setDraftContact((current) => ({ ...current, mobile: event.target.value }))}
            />

            <label style={{ fontWeight: 700 }}>WhatsApp Number</label>
            <input
              style={adminStyles.input}
              value={draftContact.whatsapp}
              onChange={(event) => setDraftContact((current) => ({ ...current, whatsapp: event.target.value }))}
            />

            <label style={{ fontWeight: 700 }}>Address</label>
            <input
              style={adminStyles.input}
              value={draftContact.address}
              onChange={(event) => setDraftContact((current) => ({ ...current, address: event.target.value }))}
            />

            <label style={{ fontWeight: 700 }}>Email</label>
            <input
              style={adminStyles.input}
              value={draftContact.email}
              onChange={(event) => setDraftContact((current) => ({ ...current, email: event.target.value }))}
            />

            <button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} onClick={updateContact}>
              संपर्क जानकारी सेव करें
            </button>
          </section>

          <section style={adminStyles.card}>
            <h2 style={{ marginTop: 0 }}>Homepage Content</h2>
            <label style={{ fontWeight: 700 }}>Edit Heading</label>
            <input
              style={adminStyles.input}
              value={draftHomepage.heading}
              onChange={(event) => setDraftHomepage((current) => ({ ...current, heading: event.target.value }))}
            />

            <label style={{ fontWeight: 700 }}>Edit Description</label>
            <textarea
              style={{ ...adminStyles.input, minHeight: 90, resize: "vertical" }}
              value={draftHomepage.description}
              onChange={(event) => setDraftHomepage((current) => ({ ...current, description: event.target.value }))}
            />

            <button style={{ ...adminStyles.button, background: "#171717", color: "#fff" }} onClick={updateHomepage}>
              होमपेज सामग्री सेव करें
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

function AdminApp() {
  const [adminToken, setAdminToken] = useState<string | null>(null);

  return (
    <Routes>
      <Route path="/admin" element={adminToken ? <AdminDashboard adminToken={adminToken} /> : <AdminLoginPage onLogin={setAdminToken} />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}

export default AdminApp;
