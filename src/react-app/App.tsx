import { Link, Navigate, Route, Routes, useNavigate, useParams } from "react-router-dom";
import "./App.css";

type MaterialItem = {
  name: string;
  description: string;
  image: string;
};

type MaterialCategory = {
  slug: string;
  title: string;
  symbol: string;
  heroTitle: string;
  heroText: string;
  image: string;
  items: MaterialItem[];
};

const createIllustration = (
  title: string,
  subtitle: string,
  accent: string,
  background: string,
  badge: string,
) => {
  const normalizedTitle = title.toLowerCase();
  let visualMarkup = "";

  if (normalizedTitle.includes("jewellery") || normalizedTitle.includes("broken gold")) {
    visualMarkup = `
      <path d="M240 420c0-70 54-126 124-126h40c70 0 124 56 124 126v20c0 53-34 98-82 115l-42 18-42-18c-48-17-82-62-82-115z" fill="${accent}" opacity="0.18" />
      <path d="M310 330c0-38 30-68 68-68h18c32 0 58 21 66 50l18 80-78 32-58-32z" fill="#171717" opacity="0.12" />
      <path d="M330 300c20-58 92-74 130-30 27 31 16 78-12 104l-30 34-28-6-40-36c-22-20-28-46-20-66z" fill="${accent}" opacity="0.75" />
      <path d="M490 300c16-14 40-14 56 0l18 16-24 24-44-14z" fill="#ffffff" opacity="0.85" />
      <path d="M592 360c0-46 34-84 80-84h40c48 0 84 38 84 84v24c0 46-36 84-84 84h-40c-46 0-80-38-80-84z" fill="${accent}" opacity="0.2" />
      <path d="M640 326h136c20 0 36 16 36 36v24c0 20-16 36-36 36H640c-20 0-36-16-36-36v-24c0-20 16-36 36-36z" fill="#ffffff" stroke="${accent}" stroke-width="6" />
      <line x1="668" y1="348" x2="748" y2="408" stroke="#171717" stroke-width="10" stroke-linecap="round" />
      <line x1="748" y1="348" x2="668" y2="408" stroke="#171717" stroke-width="10" stroke-linecap="round" />
    `;
  } else if (normalizedTitle.includes("connector") || normalizedTitle.includes("contact") || normalizedTitle.includes("pcb")) {
    visualMarkup = `
      <rect x="240" y="280" width="300" height="220" rx="24" fill="#ffffff" stroke="${accent}" stroke-width="8" />
      <rect x="280" y="320" width="220" height="140" rx="16" fill="#171717" opacity="0.08" />
      <rect x="320" y="340" width="40" height="100" rx="12" fill="${accent}" opacity="0.72" />
      <rect x="380" y="340" width="40" height="100" rx="12" fill="${accent}" opacity="0.72" />
      <rect x="440" y="340" width="40" height="100" rx="12" fill="${accent}" opacity="0.72" />
      <rect x="620" y="286" width="260" height="210" rx="20" fill="#ffffff" stroke="#171717" stroke-width="6" opacity="0.9" />
      <line x1="665" y1="320" x2="840" y2="320" stroke="${accent}" stroke-width="10" stroke-linecap="round" />
      <line x1="665" y1="368" x2="840" y2="368" stroke="${accent}" stroke-width="10" stroke-linecap="round" />
      <line x1="665" y1="418" x2="840" y2="418" stroke="${accent}" stroke-width="10" stroke-linecap="round" />
    `;
  } else if (normalizedTitle.includes("dust") || normalizedTitle.includes("filings") || normalizedTitle.includes("residue") || normalizedTitle.includes("process")) {
    visualMarkup = `
      <circle cx="280" cy="420" r="110" fill="${accent}" opacity="0.16" />
      <path d="M258 375c28-72 118-92 164-44 24 26 24 66 0 92-20 22-50 34-82 34-44 0-78-31-82-82z" fill="${accent}" opacity="0.74" />
      <circle cx="630" cy="360" r="80" fill="#ffffff" stroke="${accent}" stroke-width="6" />
      <circle cx="650" cy="340" r="18" fill="${accent}" opacity="0.9" />
      <circle cx="700" cy="382" r="12" fill="${accent}" opacity="0.8" />
      <circle cx="602" cy="396" r="16" fill="${accent}" opacity="0.75" />
      <path d="M550 500c58-38 132-38 190 0" stroke="#171717" stroke-width="10" stroke-linecap="round" opacity="0.45" />
      <path d="M622 472c40 18 80 18 120 0" stroke="${accent}" stroke-width="8" stroke-linecap="round" opacity="0.8" />
    `;
  } else if (normalizedTitle.includes("silver")) {
    visualMarkup = `
      <path d="M260 420c0-88 74-158 162-158h20c90 0 162 70 162 158v22c0 88-72 158-162 158h-20c-88 0-162-70-162-158z" fill="#ffffff" stroke="${accent}" stroke-width="6" />
      <path d="M318 376c34-42 102-42 136 0 34 42 34 106 0 148-34 42-102 42-136 0-34-42-34-106 0-148z" fill="${accent}" opacity="0.24" />
      <path d="M324 384c24-28 74-28 98 0 24 28 24 70 0 98-24 28-74 28-98 0-24-28-24-70 0-98z" fill="#ffffff" stroke="${accent}" stroke-width="4" />
    `;
  } else if (normalizedTitle.includes("platinum")) {
    visualMarkup = `
      <rect x="250" y="332" width="220" height="140" rx="24" fill="#ffffff" stroke="${accent}" stroke-width="8" />
      <rect x="270" y="352" width="180" height="100" rx="18" fill="${accent}" opacity="0.16" />
      <rect x="610" y="300" width="220" height="220" rx="28" fill="#171717" opacity="0.08" />
      <path d="M680 338h90c24 0 44 20 44 44v34c0 24-20 44-44 44h-90c-24 0-44-20-44-44v-34c0-24 20-44 44-44z" fill="${accent}" opacity="0.22" />
    `;
  } else if (normalizedTitle.includes("palladium")) {
    visualMarkup = `
      <rect x="240" y="296" width="230" height="230" rx="24" fill="${accent}" opacity="0.16" />
      <circle cx="350" cy="410" r="74" fill="#ffffff" stroke="${accent}" stroke-width="8" />
      <circle cx="350" cy="410" r="38" fill="${accent}" opacity="0.28" />
      <path d="M612 300h180" stroke="${accent}" stroke-width="12" stroke-linecap="round" />
      <path d="M612 352h180" stroke="${accent}" stroke-width="12" stroke-linecap="round" />
      <path d="M612 404h180" stroke="${accent}" stroke-width="12" stroke-linecap="round" />
    `;
  } else if (normalizedTitle.includes("industrial") || normalizedTitle.includes("crucible")) {
    visualMarkup = `
      <rect x="244" y="310" width="250" height="220" rx="24" fill="#ffffff" stroke="${accent}" stroke-width="8" />
      <rect x="280" y="344" width="178" height="160" rx="18" fill="${accent}" opacity="0.2" />
      <path d="M620 296c42 0 76 34 76 76v84h-76z" fill="${accent}" opacity="0.25" />
      <rect x="652" y="322" width="146" height="142" rx="24" fill="#ffffff" stroke="#171717" stroke-width="6" />
    `;
  } else {
    visualMarkup = `
      <rect x="240" y="286" width="260" height="220" rx="24" fill="${accent}" opacity="0.16" />
      <rect x="620" y="300" width="240" height="220" rx="24" fill="#ffffff" stroke="${accent}" stroke-width="6" />
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <rect width="1200" height="900" rx="42" fill="${background}" />
      <rect x="70" y="70" width="1060" height="760" rx="30" fill="#ffffff" opacity="0.94" />
      <circle cx="950" cy="240" r="180" fill="${accent}" opacity="0.16" />
      <circle cx="300" cy="760" r="200" fill="#171717" opacity="0.08" />
      <rect x="150" y="250" width="320" height="300" rx="28" fill="${accent}" opacity="0.15" />
      <rect x="180" y="280" width="260" height="240" rx="22" fill="${accent}" opacity="0.28" />
      <text x="150" y="220" font-family="Segoe UI, Arial, sans-serif" font-size="44" font-weight="700" fill="#171717">${title}</text>
      <text x="150" y="280" font-family="Segoe UI, Arial, sans-serif" font-size="26" fill="#5e5e5e">${subtitle}</text>
      <rect x="580" y="240" width="360" height="320" rx="26" fill="#171717" opacity="0.06" />
      <rect x="620" y="280" width="280" height="240" rx="22" fill="#ffffff" stroke="${accent}" stroke-width="6" />
      ${visualMarkup}
      <circle cx="760" cy="400" r="80" fill="${accent}" opacity="0.18" />
      <text x="720" y="420" font-family="Segoe UI, Arial, sans-serif" font-size="54" font-weight="700" fill="${accent}">${badge}</text>
      <line x1="180" y1="610" x2="460" y2="610" stroke="${accent}" stroke-width="10" stroke-linecap="round" />
      <line x1="520" y1="610" x2="940" y2="610" stroke="#c2b49b" stroke-width="10" stroke-linecap="round" />
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const materialCategories: MaterialCategory[] = [
  {
    slug: "gold-scrap",
    title: "गोल्ड स्क्रैप",
    symbol: "Au",
    heroTitle: "गोल्ड स्क्रैप की प्रोफेशनल रिकवरी",
    heroText:
      "ज्वेलरी, इलेक्ट्रॉनिक कनेक्टर और इंडस्ट्रियल मटेरियल में मौजूद सोने की पहचान, रिकवरी और मूल्यांकन।",
    image: createIllustration(
      "Gold Scrap Recovery",
      "Broken jewellery and gold bearing material",
      "#d89a19",
      "#fff2c8",
      "Au",
    ),
    items: [
      {
        name: "गोल्ड ज्वेलरी स्क्रैप",
        description: "पुराने आभूषण, कच्चे टुकड़े और वेयर-एंड-टियर गोल्ड मटेरियल।",
        image:
          "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "गोल्ड प्लेटेड कनेक्टर",
        description: "इलेक्ट्रॉनिक बोर्ड और संपर्कों पर मौजूद स्वर्ण-लेपित कनेक्टर।",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
      },
      {
        name: "गोल्ड डस्ट और फिलिंग्स",
        description: "प्रोसेसिंग के दौरान निकलने वाले सूक्ष्म स्वर्ण डस्ट और फिलिंग्स।",
        image:
          "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=900&q=80",
      },
    ],
  },
  {
    slug: "silver-scrap",
    title: "सिल्वर स्क्रैप",
    symbol: "Ag",
    heroTitle: "सिल्वर स्क्रैप की सही पहचान और रिकवरी",
    heroText:
      "चांदी युक्त वॉयर, प्लेटेड पार्ट्स और इंडस्ट्रियल मटेरियल का सुरक्षित मूल्यांकन।",
    image: createIllustration(
      "Silver Scrap Recovery",
      "Silver bearing wire and industrial material",
      "#8aa0b7",
      "#eef3f8",
      "Ag",
    ),
    items: [
      {
        name: "सिल्वर वॉयर और कनेक्टर",
        description: "इलेक्ट्रिकल कनेक्टर, सर्किट संपर्क और सिल्वर-लेपित वॉयर।",
        image: createIllustration(
          "Silver Wire & Connectors",
          "Silver contacts and electrical connectors",
          "#8aa0b7",
          "#eef3f8",
          "Ag",
        ),
      },
      {
        name: "सिल्वर प्लेटेड मटेरियल",
        description: "कई इंडस्ट्रियल और इलेक्ट्रॉनिक घटकों पर मौजूद सिल्वर प्लेटिंग।",
        image: createIllustration(
          "Silver Plated Material",
          "Plated industrial and electronic parts",
          "#8aa0b7",
          "#edf5fb",
          "Ag",
        ),
      },
      {
        name: "सिल्वर ज्वेलरी और उपकरण",
        description: "पुरानी चांदी की सामग्री, बर्तनों और औद्योगिक उपकरणों की चांदी युक्त भाग।",
        image: createIllustration(
          "Silver Jewellery & Tools",
          "Silver scrap and precision tools",
          "#8aa0b7",
          "#f0f5fb",
          "Ag",
        ),
      },
    ],
  },
  {
    slug: "platinum-scrap",
    title: "प्लेटिनम स्क्रैप",
    symbol: "Pt",
    heroTitle: "प्लेटिनम स्क्रैप की उच्च-मानक रिकवरी",
    heroText:
      "प्रिसियस मेटल रिकवरी में प्लेटिनम युक्त भागों की सही कलेक्शन और प्रोसेसिंग।",
    image: createIllustration(
      "Platinum Scrap Recovery",
      "High grade platinum bearing components",
      "#7a8b8f",
      "#eef2f4",
      "Pt",
    ),
    items: [
      {
        name: "प्लेटिनम कनेक्टर",
        description: "हाई-परफॉर्मेंस इलेक्ट्रॉनिक और ऑटोमोटिव भागों में उपयोग होने वाले प्लेटिनम कनेक्टर।",
        image: createIllustration(
          "Platinum Connectors",
          "High performance electronic contacts",
          "#7a8b8f",
          "#eef2f4",
          "Pt",
        ),
      },
      {
        name: "कैटलिटिक पार्ट्स",
        description: "ऑटो इंडस्ट्री के कैटलिटिक कन्वर्टर और संबंधित भाग।",
        image: createIllustration(
          "Catalytic Parts",
          "Automotive catalyst scrap and components",
          "#7a8b8f",
          "#edf2f4",
          "Pt",
        ),
      },
      {
        name: "इंडस्ट्रियल प्लेटिनम स्क्रैप",
        description: "रासायनिक और चिकित्सा उपकरणों में प्रयुक्त प्लेटिनम-आधारित सामग्री।",
        image: createIllustration(
          "Industrial Platinum Scrap",
          "Chemical and medical process material",
          "#7a8b8f",
          "#eef4f6",
          "Pt",
        ),
      },
    ],
  },
  {
    slug: "palladium-scrap",
    title: "पैलेडियम स्क्रैप",
    symbol: "Pd",
    heroTitle: "पैलेडियम युक्त स्क्रैप की सूक्ष्म रिकवरी",
    heroText:
      "कैटलिटिक कन्वर्टर और इलेक्ट्रॉनिक घटकों से पैलेडियम की सुरक्षित पुनर्प्राप्ति।",
    image: createIllustration(
      "Palladium Scrap Recovery",
      "Catalytic and electronic palladium material",
      "#9b7a4f",
      "#f6efe8",
      "Pd",
    ),
    items: [
      {
        name: "कैटलिटिक कन्वर्टर ड्यूटी",
        description: "ऑटोमोटिव कैटलिटिक कन्वर्टर से निकलने वाली पैलेडियम-समृद्ध सामग्री।",
        image: createIllustration(
          "Catalytic Converter Scrap",
          "Palladium rich converter components",
          "#9b7a4f",
          "#f8efe6",
          "Pd",
        ),
      },
      {
        name: "इलेक्ट्रॉनिक पैलेडियम पार्ट्स",
        description: "कनेक्टर्स, सेंसर और उच्च-तापमान इलेक्ट्रॉनिक घटक।",
        image: createIllustration(
          "Electronic Palladium Parts",
          "Sensors and high temperature electronics",
          "#9b7a4f",
          "#f7eee4",
          "Pd",
        ),
      },
      {
        name: "उच्च-प्रतिरोधी भाग",
        description: "औद्योगिक और रासायनिक उपकरणों में प्रयुक्त पैलेडियम-युक्त घटक।",
        image: createIllustration(
          "High Resistance Parts",
          "Industrial palladium bearing components",
          "#9b7a4f",
          "#f9efe7",
          "Pd",
        ),
      },
    ],
  },
  {
    slug: "pcb-e-waste",
    title: "PCB & E-Waste",
    symbol: "PCB",
    heroTitle: "PCB और ई-वेस्ट से कीमती धातुओं की रिकवरी",
    heroText:
      "मोबाइल बोर्ड, कंप्यूटर बोर्ड और टेलीकॉम ई-वेस्ट से स्वर्ण, चांदी और प्लेटिनम की पहचान।",
    image: createIllustration(
      "PCB & E-Waste Recovery",
      "Boards, connectors and telecom electronics",
      "#5a6d85",
      "#eff4fa",
      "PCB",
    ),
    items: [
      {
        name: "PCB बोर्ड",
        description: "प्रिंटेड सर्किट बोर्डों पर मौजूद precious metal bearing pads और ट्रेसेस।",
        image: createIllustration(
          "PCB Boards",
          "Printed circuit boards and pads",
          "#5a6d85",
          "#eff4fa",
          "PCB",
        ),
      },
      {
        name: "इलेक्ट्रॉनिक कनेक्टर",
        description: "मोबाइल, कंप्यूटर और टेलीकॉम उपकरणों के कनेक्टर और सॉकेट।",
        image: createIllustration(
          "Electronic Connectors",
          "Mobile and computer connectors",
          "#5a6d85",
          "#eef3f8",
          "PCB",
        ),
      },
      {
        name: "टेलीकॉम और ई-वेस्ट",
        description: "पुराने टेलीकॉम इकाइयों, सर्वर बोर्ड और इलेक्ट्रॉनिक स्क्रैप।",
        image: createIllustration(
          "Telecom & E-Waste",
          "Old telecom units and electronic scrap",
          "#5a6d85",
          "#edf4fb",
          "PCB",
        ),
      },
    ],
  },
  {
    slug: "industrial-scrap",
    title: "इंडस्ट्रियल स्क्रैप",
    symbol: "♻",
    heroTitle: "इंडस्ट्रियल प्रोसेसिंग से precious metal recovery",
    heroText:
      "कच्चा इंडस्ट्रियल स्क्रैप, क्रूसिबल, डस्ट और प्रोसेसिंग रेसिड्यू से धातु रिकवरी।",
    image: createIllustration(
      "Industrial Scrap Recovery",
      "Crucibles, dust and process residue",
      "#b17f41",
      "#f7efe2",
      "♻",
    ),
    items: [
      {
        name: "क्रूसिबल और फर्नेस रेसिड्यू",
        description: "उच्च तापमान प्रक्रिया में उपयोग होने वाले क्रूसिबल और रेसिड्यू मटेरियल।",
        image: createIllustration(
          "Crucibles & Residue",
          "High temperature process material",
          "#b17f41",
          "#f7efe2",
          "♻",
        ),
      },
      {
        name: "प्रोसेस डस्ट",
        description: "मेटल रिकवरी प्रक्रिया से निकलने वाला धातु युक्त डस्ट और सूक्ष्म भाग।",
        image: createIllustration(
          "Process Dust",
          "Fine metallic dust and residue",
          "#b17f41",
          "#f8f1e6",
          "♻",
        ),
      },
      {
        name: "प्लेटिंग और रासायनिक स्क्रैप",
        description: "प्लेटिंग, रासायनिक और मेडिकल इंडस्ट्री से आने वाला स्क्रैप।",
        image: createIllustration(
          "Plating & Chemical Scrap",
          "Industrial plating and chemical residue",
          "#b17f41",
          "#f8f2e8",
          "♻",
        ),
      },
    ],
  },
];

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/materials/:slug" element={<MaterialDetailPageWrapper />} />
      </Routes>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="logo">♻</div>

          <div>
            <h1>NIYARE WALA</h1>
            <p>सोना चांदी रीसाइक्लिंग</p>
          </div>
        </div>

        <nav className="nav">
          <a href="#rates">आज का भाव</a>
          <a href="#materials">हम क्या खरीदते हैं</a>
          <a href="#process">हमारा काम</a>
          <a href="#about">हमारे बारे में</a>
          <a href="#contact">संपर्क</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">PRECIOUS METAL RECYCLING</span>

          <h2>
            <span className="hero-heading-line">कीमती धातुओं की</span>
            <span className="hero-heading-line hero-heading-accent">
              प्रोफेशनल रीसाइक्लिंग
            </span>
          </h2>

          <p>
            सोना, चांदी, प्लेटिनम और पैलेडियम युक्त स्क्रैप की खरीद,
            प्रोसेसिंग और रिकवरी।
          </p>

          <div className="hero-buttons">
            <a href="#rates" className="primary-btn">
              आज का भाव देखें
            </a>

            <a href="#contact" className="secondary-btn">
              हमसे संपर्क करें
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="metal-circle">Au</div>
          <h3>PRECIOUS METALS</h3>
          <p>Gold • Silver • Platinum • Palladium</p>
        </div>
      </section>

      <section id="rates" className="rates-section">
        <div className="section-heading">
          <span>LIVE MARKET RATE</span>
          <h2>आज का सोना चांदी भाव</h2>
          <p>बाजार के अनुसार भाव बदल सकते हैं</p>
        </div>

        <div className="rates-grid">
          <div className="rate-card gold">
            <div className="rate-left">
              <div className="metal-icon">Au</div>

              <div>
                <h3>GOLD 999</h3>
                <p>24 कैरेट शुद्ध सोना</p>
              </div>
            </div>

            <div className="price">
              <span>₹</span>
              <strong>--</strong>
            </div>
          </div>

          <div className="rate-card silver">
            <div className="rate-left">
              <div className="metal-icon">Ag</div>

              <div>
                <h3>SILVER 999</h3>
                <p>शुद्ध चांदी</p>
              </div>
            </div>

            <div className="price">
              <span>₹</span>
              <strong>--</strong>
            </div>
          </div>
        </div>

        <div className="rate-update">♻ भाव बाजार के अनुसार बदल सकते हैं</div>
      </section>

      <section id="materials" className="materials-section">
        <div className="section-heading">
          <span>WE BUY & RECYCLE</span>
          <h2>हम क्या खरीदते हैं</h2>
          <p>कीमती धातु युक्त विभिन्न प्रकार का स्क्रैप</p>
        </div>

        <div className="materials-grid">
          {materialCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/materials/${category.slug}`}
              className="material-card-link"
            >
              <div className="material-card">
                <div className="material-symbol">{category.symbol}</div>
                <h3>{category.title}</h3>
                <p>
                  {category.slug === "gold-scrap" &&
                    "गोल्ड युक्त इंडस्ट्रियल स्क्रैप, इलेक्ट्रॉनिक स्क्रैप और अन्य गोल्ड मटेरियल।"}
                  {category.slug === "silver-scrap" &&
                    "सिल्वर कॉन्टैक्ट, सिल्वर प्लेटेड मटेरियल और इंडस्ट्रियल सिल्वर स्क्रैप।"}
                  {category.slug === "platinum-scrap" &&
                    "प्लेटिनम युक्त इंडस्ट्रियल मटेरियल और विभिन्न प्रकार के कीमती धातु स्क्रैप।"}
                  {category.slug === "palladium-scrap" &&
                    "पैलेडियम युक्त इलेक्ट्रॉनिक और इंडस्ट्रियल स्क्रैप की खरीद एवं प्रोसेसिंग।"}
                  {category.slug === "pcb-e-waste" &&
                    "मॉबाइल बोर्ड, कंप्यूटर बोर्ड और कीमती धातु युक्त इलेक्ट्रॉनिक स्क्रैप।"}
                  {category.slug === "industrial-scrap" &&
                    "Precious metal bearing dust, crucible और अन्य प्रोसेस मटेरियल।"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="process" className="process-section">
        <div className="section-heading light">
          <span>OUR PROCESS</span>
          <h2>हमारा काम कैसे होता है</h2>
          <p>सही जांच और प्रोफेशनल प्रोसेसिंग</p>
        </div>

        <div className="process-grid">
          <div className="process-card">
            <span>01</span>
            <h3>मटेरियल जांच</h3>
            <p>सबसे पहले स्क्रैप और मटेरियल की जांच की जाती है।</p>
          </div>

          <div className="process-card">
            <span>02</span>
            <h3>सैंपल और टेस्ट</h3>
            <p>मटेरियल का सैंपल लेकर कीमती धातु की जांच की जाती है।</p>
          </div>

          <div className="process-card">
            <span>03</span>
            <h3>वैल्यू कैलकुलेशन</h3>
            <p>मेटल कंटेंट और बाजार भाव के अनुसार कीमत निकाली जाती है।</p>
          </div>

          <div className="process-card">
            <span>04</span>
            <h3>रीसाइक्लिंग</h3>
            <p>मटेरियल को प्रोसेस करके कीमती धातुओं की रिकवरी की जाती है।</p>
          </div>
        </div>
      </section>

      <section id="about" className="about-section">
        <div className="about-box">
          <div className="about-content">
            <span>ABOUT NIYARE WALA</span>

            <h2>कीमती धातु रिकवरी में अनुभव</h2>

            <p>
              NIYARE WALA सोना, चांदी, प्लेटिनम, पैलेडियम और अन्य कीमती धातु
              युक्त स्क्रैप की रीसाइक्लिंग और रिकवरी के क्षेत्र में कार्य करता है।
            </p>

            <p>
              हमारा उद्देश्य मटेरियल की सही पहचान, सही मूल्यांकन और प्रोफेशनल
              रीसाइक्लिंग है।
            </p>
          </div>

          <div className="experience-card">
            <strong>28+</strong>
            <span>वर्षों का अनुभव</span>
            <p>PRECIOUS METAL RECOVERY</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="contact-content">
          <span>CONTACT US</span>

          <h2>अपना स्क्रैप बेचना चाहते हैं?</h2>

          <p>
            गोल्ड, सिल्वर, प्लेटिनम या पैलेडियम युक्त स्क्रैप के लिए हमसे संपर्क
            करें।
          </p>

          <a href="mailto:info@niyarewala.com?subject=NIYARE%20WALA%20Scrap%20Inquiry" className="contact-btn">
            संपर्क करें
          </a>
        </div>
      </section>

      <footer className="footer">
        <div>
          <h2>NIYARE WALA</h2>
          <p>सोना चांदी रीसाइक्लिंग</p>
        </div>

        <div className="footer-metals">GOLD • SILVER • PLATINUM • PALLADIUM</div>

        <p>© NIYARE WALA</p>
      </footer>
    </>
  );
}

