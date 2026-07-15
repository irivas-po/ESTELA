import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  LayoutGrid, Shirt, Plus, Calendar as CalendarIcon, UserCircle, Camera,
  Heart, RotateCw, X, ChevronLeft, ChevronRight, Check, ArrowLeft, Info
} from 'lucide-react';

/* ----------------------------- design tokens ----------------------------- */
const INK = '#0A0A0A', PAPER = '#FAFAFA', GRAY = '#999', LIGHT = '#CCC';
const BORDER = 'rgba(0,0,0,0.08)';
const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";
const MONO = "'Space Mono', 'JetBrains Mono', ui-monospace, monospace";
const SANS = "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
const shadowSm = '0 1px 3px rgba(0,0,0,0.08)';
const shadowMd = '0 6px 18px rgba(0,0,0,0.10)';
const shadowLg = '0 14px 34px rgba(0,0,0,0.13)';
const shadowXl = '0 24px 60px rgba(0,0,0,0.22)';
const DW = 380, DH = 822; // fixed iPhone design size (~9:19.5)

const mono = (size = 11, color = GRAY, weight = 700) => ({
  fontFamily: MONO, fontSize: size, letterSpacing: '0.13em',
  textTransform: 'uppercase', color, fontWeight: weight,
});
const serif = (size, color = INK, weight = 400) => ({ fontFamily: SERIF, fontSize: size, color, fontWeight: weight });

/* -------------------------------- data ---------------------------------- */
const PALETAS = {
  Primavera: ["#FF6B6B", "#FFD93D", "#FFAB91", "#A8E6CF", "#FFF3E0", "#FF8A65", "#DCE775", "#FFCC80"],
  Otoño: ["#BF360C", "#F9A825", "#558B2F", "#880E4F", "#FFF8E1", "#6D4C41", "#E65100", "#827717"],
  Verano: ["#CE93D8", "#F48FB1", "#81D4FA", "#CFD8DC", "#80CBC4", "#B39DDB", "#EF9A9A", "#A5D6A7"],
  Invierno: ["#0A0A0A", "#FAFAFA", "#D32F2F", "#1565C0", "#00695C", "#6A1B9A", "#F50057", "#00838F"],
};

const ESTETICAS = [
  { name: "Minimal", desc: "Menos es más. Piezas clave, colores neutros.", g: ["#F0F0F0", "#E0E0E0"] },
  { name: "Streetwear", desc: "Oversized, gráficos, sneakers.", g: ["#E8E8E8", "#D0D0D0"] },
  { name: "Clásico", desc: "Atemporal. Blazers, camisas, piezas atemporales.", g: ["#F5F5F0", "#E8E8E0"] },
  { name: "Bohemio", desc: "Texturas, capas, estampados naturales.", g: ["#F0EDE8", "#E5E0D8"] },
  { name: "Sport Luxe", desc: "Athleisure elevado. Funcional y estético.", g: ["#E5E8E8", "#D8DCDC"] },
  { name: "Vanguardia", desc: "Experimental, oversized, deconstruido.", g: ["#E0E0E5", "#D0D0D8"] },
];

const GARMENTS = [
  { id: 1, name: "Camisa Oxford Blanca", category: "Tops", mainColor: "#F8F8F8", bgColor: "#F0EDE8", dots: ["#F8F8F8", "#E8E8E8"], material: "Algodón", pattern: "Liso", formality: 4, seasons: ["Primavera", "Verano", "Otoño", "Invierno"], uses: 18, lastWorn: "Hace 3 días", daysAgo: 3, outfitsWith: ["of-1", "ev-2"] },
  { id: 2, name: "Camiseta Negra Básica", category: "Tops", mainColor: "#1A1A1A", bgColor: "#E8E8E8", dots: ["#1A1A1A", "#2A2A2A"], material: "Algodón", pattern: "Liso", formality: 2, seasons: ["Primavera", "Verano", "Otoño", "Invierno"], uses: 32, lastWorn: "Ayer", daysAgo: 1, outfitsWith: ["ca-1", "of-3"] },
  { id: 3, name: "Blazer Gris Oversize", category: "Outer", mainColor: "#6B6B6B", bgColor: "#E5E5E5", dots: ["#6B6B6B", "#8A8A8A"], material: "Lana", pattern: "Liso", formality: 4, seasons: ["Otoño", "Invierno"], uses: 8, lastWorn: "Hace 5 días", daysAgo: 5, outfitsWith: ["of-1", "ca-3", "ev-1"] },
  { id: 4, name: "Jeans Slim Oscuros", category: "Bottoms", mainColor: "#2C3E6B", bgColor: "#D8DEE8", dots: ["#2C3E6B", "#1A2744"], material: "Denim", pattern: "Liso", formality: 2, seasons: ["Primavera", "Verano", "Otoño", "Invierno"], uses: 25, lastWorn: "Hoy", daysAgo: 0, outfitsWith: ["of-3", "ca-1", "ca-3"] },
  { id: 5, name: "Chino Beige", category: "Bottoms", mainColor: "#D4C5A9", bgColor: "#EDE8DF", dots: ["#D4C5A9", "#BFB08A"], material: "Algodón", pattern: "Liso", formality: 3, seasons: ["Primavera", "Verano"], uses: 14, lastWorn: "Hace 4 días", daysAgo: 4, outfitsWith: ["of-2"] },
  { id: 6, name: "Falda Midi Plisada", category: "Bottoms", mainColor: "#1A1A1A", bgColor: "#E0E0E0", dots: ["#1A1A1A"], material: "Poliéster", pattern: "Plisado", formality: 4, seasons: ["Otoño", "Invierno"], uses: 6, lastWorn: "Hace 32 días", daysAgo: 32, outfitsWith: ["of-1", "ci-1", "ci-2", "ev-2"] },
  { id: 7, name: "Sneakers Blancos", category: "Calzado", mainColor: "#F5F5F5", bgColor: "#EAEAEA", dots: ["#F5F5F5", "#E0E0E0"], material: "Cuero", pattern: "Liso", formality: 1, seasons: ["Primavera", "Verano", "Otoño", "Invierno"], uses: 30, lastWorn: "Hoy", daysAgo: 0, outfitsWith: ["ca-1", "ca-2"] },
  { id: 8, name: "Botines Chelsea", category: "Calzado", mainColor: "#1A1A1A", bgColor: "#E0E0E0", dots: ["#1A1A1A", "#3A3A3A"], material: "Cuero", pattern: "Liso", formality: 4, seasons: ["Otoño", "Invierno"], uses: 12, lastWorn: "Hace 2 días", daysAgo: 2, outfitsWith: ["of-1", "ci-1", "ci-2", "ev-1"] },
  { id: 9, name: "Suéter Crema Cuello Alto", category: "Tops", mainColor: "#F5E6D3", bgColor: "#F0EBE3", dots: ["#F5E6D3", "#E8D5BE"], material: "Cashmere", pattern: "Liso", formality: 3, seasons: ["Otoño", "Invierno"], uses: 9, lastWorn: "Hace 6 días", daysAgo: 6, outfitsWith: ["of-2", "ca-3", "ci-1"] },
  { id: 10, name: "Vestido Camisero Oliva", category: "Tops", mainColor: "#558B2F", bgColor: "#E4EBD8", dots: ["#558B2F", "#6B9B3F"], material: "Lino", pattern: "Liso", formality: 3, seasons: ["Primavera", "Verano"], uses: 4, lastWorn: "Hace 34 días", daysAgo: 34, outfitsWith: ["ca-2", "ev-1"] },
  { id: 11, name: "Bufanda Gris Jaspeada", category: "Accesorios", mainColor: "#9E9E9E", bgColor: "#EAEAEA", dots: ["#9E9E9E", "#B0B0B0", "#808080"], material: "Lana", pattern: "Jaspeado", formality: 2, seasons: ["Otoño", "Invierno"], uses: 5, lastWorn: "Hace 41 días", daysAgo: 41, outfitsWith: ["ca-3"] },
  { id: 12, name: "Bolso Tote Negro", category: "Accesorios", mainColor: "#2A2A2A", bgColor: "#E0E0E0", dots: ["#2A2A2A", "#1A1A1A"], material: "Cuero", pattern: "Liso", formality: 3, seasons: ["Primavera", "Verano", "Otoño", "Invierno"], uses: 22, lastWorn: "Ayer", daysAgo: 1, outfitsWith: ["of-1", "of-2", "ca-2"] },
];

const OUTFITS_BY_OCCASION = {
  Oficina: [
    { id: "of-1", name: "Power Meeting", occasion: "Oficina", colors: ["#FFFFFF", "#1A1A1A", "#1A1A1A", "#6B6B6B"], bodyTip: "Falda midi + blazer entallado: silueta profesional que respeta tu curva natural de reloj de arena", colorTip: "Negro + blanco + gris: base neutra ejecutiva — añade un accesorio en terracota para calidez" },
    { id: "of-2", name: "Smart Friday", occasion: "Oficina", colors: ["#F5E6D3", "#D4C5A9", "#F5F5F5"], bodyTip: "El suéter cuello alto define tu torso, el chino recto equilibra la cadera — proporción perfecta", colorTip: "Full paleta Otoño: crema y beige son tus colores estrella del día a día" },
    { id: "of-3", name: "Directora Creativa", occasion: "Oficina", colors: ["#1A1A1A", "#2C3E6B", "#1A1A1A", "#6B6B6B"], bodyTip: "Jeans slim + blazer: marca cintura natural sin esfuerzo. El blazer oversize crea drama arriba", colorTip: "Base total oscura — rompe con un labial terracota o bufanda mostaza" },
    { id: "of-4", name: "Oficina sin Corbata", occasion: "Oficina", colors: ["#F8F8F8", "#D4C5A9", "#1A1A1A"], bodyTip: "Camisa oxford + chino beige: sencillez profesional y cómoda para días de foco", colorTip: "Tonos tierra suaves que armonizan con tu subtono cálido otoñal" },
  ],
  Casual: [
    { id: "ca-1", name: "Domingo Relax", occasion: "Casual", colors: ["#1A1A1A", "#2C3E6B", "#F5F5F5"], bodyTip: "Camiseta + jeans slim: lo básico que nunca falla para tu silueta reloj de arena", colorTip: "Negro + blanco: base neutra que puedes elevar con accesorios en mostaza o terracota" },
    { id: "ca-2", name: "Lino & Relax", occasion: "Casual", colors: ["#558B2F", "#558B2F", "#F5F5F5"], bodyTip: "El vestido camisero crea cintura definida sin esfuerzo — agrega un cinturón para más definición", colorTip: "Oliva es clave en tu paleta Otoño — combínalo con accesorios en chocolate y crema" },
    { id: "ca-3", name: "Capas de Otoño", occasion: "Casual", colors: ["#F5E6D3", "#2C3E6B", "#F5F5F5", "#6B6B6B"], bodyTip: "Capas estructuradas sin ocultar tu silueta — el blazer da forma, la bufanda da volumen arriba", colorTip: "Crema + gris: combinación otoñal sofisticada que armoniza con tu subtono cálido" },
    { id: "ca-4", name: "Monocromo Urbano", occasion: "Casual", colors: ["#1A1A1A", "#2C3E6B", "#F5F5F5"], bodyTip: "Camiseta negra + jeans slim oscuros: contraste que estiliza y aporta un aire minimalista", colorTip: "La base oscura es ideal para resaltar tus rasgos otoñales con un pop de color" },
  ],
  Cita: [
    { id: "ci-1", name: "Minimal Chic", occasion: "Cita", colors: ["#F5E6D3", "#1A1A1A", "#1A1A1A"], bodyTip: "La falda midi aporta movimiento y feminidad. El suéter cuello alto equilibra la proporción arriba", colorTip: "Crema + negro: contraste elegante con base otoñal — labios en terracota completarían el look" },
    { id: "ci-2", name: "Noche Elegante", occasion: "Cita", colors: ["#1A1A1A", "#1A1A1A", "#1A1A1A", "#6B6B6B"], bodyTip: "Blazer + falda midi: silueta dramática que alarga tu cuerpo y define la cintura", colorTip: "Total look oscuro con texturas — añade aretes dorados para calidez otoñal" },
  ],
  Evento: [
    { id: "ev-1", name: "Cocktail Otoñal", occasion: "Evento", colors: ["#558B2F", "#1A1A1A", "#1A1A1A", "#6B6B6B"], bodyTip: "Vestido + blazer estructurado: combo perfecto para eventos semi-formales en tu silueta", colorTip: "Oliva profundo es statement puro en tu paleta Otoño — destaca sin gritar" },
    { id: "ev-2", name: "Gala Minimal", occasion: "Evento", colors: ["#FFFFFF", "#1A1A1A", "#1A1A1A"], bodyTip: "Camisa entallada + falda midi: proporciones clásicas que honran tu reloj de arena", colorTip: "Blanco + negro con textura: elegancia atemporal. Añade un clutch en burdeos" },
  ],
};
const OUTFITS_DATA = [...OUTFITS_BY_OCCASION.Oficina, ...OUTFITS_BY_OCCASION.Casual, ...OUTFITS_BY_OCCASION.Cita, ...OUTFITS_BY_OCCASION.Evento];

