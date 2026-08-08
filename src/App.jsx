import React, { useState, useMemo } from "react";
import {
  Home, Package, ShoppingBag, Users, BarChart3, Plus, X, Search,
  ChevronRight, Star, TrendingUp, TrendingDown, Clock, Trash2,
  Glasses, ArrowUpRight, Calendar, DollarSign, Award,
  UserPlus, Check, AlertCircle, Tag, ArrowLeft, Percent, LogOut, RotateCcw
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, CartesianGrid, PieChart, Pie, Cell
} from "recharts";

// ---------- Design tokens ----------
const C = {
  bg: "#0A0A0F",
  bgElevated: "#0F0F16",
  surface: "#15151F",
  surface2: "#1C1C28",
  border: "#26262F",
  borderSoft: "#1E1E28",
  text: "#F3F3F6",
  textMuted: "#8B8B9A",
  textFaint: "#54545F",
  violet: "#8B5CF6",
  cyan: "#22D3C8",
  coral: "#FF6B81",
  gold: "#FBBF24",
  green: "#34D399",
};
const gradPrism = `linear-gradient(135deg, ${C.violet} 0%, #6366F1 45%, ${C.cyan} 100%)`;
const gradCoral = `linear-gradient(135deg, ${C.coral} 0%, #F97362 100%)`;
const gradGold = `linear-gradient(135deg, ${C.gold} 0%, #F59E0B 100%)`;

const fontDisplay = { fontFamily: "'Segoe UI', system-ui, sans-serif", fontWeight: 800, letterSpacing: "-0.02em" };
const fontMono = { fontFamily: "'SF Mono', 'Courier New', monospace" };

// ---------- Mock data ----------
const CATEGORIES = ["Солнцезащитные", "Оптические", "Спортивные", "Аксессуары"];

const initialProducts = [
  { id: 1, sku: "RB-3025", name: "Ray-Ban Aviator Classic", category: "Солнцезащитные", price: 4500, cost: 2200, stock: 12 },
  { id: 2, sku: "OK-9013", name: "Oakley Holbrook", category: "Солнцезащитные", price: 5200, cost: 2800, stock: 7 },
  { id: 3, sku: "GC-1102", name: "Gucci GG0061S", category: "Солнцезащитные", price: 12000, cost: 6500, stock: 3 },
  { id: 4, sku: "PR-A001", name: "Prada Optical Frame", category: "Оптические", price: 8900, cost: 4200, stock: 5 },
  { id: 5, sku: "ADIQ-014", name: "Adiq Vision Slim", category: "Оптические", price: 2200, cost: 900, stock: 20 },
  { id: 6, sku: "SP-2201", name: "SportFlex Runner", category: "Спортивные", price: 3100, cost: 1400, stock: 15 },
  { id: 7, sku: "ACC-CASE1", name: "Футляр кожаный", category: "Аксессуары", price: 650, cost: 200, stock: 30 },
  { id: 8, sku: "ACC-CLOTH", name: "Салфетка микрофибра", category: "Аксессуары", price: 150, cost: 40, stock: 60 },
];

const OWNER_PASSWORD = "admin2026";

const initialSellers = [
  { id: 1, name: "Айгерим Т.", initials: "АТ", rating: 4.8, color: C.violet, onShift: true, age: 24, password: "prodavec841", bonus: 0 },
  { id: 2, name: "Бекзат У.", initials: "БУ", rating: 4.5, color: C.cyan, onShift: true, age: 27, password: "prodavec392", bonus: 0 },
  { id: 3, name: "Жанна С.", initials: "ЖС", rating: 4.9, color: C.gold, onShift: false, age: 22, password: "prodavec156", bonus: 0 },
  { id: 4, name: "Марат Д.", initials: "МД", rating: 4.2, color: C.coral, onShift: false, age: 29, password: "prodavec704", bonus: 0 },
];
function generatePassword() {
  return "prodavec" + Math.floor(100 + Math.random() * 900);
}

const weekRevenue = [
  { day: "Пн", value: 24500 }, { day: "Вт", value: 31200 }, { day: "Ср", value: 18900 },
  { day: "Чт", value: 42100 }, { day: "Пт", value: 51300 }, { day: "Сб", value: 68900 },
  { day: "Вс", value: 39400 },
];
const hourlyData = [
  { h: "10", v: 3 }, { h: "11", v: 5 }, { h: "12", v: 8 }, { h: "13", v: 6 },
  { h: "14", v: 9 }, { h: "15", v: 14 }, { h: "16", v: 18 }, { h: "17", v: 22 },
  { h: "18", v: 19 }, { h: "19", v: 11 }, { h: "20", v: 4 },
];
const sellerLeaderboard = [
  { name: "Жанна С.", revenue: 189400, sales: 41, color: C.gold },
  { name: "Айгерим Т.", revenue: 164200, sales: 35, color: C.violet },
  { name: "Бекзат У.", revenue: 121800, sales: 28, color: C.cyan },
  { name: "Марат Д.", revenue: 98600, sales: 22, color: C.coral },
];
const topProducts = [
  { name: "Ray-Ban Aviator Classic", units: 34, color: C.violet },
  { name: "Oakley Holbrook", units: 27, color: C.cyan },
  { name: "Adiq Vision Slim", units: 22, color: C.gold },
  { name: "SportFlex Runner", units: 15, color: C.coral },
];

function money(n) {
  return n.toLocaleString("ru-RU") + " с";
}