function MaterialDetailPageWrapper() {
  const { slug } = useParams();
  const category = materialCategories.find((item) => item.slug === slug);

  if (!category) {
    return <Navigate to="/" replace />;
  }

  return <MaterialDetailPage category={category} />;
}

function MaterialDetailPage({ category }: { category: MaterialCategory }) {
  const navigate = useNavigate();
  const isGoldScrap = category.slug === "gold-scrap";

  return (
    <div className="detail-page">
      <header className="detail-header">
        <Link className="brand-link" to="/">
          <div className="brand">
            <div className="logo">♻</div>
            <div>
              <h1>NIYARE WALA</h1>
              <p>सोना चांदी रीसाइक्लिंग</p>
            </div>
          </div>
        </Link>

        <nav className="detail-nav">
          <a
            href="mailto:info@niyarewala.com?subject=NIYARE%20WALA%20Scrap%20Inquiry"
            className="detail-nav-link"
          >
            हमसे संपर्क करें
          </a>
        </nav>
      </header>

      <main className="detail-main">
        {!isGoldScrap && (
          <section className="detail-hero">
            <div className="detail-hero-content">
              <span className="hero-tag">PRECIOUS METAL RECYCLING</span>
              <h1>{category.heroTitle}</h1>
              <p>{category.heroText}</p>

              <div className="detail-actions">
                <a
                  href="mailto:info@niyarewala.com?subject=NIYARE%20WALA%20Scrap%20Inquiry"
                  className="primary-btn"
                >
                  हमसे संपर्क करें
                </a>
                <button type="button" className="secondary-btn" onClick={() => navigate(-1)}>
                  वापस जाएँ
                </button>
              </div>
            </div>

            <div className="detail-hero-visual">
              <img src={category.image} alt={category.title} />
            </div>
          </section>
        )}

        <section className="detail-types-section">
          <div className="section-heading">
            {!isGoldScrap && <span>DETAILS</span>}
            <h2>{category.title}</h2>
            {!isGoldScrap && <p>इस श्रेणी में आमतौर पर मिलने वाले रूप और प्रकार</p>}
          </div>

          <div className="detail-grid">
            {category.items.map((item) => (
              <article className="detail-card" key={item.name}>
                <div className="detail-card-image">
                  <img src={item.image} alt={item.name} />
                </div>
                <h3>{item.name}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div>
          <h2>NIYARE WALA</h2>
          <p>सोना चांदी रीसाइक्लिंग</p>
        </div>
        <div className="footer-metals">GOLD • SILVER • PLATINUM • PALLADIUM</div>
        <p>© NIYARE WALA</p>
      </footer>
    </div>
  );
}

export default App;