const MAKEUP_LOOKS = [
  { name: "Otoño Natural", vibe: "Día a día", steps: [{ area: "BASE", desc: "BB Cream tono cálido medio", color: "#D4A574" }, { area: "OJOS", desc: "Sombra marrón dorado + delineado", color: "#8B6914" }, { area: "LABIOS", desc: "Terracota mate", color: "#BF360C" }, { area: "MEJILLAS", desc: "Blush melocotón suave", color: "#FFAB91" }], tip: "Para tu rostro ovalado: aplica el blush en las manzanas difuminando hacia las sienes. Tu proporción equilibrada permite blush generoso." },
  { name: "Power Glam", vibe: "Noche", steps: [{ area: "BASE", desc: "Base luminosa alta cobertura", color: "#D4A574" }, { area: "OJOS", desc: "Smokey en burdeos + máscara", color: "#880E4F" }, { area: "LABIOS", desc: "Burdeos cremoso", color: "#880E4F" }, { area: "MEJILLAS", desc: "Contorno bronce + highlight", color: "#F9A825" }], tip: "Tu rostro ovalado permite smokey eyes intenso sin perder equilibrio. El burdeos es perfecto para tu paleta Otoño." },
  { name: "Glow Minimal", vibe: "Oficina", steps: [{ area: "BASE", desc: "Tinted moisturizer con SPF", color: "#D4A574" }, { area: "OJOS", desc: "Máscara marrón + cejas peinadas", color: "#6D4C41" }, { area: "LABIOS", desc: "Lip oil en miel", color: "#E65100" }, { area: "MEJILLAS", desc: "Cream blush cálido", color: "#FFAB91" }], tip: "Tu subtono cálido brilla con menos producto — deja que tu piel hable. El lip oil en miel potencia el dorado natural." },
];

const HAIRSTYLES = [
  { id: 1, name: "Ondas Sueltas", occasion: "Casual", icon: "〰", desc: "Ondas naturales desde el medio del cabello. Raya al centro o lateral.", tip: "Ideal para cara ovalada: las ondas solo enmarcan tu rostro de manera natural." },
  { id: 2, name: "Cola Baja Elegante", occasion: "Oficina", icon: "◎", desc: "Cola baja con raya al medio, mechones sueltos enmarcando el rostro.", tip: "Alarga sutilmente tu rostro ovalado — perfecto para meetings." },
  { id: 3, name: "Moño Relajado", occasion: "Cita", icon: "●", desc: "Moño bajo, ligeramente despeinado, con mechones al frente.", tip: "Despeja tu cara ovalada y resalta tu jawline — elegante sin esfuerzo." },
  { id: 4, name: "Liso con Volumen", occasion: "Evento", icon: "▽", desc: "Brushing con volumen en la raíz, puntas hacia adentro.", tip: "El volumen en la raíz añade drama sin desequilibrar tus proporciones." },
  { id: 5, name: "Trenza Lateral", occasion: "Casual", icon: "⟡", desc: "Trenza lateral suelta, empezando desde la sien. Textura bohemia.", tip: "La asimetría juega bien con caras ovaladas — añade interés visual." },
];

const APRIL_LOG = {
  3: { morning: 'ca-1', afternoon: 'ca-1' }, 4: { morning: 'of-2' }, 6: { morning: 'ca-3' },
  8: { morning: 'of-1' }, 9: {}, 10: { morning: 'of-3' }, 11: { morning: 'of-2', night: 'ci-1' },
  12: { morning: 'ca-2' }, 15: { morning: 'ca-4' }, 16: { morning: 'of-4' }, 17: { morning: 'of-1' },
  18: { morning: 'ca-1', night: 'ci-2' }, 19: { morning: 'ca-3' }, 20: { morning: 'ev-1' },
  22: { morning: 'of-4', night: 'ci-1' }, 23: { morning: 'of-3' }, 24: { morning: 'ca-4' },
  25: { morning: 'ca-1' }, 26: { morning: 'of-2' }, 27: { morning: 'ca-2' }, 28: { morning: 'of-1' },
};

const getOutfitById = (id) => {
  const o = OUTFITS_DATA.find(x => x.id === id);
  if (!o) return null;
  let garments = [{ name: "Top", color: o.colors[0] }, { name: "Bottom", color: o.colors[1] }, { name: "Calzado", color: o.colors[2] }];
  if (o.id === 'of-4') garments = [{ name: "Camisa Oxford Blanca", color: "#F8F8F8" }, { name: "Chino Beige", color: "#D4C5A9" }, { name: "Botines Chelsea", color: "#1A1A1A" }];
  else if (o.id === 'ci-1') garments = [{ name: "Suéter Crema", color: "#F5E6D3" }, { name: "Falda Midi", color: "#1A1A1A" }, { name: "Botines Chelsea", color: "#1A1A1A" }, { name: "Bufanda Gris", color: "#9E9E9E" }];
  else if (o.id === 'ca-1') garments = [{ name: "Camiseta Negra", color: "#1A1A1A" }, { name: "Jeans Slim", color: "#2C3E6B" }, { name: "Sneakers Blancos", color: "#F5F5F5" }, { name: "Bolso Tote", color: "#2A2A2A" }];
  return { ...o, garments };
};

/* ---------------------------- small components --------------------------- */
const IconBtn = ({ icon: Icon, onClick, style, size = 20 }) => (
  <button onClick={onClick} style={{ border: 'none', cursor: 'pointer', background: 'transparent', padding: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, ...style }}>
    <Icon size={size} strokeWidth={2} />
  </button>
);

const BodyShapeSVG = ({ type }) => (
  <svg viewBox="0 0 40 80" style={{ width: '100%', height: '100%', color: INK, opacity: 0.82 }}>
    {type === "Reloj de Arena" && <path d="M10,10 C20,10 20,10 30,10 C25,35 25,45 30,75 C20,75 20,75 10,75 C15,45 15,35 10,10" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Triángulo" && <path d="M20,10 L35,75 L5,75 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Triángulo Invertido" && <path d="M5,10 L35,10 L20,75 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Rectángulo" && <rect x="8" y="10" width="24" height="65" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Óvalo" && <ellipse cx="20" cy="42.5" rx="14" ry="32.5" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "No estoy seguro/a" && <text x="20" y="48" textAnchor="middle" fontSize="20" fill="currentColor">?</text>}
  </svg>
);