// ---------- Shared UI ----------
function Card({ children, style, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: C.surface,
        border: `1px solid ${C.borderSoft}`,
        borderRadius: 18,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function StatCard({ label, value, delta, icon, grad }) {
  const up = delta >= 0;
  return (
    <Card style={{ flex: 1, minWidth: 0, position: "relative", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: -30, right: -30, width: 90, height: 90,
        borderRadius: "50%", background: grad, opacity: 0.18, filter: "blur(2px)",
      }} />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ color: C.textMuted, fontSize: 12 }}>{label}</span>
        <div style={{
          width: 26, height: 26, borderRadius: 8, background: grad,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {icon}
        </div>
      </div>
      <div style={{ ...fontDisplay, fontSize: 22, marginTop: 10, color: C.text }}>{value}</div>
      {delta !== undefined && (
        <div style={{
          display: "flex", alignItems: "center", gap: 4, marginTop: 4,
          color: up ? C.green : C.coral, fontSize: 12, fontWeight: 600,
        }}>
          {up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(delta)}% за неделю
        </div>
      )}
    </Card>
  );
}

function Pill({ active, children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 12px",
        borderRadius: 999,
        border: `1px solid ${active ? "transparent" : C.border}`,
        background: active ? gradPrism : "transparent",
        color: active ? "#0A0A0F" : C.textMuted,
        fontSize: 12,
        fontWeight: 700,
        whiteSpace: "nowrap",
        cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function RatingStars({ value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 3 }}>
      <Star size={13} fill={C.gold} color={C.gold} />
      <span style={{ fontSize: 12, color: C.text, fontWeight: 700 }}>{value.toFixed(1)}</span>
    </div>
  );
}

// ---------- Screens ----------
function Dashboard({ products, sellers, setTab }) {
  const invValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const lowStock = products.filter((p) => p.stock <= 5);
  const onShift = sellers.filter((s) => s.onShift);
  const pd = periodData["День"];
  const pw = periodData["Неделя"];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{
        borderRadius: 20, padding: 18, background: gradPrism, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 85% 0%, rgba(255,255,255,0.25), transparent 60%)" }} />
        <div style={{ color: "rgba(10,10,15,0.7)", fontSize: 12, fontWeight: 700, position: "relative" }}>ОБОРОТ СЕГОДНЯ</div>
        <div style={{ ...fontDisplay, fontSize: 34, color: "#0A0A0F", position: "relative" }}>{money(pd.revenue)}</div>
        <div style={{ display: "flex", gap: 16, marginTop: 10, position: "relative" }}>
          <div style={{ fontSize: 12, color: "rgba(10,10,15,0.75)", fontWeight: 600 }}>17 продаж</div>
          <div style={{ fontSize: 12, color: "rgba(10,10,15,0.75)", fontWeight: 600 }}>Чистыми {money(pd.profit)}</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <StatCard label="Оборот · неделя" value={money(pw.revenue)} delta={pw.delta} icon={<DollarSign size={14} color="#0A0A0F" />} grad={gradPrism} />
        <StatCard label="Чистая прибыль · неделя" value={money(pw.profit)} delta={pw.delta - 6} icon={<TrendingUp size={14} color="#0A0A0F" />} grad={gradCoral} />
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        <StatCard label="Зарплата · неделя" value={money(pw.payroll)} icon={<Users size={14} color="#0A0A0F" />} grad={gradGold} />
        <StatCard label="Товар на складе" value={money(invValue)} icon={<Package size={14} color="#0A0A0F" />} grad={gradPrism} />
      </div>

      <Card style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.10), rgba(251,191,36,0.02))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Users size={15} color={C.gold} />
          <div style={{ ...fontDisplay, fontSize: 14, color: C.text }}>Расходы на зарплату</div>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8 }}>Оклад 1 000 сом/смена + 3% от оборота продавца</div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {["День", "Неделя", "Месяц", "Год"].map((k) => (
            <div key={k} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 9.5, color: C.textFaint, fontWeight: 700, textTransform: "uppercase" }}>{k}</div>
              <div style={{ fontSize: 12.5, fontWeight: 800, color: C.text, ...fontMono, marginTop: 2 }}>{money(periodData[k].payroll)}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ ...fontDisplay, fontSize: 15, color: C.text }}>Смена сегодня</div>
          <button onClick={() => setTab("team")} style={{ background: "none", border: "none", color: C.cyan, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 2, cursor: "pointer" }}>
            Все <ChevronRight size={14} />
          </button>
        </div>
        {onShift.length === 0 && <div style={{ fontSize: 12, color: C.textFaint }}>Сегодня никто не отмечен на смене</div>}
        {onShift.map((s) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderTop: `1px solid ${C.borderSoft}` }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#0A0A0F" }}>
              {s.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{s.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted }}>на смене</div>
            </div>
            <RatingStars value={s.rating} />
          </div>
        ))}
      </Card>

      {lowStock.length > 0 && (
        <Card style={{ border: `1px solid rgba(255,107,129,0.35)`, background: "rgba(255,107,129,0.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <AlertCircle size={16} color={C.coral} />
            <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Заканчивается на складе</div>
          </div>
          {lowStock.map((p) => (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, padding: "4px 0", color: C.textMuted }}>
              <span>{p.name}</span>
              <span style={{ color: C.coral, fontWeight: 700, ...fontMono }}>{p.stock} шт</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function Inventory({ products, setProducts }) {
  const [cat, setCat] = useState("Все");
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ sku: "", name: "", category: CATEGORIES[0], price: "", cost: "", stock: "" });

  const filtered = products.filter((p) =>
    (cat === "Все" || p.category === cat) &&
    (p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
  );

  function addProduct() {
    if (!form.sku || !form.name || !form.price) return;
    setProducts((prev) => [
      ...prev,
      { id: Date.now(), sku: form.sku, name: form.name, category: form.category, price: Number(form.price), cost: Number(form.cost) || 0, stock: Number(form.stock) || 0 },
    ]);
    setForm({ sku: "", name: "", category: CATEGORIES[0], price: "", cost: "", stock: "" });
    setShowAdd(false);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: C.surface, border: `1px solid ${C.borderSoft}`, borderRadius: 14, padding: "10px 12px" }}>
          <Search size={15} color={C.textFaint} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию или артикулу"
            style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, width: "100%" }}
          />
        </div>
        <button
          onClick={() => setShowAdd(true)}
          style={{ width: 40, height: 40, borderRadius: 12, background: gradPrism, border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <Plus size={18} color="#0A0A0F" />
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 2 }}>
        {["Все", ...CATEGORIES].map((c) => (
          <Pill key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Pill>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((p) => (
          <Card key={p.id} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12, flexShrink: 0,
              background: `linear-gradient(135deg, ${p.category === "Солнцезащитные" ? C.violet : p.category === "Оптические" ? C.cyan : p.category === "Спортивные" ? C.coral : C.gold}33, transparent)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              border: `1px solid ${C.borderSoft}`,
            }}>
              <Glasses size={18} color={C.text} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, ...fontMono, marginTop: 2 }}>{p.sku} · {p.category}</div>
            </div>
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.text, ...fontMono }}>{money(p.price)}</div>
              <div style={{ fontSize: 11, color: p.stock <= 5 ? C.coral : C.textMuted, fontWeight: 600 }}>{p.stock} шт на складе</div>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", color: C.textFaint, fontSize: 13, padding: 30 }}>Ничего не найдено</div>
        )}
      </div>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bgElevated, borderRadius: "22px 22px 0 0", padding: 20, border: `1px solid ${C.border}`, borderBottom: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ ...fontDisplay, fontSize: 17, color: C.text }}>Новый товар</div>
              <X size={20} color={C.textMuted} onClick={() => setShowAdd(false)} style={{ cursor: "pointer" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Артикул (SKU)" value={form.sku} onChange={(v) => setForm({ ...form, sku: v })} placeholder="RB-3025" mono />
              <Field label="Название" value={form.name} onChange={(v) => setForm({ ...form, name: v })} placeholder="Ray-Ban Aviator" />
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>Категория</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {CATEGORIES.map((c) => (
                    <Pill key={c} active={form.category === c} onClick={() => setForm({ ...form, category: c })}>{c}</Pill>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <Field label="Цена продажи" value={form.price} onChange={(v) => setForm({ ...form, price: v })} placeholder="4500" mono />
                <Field label="Остаток" value={form.stock} onChange={(v) => setForm({ ...form, stock: v })} placeholder="10" mono />
              </div>
              <button onClick={addProduct} style={{ marginTop: 6, padding: 14, borderRadius: 14, border: "none", background: gradPrism, color: "#0A0A0F", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                Добавить в базу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, mono, onEnter }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter" && onEnter) onEnter(); }}
        placeholder={placeholder}
        style={{
          width: "100%", boxSizing: "border-box", background: C.surface2, border: `1px solid ${C.border}`,
          borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none",
          ...(mono ? fontMono : {}),
        }}
      />
    </div>
  );
}

function ProductRow({ p, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex", alignItems: "center", gap: 10, padding: 10, borderRadius: 12,
        background: C.surface2, border: `1px solid ${C.border}`, cursor: "pointer",
      }}
    >
      <div style={{ width: 32, height: 32, borderRadius: 9, background: `${C.violet}22`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Glasses size={15} color={C.text} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.name}</div>
        <div style={{ fontSize: 10.5, ...fontMono, color: C.textFaint, marginTop: 2 }}>{p.sku} · {p.stock} шт</div>
      </div>
      <div style={{ fontSize: 12.5, fontWeight: 800, color: C.text, ...fontMono, flexShrink: 0 }}>{money(p.price)}</div>
    </div>
  );
}

function SalesScreen({ products, setProducts, sellers, sales, setSales }) {
  const [selected, setSelected] = useState(null);
  const [price, setPrice] = useState("");
  const [seller, setSeller] = useState(sellers.find((s) => s.onShift)?.id || sellers[0].id);
  const [done, setDone] = useState(false);
  const [query, setQuery] = useState("");
  const [tier, setTier] = useState(null);

  const inStock = products.filter((p) => p.stock > 0);

  const tiers = useMemo(() => {
    const map = new Map();
    inStock.forEach((p) => {
      if (!map.has(p.price)) map.set(p.price, []);
      map.get(p.price).push(p);
    });
    return [...map.entries()].map(([price, items]) => ({ price, items })).sort((a, b) => a.price - b.price);
  }, [products]);

  const searching = query.trim().length > 0;
  const searchResults = searching
    ? inStock.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.sku.toLowerCase().includes(query.toLowerCase()))
    : [];

  function pick(p) {
    setSelected(p);
    setPrice(String(p.price));
  }
  function reset() {
    setSelected(null); setPrice(""); setTier(null); setQuery("");
  }
  function applyDiscount(pct) {
    if (!selected) return;
    const val = Math.round((selected.price * (1 - pct / 100)) / 10) * 10;
    setPrice(String(val));
  }
  function confirmSale() {
    if (!selected || !price) return;
    setProducts((prev) => prev.map((p) => (p.id === selected.id ? { ...p, stock: Math.max(0, p.stock - 1) } : p)));
    setSales((prev) => [{ id: Date.now(), productId: selected.id, sellerId: seller, price: Number(price) }, ...prev]);
    setDone(true);
    setTimeout(() => { setDone(false); reset(); }, 1400);
  }

  const todaySales = sales.slice(0, 6);
  const discountPct = selected ? Math.round((1 - Number(price || selected.price) / selected.price) * 100) : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <Card>
        <div style={{ ...fontDisplay, fontSize: 15, color: C.text, marginBottom: 12 }}>Новая продажа</div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 14, padding: "10px 12px", marginBottom: 12 }}>
          <Search size={15} color={C.textFaint} />
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setTier(null); }}
            placeholder="Поиск по названию или артикулу"
            style={{ background: "none", border: "none", outline: "none", color: C.text, fontSize: 13, width: "100%" }}
          />
          {query && <X size={15} color={C.textFaint} style={{ cursor: "pointer" }} onClick={() => setQuery("")} />}
        </div>

        {!selected && searching && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {searchResults.length === 0 && <div style={{ fontSize: 12, color: C.textFaint, padding: "8px 0" }}>Ничего не найдено</div>}
            {searchResults.map((p) => <ProductRow key={p.id} p={p} onClick={() => pick(p)} />)}
          </div>
        )}

        {!selected && !searching && !tier && (
          <>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Ценовые категории</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {tiers.map((t) => (
                <div key={t.price} onClick={() => setTier(t)} style={{ borderRadius: 14, padding: 12, cursor: "pointer", background: C.surface2, border: `1px solid ${C.border}` }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: gradPrism, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
                    <Tag size={13} color="#0A0A0F" />
                  </div>
                  <div style={{ ...fontMono, fontSize: 15, fontWeight: 800, color: C.text }}>{money(t.price)}</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{t.items.length} {t.items.length === 1 ? "модель" : "моделей"}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {!selected && !searching && tier && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <button onClick={() => setTier(null)} style={{ background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <ArrowLeft size={14} color={C.text} />
              </button>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>Категория {money(tier.price)}</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tier.items.map((p) => <ProductRow key={p.id} p={p} onClick={() => pick(p)} />)}
            </div>
          </>
        )}

        {selected && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, background: C.surface2, borderRadius: 12, padding: 10, marginBottom: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: gradPrism, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Glasses size={16} color="#0A0A0F" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: C.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selected.name}</div>
                <div style={{ fontSize: 10.5, ...fontMono, color: C.textFaint, marginTop: 2 }}>{selected.sku} · остаток {selected.stock} шт</div>
              </div>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={16} color={C.textFaint} />
              </button>
            </div>

            <Field label="Цена продажи (сом)" value={price} onChange={setPrice} placeholder="1200" mono />

            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, marginBottom: 12, flexWrap: "wrap" }}>
              <span style={{ fontSize: 10.5, color: C.textFaint, display: "flex", alignItems: "center", gap: 3, marginRight: 2 }}><Percent size={11} /> Скидка:</span>
              {[0, 10, 20, 30].map((pct) => (
                <Pill key={pct} active={discountPct === pct} onClick={() => applyDiscount(pct)}>{pct === 0 ? "Без скидки" : `-${pct}%`}</Pill>
              ))}
            </div>

            <div style={{ fontSize: 11, color: C.textMuted, margin: "0 0 6px", fontWeight: 600 }}>Продавец</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
              {sellers.map((s) => <Pill key={s.id} active={seller === s.id} onClick={() => setSeller(s.id)}>{s.name}</Pill>)}
            </div>
            <button
              onClick={confirmSale}
              style={{
                width: "100%", padding: 14, borderRadius: 14, border: "none", cursor: "pointer",
                background: done ? C.green : gradCoral, color: done ? "#0A0A0F" : "#fff", fontWeight: 800, fontSize: 14,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              {done ? <><Check size={16} /> Продано!</> : `Подтвердить продажу — ${price ? Number(price).toLocaleString("ru-RU") : 0} с`}
            </button>
          </>
        )}
      </Card>

      <Card>
        <div style={{ ...fontDisplay, fontSize: 15, color: C.text, marginBottom: 10 }}>Последние продажи</div>
        {todaySales.length === 0 && <div style={{ fontSize: 12, color: C.textFaint }}>Продаж пока нет</div>}
        {todaySales.map((s) => {
          const prod = products.find((p) => p.id === s.productId);
          const sel = sellers.find((sl) => sl.id === s.sellerId);
          return (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderTop: `1px solid ${C.borderSoft}` }}>
              <div>
                <div style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{prod?.name}</div>
                <div style={{ fontSize: 10, color: C.textFaint }}>{sel?.name}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 800, color: C.green, ...fontMono }}>+{money(s.price)}</div>
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function dateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const ROTATION_EPOCH = new Date(2026, 0, 1);

function ShiftCalendar({ sellers, rotationOrder, setRotationOrder, overrides, setOverrides, canEdit, highlightSellerId }) {
  const now = new Date();
  const [viewDate, setViewDate] = useState({ year: now.getFullYear(), month: now.getMonth() });
  const { year, month } = viewDate;
  const monthLabel = new Date(year, month, 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
  const isCurrentMonthView = year === now.getFullYear() && month === now.getMonth();

  function prevMonth() {
    setViewDate((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }));
  }
  function nextMonth() {
    setViewDate((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }));
  }
  function goToday() {
    setViewDate({ year: now.getFullYear(), month: now.getMonth() });
  }

  const order = rotationOrder.map((id) => sellers.find((s) => s.id === id)).filter(Boolean);

  function sellerForDate(date) {
    const key = dateKey(date);
    if (overrides[key] !== undefined) {
      return sellers.find((s) => s.id === overrides[key]) || null;
    }
    if (order.length === 0) return null;
    const diffDays = Math.floor((date - ROTATION_EPOCH) / 86400000);
    const idx = ((Math.floor(diffDays / 3) % order.length) + order.length) % order.length;
    return order[idx];
  }

  function move(id, dir) {
    setRotationOrder((prev) => {
      const idx = prev.indexOf(id);
      const swap = idx + dir;
      if (swap < 0 || swap >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[swap]] = [next[swap], next[idx]];
      return next;
    });
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1);
  const leadBlanks = (firstDay.getDay() + 6) % 7;
  const cells = [];
  for (let i = 0; i < leadBlanks; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const [editDay, setEditDay] = useState(null);

  function assignDay(date, sellerId) {
    const key = dateKey(date);
    setOverrides((prev) => {
      const next = { ...prev };
      if (sellerId === null) delete next[key];
      else next[key] = sellerId;
      return next;
    });
    setEditDay(null);
  }

  const weekLabels = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ ...fontDisplay, fontSize: 15, color: C.text, textTransform: "capitalize" }}>{monthLabel}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button onClick={prevMonth} style={{ width: 24, height: 24, borderRadius: 7, border: `1px solid ${C.border}`, background: "none", color: C.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={12} />
          </button>
          {!isCurrentMonthView && (
            <button onClick={goToday} style={{ padding: "0 8px", height: 24, borderRadius: 7, border: `1px solid ${C.border}`, background: "none", color: C.textMuted, cursor: "pointer", fontSize: 10, fontWeight: 700 }}>
              Сегодня
            </button>
          )}
          <button onClick={nextMonth} style={{ width: 24, height: 24, borderRadius: 7, border: `1px solid ${C.border}`, background: "none", color: C.text, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ArrowLeft size={12} style={{ transform: "rotate(180deg)" }} />
          </button>
        </div>
      </div>
      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 12 }}>
        {canEdit ? "Ротация по 3 дня — нажмите на день, чтобы поменять" : "Ваши дни подсвечены цветом"}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 4 }}>
        {weekLabels.map((w) => (
          <div key={w} style={{ textAlign: "center", fontSize: 9, color: C.textFaint, fontWeight: 700 }}>{w}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 3, marginBottom: 16 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const s = sellerForDate(d);
          const isToday = isCurrentMonthView && dateKey(d) === dateKey(now);
          const dim = highlightSellerId && s?.id !== highlightSellerId;
          return (
            <div
              key={i}
              onClick={() => canEdit && setEditDay(d)}
              style={{
                aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", cursor: canEdit ? "pointer" : "default",
                background: s ? `${s.color}22` : C.surface2,
                border: isToday ? `1px solid ${C.text}` : `1px solid ${C.borderSoft}`,
                opacity: dim ? 0.3 : 1,
              }}
            >
              <div style={{ fontSize: 10, fontWeight: isToday ? 800 : 600, color: C.text }}>{d.getDate()}</div>
              {s && (
                <div style={{ width: 13, height: 13, borderRadius: 4, background: s.color, marginTop: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 6, fontWeight: 800, color: "#0A0A0F" }}>
                  {s.initials}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 8, fontWeight: 600 }}>Порядок ротации</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {order.map((s, i) => (
          <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 8, background: s.id === highlightSellerId ? `${s.color}22` : C.surface2, borderRadius: 10, padding: "6px 10px" }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: s.color, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8.5, fontWeight: 800, color: "#0A0A0F" }}>{s.initials}</div>
            <div style={{ flex: 1, fontSize: 12, color: C.text, fontWeight: 600 }}>{s.name}</div>
            {canEdit && (
              <div style={{ display: "flex", gap: 4 }}>
                <button onClick={() => move(s.id, -1)} disabled={i === 0} style={{ width: 20, height: 20, borderRadius: 6, border: `1px solid ${C.border}`, background: "none", color: i === 0 ? C.textFaint : C.text, cursor: i === 0 ? "default" : "pointer", fontSize: 10 }}>↑</button>
                <button onClick={() => move(s.id, 1)} disabled={i === order.length - 1} style={{ width: 20, height: 20, borderRadius: 6, border: `1px solid ${C.border}`, background: "none", color: i === order.length - 1 ? C.textFaint : C.text, cursor: i === order.length - 1 ? "default" : "pointer", fontSize: 10 }}>↓</button>
              </div>
            )}
          </div>
        ))}
      </div>

      {editDay && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 50 }} onClick={() => setEditDay(null)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: C.bgElevated, borderRadius: "22px 22px 0 0", padding: 20, border: `1px solid ${C.border}`, borderBottom: "none" }}>
            <div style={{ ...fontDisplay, fontSize: 16, color: C.text, marginBottom: 4, textTransform: "capitalize" }}>
              {editDay.toLocaleDateString("ru-RU", { day: "numeric", month: "long" })}
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Кто выходит в этот день?</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sellers.map((s) => (
                <div key={s.id} onClick={() => assignDay(editDay, s.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 10, background: C.surface2, cursor: "pointer" }}>
                  <div style={{ width: 22, height: 22, borderRadius: 7, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#0A0A0F" }}>{s.initials}</div>
                  <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{s.name}</span>
                </div>
              ))}
              <button onClick={() => assignDay(editDay, null)} style={{ marginTop: 4, padding: "9px 10px", borderRadius: 10, border: `1px solid ${C.border}`, background: "none", color: C.textMuted, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                Сбросить к ротации по умолчанию
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}

function Team({ sellers, setSellers, sales, products, role, rotationOrder, setRotationOrder, overrides, setOverrides }) {
  const isOwner = role === "owner";
  const me = !isOwner ? sellers.find((s) => s.id === role) : null;

  const [subTab, setSubTab] = useState("list");
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [genPass, setGenPass] = useState(generatePassword());
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removePassInput, setRemovePassInput] = useState("");
  const [removeError, setRemoveError] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passSaved, setPassSaved] = useState(false);
  const [bonusInputs, setBonusInputs] = useState({});

  function addSeller() {
    if (!name) return;
    const palette = [C.violet, C.cyan, C.gold, C.coral];
    const id = Date.now();
    setSellers((prev) => [...prev, {
      id, name, age: age || null, initials: name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2),
      rating: 5.0, color: palette[prev.length % palette.length], onShift: false, password: genPass, bonus: 0,
    }]);
    setRotationOrder((prev) => [...prev, id]);
    setName(""); setAge(""); setGenPass(generatePassword()); setShowAdd(false);
  }
  function confirmRemove() {
    if (!removeTarget) return;
    if (removePassInput !== removeTarget.password) {
      setRemoveError("Неверный пароль продавца");
      return;
    }
    setSellers((prev) => prev.filter((s) => s.id !== removeTarget.id));
    setRotationOrder((prev) => prev.filter((id) => id !== removeTarget.id));
    setRemoveTarget(null); setRemovePassInput(""); setRemoveError("");
  }
  function toggleShift(id) {
    setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, onShift: !s.onShift } : s)));
  }
  function sellerStats(id) {
    const own = sales.filter((s) => s.sellerId === id);
    const revenue = own.reduce((s, x) => s + x.price, 0);
    const commission = Math.round(revenue * 0.03);
    const bonus = sellers.find((s) => s.id === id)?.bonus || 0;
    return { count: own.length, revenue, commission, bonus, total: 1000 + commission + bonus };
  }
  function savePassword() {
    if (!newPass || !me) return;
    setSellers((prev) => prev.map((s) => (s.id === me.id ? { ...s, password: newPass } : s)));
    setNewPass(""); setPassSaved(true);
    setTimeout(() => setPassSaved(false), 1500);
  }
  function giveBonus(id) {
    const amount = Number(bonusInputs[id]);
    if (!amount) return;
    setSellers((prev) => prev.map((s) => (s.id === id ? { ...s, bonus: (s.bonus || 0) + amount } : s)));
    setBonusInputs((prev) => ({ ...prev, [id]: "" }));
  }

  // ---- Seller's own profile (owner-wide data hidden) ----
  if (!isOwner) {
    if (!me) return <div style={{ color: C.textFaint, fontSize: 13 }}>Аккаунт не найден</div>;
    const st = sellerStats(me.id);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: me.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0A0A0F", fontSize: 16 }}>{me.initials}</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>{me.name}</div>
              <RatingStars value={me.rating} />
            </div>
          </div>
        </Card>

        <Card style={{ background: "linear-gradient(135deg, rgba(139,92,246,0.14), rgba(34,211,200,0.14))" }}>
          <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>Мой заработок за смену</div>
          <div style={{ ...fontDisplay, fontSize: 24, color: C.text, marginTop: 4 }}>{money(st.total)}</div>
          <div style={{ fontSize: 11, color: C.textFaint, marginTop: 2 }}>база 1 000 с + 3% от {st.count} продаж ({money(st.commission)}){st.bonus > 0 ? ` + премия ${money(st.bonus)}` : ""}</div>
        </Card>

        <ShiftCalendar sellers={sellers} rotationOrder={rotationOrder} setRotationOrder={setRotationOrder} overrides={overrides} setOverrides={setOverrides} canEdit={false} highlightSellerId={me.id} />

        <Card>
          <div style={{ ...fontDisplay, fontSize: 14, color: C.text, marginBottom: 10 }}>Сменить пароль</div>
          <Field label="Новый пароль" value={newPass} onChange={setNewPass} placeholder="Введите новый пароль" mono />
          <button onClick={savePassword} style={{ marginTop: 10, width: "100%", padding: 12, borderRadius: 12, border: "none", background: passSaved ? C.green : gradPrism, color: "#0A0A0F", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
            {passSaved ? "Пароль обновлён ✓" : "Сохранить пароль"}
          </button>
        </Card>
      </div>
    );
  }

  // ---- Owner view ----
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ ...fontDisplay, fontSize: 17, color: C.text }}>Команда</div>
        {subTab === "list" && (
          <button onClick={() => setShowAdd(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "8px 12px", color: C.text, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
            <UserPlus size={14} /> Добавить
          </button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        <Pill active={subTab === "list"} onClick={() => setSubTab("list")}>Продавцы</Pill>
        <Pill active={subTab === "shifts"} onClick={() => setSubTab("shifts")}>Смены</Pill>
      </div>

      {subTab === "shifts" && (
        <ShiftCalendar sellers={sellers} rotationOrder={rotationOrder} setRotationOrder={setRotationOrder} overrides={overrides} setOverrides={setOverrides} canEdit={true} />
      )}

      {subTab === "list" && (
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {sellers.length === 0 && <div style={{ fontSize: 12, color: C.textFaint, textAlign: "center", padding: 24 }}>Продавцов пока нет</div>}
        {sellers.map((s) => {
          const st = sellerStats(s.id);
          return (
            <Card key={s.id} onClick={() => setSelectedSeller(selectedSeller === s.id ? null : s.id)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#0A0A0F", fontSize: 13, flexShrink: 0 }}>
                  {s.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{s.name}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <RatingStars value={s.rating} />
                    <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 999, background: s.onShift ? "rgba(52,211,153,0.15)" : C.surface2, color: s.onShift ? C.green : C.textFaint, fontWeight: 700 }}>
                      {s.onShift ? "на смене" : "не на смене"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleShift(s.id); }}
                  style={{ fontSize: 11, fontWeight: 700, padding: "6px 10px", borderRadius: 8, border: `1px solid ${C.border}`, background: "none", color: C.textMuted, cursor: "pointer" }}
                >
                  {s.onShift ? "Завершить" : "На смену"}
                </button>
              </div>

              {selectedSeller === s.id && (
                <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.borderSoft}` }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ flex: 1, background: C.surface2, borderRadius: 12, padding: 10 }}>
                      <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>Продажи</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.text, ...fontMono }}>{st.count}</div>
                    </div>
                    <div style={{ flex: 1, background: C.surface2, borderRadius: 12, padding: 10 }}>
                      <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>Выручка</div>
                      <div style={{ fontSize: 15, fontWeight: 800, color: C.text, ...fontMono }}>{money(st.revenue)}</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 8, background: "linear-gradient(135deg, rgba(139,92,246,0.12), rgba(34,211,200,0.12))", borderRadius: 12, padding: 10 }}>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600 }}>Заработок за смену (1000 с + 3%)</div>
                    <div style={{ fontSize: 17, fontWeight: 800, color: C.text, ...fontMono }}>{money(st.total)}</div>
                    <div style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>база 1 000 с + комиссия {money(st.commission)}{st.bonus > 0 ? ` + премия ${money(st.bonus)}` : ""}</div>
                  </div>

                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 10, color: C.textMuted, fontWeight: 600, marginBottom: 6 }}>Выдать премию (за отличную работу)</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      <input
                        value={bonusInputs[s.id] || ""}
                        onChange={(e) => setBonusInputs((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        placeholder="Сумма, сом"
                        style={{ flex: 1, boxSizing: "border-box", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 12px", color: C.text, fontSize: 12, outline: "none", ...fontMono }}
                      />
                      <button onClick={() => giveBonus(s.id)} style={{ padding: "0 14px", borderRadius: 10, border: "none", background: gradGold, color: "#0A0A0F", fontSize: 12, fontWeight: 800, cursor: "pointer" }}>
                        Выдать
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setRemoveTarget(s)}
                    style={{ marginTop: 10, width: "100%", padding: 10, borderRadius: 10, border: `1px solid rgba(255,107,129,0.3)`, background: "rgba(255,107,129,0.08)", color: C.coral, fontWeight: 700, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, cursor: "pointer" }}
                  >
                    <Trash2 size={13} /> Уволить продавца
                  </button>
                </div>
              )}
            </Card>
          );
        })}
      </div>
      )}

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bgElevated, borderRadius: "22px 22px 0 0", padding: 20, border: `1px solid ${C.border}`, borderBottom: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ ...fontDisplay, fontSize: 17, color: C.text }}>Новый продавец</div>
              <X size={20} color={C.textMuted} onClick={() => setShowAdd(false)} style={{ cursor: "pointer" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Field label="Имя и фамилия" value={name} onChange={setName} placeholder="Аида К." />
              <Field label="Возраст" value={age} onChange={setAge} placeholder="24" mono />
              <div>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6, fontWeight: 600 }}>Пароль для входа</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={genPass} onChange={(e) => setGenPass(e.target.value)} style={{ flex: 1, boxSizing: "border-box", background: C.surface2, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 12px", color: C.text, fontSize: 13, outline: "none", ...fontMono }} />
                  <button onClick={() => setGenPass(generatePassword())} style={{ padding: "0 12px", borderRadius: 10, border: `1px solid ${C.border}`, background: "none", color: C.textMuted, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>Ещё</button>
                </div>
                <div style={{ fontSize: 10, color: C.textFaint, marginTop: 6 }}>Продавец сможет сменить пароль после первого входа</div>
              </div>
              <button onClick={addSeller} style={{ marginTop: 6, width: "100%", padding: 14, borderRadius: 14, border: "none", background: gradPrism, color: "#0A0A0F", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
                Создать аккаунт
              </button>
            </div>
          </div>
        </div>
      )}

      {removeTarget && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", zIndex: 50 }} onClick={() => { setRemoveTarget(null); setRemovePassInput(""); setRemoveError(""); }}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.bgElevated, borderRadius: "22px 22px 0 0", padding: 20, border: `1px solid ${C.border}`, borderBottom: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <AlertCircle size={18} color={C.coral} />
              <div style={{ ...fontDisplay, fontSize: 16, color: C.text }}>Увольнение: {removeTarget.name}</div>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 14 }}>Для подтверждения введите текущий пароль продавца. Это защищает от увольнения без его ведома.</div>
            <Field label="Пароль продавца" value={removePassInput} onChange={(v) => { setRemovePassInput(v); setRemoveError(""); }} placeholder="Пароль" mono />
            {removeError && <div style={{ fontSize: 11, color: C.coral, marginTop: 6, fontWeight: 600 }}>{removeError}</div>}
            <button onClick={confirmRemove} style={{ marginTop: 14, width: "100%", padding: 14, borderRadius: 14, border: "none", background: gradCoral, color: "#fff", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
              Подтвердить увольнение
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const periodData = {
  "День": { revenue: 39400, profit: 16800, delta: 6, payroll: 3200 },
  "Неделя": { revenue: 276300, profit: 116000, delta: 18, payroll: 15300 },
  "Месяц": { revenue: 1042000, profit: 438000, delta: 12, payroll: 61300 },
  "Год": { revenue: 8930000, profit: 3620000, delta: 24, payroll: 633000 },
};

function Analytics({ products, sales, sellers, role }) {
  const [period, setPeriod] = useState("Неделя");
  const invValue = products.reduce((s, p) => s + p.price * p.stock, 0);
  const maxSeller = Math.max(...sellerLeaderboard.map(s => s.revenue));
  const pd = periodData[period];
  const isOwner = role === "owner";
  const me = !isOwner ? sellers.find((s) => s.id === role) : null;

  if (!isOwner) {
    const own = sales.filter((s) => s.sellerId === me?.id);
    const revenue = own.reduce((s, x) => s + x.price, 0);
    const commission = Math.round(revenue * 0.03);
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <Card style={{ background: gradPrism }}>
          <div style={{ fontSize: 11, color: "rgba(10,10,15,0.7)", fontWeight: 700 }}>МОЯ ВЫРУЧКА ЗА СМЕНУ</div>
          <div style={{ ...fontDisplay, fontSize: 26, color: "#0A0A0F" }}>{money(revenue)}</div>
          <div style={{ fontSize: 12, color: "rgba(10,10,15,0.75)", marginTop: 4, fontWeight: 600 }}>{own.length} продаж · заработок {money(1000 + commission)}</div>
        </Card>
        <Card>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <AlertCircle size={15} color={C.textFaint} />
            <div style={{ fontSize: 12, color: C.textMuted }}>Статистику по всей команде и складу видит только владелец.</div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
        {["День", "Неделя", "Месяц", "Год"].map((p) => (
          <Pill key={p} active={period === p} onClick={() => setPeriod(p)}>{p}</Pill>
        ))}
      </div>

      <Card>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 2 }}>
          <div style={{ ...fontDisplay, fontSize: 15, color: C.text }}>Выручка · {period.toLowerCase()}</div>
          <div style={{ fontSize: 12, color: C.green, fontWeight: 700 }}>+{pd.delta}%</div>
        </div>
        <div style={{ ...fontDisplay, fontSize: 24, color: C.text, marginBottom: 6 }}>{money(pd.revenue)}</div>
        <div style={{ height: 140 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weekRevenue}>
              <defs>
                <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.violet} stopOpacity={0.5} />
                  <stop offset="100%" stopColor={C.violet} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: C.textFaint, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ background: C.bgElevated, border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 12 }} labelStyle={{ color: C.text }} formatter={(v) => [money(v), "Выручка"]} />
              <Area type="monotone" dataKey="value" stroke={C.violet} strokeWidth={2.5} fill="url(#rev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <div style={{ display: "flex", gap: 10 }}>
        <StatCard label={`Чистая прибыль · ${period.toLowerCase()}`} value={money(pd.profit)} delta={pd.delta - 6} icon={<DollarSign size={14} color="#0A0A0F" />} grad={gradCoral} />
        <StatCard label="Стоимость склада" value={money(invValue)} icon={<Package size={14} color="#0A0A0F" />} grad={gradGold} />
      </div>

      <StatCard label={`Расходы на зарплату · ${period.toLowerCase()}`} value={money(pd.payroll)} icon={<Users size={14} color="#0A0A0F" />} grad={gradPrism} />
      <Card>
        <div style={{ ...fontDisplay, fontSize: 15, color: C.text, marginBottom: 8 }}>Продажи по часам</div>
        <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Пик — 17:00–18:00</div>
        <div style={{ height: 110 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={hourlyData}>
              <XAxis dataKey="h" tick={{ fill: C.textFaint, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Bar dataKey="v" radius={[4, 4, 0, 0]}>
                {hourlyData.map((d, i) => (
                  <Cell key={i} fill={d.v >= 18 ? C.cyan : `${C.cyan}66`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <Award size={16} color={C.gold} />
          <div style={{ ...fontDisplay, fontSize: 15, color: C.text }}>Рейтинг продавцов</div>
        </div>
        {sellerLeaderboard.map((s, i) => (
          <div key={s.name} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
              <span style={{ color: C.text, fontWeight: 600 }}>{i + 1}. {s.name}</span>
              <span style={{ color: C.textMuted, ...fontMono }}>{money(s.revenue)}</span>
            </div>
            <div style={{ height: 6, borderRadius: 4, background: C.surface2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(s.revenue / maxSeller) * 100}%`, background: s.color, borderRadius: 4 }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 10.5, color: C.textFaint, marginTop: 4 }}>Премию лидеру можно выдать на вкладке «Команда»</div>
      </Card>

      <Card>
        <div style={{ ...fontDisplay, fontSize: 15, color: C.text, marginBottom: 10 }}>Топ товаров</div>
        {topProducts.map((p, i) => (
          <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", borderTop: i ? `1px solid ${C.borderSoft}` : "none" }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: p.color, flexShrink: 0 }} />
            <div style={{ flex: 1, fontSize: 12, color: C.text, fontWeight: 600 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: C.textMuted, ...fontMono }}>{p.units} шт</div>
          </div>
        ))}
      </Card>
    </div>
  );
}

// ---------- Login ----------
function LoginScreen({ sellers, onLogin }) {
  const [selected, setSelected] = useState("owner");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit() {
    const entered = password.trim();
    if (selected === "owner") {
      if (entered === OWNER_PASSWORD) onLogin("owner");
      else setError("Неверный пароль");
      return;
    }
    const seller = sellers.find((s) => s.id === selected);
    if (seller && entered === seller.password) onLogin(seller.id);
    else setError("Неверный пароль");
  }

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: C.bg, display: "flex", flexDirection: "column", justifyContent: "center", padding: 24, boxSizing: "border-box", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: gradPrism, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
          <Glasses size={26} color="#0A0A0F" />
        </div>
        <div style={{ ...fontDisplay, fontSize: 20, color: C.text }}>OPTIC HUB</div>
        <div style={{ fontSize: 12, color: C.textFaint, marginTop: 4 }}>Войдите в аккаунт магазина</div>
      </div>

      <div style={{ fontSize: 11, color: C.textMuted, fontWeight: 600, marginBottom: 8 }}>Аккаунт</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16, maxHeight: 220, overflowY: "auto" }}>
        <div
          onClick={() => { setSelected("owner"); setError(""); }}
          style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer", background: selected === "owner" ? C.surface2 : "transparent", border: `1px solid ${selected === "owner" ? C.border : "transparent"}` }}
        >
          <div style={{ width: 30, height: 30, borderRadius: 9, background: C.surface2, border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: C.text }}>АД</div>
          <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Владелец</span>
        </div>
        {sellers.map((s) => (
          <div
            key={s.id}
            onClick={() => { setSelected(s.id); setError(""); }}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 12, cursor: "pointer", background: selected === s.id ? C.surface2 : "transparent", border: `1px solid ${selected === s.id ? C.border : "transparent"}` }}
          >
            <div style={{ width: 30, height: 30, borderRadius: 9, background: s.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#0A0A0F" }}>{s.initials}</div>
            <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{s.name}</span>
          </div>
        ))}
        {sellers.length === 0 && <div style={{ fontSize: 11, color: C.textFaint, padding: "6px 4px" }}>Продавцов пока нет — добавьте их на вкладке «Команда»</div>}
      </div>

      <div style={{ position: "relative" }}>
        <Field
          label="Пароль"
          value={password}
          onChange={(v) => { setPassword(v); setError(""); }}
          placeholder="Введите пароль"
          mono
          onEnter={submit}
        />
      </div>
      {error && <div style={{ fontSize: 11, color: C.coral, marginTop: 6, fontWeight: 600 }}>{error}</div>}
      <div style={{ fontSize: 10, color: C.textFaint, marginTop: 8 }}>Демо: пароль владельца — {OWNER_PASSWORD}</div>

      <button onClick={submit} style={{ marginTop: 16, width: "100%", padding: 14, borderRadius: 14, border: "none", background: gradPrism, color: "#0A0A0F", fontWeight: 800, fontSize: 14, cursor: "pointer" }}>
        Войти
      </button>
    </div>
  );
}

// ---------- App shell ----------
const TABS = [
  { id: "home", label: "Главная", icon: Home },
  { id: "inventory", label: "Склад", icon: Package },
  { id: "sales", label: "Продажа", icon: ShoppingBag },
  { id: "team", label: "Команда", icon: Users },
  { id: "analytics", label: "Аналитика", icon: BarChart3 },
];

export default function OpticApp() {
  const [tab, setTab] = useState("home");
  const [products, setProducts] = useState(initialProducts);
  const [sellers, setSellers] = useState(initialSellers);
  const [sales, setSales] = useState([]);
  const [rotationOrder, setRotationOrder] = useState(initialSellers.map((s) => s.id));
  const [shiftOverrides, setShiftOverrides] = useState({});
  const [role, setRole] = useState(null); // null (logged out) | "owner" | sellerId
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const isOwner = role === "owner";
  const me = role && !isOwner ? sellers.find((s) => s.id === role) : null;

  function logout() {
    setRole(null);
    setShowRoleMenu(false);
    setTab("home");
  }

  function resetTestData() {
    setProducts([]);
    setSellers([]);
    setSales([]);
    setRotationOrder([]);
    setShiftOverrides({});
    setShowReset(false);
    logout();
  }

  if (!role) {
    return <LoginScreen sellers={sellers} onLogin={setRole} />;
  }

  return (
    <div style={{
      maxWidth: 420, margin: "0 auto", minHeight: "100vh", background: C.bg,
      display: "flex", flexDirection: "column", fontFamily: "system-ui, -apple-system, sans-serif",
      position: "relative",
    }}>
      {/* Header */}
      <div style={{ padding: "18px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: gradPrism, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Glasses size={17} color="#0A0A0F" />
          </div>
          <div>
            <div style={{ ...fontDisplay, fontSize: 16, color: C.text, lineHeight: 1 }}>OPTIC HUB</div>
            <div style={{ fontSize: 10, color: C.textFaint, marginTop: 2 }}>{isOwner ? "Владелец · панель управления" : `${me?.name} · продавец`}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {isOwner && (
            <button onClick={() => setShowReset(true)} title="Очистить тестовые данные" style={{ width: 30, height: 30, borderRadius: "50%", background: "none", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <RotateCcw size={13} color={C.textFaint} />
            </button>
          )}
          <button onClick={logout} title="Выйти из аккаунта" style={{ width: 30, height: 30, borderRadius: "50%", background: "none", border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
            <LogOut size={13} color={C.textFaint} />
          </button>
          <div style={{ position: "relative" }}>
            <div
              onClick={() => setShowRoleMenu((v) => !v)}
              style={{
                width: 34, height: 34, borderRadius: "50%",
                background: isOwner ? C.surface2 : me?.color,
                border: `1px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 800, color: isOwner ? C.text : "#0A0A0F", cursor: "pointer",
              }}
            >
              {isOwner ? "АД" : me?.initials}
            </div>
            {showRoleMenu && (
              <>
                <div onClick={() => setShowRoleMenu(false)} style={{ position: "fixed", inset: 0, zIndex: 40 }} />
                <div style={{
                  position: "absolute", top: 42, right: 0, background: C.bgElevated, border: `1px solid ${C.border}`,
                  borderRadius: 14, padding: 6, zIndex: 41, minWidth: 180, boxShadow: "0 12px 30px rgba(0,0,0,0.5)",
                }}>
                  <div style={{ fontSize: 10, color: C.textFaint, fontWeight: 700, padding: "6px 10px" }}>ТЕКУЩИЙ АККАУНТ</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, background: C.surface2 }}>
                    <div style={{ width: 22, height: 22, borderRadius: 7, background: isOwner ? C.surface2 : me?.color, border: isOwner ? `1px solid ${C.border}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: isOwner ? C.text : "#0A0A0F" }}>
                      {isOwner ? "АД" : me?.initials}
                    </div>
                    <span style={{ fontSize: 12.5, color: C.text, fontWeight: 600 }}>{isOwner ? "Владелец" : me?.name}</span>
                  </div>
                  <div onClick={logout} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 10px", borderRadius: 10, cursor: "pointer", marginTop: 2 }}>
                    <LogOut size={14} color={C.coral} />
                    <span style={{ fontSize: 12.5, color: C.coral, fontWeight: 600 }}>Выйти из аккаунта</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: "4px 16px 100px" }}>
        {tab === "home" && <Dashboard products={products} sellers={sellers} setTab={setTab} />}
        {tab === "inventory" && <Inventory products={products} setProducts={setProducts} />}
        {tab === "sales" && <SalesScreen products={products} setProducts={setProducts} sellers={sellers} sales={sales} setSales={setSales} />}
        {tab === "team" && <Team sellers={sellers} setSellers={setSellers} sales={sales} products={products} role={role} rotationOrder={rotationOrder} setRotationOrder={setRotationOrder} overrides={shiftOverrides} setOverrides={setShiftOverrides} />}
        {tab === "analytics" && <Analytics products={products} sales={sales} sellers={sellers} role={role} />}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 420,
        background: "rgba(15,15,22,0.9)", backdropFilter: "blur(20px)", borderTop: `1px solid ${C.border}`,
        display: "flex", padding: "10px 8px calc(10px + env(safe-area-inset-bottom))",
      }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                flex: 1, background: "none", border: "none", cursor: "pointer",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "6px 0",
              }}
            >
              <Icon size={20} color={active ? C.text : C.textFaint} strokeWidth={active ? 2.4 : 2} />
              <span style={{ fontSize: 9.5, fontWeight: active ? 700 : 500, color: active ? C.text : C.textFaint }}>{t.label}</span>
              {active && <div style={{ width: 4, height: 4, borderRadius: "50%", background: gradPrism }} />}
            </button>
          );
        })}
      </div>

      {showReset && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "flex-end", justifyContent: "center", zIndex: 60 }} onClick={() => setShowReset(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: "100%", maxWidth: 420, background: C.bgElevated, borderRadius: "22px 22px 0 0", padding: 20, border: `1px solid ${C.border}`, borderBottom: "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <AlertCircle size={18} color={C.coral} />
              <div style={{ ...fontDisplay, fontSize: 16, color: C.text }}>Очистить тестовые данные?</div>
            </div>
            <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 16 }}>
              Удалятся все товары, продавцы, продажи и график смен, добавленные для проверки. Действие нельзя отменить — используйте, когда закончите тестировать и готовы начать работать с чистого листа.
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowReset(false)} style={{ flex: 1, padding: 13, borderRadius: 14, border: `1px solid ${C.border}`, background: "none", color: C.textMuted, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
                Отмена
              </button>
              <button onClick={resetTestData} style={{ flex: 1, padding: 13, borderRadius: 14, border: "none", background: gradCoral, color: "#fff", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>
                Очистить всё
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