const FaceShapeSVG = ({ type }) => (
  <svg viewBox="0 0 40 40" style={{ width: '100%', height: '100%', color: INK, opacity: 0.82 }}>
    {type === "Ovalada" && <ellipse cx="20" cy="20" rx="10" ry="14" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Redonda" && <circle cx="20" cy="20" r="12" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Cuadrada" && <rect x="10" y="8" width="20" height="24" rx="4" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Corazón" && <path d="M20,32 C12,24 8,20 8,14 C8,10 12,8 16,8 C18,8 20,10 20,10 C20,10 22,8 24,8 C28,8 32,10 32,14 C32,20 28,24 20,32" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Alargada" && <ellipse cx="20" cy="20" rx="8" ry="16" fill="none" stroke="currentColor" strokeWidth="1.5" />}
    {type === "Diamante" && <path d="M20,6 L30,20 L20,34 L10,20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />}
  </svg>
);

const MiniAvatar = ({ top, bottom, shoes, size = 36 }) => (
  <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
    <circle cx="18" cy="6" r="3" fill="#0A0A0A" />
    <rect x="10" y="10" width="16" height="12" rx="2" fill={top} />
    <rect x="12" y="22" width="12" height="10" rx="1" fill={bottom} />
    <rect x="11" y="32" width="14" height="3" rx="1" fill={shoes} />
  </svg>
);

const DetailedAvatar = ({ outfit, w = 60, h = 85 }) => {
  if (!outfit) return null;
  const g = outfit.garments || [];
  const find = (...keys) => g.find(x => keys.some(k => x.name.toLowerCase().includes(k)))?.color;
  const top = find('top', 'camisa', 'suéter', 'camiseta') || outfit.colors[0];
  const bottom = find('bottom', 'chino', 'jeans', 'falda', 'pantal') || outfit.colors[1];
  const shoes = find('calzado', 'botín', 'botines', 'zapa', 'sneaker') || outfit.colors[2];
  const outer = find('outer', 'blazer') || (outfit.colors.length > 3 ? outfit.colors[3] : null);
  const accessory = find('bolso');
  const scarf = find('bufanda');
  return (
    <svg width={w} height={h} viewBox="0 0 60 85" fill="none">
      <circle cx="30" cy="8" r="6" fill="#0A0A0A" />
      <rect x="27" y="14" width="6" height="4" fill={top} />
      <rect x="12" y="18" width="36" height="24" rx="4" fill={top} />
      <rect x="6" y="18" width="10" height="6" rx="2" fill={top} />
      <rect x="44" y="18" width="10" height="6" rx="2" fill={top} />
      {outer && <rect x="8" y="16" width="44" height="28" rx="4" fill={outer} fillOpacity="0.6" />}
      <rect x="16" y="44" width="11" height="28" rx="3" fill={bottom} />
      <rect x="33" y="44" width="11" height="28" rx="3" fill={bottom} />
      <rect x="14" y="72" width="15" height="6" rx="3" fill={shoes} />
      <rect x="31" y="72" width="15" height="6" rx="3" fill={shoes} />
      {accessory && <rect x="50" y="30" width="8" height="12" rx="2" fill={accessory} />}
      {scarf && <rect x="20" y="14" width="20" height="6" rx="2" fill={scarf} />}
    </svg>
  );
};

const Stars = ({ n }) => <span>{[1, 2, 3, 4, 5].map(v => v <= n ? '★' : '☆').join('')}</span>;

/* ================================== APP ================================== */
export default function App() {
  const [step, setStep] = useState(1);
  const [showReveal, setShowReveal] = useState(false);
  const [activeScreen, setActiveScreen] = useState("home");
  const [activeFilter, setActiveFilter] = useState("Todo");
  const [expandedOutfitId, setExpandedOutfitId] = useState(null);
  const [expandedHairId, setExpandedHairId] = useState(null);
  const [expandedMakeupId, setExpandedMakeupId] = useState(null);

  const [activeClosetCategory, setActiveClosetCategory] = useState("Todo");
  const [closetSort, setClosetSort] = useState("Recientes");
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [isGarmentModalOpen, setIsGarmentModalOpen] = useState(false);

  const [addGarmentStep, setAddGarmentStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  const [shutter, setShutter] = useState(false);

  const carouselRef = useRef(null);

  const stageRef = useRef(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const compute = () => {
      const w = el.clientWidth, h = el.clientHeight;
      setScale(Math.min((w - 24) / DW, (h - 24) / DH, 1));
    };
    compute();
    let ro;
    if (typeof ResizeObserver !== 'undefined') { ro = new ResizeObserver(compute); ro.observe(el); }
    window.addEventListener('resize', compute);
    return () => { if (ro) ro.disconnect(); window.removeEventListener('resize', compute); };
  }, []);

  const [user, setUser] = useState({
    name: "Valentina", gender: "Femenino", height: 165, includeWeight: false, size: "M",
    bodyType: "Reloj de Arena", faceShape: "Ovalada", skinTone: "Cálido", station: "Otoño",
    estilos: ["Minimal", "Clásico"], itemsCount: 0,
  });

  const [analysis, setAnalysis] = useState({ active: false, type: 'body', step: 'camera', result: null });
  const [activeCalendarView, setActiveCalendarView] = useState('monthly');
  const [selectedCalendarDate, setSelectedCalendarDate] = useState(28);

  const filteredOutfits = useMemo(() => {
    if (activeFilter === "Todo") return [OUTFITS_BY_OCCASION.Oficina[0], OUTFITS_BY_OCCASION.Casual[0], OUTFITS_BY_OCCASION.Cita[0], OUTFITS_BY_OCCASION.Evento[0]];
    return OUTFITS_BY_OCCASION[activeFilter] || [];
  }, [activeFilter]);

  const startAnalysis = (type) => setAnalysis({ active: true, type, step: 'camera', result: null });
  const captureAnalysis = () => {
    setAnalysis(p => ({ ...p, step: 'processing' }));
    setTimeout(() => {
      const result = analysis.type === 'body' ? 'Reloj de Arena' : 'Ovalada';
      setAnalysis(p => ({ ...p, step: 'result', result }));
      setUser(u => ({ ...u, [analysis.type === 'body' ? 'bodyType' : 'faceShape']: result }));
    }, 2400);
  };
  const closeAnalysis = () => setAnalysis({ active: false, type: 'body', step: 'camera', result: null });
  const goNext = () => setStep(s => s + 1);
  const goBack = () => setStep(s => s - 1);

  const btnDark = { background: INK, color: '#fff', border: 'none', borderRadius: 14, padding: '15px 0', fontWeight: 700, cursor: 'pointer', fontFamily: SANS, fontSize: 15 };
  const pill = (active) => ({ padding: '9px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all .2s', border: active ? '1.5px solid ' + INK : '1.5px solid #DCDCDC', background: active ? INK : '#fff', color: active ? '#fff' : '#555' });

  /* ------------------------------ HOME ------------------------------ */
  const renderHome = () => (
    <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 96 }}>
      <header style={{ padding: '54px 24px 16px' }}>
        <h1 style={serif(24)}>Buenos días, Valentina</h1>
        <p style={{ fontSize: 13, color: '#BBB', marginTop: 2 }}>☁ 18°C · Bogotá</p>
      </header>

      <div style={{ padding: '0 24px', marginBottom: 24 }}>
        <div style={{ background: '#F5F5F5', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: '1px solid ' + BORDER }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 40, background: '#fff', borderRadius: 6, padding: 5, boxShadow: shadowSm }}><BodyShapeSVG type={user.bodyType} /></div>
            <div style={{ display: 'flex', gap: 4 }}>{PALETAS[user.station].slice(0, 3).map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: 999, background: c }} />)}</div>
            <span style={{ ...mono(10, INK), borderLeft: '1px solid ' + BORDER, paddingLeft: 12, lineHeight: 1.4 }}>{user.station} · {user.estilos.join(' & ')}</span>
          </div>
          <IconBtn icon={RotateCw} size={14} style={{ background: '#fff', boxShadow: shadowSm }} />
        </div>
      </div>

      <div className="hscroll" style={{ display: 'flex', gap: 8, padding: '0 24px', marginBottom: 22 }}>
        {["Todo", "Oficina", "Casual", "Cita", "Evento"].map(f => (
          <button key={f} onClick={() => { setActiveFilter(f); setExpandedOutfitId(null); }} style={{ ...pill(activeFilter === f), flexShrink: 0 }}>{f}</button>
        ))}
      </div>

      <div ref={carouselRef} className="hscroll snap" style={{ display: 'flex', gap: 12, padding: '0 24px 4px' }}>
        {filteredOutfits.map(o => {
          const exp = expandedOutfitId === o.id;
          return (
            <div key={activeFilter + o.id} onClick={() => setExpandedOutfitId(exp ? null : o.id)} className="snapitem fade-in" style={{ width: '82%', maxWidth: 300, minWidth: 260, background: '#fff', borderRadius: 16, boxShadow: shadowLg, padding: 14, position: 'relative', border: '1px solid ' + BORDER, alignSelf: 'flex-start', cursor: 'pointer' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, aspectRatio: '1 / 1', marginBottom: 16 }}>
                {o.colors.map((c, i) => {
                  let bg = '#F5E6E0';
                  if (c === '#2C3E6B') bg = '#E0E8F0';
                  if (c === '#558B2F') bg = '#E4EBD8';
                  if (['#0A0A0A', '#6B6B6B', '#1A1A1A'].includes(c)) bg = '#F0F0F0';
                  if (['#FFF8E1', '#F5E6D3'].includes(c)) bg = '#EDE8DF';
                  return <div key={i} style={{ borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: bg }}><div style={{ width: '100%', height: '100%', borderRadius: 8, background: c, boxShadow: shadowSm }} /></div>;
                })}
              </div>
              <div style={{ position: 'absolute', top: 22, right: 22, display: 'flex', flexDirection: 'column', gap: 8 }} onClick={e => e.stopPropagation()}>
                <button style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.92)', boxShadow: shadowSm, border: '1px solid ' + BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><Heart size={16} /></button>
                <button style={{ width: 32, height: 32, borderRadius: 999, background: 'rgba(255,255,255,0.92)', boxShadow: shadowSm, border: '1px solid ' + BORDER, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><RotateCw size={16} /></button>
              </div>
              <span style={mono(10)}>{o.occasion}</span>
              <h3 style={{ fontSize: 17, fontWeight: 700, margin: '4px 0' }}>{o.name}</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                <span style={{ padding: '3px 8px', borderRadius: 999, background: '#F5F5F5', fontSize: 10, fontWeight: 500, color: '#555' }}>✓ Para tu silueta</span>
                <span style={{ padding: '3px 8px', borderRadius: 999, background: '#F5F5F5', fontSize: 10, fontWeight: 500, color: '#555' }}>✓ Tu paleta</span>
              </div>
              {exp && (
                <div className="fade-in" style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 10 }}><p style={mono(9)}>Tu silueta reloj de arena</p><p style={{ ...serif(13), fontStyle: 'italic', lineHeight: 1.35, marginTop: 4 }}>{o.bodyTip}</p></div>
                  <div style={{ background: '#F8F8F6', borderRadius: 12, padding: 10 }}><p style={mono(9)}>Tu paleta otoño</p><p style={{ ...serif(13), fontStyle: 'italic', lineHeight: 1.35, marginTop: 4 }}>{o.colorTip}</p></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, margin: '18px 0 40px' }}>
        {filteredOutfits.map((_, i) => <div key={i} style={{ height: 4, borderRadius: 999, width: i === 0 ? 16 : 4, background: i === 0 ? INK : '#DCDCDC' }} />)}
      </div>

      <section style={{ padding: '0 24px', marginBottom: 44 }}>
        <h2 style={{ ...serif(20), lineHeight: 1.1 }}>Tus colores</h2>
        <p style={{ fontSize: 11, color: GRAY, marginBottom: 16 }}>Paleta Otoño</p>
        <div className="hscroll" style={{ display: 'flex', gap: 16 }}>
          {PALETAS.Otoño.slice(0, 6).map((c, i) => {
            const names = ["Terracota", "Mostaza", "Oliva", "Burdeos", "Crema", "Chocolate"];
            return <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}><div style={{ width: 32, height: 32, borderRadius: 999, background: c, border: '2px solid #fff', boxShadow: shadowSm }} /><span style={mono(8)}>{names[i]}</span></div>;
          })}
        </div>
      </section>

      <div style={{ height: 6, background: '#F3F3F3', marginBottom: 40 }} />

      <section style={{ marginBottom: 44 }}>
        <header style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}>
          <h2 style={serif(20)}>Maquillaje</h2><span style={{ fontSize: 11, color: GRAY }}>Rostro ovalado · Otoño</span>
        </header>
        <div className="hscroll snap" style={{ display: 'flex', gap: 16, padding: '0 24px' }}>
          {MAKEUP_LOOKS.map(look => {
            const e = expandedMakeupId === look.name;
            return (
              <div key={look.name} onClick={() => setExpandedMakeupId(e ? null : look.name)} className="snapitem" style={{ width: 250, minWidth: 250, background: '#fff', border: '1px solid #EBEBEB', borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', gap: 14, cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h3 style={{ fontSize: 15, fontWeight: 700 }}>{look.name}</h3><span style={{ padding: '2px 8px', borderRadius: 999, background: '#F3F3F3', ...mono(9, '#555') }}>{look.vibe}</span></div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {look.steps.map((s, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 28, height: 28, borderRadius: 8, background: s.color, boxShadow: shadowSm, border: '1px solid ' + BORDER, flexShrink: 0 }} /><div style={{ minWidth: 0 }}><p style={mono(9)}>{s.area}</p><p style={{ fontSize: 12, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.desc}</p></div></div>)}
                </div>
                {e && <div className="fade-in" style={{ paddingTop: 8, borderTop: '1px solid #F0F0F0' }}><p style={{ ...serif(12), fontStyle: 'italic', color: '#777', lineHeight: 1.35 }}>{look.tip}</p></div>}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ height: 6, background: '#F3F3F3', marginBottom: 40 }} />

      <section style={{ padding: '0 24px', marginBottom: 44 }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 22 }}><h2 style={serif(20)}>Peinados</h2><span style={{ fontSize: 11, color: GRAY }}>Cara ovalada · Otoño</span></header>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {HAIRSTYLES.map(hair => {
            const e = expandedHairId === hair.id;
            return (
              <div key={hair.id} onClick={() => setExpandedHairId(e ? null : hair.id)} style={{ background: '#fff', border: '1px solid #EBEBEB', borderRadius: 14, padding: 14, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: '#F3F3F3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{hair.icon}</div>
                  <div style={{ flex: 1 }}><h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{hair.name}</h3><p style={mono(10)}>{hair.occasion}</p></div>
                  <ChevronRight size={18} style={{ color: LIGHT, transform: e ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
                </div>
                {e && <div className="fade-in" style={{ paddingTop: 14, marginTop: 14, borderTop: '1px solid #F0F0F0' }}><p style={{ fontSize: 13, color: '#555', marginBottom: 8 }}>{hair.desc}</p><p style={{ ...serif(12), fontStyle: 'italic', color: GRAY }}>↳ {hair.tip}</p></div>}
              </div>
            );
          })}
        </div>
      </section>

      <div style={{ height: 6, background: '#F3F3F3', marginBottom: 40 }} />

      <section style={{ padding: '0 24px', marginBottom: 24 }}>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>Prendas olvidadas</h2>
        <div className="hscroll" style={{ display: 'flex', gap: 16 }}>
          {GARMENTS.slice(0, 8).map((p, i) => (
            <div key={p.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
              <div style={{ width: 64, height: 64, borderRadius: 999, border: '2px solid #EBEBEB', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: '#fff' }}><div style={{ width: '100%', height: '100%', borderRadius: 8, background: p.mainColor, boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)' }} /></div>
              <span style={mono(9)}>{[32, 28, 45, 12, 18, 50, 4, 15][i]} días</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  /* ------------------------------ CLOSET ------------------------------ */
  const renderCloset = () => {
    const cats = [{ name: "Todo", count: GARMENTS.length }, ...["Tops", "Bottoms", "Calzado", "Outer", "Accesorios"].map(n => ({ name: n, count: GARMENTS.filter(g => g.category === n).length }))];
    let list = activeClosetCategory === "Todo" ? GARMENTS : GARMENTS.filter(g => g.category === activeClosetCategory);
    list = [...list].sort((a, b) => closetSort === "Recientes" ? a.daysAgo - b.daysAgo : closetSort === "Más usadas" ? b.uses - a.uses : a.uses - b.uses);
    return (
      <div style={{ background: '#fff', minHeight: '100%', paddingBottom: 96 }}>
        <header style={{ padding: '52px 24px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}><h1 style={serif(24)}>Mi Armario</h1><span style={{ background: INK, color: '#fff', fontSize: 12, fontWeight: 600, padding: '2px 10px', borderRadius: 12 }}>{GARMENTS.length}</span></div>
          <p style={mono(11, '#AAA')}>Valor estimado: $2,400 · Costo/uso: $3.20</p>
        </header>
        <div className="hscroll" style={{ display: 'flex', gap: 20, padding: '0 20px', marginBottom: 16, borderBottom: '1px solid ' + BORDER }}>
          {cats.map(c => {
            const a = activeClosetCategory === c.name;
            return <button key={c.name} onClick={() => setActiveClosetCategory(c.name)} style={{ paddingBottom: 8, display: 'flex', alignItems: 'baseline', gap: 6, whiteSpace: 'nowrap', background: 'transparent', border: 'none', borderBottom: a ? '2.5px solid ' + INK : '2.5px solid transparent', cursor: 'pointer', color: a ? INK : '#AAA', fontWeight: a ? 600 : 400 }}><span style={{ fontSize: 14 }}>{c.name}</span><span style={{ fontSize: 10, opacity: 0.6 }}>({c.count})</span></button>;
          })}
        </div>
        <div style={{ padding: '0 20px', marginBottom: 16, display: 'flex', gap: 6, fontSize: 12 }}>
          {["Recientes", "Más usadas", "Menos usadas"].map((s, i) => (
            <React.Fragment key={s}><button onClick={() => setClosetSort(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: closetSort === s ? '#000' : '#BBB', fontWeight: closetSort === s ? 600 : 400 }}>{s}</button>{i < 2 && <span style={{ color: '#BBB' }}>·</span>}</React.Fragment>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, padding: '0 16px' }}>
          {list.map(g => (
            <div key={g.id} onClick={() => { setSelectedGarment(g); setIsGarmentModalOpen(true); }} className="fade-in" style={{ aspectRatio: '3 / 4', borderRadius: 14, background: '#F5F5F5', overflow: 'hidden', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 12, background: g.mainColor + '15' }}>
                <div style={{ backgroundColor: g.mainColor, boxShadow: shadowSm, ...(g.category === 'Tops' ? { width: '100%', height: '80%', borderRadius: '12px 12px 4px 4px' } : g.category === 'Bottoms' ? { width: '60%', height: '100%', borderRadius: 4 } : g.category === 'Calzado' ? { width: '80%', height: '40%', borderRadius: 6 } : { width: '40%', height: '40%', borderRadius: 999 }) }} />
              </div>
              <div style={{ height: 40, padding: 8, background: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <p style={{ fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div style={{ display: 'flex', gap: 3 }}>{g.dots.map((c, i) => <div key={i} style={{ width: 6, height: 6, borderRadius: 999, background: c, border: '1px solid ' + BORDER }} />)}</div><span style={mono(9, '#BBB')}>×{g.uses}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* --------------------------- ADD GARMENT --------------------------- */
  const renderAdd = () => {
    const save = () => { setActiveScreen("closet"); setAddGarmentStep(1); setShowAnalysisResult(false); };
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: PAPER }}>
        {addGarmentStep === 1 ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <header style={{ padding: '48px 24px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff' }}>
              <button onClick={() => setActiveScreen("home")} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}><ChevronLeft size={18} /> Atrás</button>
              <h2 style={{ fontSize: 16, fontWeight: 600, flex: 1, textAlign: 'center', paddingRight: 40 }}>Nueva prenda</h2>
            </header>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '12px 16px 24px' }}>
              <div style={{ flex: 0.75, background: '#1A1A1A', borderRadius: 20, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                {shutter && <div className="fade-in" style={{ position: 'absolute', inset: 0, background: '#fff', zIndex: 5 }} />}
                {[['top', 'left'], ['top', 'right'], ['bottom', 'left'], ['bottom', 'right']].map(([v, h], i) => <div key={i} style={{ position: 'absolute', [v]: 16, [h]: 16, width: 28, height: 28, [`border${v === 'top' ? 'Top' : 'Bottom'}`]: '2px solid rgba(255,255,255,0.8)', [`border${h === 'left' ? 'Left' : 'Right'}`]: '2px solid rgba(255,255,255,0.8)' }} />)}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, opacity: 0.3 }}><Shirt size={48} color="#fff" /><span style={{ fontSize: 14, color: '#fff' }}>Enfoca tu prenda</span></div>
                <div className="scanline" style={{ position: 'absolute', left: 24, right: 24, height: 1, background: 'rgba(255,255,255,0.3)', boxShadow: '0 0 8px rgba(255,255,255,0.4)' }} />
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 24 }}>
                <button onClick={() => { setShutter(true); setTimeout(() => setShutter(false), 150); setTimeout(() => { setIsAnalyzing(true); setAddGarmentStep(2); setTimeout(() => { setIsAnalyzing(false); setShowAnalysisResult(true); }, 2000); }, 300); }} style={{ width: 68, height: 68, borderRadius: 999, border: '3px solid #000', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', marginBottom: 12 }}><div style={{ width: 56, height: 56, background: '#000', borderRadius: 999 }} /></button>
                <p style={{ fontSize: 12, color: '#BBB', fontWeight: 500, letterSpacing: '0.04em' }}>Toca para capturar</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="slide-up" style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#fff' }}>
            <header style={{ padding: '48px 24px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid ' + BORDER }}>
              <button onClick={() => { setAddGarmentStep(1); setShowAnalysisResult(false); }} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}><ChevronLeft size={16} /> Reintentar</button>
              <span style={{ fontSize: 16, fontWeight: 600 }}>Nueva prenda</span><div style={{ width: 40 }} />
            </header>
            <div className="vscroll" style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
              <div style={{ borderRadius: 24, background: '#F8F8F8', height: 280, marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                {isAnalyzing ? (
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="spin" style={{ width: 64, height: 64, border: '4px solid rgba(0,0,0,0.06)', borderTopColor: '#000', borderRadius: 999, marginBottom: 16 }} />
                    <p style={mono(14, '#000')}>Analizando...</p>
                  </div>
                ) : (
                  <div className="fade-in" style={{ position: 'relative' }}><div style={{ width: 128, height: 176, background: '#2C5F8A', borderRadius: 8, transform: 'rotate(2deg)', boxShadow: shadowXl }} /><div style={{ position: 'absolute', top: -8, right: -8, background: '#000', color: '#fff', padding: '4px 8px', borderRadius: 4, fontSize: 10, fontWeight: 700 }}>98% MATCH</div></div>
                )}
              </div>
              {showAnalysisResult && (
                <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <h3 style={mono(10, '#BBB')}>Detección IA</h3>
                  {[{ l: "CATEGORÍA", v: "Top — Camisa", c: "94%" }, { l: "MATERIAL", v: "Algodón Oxford", c: "91%" }, { l: "PATRÓN", v: "Liso", c: "87%" }, { l: "ESTILO", v: "Smart Casual", c: "89%" }].map(r => (
                    <div key={r.l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: 12, background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0' }}><span style={mono(10)}>{r.l}</span><div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}><span style={{ fontSize: 13, fontWeight: 700 }}>{r.v}</span><span style={mono(9, '#CCC')}>{r.c}</span></div></div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: '#FAFAFA', borderRadius: 12, border: '1px solid #F0F0F0' }}><span style={mono(10)}>Colores detectados</span><div style={{ display: 'flex', gap: 6 }}>{["#2C5F8A", "#FFFFFF", "#D4D4D4"].map(c => <div key={c} style={{ width: 20, height: 20, borderRadius: 999, background: c, border: '1px solid ' + BORDER }} />)}</div></div>
                  <button onClick={save} style={{ ...btnDark, height: 56, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: shadowLg }}>Guardar en mi armario <Check size={18} /></button>
                  <button onClick={() => setAddGarmentStep(1)} style={{ background: 'none', border: 'none', color: '#BBB', fontSize: 13, fontWeight: 500, cursor: 'pointer', paddingBottom: 12 }}>Descartar y repetir</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  /* ------------------------------ CALENDAR ------------------------------ */
  const dayName = (d) => ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"][new Date(2026, 3, d).getDay()];

  const renderCalendarMonthly = () => {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const grid = [...Array.from({ length: 2 }, () => null), ...days]; // Apr 2026 starts Wed
    return (
      <div style={{ background: '#fff', minHeight: '100%', paddingTop: 48, paddingBottom: 96 }}>
        <header style={{ padding: '0 24px', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><ChevronLeft size={20} /><h2 style={serif(22)}>Abril 2026</h2><ChevronRight size={20} /></div>
          <div style={{ background: '#F5F5F5', padding: 4, borderRadius: 999, display: 'flex', gap: 4 }}><button style={{ padding: '6px 16px', borderRadius: 999, background: '#fff', fontSize: 12, fontWeight: 700, border: 'none', boxShadow: shadowSm }}>Mes</button><button onClick={() => setActiveCalendarView('daily')} style={{ padding: '6px 16px', borderRadius: 999, background: 'none', fontSize: 12, color: GRAY, border: 'none', cursor: 'pointer' }}>Hoy</button></div>
        </header>
        <div style={{ padding: '0 24px', marginBottom: 24 }}><p style={mono(11)}>18 outfits este mes · Racha: 5 días 🔥</p></div>

        <div style={{ marginBottom: 32 }}>
          <div style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}><h3 style={mono(10, '#BBB')}>Semana actual</h3><span style={{ fontSize: 11, color: '#DDD' }}>Abr 20 – 26</span></div>
          <div className="hscroll" style={{ display: 'flex', gap: 12, padding: '0 24px' }}>
            {[20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map(d => {
              const data = APRIL_LOG[d]; const cur = d === 28; const o = data?.morning ? getOutfitById(data.morning) : null;
              return (
                <div key={d} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={mono(10, '#AAA')}>{['D', 'L', 'M', 'M', 'J', 'V', 'S'][new Date(2026, 3, d).getDay()]}</span>
                  <button onClick={() => { setSelectedCalendarDate(d); setActiveCalendarView('daily'); }} style={{ width: 52, height: 52, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: cur ? 'none' : '1px solid #F0F0F0', background: cur ? '#000' : '#F8F8F8', color: cur ? '#fff' : '#000', boxShadow: cur ? shadowMd : 'none' }}>
                    {o && !cur ? <MiniAvatar top={o.colors[0]} bottom={o.colors[1]} shoes={o.colors[2]} size={32} /> : <span style={{ fontSize: 15, fontWeight: 700 }}>{d}</span>}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ padding: '0 16px', marginBottom: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', textAlign: 'center', marginBottom: 8, padding: '0 8px' }}>{['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => <span key={i} style={{ ...mono(10, '#AAA'), padding: '8px 0' }}>{d}</span>)}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 4 }}>
            {grid.map((d, i) => {
              if (!d) return <div key={i} />;
              const log = APRIL_LOG[d]; const today = d === 28; const future = d > 28; const cnt = log ? Object.keys(log).length : 0; const o = log?.morning ? getOutfitById(log.morning) : null;
              return (
                <div key={i} onClick={() => { if (!future) { setSelectedCalendarDate(d); setActiveCalendarView('daily'); } }} style={{ height: 56, borderRadius: 12, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: log ? '#F3F3F3' : 'transparent', opacity: future ? 0.3 : 1, cursor: future ? 'default' : 'pointer' }}>
                  <span style={{ position: 'absolute', top: 4, right: 4, ...mono(9), width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 999, background: today ? INK : 'transparent', color: today ? '#fff' : '#CCC' }}>{d}</span>
                  {o ? <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}><MiniAvatar top={o.colors[0]} bottom={o.colors[1]} shoes={o.colors[2]} size={36} />{cnt > 1 && <div style={{ display: 'flex', gap: 2, position: 'absolute', bottom: 6 }}>{Array.from({ length: cnt }).map((_, k) => <div key={k} style={{ width: 4, height: 4, borderRadius: 999, background: '#000' }} />)}</div>}</div> : !today && <span style={{ fontSize: 12, color: '#CCC', fontWeight: 500 }}>{d}</span>}
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: 1, background: '#EEE', margin: '0 24px 32px' }} />
        <section style={{ padding: '0 24px', marginBottom: 40 }}>
          <h2 style={{ ...serif(18), marginBottom: 16 }}>Tu mes en números</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div style={{ background: '#F5F5F5', borderRadius: 14, padding: 14, height: 126, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}><div style={{ width: 40, height: 40, borderRadius: 999, background: '#1A1A1A', boxShadow: shadowSm }} /><div><h4 style={{ fontSize: 13, fontWeight: 700 }}>Camiseta Negra</h4><p style={mono(10)}>Usada 12 veces</p></div></div>
            <div style={{ background: '#F5F5F5', borderRadius: 14, padding: 14, height: 126, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}><span style={serif(32)}>18</span><p style={{ fontSize: 11, color: GRAY, lineHeight: 1.2 }}>combinaciones diferentes</p></div>
            <div style={{ background: '#F5F5F5', borderRadius: 14, padding: 14, height: 126, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}><span style={serif(32, GRAY)}>3</span><div><p style={{ fontSize: 11, color: GRAY, lineHeight: 1.2 }}>prendas olvidadas</p><p style={{ fontSize: 9, color: '#BBB', marginTop: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Vestido Oliva, Bufanda…</p></div></div>
            <div style={{ background: '#F5F5F5', borderRadius: 14, padding: 14, height: 126, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}><span style={serif(32)}>5 🔥</span><p style={{ fontSize: 11, color: GRAY, lineHeight: 1.2 }}>días seguidos registrando</p></div>
          </div>
        </section>
      </div>
    );
  };

  const renderCalendarDaily = () => {
    const log = APRIL_LOG[selectedCalendarDate];
    const moments = [{ id: 'morning', label: 'Mañana', icon: '☀️', time: '7:00 – 12:00' }, { id: 'afternoon', label: 'Tarde', icon: '🌤', time: '12:00 – 19:00' }, { id: 'night', label: 'Noche', icon: '🌙', time: '19:00 – 23:00' }];
    const inDay = moments.map(m => { const id = log?.[m.id]; return id ? getOutfitById(id) : null; }).filter(Boolean);
    const uniq = Array.from(new Set(inDay.map(o => o.id))).map(id => inDay.find(o => o.id === id));
    const changeDay = (dir) => { const n = selectedCalendarDate + (dir === 'next' ? 1 : -1); if (n >= 1 && n <= 28) setSelectedCalendarDate(n); };
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: PAPER }}>
        <header style={{ background: '#fff', borderBottom: '1px solid #EBEBEB' }}>
          <div style={{ padding: '48px 24px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => setActiveCalendarView('monthly')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500 }}><ChevronLeft size={16} /> Volver</button>
            <div style={{ display: 'flex', gap: 16 }}><button onClick={() => changeDay('prev')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)' }}><ChevronLeft size={20} /></button><button onClick={() => changeDay('next')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.4)' }}><ChevronRight size={20} /></button></div>
          </div>
          <div className="hscroll" style={{ display: 'flex', gap: 4, padding: '0 16px 16px' }}>
            {Array.from({ length: 30 }, (_, i) => i + 1).map(d => {
              const sel = selectedCalendarDate === d;
              return <button key={d} onClick={() => setSelectedCalendarDate(d)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 50, flexShrink: 0, padding: '12px 0', borderRadius: 16, gap: 4, border: 'none', cursor: 'pointer', background: sel ? '#000' : 'transparent', color: sel ? '#fff' : '#BBB', boxShadow: sel ? shadowMd : 'none' }}><span style={mono(10, sel ? '#fff' : '#BBB')}>{dayName(d)[0]}</span><span style={{ fontSize: 15, fontWeight: 700 }}>{d}</span></button>;
            })}
          </div>
          <div style={{ padding: '16px 24px', borderTop: '1px solid #F8F8F8' }}>
            <h2 style={{ ...serif(24), lineHeight: 1.1 }}>{dayName(selectedCalendarDate)}, {selectedCalendarDate} de abril</h2>
            <span style={mono(11, '#BBB')}>☁ 17°C · Bogotá · 18 outfits</span>
          </div>
        </header>

        <div className="vscroll fade-in" key={selectedCalendarDate} style={{ flex: 1, overflowY: 'auto', paddingBottom: 120 }}>
          {uniq.length > 0 && (
            <section style={{ background: PAPER, borderBottom: '1px solid #EBEBEB', padding: '24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
                {uniq.map((o, i) => (
                  <React.Fragment key={o.id}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 80, height: 80, borderRadius: 999, background: '#EEE', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8 }}><DetailedAvatar outfit={o} w={56} h={80} /></div>
                      <div style={{ textAlign: 'center', width: 100 }}><p style={mono(9)}>{i === 0 ? 'Mañana' : 'Noche'}</p><p style={{ fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</p></div>
                    </div>
                    {i < uniq.length - 1 && <ChevronRight size={16} style={{ color: '#DDD', marginTop: -40 }} />}
                  </React.Fragment>
                ))}
              </div>
            </section>
          )}
          <div style={{ padding: 24, position: 'relative' }}>
            <div style={{ position: 'absolute', left: 24, top: 32, bottom: 60, width: 2, background: '#EBEBEB' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
              {moments.map(m => {
                const oid = log?.[m.id]; const o = oid ? getOutfitById(oid) : null;
                const sameAsMorning = m.id === 'afternoon' && log?.morning && oid === log.morning;
                const exp = expandedOutfitId === `${selectedCalendarDate}-${m.id}`;
                return (
                  <div key={m.id} style={{ position: 'relative', paddingLeft: 44 }}>
                    <div style={{ position: 'absolute', left: -23, top: 4, width: 10, height: 10, borderRadius: 999, background: o ? '#0A0A0A' : '#E0E0E0', zIndex: 2 }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}><span style={{ fontSize: 14 }}>{m.icon}</span><span style={{ fontSize: 13, fontWeight: 700 }}>{m.label}</span><span style={mono(11, '#BBB')}>{m.time}</span></div>
                    {sameAsMorning ? (
                      <div style={{ height: 44, background: '#F8F8F8', border: '1px dashed #DDD', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><p style={{ fontSize: 12, color: GRAY }}>↑ Mismo outfit de la mañana</p></div>
                    ) : o ? (
                      <div onClick={() => setExpandedOutfitId(exp ? null : `${selectedCalendarDate}-${m.id}`)} style={{ background: '#fff', borderRadius: 16, border: '1px solid #EBEBEB', padding: 16, boxShadow: shadowSm, cursor: 'pointer' }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                          <div style={{ width: 80, height: 100, background: '#F5F5F5', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 8, flexShrink: 0 }}><DetailedAvatar outfit={o} w={45} h={65} /></div>
                          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}><h3 style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.1 }}>{o.name}</h3><span style={{ ...mono(9), padding: '2px 8px', border: '1px solid #EEE', borderRadius: 999, color: GRAY }}>{o.occasion}</span></div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{o.garments.slice(0, 3).map((g, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}><div style={{ width: 8, height: 8, borderRadius: 999, background: g.color }} /><span style={{ fontSize: 11, color: '#777', fontWeight: 500 }}>{g.name}</span></div>)}{o.garments.length > 3 && <p style={{ fontSize: 11, color: '#BBB', marginLeft: 16 }}>+ {o.garments.length - 3} más</p>}</div>
                            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>{['😍', '😊', '😐', '😕', '😣'].map((em, i) => { const s = (o.id === 'ci-1' && i === 0) || (o.id === 'of-4' && i === 1) || (o.id === 'ca-1' && i === 1) || (o.id === 'ci-2' && i === 0); return <span key={i} style={{ fontSize: 16, opacity: s ? 1 : 0.2, transform: s ? 'scale(1.1)' : 'none' }}>{em}</span>; })}</div>
                          </div>
                        </div>
                        {exp && <div className="fade-in" style={{ paddingTop: 16, marginTop: 16, borderTop: '1px solid #F5F5F5' }}><div className="hscroll" style={{ display: 'flex', gap: 12, paddingBottom: 8 }}>{o.garments.map((g, i) => <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, flexShrink: 0 }}><div style={{ width: 48, height: 64, borderRadius: 8, background: g.color, border: '1px solid ' + BORDER }} /><span style={{ fontSize: 8, color: GRAY, maxWidth: 48, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{g.name}</span></div>)}</div><p style={{ ...serif(12), fontStyle: 'italic', color: GRAY, lineHeight: 1.35, marginTop: 8 }}>“{o.bodyTip}”</p></div>}
                      </div>
                    ) : (
                      <button style={{ width: '100%', height: 100, border: '1.5px dashed #DDD', borderRadius: 14, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#FBFBFB', cursor: 'pointer' }}><Plus size={20} color="#CCC" /><span style={{ fontSize: 13, fontWeight: 500, color: '#BBB' }}>Registrar outfit</span></button>
                    )}
                  </div>
                );
              })}
            </div>
            {inDay.length > 0 && (
              <div style={{ background: '#F8F8F6', borderRadius: 14, padding: 16, marginTop: 24, marginLeft: 44, border: '1px solid #F0F0EE' }}>
                <h4 style={mono(10, '#BBB')}>Resumen del día</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 12, fontWeight: 500, marginTop: 12 }}><span>{inDay.length} outfits</span><span style={{ color: '#DDD' }}>·</span><span>{Array.from(new Set(inDay.flatMap(o => o.garments.map(g => g.name)))).length} prendas</span><span style={{ color: '#DDD' }}>·</span><span>{Array.from(new Set(inDay.map(o => o.occasion))).length} categorías</span></div>
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 11, color: GRAY }}>Tu día:</span><span style={{ fontSize: 14 }}>{inDay.map(o => (o.id === 'ci-1' || o.id === 'ci-2') ? '😍' : '😊').join('')}</span></div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  /* --------------------------- GARMENT MODAL --------------------------- */
  const renderModal = () => {
    if (!isGarmentModalOpen || !selectedGarment) return null;
    const g = selectedGarment;
    return (
      <div style={{ position: 'absolute', inset: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
        <div className="fade-in" onClick={() => setIsGarmentModalOpen(false)} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)' }} />
        <div className="slide-up vscroll" style={{ background: '#fff', borderRadius: '20px 20px 0 0', maxHeight: '85%', overflowY: 'auto', position: 'relative', zIndex: 1001, paddingBottom: 32 }}>
          <div style={{ width: 40, height: 4, background: '#DDD', borderRadius: 999, margin: '12px auto 16px' }} />
          <div style={{ margin: '0 20px 24px' }}><div style={{ width: '100%', height: 220, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', background: g.bgColor, boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.08)' }}><div style={{ backgroundColor: g.mainColor, boxShadow: shadowMd, ...(g.category === 'Tops' ? { width: '40%', height: '70%', borderRadius: '20px 20px 10px 10px' } : g.category === 'Bottoms' ? { width: '25%', height: '90%', borderRadius: 10 } : g.category === 'Calzado' ? { width: '60%', height: '30%', borderRadius: 12 } : { width: '40%', height: '40%', borderRadius: 999 }) }} /></div></div>
          <div style={{ padding: '0 20px', marginBottom: 24 }}>
            <h2 style={{ ...serif(22), marginBottom: 4 }}>{g.name}</h2>
            <p style={{ fontSize: 12, color: GRAY, marginBottom: 4 }}>{g.material} · {g.pattern} · Formalidad <Stars n={g.formality} /></p>
            <p style={mono(11, '#BBB')}>Usada {g.uses} veces · Última vez: {g.lastWorn}</p>
          </div>
          <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24 }}>
            <section><h3 style={{ ...mono(10, '#BBB'), marginBottom: 12 }}>Detalles</h3><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}><span style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid #DDD', fontSize: 12 }}>{g.category}</span><span style={{ padding: '6px 14px', borderRadius: 999, border: '1px solid #DDD', fontSize: 12 }}>{g.material}</span>{["Primavera", "Verano", "Otoño", "Invierno"].map(s => { const a = g.seasons.includes(s); return <span key={s} style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, border: a ? '1px solid #000' : '1px solid #DDD', background: a ? '#000' : 'transparent', color: a ? '#fff' : GRAY }}>{s}</span>; })}</div></section>
            <section><h3 style={{ ...mono(10, '#BBB'), marginBottom: 12 }}>Formalidad</h3><div style={{ display: 'flex', alignItems: 'center', gap: 16 }}><span style={{ fontSize: 10, color: GRAY }}>Casual</span><div style={{ display: 'flex', gap: 6, flex: 1 }}>{[1, 2, 3, 4, 5].map(v => <div key={v} style={{ height: 12, flex: 1, borderRadius: 999, background: v <= g.formality ? '#000' : '#E0E0E0' }} />)}</div><span style={{ fontSize: 10, color: GRAY }}>Formal</span></div></section>
            <section><h3 style={{ ...mono(10, '#BBB'), marginBottom: 12 }}>Aparece en</h3><div className="hscroll" style={{ display: 'flex', gap: 12, paddingBottom: 8 }}>{g.outfitsWith.map(id => { const o = OUTFITS_DATA.find(x => x.id === id); if (!o) return null; return <div key={id} onClick={() => { setActiveScreen("home"); setIsGarmentModalOpen(false); }} style={{ width: 120, flexShrink: 0, cursor: 'pointer' }}><div style={{ aspectRatio: '1/1', background: '#F5F5F5', borderRadius: 12, padding: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>{o.colors.map((c, i) => <div key={i} style={{ borderRadius: 999, background: c, border: '1px solid ' + BORDER }} />)}</div><p style={{ fontSize: 10, fontWeight: 600, marginTop: 8, textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{o.name}</p></div>; })}</div></section>
            <div style={{ paddingTop: 8, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <button onClick={() => { setActiveScreen("home"); setIsGarmentModalOpen(false); }} style={{ ...btnDark, height: 48, fontSize: 14 }}>Generar outfit con esta prenda →</button>
              <button style={{ background: 'none', border: 'none', color: '#D32F2F', fontSize: 13, fontWeight: 500, cursor: 'pointer', padding: 8 }}>Eliminar prenda</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  /* ----------------------------- ONBOARDING ----------------------------- */
  const stepHeader = () => (
    <div style={{ padding: '48px 24px 16px', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, height: 32 }}>
        {step > 1 ? <IconBtn icon={ArrowLeft} onClick={goBack} style={{ background: 'rgba(255,255,255,0.5)', marginLeft: -8 }} /> : <div />}
        <div style={{ display: 'flex', gap: 6, flex: 1, justifyContent: 'center', maxWidth: 150 }}>{Array.from({ length: 8 }).map((_, i) => <div key={i} style={{ height: 4, flex: 1, borderRadius: 999, background: i < step ? INK : '#E5E5E5' }} />)}</div>
        <div style={{ width: 32 }} />
      </div>
    </div>
  );

  const onbBtn = (label, onClick, disabled) => <button onClick={onClick} disabled={disabled} style={{ ...btnDark, width: '100%', marginTop: 'auto', marginBottom: 8, opacity: disabled ? 0.3 : 1, cursor: disabled ? 'default' : 'pointer' }}>{label}</button>;
  const scanBtn = (type, label) => <button onClick={() => startAnalysis(type)} style={{ marginBottom: 24, width: '100%', padding: '15px 0', borderRadius: 16, border: '2px solid ' + INK, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, fontWeight: 700, cursor: 'pointer', color: INK, fontFamily: SANS }}><Camera size={20} /> {label}</button>;

  const renderOnboarding = () => {
    if (step === 1) return (
      <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, textAlign: 'center', background: '#fff' }}>
        <h1 style={{ ...serif(44), letterSpacing: 6, marginBottom: 8 }}>ESTELA</h1>
        <p style={{ fontSize: 15, color: GRAY, marginBottom: 48 }}>Descubramos tu estilo</p>
        <button onClick={goNext} style={{ ...btnDark, borderRadius: 999, padding: '14px 48px', boxShadow: shadowLg }}>Comenzar</button>
      </div>
    );
    if (step === 2) return (
      <div className="vscroll" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
        <h2 style={serif(26)}>Cuéntanos de ti</h2><p style={{ fontSize: 13, color: GRAY, marginBottom: 32 }}>Esto nos ayuda a entender tu silueta y proporción</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          <section><label style={{ ...mono(11), display: 'block', marginBottom: 16 }}>Género expresivo</label><div style={{ display: 'flex', gap: 12 }}>{["Femenino", "Masculino", "Fluido"].map(gx => <button key={gx} onClick={() => setUser({ ...user, gender: gx })} style={{ flex: 1, aspectRatio: '1/1', borderRadius: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer', border: user.gender === gx ? '2px solid ' + INK : '2px solid transparent', background: user.gender === gx ? '#fff' : '#F5F5F5' }}><div style={{ width: 32, height: 32, borderRadius: 999, border: '1px solid rgba(0,0,0,0.2)' }} /><span style={{ fontSize: 12, fontWeight: 500 }}>{gx}</span></button>)}</div></section>
          <section><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 16 }}><label style={mono(11)}>Estatura</label><div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}><span style={{ ...serif(30), fontWeight: 700 }}>{user.height}</span><span style={mono(10)}>cm</span></div></div><div style={{ position: 'relative', height: 32, display: 'flex', alignItems: 'center' }}><div style={{ position: 'absolute', width: '100%', height: 2, background: '#E5E5E5' }} /><input type="range" min="140" max="200" value={user.height} onChange={e => setUser({ ...user, height: parseInt(e.target.value) })} style={{ position: 'absolute', width: '100%', opacity: 0, cursor: 'pointer', height: '100%', zIndex: 2, margin: 0 }} /><div style={{ position: 'absolute', height: 20, width: 20, background: INK, borderRadius: 999, boxShadow: shadowMd, left: `${((user.height - 140) / 60) * 100}%`, transform: 'translateX(-50%)' }} /></div></section>
          <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}><div><label style={mono(11)}>¿Incluir peso?</label><p style={{ fontSize: 11, color: GRAY }}>Ayuda a refinar proporciones</p></div><button onClick={() => setUser({ ...user, includeWeight: !user.includeWeight })} style={{ width: 48, height: 28, borderRadius: 999, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: 4, background: user.includeWeight ? INK : '#DDD' }}><div style={{ width: 20, height: 20, background: '#fff', borderRadius: 999, boxShadow: shadowSm, transform: user.includeWeight ? 'translateX(20px)' : 'none', transition: 'transform .2s' }} /></button></section>
          <section><label style={{ ...mono(11), display: 'block', marginBottom: 16 }}>Talla general</label><div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>{["XS", "S", "M", "L", "XL", "XXL"].map(s => <button key={s} onClick={() => setUser({ ...user, size: s })} style={{ padding: '8px 20px', borderRadius: 999, fontSize: 13, fontWeight: 700, cursor: 'pointer', border: user.size === s ? '1px solid ' + INK : '1px solid #DDD', background: user.size === s ? INK : '#fff', color: user.size === s ? '#fff' : '#555' }}>{s}</button>)}</div></section>
        </div>
        {onbBtn("Siguiente →", goNext)}
      </div>
    );
    if (step === 3) return (
      <div className="vscroll" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
        <h2 style={serif(26)}>¿Cuál se parece más a tu silueta?</h2><p style={{ fontSize: 13, color: GRAY, marginBottom: 24 }}>Esto nos ayuda a sugerirte cortes ideales</p>
        {scanBtn('body', 'Escanear mi cuerpo con IA')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {["Reloj de Arena", "Triángulo", "Triángulo Invertido", "Rectángulo", "Óvalo", "No estoy seguro/a"].map(t => <button key={t} onClick={() => setUser({ ...user, bodyType: t })} style={{ borderRadius: 16, padding: 16, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, cursor: 'pointer', border: user.bodyType === t ? '2px solid ' + INK : '2px solid transparent', background: user.bodyType === t ? '#fff' : '#F5F5F5' }}><div style={{ height: 112, width: 64 }}><BodyShapeSVG type={t} /></div><span style={{ fontSize: 12, fontWeight: 600, textAlign: 'center', lineHeight: 1.1 }}>{t}</span></button>)}
        </div>
        {onbBtn("Siguiente →", goNext)}
      </div>
    );
    if (step === 4) return (
      <div className="vscroll" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
        <h2 style={serif(26)}>¿Qué forma tiene tu rostro?</h2><p style={{ fontSize: 13, color: GRAY, marginBottom: 24 }}>Esto nos ayuda con accesorios y cuellos</p>
        {scanBtn('face', 'Escanear mi rostro con IA')}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
          {["Ovalada", "Redonda", "Cuadrada", "Corazón", "Alargada", "Diamante"].map(t => <button key={t} onClick={() => setUser({ ...user, faceShape: t })} style={{ borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, cursor: 'pointer', border: user.faceShape === t ? '2px solid ' + INK : '2px solid transparent', background: user.faceShape === t ? '#fff' : '#F5F5F5' }}><div style={{ width: 48, height: 48 }}><FaceShapeSVG type={t} /></div><span style={{ fontSize: 12, fontWeight: 600 }}>{t}</span></button>)}
        </div>
        {onbBtn("Siguiente →", goNext)}
      </div>
    );
    if (step === 5) return (
      <div className="vscroll" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
        <h2 style={serif(26)}>Descubramos tus colores</h2><p style={{ fontSize: 13, color: GRAY, marginBottom: 32 }}>Tu paleta personal para que cada outfit te ilumine</p>
        <section style={{ marginBottom: 40 }}>
          <p style={{ ...mono(11), marginBottom: 16 }}>¿Cómo describirías tu tono de piel?</p>
          <div style={{ display: 'flex', gap: 12 }}>{[{ n: "Cálido", g: ["#F5D0A9", "#FAEBD7"] }, { n: "Frío", g: ["#E8D0E8", "#F0E6F6"] }, { n: "Neutro", g: ["#EDE8E0", "#F0EEEB"] }].map(t => <button key={t.n} onClick={() => setUser({ ...user, skinTone: t.n })} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 6, borderRadius: 14, cursor: 'pointer', border: user.skinTone === t.n ? '2px solid ' + INK : '2px solid transparent' }}><div style={{ width: '100%', aspectRatio: '1/1', borderRadius: 10, background: `linear-gradient(135deg, ${t.g[0]}, ${t.g[1]})` }} /><span style={{ fontSize: 11, fontWeight: 700 }}>{t.n}</span></button>)}</div>
        </section>
        <section><p style={{ ...mono(11), marginBottom: 16 }}>Estación de color</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>{(user.skinTone === "Cálido" ? ["Primavera", "Otoño"] : user.skinTone === "Frío" ? ["Verano", "Invierno"] : ["Primavera", "Otoño", "Verano", "Invierno"]).map(st => <button key={st} onClick={() => setUser({ ...user, station: st })} style={{ padding: 16, borderRadius: 16, textAlign: 'left', cursor: 'pointer', border: user.station === st ? '2px solid ' + INK : '2px solid transparent', background: user.station === st ? '#fff' : '#F5F5F5', boxShadow: user.station === st ? shadowMd : 'none' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}><span style={serif(18)}>{st}</span><span style={mono(9, '#BBB')}>{st === "Primavera" || st === "Otoño" ? 'cálido' : 'frío'} · vibrante</span></div><div style={{ display: 'flex', gap: 8 }}>{PALETAS[st].slice(0, 5).map(c => <div key={c} style={{ width: 24, height: 24, borderRadius: 999, background: c }} />)}</div></button>)}</div>
        </section>
        <div style={{ marginTop: 40, padding: 24, border: '1px solid #EEE', borderRadius: 20, background: '#fff', boxShadow: shadowSm }}>
          <h3 style={{ ...serif(20), textAlign: 'center', marginBottom: 16 }}>Tu paleta personal</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12 }}>{PALETAS[user.station].map(c => <div key={c} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}><div style={{ width: 40, height: 40, borderRadius: 999, background: c }} /><span style={mono(8)}>{c}</span></div>)}</div>
        </div>
        {onbBtn("Siguiente →", goNext)}
      </div>
    );
    if (step === 6) return (
      <div className="vscroll" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
        <h2 style={serif(26)}>¿Qué estéticas te atraen?</h2><p style={{ fontSize: 13, color: GRAY, marginBottom: 24 }}>Selecciona de 1 a 3</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {ESTETICAS.map(e => { const a = user.estilos.includes(e.name); return <button key={e.name} onClick={() => { if (a) setUser({ ...user, estilos: user.estilos.filter(x => x !== e.name) }); else if (user.estilos.length < 3) setUser({ ...user, estilos: [...user.estilos, e.name] }); }} style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', border: a ? '2px solid ' + INK : '2px solid transparent', background: '#fff', boxShadow: a ? 'none' : shadowSm, padding: 0 }}><div style={{ aspectRatio: '3/4', background: `linear-gradient(135deg, ${e.g[0]}, ${e.g[1]})`, opacity: 0.8 }} /><div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12, background: 'linear-gradient(to top, rgba(255,255,255,0.9), transparent)', textAlign: 'left' }}><span style={{ fontSize: 14, fontWeight: 700 }}>{e.name}</span><span style={{ fontSize: 10, color: '#666', lineHeight: 1.2, marginTop: 4 }}>{e.desc}</span></div>{a && <div style={{ position: 'absolute', top: 12, right: 12, width: 24, height: 24, background: INK, color: '#fff', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Check size={14} strokeWidth={3} /></div>}</button>; })}
        </div>
        {onbBtn("Siguiente →", goNext, user.estilos.length === 0)}
      </div>
    );
    if (step === 7) return (
      <div className="vscroll" style={{ height: '100%', display: 'flex', flexDirection: 'column', padding: 24, overflowY: 'auto' }}>
        <h2 style={{ ...serif(26), marginTop: 32 }}>Ahora, tu armario</h2><p style={{ fontSize: 13, color: GRAY, marginBottom: 32 }}>Sube al menos 5 prendas para tu primer outfit</p>
        <div onClick={() => setUser({ ...user, itemsCount: Math.min(5, user.itemsCount + 1) })} style={{ border: '1.5px dashed #CCC', borderRadius: 16, padding: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, background: '#fff', cursor: 'pointer' }}><Camera size={32} color={GRAY} /><p style={{ fontSize: 14, color: GRAY, fontWeight: 500 }}>Toca para añadir fotos</p></div>
        <div style={{ marginTop: 32 }}>
          <div style={{ display: 'flex', gap: 12, paddingBottom: 16 }}>{Array.from({ length: 5 }).map((_, i) => <div key={i} style={{ width: 56, height: 56, borderRadius: 10, flexShrink: 0, background: i < user.itemsCount ? 'rgba(10,10,10,0.1)' : '#F2F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{i < user.itemsCount && <Check size={20} style={{ color: 'rgba(10,10,10,0.4)' }} />}</div>)}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}><span style={mono(10, INK)}>{user.itemsCount}/5 prendas</span><span style={{ fontSize: 12, fontStyle: 'italic', color: GRAY }}>{user.itemsCount < 3 ? 'Vamos...' : user.itemsCount < 5 ? '¡Casi listo!' : '¡Perfecto!'}</span></div>
        </div>
        <button onClick={() => { setShowReveal(true); setTimeout(() => { setShowReveal(false); setStep(8); }, 2200); }} disabled={user.itemsCount < 5} style={{ ...btnDark, width: '100%', marginTop: 'auto', marginBottom: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: user.itemsCount < 5 ? 0.3 : 1, cursor: user.itemsCount < 5 ? 'default' : 'pointer' }}>Ver mi Style DNA <ChevronRight size={18} /></button>
      </div>
    );
    if (step === 8) return (
      <div className="vscroll" style={{ height: '100%', overflowY: 'auto', padding: 24, background: '#fff' }}>
        <div style={{ textAlign: 'center', margin: '32px 0 40px' }}><h1 style={serif(30)}>Tu Style DNA</h1><p style={{ fontSize: 13, color: GRAY }}>Personalizado para ti</p></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 24 }}>
          <div style={{ background: '#fff', border: '1px solid #EEE', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 20, boxShadow: shadowSm }}><div style={{ width: 64, height: 96, flexShrink: 0, background: '#F5F5F5', borderRadius: 10, padding: 12 }}><BodyShapeSVG type={user.bodyType} /></div><div><p style={{ fontSize: 15, fontWeight: 700 }}>Tipo: {user.bodyType}</p><p style={{ ...serif(13), fontStyle: 'italic', color: '#777', marginTop: 4, lineHeight: 1.2 }}>Proporciones equilibradas. Te recomendaremos prendas que marquen tu silueta natural.</p></div></div>
          <div style={{ background: '#fff', border: '1px solid #EEE', borderRadius: 16, padding: 16, display: 'flex', alignItems: 'center', gap: 20, boxShadow: shadowSm }}><div style={{ width: 64, height: 64, flexShrink: 0, background: '#F5F5F5', borderRadius: 999, padding: 16 }}><FaceShapeSVG type={user.faceShape} /></div><div><p style={{ fontSize: 15, fontWeight: 700 }}>Rostro: {user.faceShape}</p><p style={{ ...serif(13), fontStyle: 'italic', color: '#777', marginTop: 4, lineHeight: 1.2 }}>Forma armoniosa. Ideal para cuellos V y accesorios que alargan visualmente.</p></div></div>
          <div style={{ background: '#F9F9F7', borderRadius: 16, padding: 20, boxShadow: shadowSm }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}><span style={serif(18)}>Estación: {user.station}</span><span style={mono(9, '#BBB')}>{user.skinTone}</span></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(8,1fr)', gap: 8, marginBottom: 16 }}>{PALETAS[user.station].map(c => <div key={c} style={{ width: 24, height: 24, borderRadius: 999, background: c }} />)}</div><p style={{ fontSize: 12, color: '#777', lineHeight: 1.4 }}>Priorizaremos prendas en {PALETAS[user.station].slice(0, 3).join(', ')} para iluminar tu rostro.</p></div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 8 }}>{user.estilos.map(e => <span key={e} style={{ padding: '8px 20px', borderRadius: 999, background: INK, color: '#fff', ...mono(12, '#fff') }}>{e}</span>)}</div>
          <button onClick={() => setStep(9)} style={{ ...btnDark, borderRadius: 16, marginTop: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: shadowXl }}>Descubrir mis outfits →</button>
        </div>
      </div>
    );
    return null;
  };

  /* ----------------------------- main shell ----------------------------- */
  const screen = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: PAPER, position: 'relative', overflow: 'hidden' }}>
      <div key={activeScreen} className="vscroll fade-in" style={{ flex: 1, overflowY: 'auto' }}>
        {activeScreen === "home" && renderHome()}
        {activeScreen === "closet" && renderCloset()}
        {activeScreen === "add" && renderAdd()}
        {activeScreen === "calendar" && (activeCalendarView === 'monthly' ? renderCalendarMonthly() : renderCalendarDaily())}
        {activeScreen === "profile" && (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24, background: '#fff' }}>
            <div style={{ width: 96, height: 96, background: '#F5F5F5', borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}><UserCircle size={48} color={LIGHT} /></div>
            <h2 style={{ ...serif(24), marginBottom: 8 }}>Próximamente</h2><p style={{ fontSize: 13, color: GRAY }}>Estamos trabajando en esto para ti</p>
          </div>
        )}
      </div>
      <nav style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 72, borderTop: '1px solid ' + BORDER, background: '#fff', boxShadow: '0 -4px 20px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px', zIndex: 500 }}>
        {[{ k: 'home', I: LayoutGrid, l: 'Home' }, { k: 'closet', I: Shirt, l: 'Armario' }].map(({ k, I, l }) => (
          <button key={k} onClick={() => setActiveScreen(k)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 60 }}><I size={22} fill={activeScreen === k ? INK : 'none'} style={{ color: activeScreen === k ? INK : '#AAA', opacity: activeScreen === k ? 1 : 0.4 }} />{activeScreen === k && <span style={mono(9, INK)}>{l}</span>}</button>
        ))}
        <button onClick={() => { setActiveScreen("add"); setAddGarmentStep(1); }} style={{ background: 'none', border: 'none', cursor: 'pointer', marginTop: -32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}><div style={{ width: 56, height: 56, background: INK, borderRadius: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: shadowXl, border: '4px solid #fff' }}><Plus color="#fff" size={26} strokeWidth={2.5} /></div></button>
        {[{ k: 'calendar', I: CalendarIcon, l: 'Agenda' }, { k: 'profile', I: UserCircle, l: 'Perfil' }].map(({ k, I, l }) => (
          <button key={k} onClick={() => setActiveScreen(k)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minWidth: 60 }}><I size={22} fill={activeScreen === k ? INK : 'none'} style={{ color: activeScreen === k ? INK : '#AAA', opacity: activeScreen === k ? 1 : 0.4 }} />{activeScreen === k && <span style={mono(9, INK)}>{l}</span>}</button>
        ))}
      </nav>
      {renderModal()}
    </div>
  );

  const css = `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Space+Mono:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
    .vscroll::-webkit-scrollbar,.hscroll::-webkit-scrollbar{display:none}
    .vscroll,.hscroll{-ms-overflow-style:none;scrollbar-width:none}
    .hscroll{overflow-x:auto}
    .snap{scroll-snap-type:x mandatory}
    .snapitem{scroll-snap-align:start}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spin{animation:spin .9s linear infinite}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .fade-in{animation:fadeIn .35s ease}
    @keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}
    .slide-up{animation:slideUp .3s ease-out}
    @keyframes scan{0%{top:20%}50%{top:80%}100%{top:20%}}
    .scanline{animation:scan 4s ease-in-out infinite}
    @keyframes reveal{0%{background:#FAFAFA}40%{background:#0A0A0A}100%{background:#FAFAFA}}
    @keyframes revealText{0%{opacity:0;transform:scale(.9)}40%{opacity:1;transform:scale(1.1)}80%{opacity:0;transform:scale(1)}100%{opacity:0}}
  `;

  return (
    <div ref={stageRef} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#DEDCD6', padding: 12, fontFamily: SANS, boxSizing: 'border-box', overflow: 'hidden' }}>
      <style>{css}</style>
      {/* scaled stage keeps fixed iPhone proportions */}
      <div style={{ width: DW * scale, height: DH * scale, position: 'relative', flexShrink: 0 }}>
      {/* titanium rail */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: DW, height: DH, transform: `scale(${scale})`, transformOrigin: 'top left', borderRadius: 54, padding: 5, boxSizing: 'border-box', background: 'linear-gradient(90deg, rgba(255,255,255,0.14), rgba(255,255,255,0) 10%, rgba(255,255,255,0) 90%, rgba(255,255,255,0.14)), linear-gradient(180deg,#47474b 0%,#2c2c2f 48%,#202023 100%)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08), inset 0 1px 1px rgba(255,255,255,0.20), 0 24px 50px rgba(0,0,0,0.32)' }}>
        {/* side buttons */}
        <div style={{ position: 'absolute', left: -2, top: '14%', width: 3, height: 26, borderRadius: '3px 0 0 3px', background: 'linear-gradient(90deg,#171719,#3d3d41)' }} />
        <div style={{ position: 'absolute', left: -3, top: '21.5%', width: 3, height: 52, borderRadius: '3px 0 0 3px', background: 'linear-gradient(90deg,#171719,#3d3d41)' }} />
        <div style={{ position: 'absolute', left: -3, top: '31%', width: 3, height: 52, borderRadius: '3px 0 0 3px', background: 'linear-gradient(90deg,#171719,#3d3d41)' }} />
        <div style={{ position: 'absolute', right: -3, top: '26%', width: 3, height: 88, borderRadius: '0 3px 3px 0', background: 'linear-gradient(90deg,#3d3d41,#171719)' }} />
        {/* black bezel */}
        <div style={{ height: '100%', width: '100%', boxSizing: 'border-box', background: '#050506', borderRadius: 49, padding: 9 }}>
          {/* screen */}
          <div style={{ position: 'relative', height: '100%', width: '100%', background: PAPER, borderRadius: 41, overflow: 'hidden' }}>
            {/* dynamic island */}
            <div style={{ position: 'absolute', top: 11, left: '50%', transform: 'translateX(-50%)', width: 110, height: 31, background: '#000', borderRadius: 999, zIndex: 1300, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 11, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)' }}>
              <div style={{ width: 9, height: 9, borderRadius: 999, background: 'radial-gradient(circle at 35% 30%, #46577d, #060606 72%)', boxShadow: 'inset 0 0 1px rgba(140,170,230,0.6)' }} />
            </div>
            {/* home indicator */}
            <div style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', width: 128, height: 5, borderRadius: 999, background: 'rgba(0,0,0,0.22)', zIndex: 700, pointerEvents: 'none' }} />

        {showReveal && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, animation: 'reveal 2.2s ease forwards' }}>
            <h1 style={{ ...serif(36, '#fff'), letterSpacing: 10, animation: 'revealText 2s ease forwards' }}>ESTELA</h1>
          </div>
        )}

        {step < 9 ? (
          <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: PAPER, position: 'relative' }}>
            {stepHeader()}
            {analysis.active && (
              <div className="fade-in" style={{ position: 'absolute', inset: 0, zIndex: 1100, background: '#fff', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '48px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><IconBtn icon={X} onClick={closeAnalysis} /><span style={mono(11, INK)}>Detección IA</span><div style={{ width: 40 }} /></div>
                {analysis.step === 'camera' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
                    <h3 style={{ ...serif(24), margin: '16px 0 24px' }}>Analiza tu {analysis.type === 'body' ? 'silueta' : 'rostro'}</h3>
                    <div style={{ flex: 1, background: '#1A1A1A', borderRadius: 24, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ position: 'absolute', inset: 32, border: '1px solid rgba(255,255,255,0.3)', borderRadius: 20 }} /><Camera size={48} style={{ color: 'rgba(255,255,255,0.2)' }} /><div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}><button onClick={captureAnalysis} style={{ width: 64, height: 64, borderRadius: 999, border: '4px solid #fff', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><div style={{ width: 48, height: 48, background: '#fff', borderRadius: 999 }} /></button></div></div>
                    <p style={{ fontSize: 13, textAlign: 'center', color: GRAY, marginTop: 24, padding: '0 16px' }}>Ubícate en un lugar iluminado y mantén la cámara estable.</p>
                  </div>
                )}
                {analysis.step === 'processing' && (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 24 }}><div className="spin" style={{ width: 96, height: 96, borderRadius: 999, border: '4px solid #F0F0F0', borderTopColor: INK }} /><div style={{ textAlign: 'center' }}><h3 style={{ ...serif(20), marginBottom: 8 }}>Analizando proporciones</h3><p style={{ fontSize: 13, color: GRAY, padding: '0 48px' }}>Nuestra IA está midiendo puntos clave...</p></div></div>
                )}
                {analysis.step === 'result' && (
                  <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 24 }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 192, height: 256, background: '#F5F5F5', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, marginBottom: 32 }}>{analysis.type === 'body' ? <BodyShapeSVG type={analysis.result} /> : <FaceShapeSVG type={analysis.result} />}</div>
                      <h3 style={{ ...serif(28), marginBottom: 8 }}>¡Detectado!</h3>
                      <p style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Tienes un {analysis.type === 'body' ? 'tipo de cuerpo' : 'rostro'} {analysis.result}</p>
                      <div style={{ background: '#F9F9F9', padding: 20, borderRadius: 16, border: '1px solid ' + BORDER, margin: '0 16px' }}><p style={{ ...serif(14), fontStyle: 'italic', textAlign: 'center', color: '#777', lineHeight: 1.2 }}>{analysis.type === 'body' ? 'Tu silueta presenta hombros y caderas equilibrados con cintura definida. Te van genial las prendas entalladas.' : 'Tu rostro ovalado es extremadamente balanceado. Te favorece casi cualquier cuello y accesorio.'}</p></div>
                    </div>
                    <button onClick={closeAnalysis} style={{ ...btnDark, borderRadius: 16, boxShadow: shadowLg }}>Continuar</button>
                  </div>
                )}
              </div>
            )}
            <div className="fade-in" key={step} style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>{renderOnboarding()}</div>
          </div>
        ) : screen}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
