import { getNextScheduledLabel, type MetalPriceSettings } from "./metalsPrice";

export type AdminMaterial = {
  id: string;
  title: string;
  description: string;
  image: string;
};

export type AdminMaterialItem = {
  name: string;
  description: string;
  image: string;
};

export type AdminCategory = {
  id: string;
  slug: string;
  symbol: string;
  title: string;
  description: string;
  heroText: string;
  image: string;
  note?: string;
  items: AdminMaterialItem[];
};

export type AdminState = {
  rates: {
    gold: string;
    silver: string;
    platinum: string;
    palladium: string;
  };
  materials: AdminMaterial[];
  categories: AdminCategory[];
  contact: {
    mobile: string;
    whatsapp: string;
    address: string;
    email: string;
  };
  homepage: {
    heading: string;
    description: string;
  };
  metalPriceSettings: MetalPriceSettings;
};

const STORAGE_KEY = "niyarewala-admin-state-v1";

const localAssetUrl = (fileName: string) => `/images/materials/${fileName}.svg`;

function getDefaultMetalPriceSettings(): MetalPriceSettings {
  return {
    apiStatus: {
      provider: "Metals.Dev",
      status: "Error",
      lastSuccessfulUpdate: null,
      nextScheduledUpdate: getNextScheduledLabel(),
      apiUsageCounter: "-",
    },
    schedule: "Every 60 minutes",
    timezone: "Asia/Kolkata",
    gold999Adjustment: { mode: "fixed", value: 0 },
    gold995Adjustment: { mode: "fixed", value: 0 },
    silver999Adjustment: { mode: "fixed", value: 0 },
    manualPriceMode: false,
    manualPrices: {
      gold999: 0,
      gold995: 0,
      silver999: 0,
    },
    currentSnapshot: null,
    previousSnapshot: null,
  };
}

function createDefaultCategories(): AdminCategory[] {
  return [
    {
      id: "workshop-sweep",
      slug: "workshop-sweep",
      symbol: "ग",
      title: "वर्कशॉप गाद और स्वीप",
      description:
        "कारीगर की बेंच, फर्श, चटाई और कार्यस्थल से एकत्र धातुयुक्त धूल व महीन अवशेष।",
      heroText:
        "बेंच स्वीप, फ्लोर स्वीप और वर्क टेबल क्लीनिंग से निकले धातुयुक्त अवशेषों की प्रोफेशनल खरीद।",
      image: "/images/materials/workshop-sweep.svg",
      items: [
        {
          name: "बेंच स्वीप",
          description: "कार्यस्थल की बेंच पर जमा धूल और सूक्ष्म धातु अवशेष।",
          image: localAssetUrl("workshop-sweep"),
        },
        {
          name: "फ्लोर स्वीप",
          description: "वर्कशॉप के फर्श से एकत्रित धूल और धातु के सूक्ष्म कण।",
          image: localAssetUrl("workshop-sweep"),
        },
        {
          name: "चटाई / कारपेट डस्ट",
          description: "वर्किंग मैट और कारपेट से निकाले गए धातुयुक्त डस्ट।",
          image: localAssetUrl("workshop-sweep"),
        },
        {
          name: "बेंच ड्रॉअर डस्ट",
          description: "टूल ड्रॉअर और स्टोरेज एरिया में जमा हुआ धातुयुक्त डस्ट।",
          image: localAssetUrl("workshop-sweep"),
        },
        {
          name: "कार्यस्थल की सफाई से निकला वेस्ट",
          description: "वर्क टेबल क्लीनिंग के दौरान एकत्रित अवशेष और वेस्ट मटेरियल।",
          image: localAssetUrl("workshop-sweep"),
        },
        {
          name: "वर्क टेबल क्लीनिंग वेस्ट",
          description: "करीगर के काम से निकले धातुयुक्त अवशेषों को सुरक्षित रूप से संग्रहित किया जाता है।",
          image: localAssetUrl("workshop-sweep"),
        },
      ],
    },
    {
      id: "buffing-polishing",
      slug: "buffing-polishing",
      symbol: "प",
      title: "बफिंग और पॉलिशिंग वेस्ट",
      description:
        "ज्वेलरी की बफिंग और पॉलिशिंग के दौरान निकलने वाली डस्ट, बफ और धातुयुक्त अवशेष।",
      heroText:
        "पॉलिशिंग और बफिंग प्रक्रिया के दौरान जमा धूल, कपड़ा और मशीन अवशेष।",
      image: "/images/materials/buffing-polishing.svg",
      items: [
        {
          name: "बफिंग डस्ट",
          description: "बफिंग व्हील और पेड पर जमा धातुयुक्त डस्ट।",
          image: localAssetUrl("buffing-polishing"),
        },
        {
          name: "पॉलिशिंग डस्ट",
          description: "पॉलिशिंग के बाद बचा धूल और महीन धातु अवशेष।",
          image: localAssetUrl("buffing-polishing"),
        },
        {
          name: "इस्तेमाल किए हुए बफ",
          description: "बफिंग पैड, व्हील और कंपाउंड में कब्जा किया अवशेष।",
          image: localAssetUrl("buffing-polishing"),
        },
        {
          name: "पॉलिशिंग कपड़ा",
          description: "धातु की सफाई और पॉलिशिंग के बाद इस्तेमाल किया गया कपड़ा।",
          image: localAssetUrl("buffing-polishing"),
        },
        {
          name: "मशीन के अंदर जमा डस्ट",
          description: "पॉलिशिंग मशीन के अंदर इकट्ठा हुआ धूल और रेसिड्यू।",
          image: localAssetUrl("buffing-polishing"),
        },
        {
          name: "पॉलिशिंग फिल्टर डस्ट",
          description: "धूल कलेक्शन फिल्टर में जमा धातुयुक्त अवशेष।",
          image: localAssetUrl("buffing-polishing"),
        },
      ],
    },
    {
      id: "crucible-furnace",
      slug: "crucible-furnace",
      symbol: "भ",
      title: "क्रूसिबल और भट्ठी अवशेष",
      description:
        "गोल्ड-सिल्वर मेल्टिंग में उपयोग हुए क्रूसिबल, भट्ठी अवशेष और मेल्टिंग वेस्ट।",
      heroText:
        "टूटा और इस्तेमाल किया हुआ क्रूसिबल, भट्ठी की राख और मेल्टिंग स्लैग।",
      image: "/images/materials/crucible-furnace.svg",
      items: [
        {
          name: "टूटा क्रूसिबल",
          description: "उच्च तापमान के बाद टूटे या क्षतिग्रस्त क्रूसिबल टुकड़े।",
          image: localAssetUrl("crucible-furnace"),
        },
        {
          name: "इस्तेमाल किया हुआ क्रूसिबल",
          description: "मेल्टिंग लूप के बाद बचा हुआ इस्तेमाल किया क्रूसिबल।",
          image: localAssetUrl("crucible-furnace"),
        },
        {
          name: "मेल्टिंग स्लैग",
          description: "पिघलाने की प्रक्रिया के दौरान बनने वाला स्लैग और रिसिड्यू।",
          image: localAssetUrl("crucible-furnace"),
        },
        {
          name: "भट्ठी की राख",
          description: "फर्नेस क्लीनिंग के बाद बची राख और धातुयुक्त अवशेष।",
          image: localAssetUrl("crucible-furnace"),
        },
        {
          name: "फर्नेस क्लीनिंग वेस्ट",
          description: "भट्ठी की सफाई से निकला वेस्ट और रेसिड्यू।",
          image: localAssetUrl("crucible-furnace"),
        },
        {
          name: "मेल्टिंग पॉट अवशेष",
          description: "मेल्टिंग पॉट के आसपास जमा प्रोसेस डस्ट और अवशेष।",
          image: localAssetUrl("crucible-furnace"),
        },
      ],
    },
    {
      id: "filings-scrap",
      slug: "filings-scrap",
      symbol: "फ़",
      title: "फाइलिंग, कतरन और बेंच स्क्रैप",
      description:
        "ज्वेलरी निर्माण के दौरान निकलने वाली फाइलिंग, बुरादा, तार के टुकड़े और महीन स्क्रैप।",
      heroText:
        "कटिंग, फाइलिंग और बेंच वर्क से निकलने वाले धातुयुक्त स्क्रैप का व्यावसायिक संग्रह।",
      image: "/images/materials/filings-scrap.svg",
      items: [
        {
          name: "फाइलिंग",
          description: "फाइलिंग से बनी सूक्ष्म धातु की बुरादा।",
          image: localAssetUrl("filings-scrap"),
        },
        {
          name: "कतरन",
          description: "कटिंग और शेपिंग से निकला धातु कतरन।",
          image: localAssetUrl("filings-scrap"),
        },
        {
          name: "बुरादा",
          description: "वर्कशॉप टूलिंग से इकट्ठा धातु की बुरादा।",
          image: localAssetUrl("filings-scrap"),
        },
        {
          name: "तार के टुकड़े",
          description: "तार काटने और जोड़ने से बचा छोटा धातु स्क्रैप।",
          image: localAssetUrl("filings-scrap"),
        },
        {
          name: "कटिंग स्क्रैप",
          description: "कटिंग स्टेज में अलग हुआ धातुयुक्त स्क्रैप।",
          image: localAssetUrl("filings-scrap"),
        },
        {
          name: "ड्रिलिंग वेस्ट",
          description: "ड्रिलिंग के बाद बचा बुरादा और छोटे कण।",
          image: localAssetUrl("filings-scrap"),
        },
      ],
    },
    {
      id: "exhaust-dust",
      slug: "exhaust-dust",
      symbol: "ड",
      title: "एग्जॉस्ट और डस्ट कलेक्शन अवशेष",
      description:
        "वर्कशॉप एग्जॉस्ट, फिल्टर और डस्ट कलेक्शन सिस्टम में एकत्र प्रोसेस अवशेष।",
      heroText:
        "एग्जॉस्ट सिस्टम, फिल्टर और कलेक्शन यूनिट से मिलने वाले धातुयुक्त अवशेष।",
      image: "/images/materials/exhaust-dust.svg",
      items: [
        {
          name: "एग्जॉस्ट फिल्टर",
          description: "एग्जॉस्ट सिस्टम फिल्टर में जमा धातुयुक्त अवशेष।",
          image: localAssetUrl("exhaust-dust"),
        },
        {
          name: "डस्ट कलेक्टर डस्ट",
          description: "कलेक्टर यूनिट में जमा प्रोसेसिंग डस्ट।",
          image: localAssetUrl("exhaust-dust"),
        },
        {
          name: "डक्ट क्लीनिंग डस्ट",
          description: "डक्ट और पाइपलाइन से निकाला सफाई डस्ट।",
          image: localAssetUrl("exhaust-dust"),
        },
        {
          name: "चिमनी / एग्जॉस्ट में जमा अवशेष",
          description: "वेंट सिस्टम में जमा प्रोसेस अवशेष।",
          image: localAssetUrl("exhaust-dust"),
        },
        {
          name: "फिल्टर बैग",
          description: "फिल्टर बैग में एकत्र धातुयुक्त कण और बैग अवशेष।",
          image: localAssetUrl("exhaust-dust"),
        },
        {
          name: "फर्नेस एग्जॉस्ट डस्ट",
          description: "भट्ठी एग्जॉस्ट से निकला पाउडर और अवशेष।",
          image: localAssetUrl("exhaust-dust"),
        },
      ],
      note: "कीमती धातु की वास्तविक मात्रा जांच और मूल्यांकन के बाद निर्धारित की जाती है।",
    },
    {
      id: "wash-processing",
      slug: "wash-processing",
      symbol: "व",
      title: "वॉश और प्रोसेसिंग अवशेष",
      description:
        "ज्वेलरी कार्य, सफाई और प्रोसेसिंग से एकत्र किए गए धातुयुक्त ठोस अवशेष।",
      heroText:
        "वॉशिंग, सेटलिंग और प्रोसेसिंग से एकत्र ठोस धातुयुक्त अवशेष।",
      image: "/images/materials/wash-processing.svg",
      items: [
        {
          name: "सिंक ट्रैप अवशेष",
          description: "सिंक ट्रैप में संचयित धातुयुक्त ठोस।",
          image: localAssetUrl("wash-processing"),
        },
        {
          name: "सेटलिंग सॉलिड",
          description: "वॉशिंग के बाद नीचे बैठने वाला धातुयुक्त ठोस।",
          image: localAssetUrl("wash-processing"),
        },
        {
          name: "वॉशिंग से एकत्र ठोस अवशेष",
          description: "सफाई के बाद बचा ठोस धातु अवशेष।",
          image: localAssetUrl("wash-processing"),
        },
        {
          name: "मशीन क्लीनिंग वेस्ट",
          description: "सफाई मशीन से निकला धातुयुक्त वेस्ट।",
          image: localAssetUrl("wash-processing"),
        },
        {
          name: "ट्रे क्लीनिंग अवशेष",
          description: "बर्तनों और ट्रे की साफ़ी से बचा अवशेष।",
          image: localAssetUrl("wash-processing"),
        },
        {
          name: "प्रोसेसिंग फिल्टर अवशेष",
          description: "प्रोसेसिंग फिल्टर में जमा ठोस अवशेष।",
          image: localAssetUrl("wash-processing"),
        },
      ],
    },
    {
      id: "broken-jewellery",
      slug: "broken-jewellery",
      symbol: "ट",
      title: "पुरानी और टूटी ज्वेलरी",
      description:
        "टूटी, अधूरी, पुरानी और उपयोग से बाहर गोल्ड-सिल्वर ज्वेलरी व मेटल स्क्रैप।",
      heroText:
        "टूटी, अधूरी और पुरानी ज्वेलरी से निकले कीमती धातुयुक्त अवशेष।",
      image: "/images/materials/broken-jewellery.svg",
      items: [
        {
          name: "टूटी चेन",
          description: "टूटी हुई चेन और कनेक्टेड धातु हिस्से।",
          image: localAssetUrl("broken-jewellery"),
        },
        {
          name: "टूटी अंगूठी",
          description: "घिसी या टूटी अंगूठी के धातु अवशेष।",
          image: localAssetUrl("broken-jewellery"),
        },
        {
          name: "अधूरी ज्वेलरी",
          description: "निर्माण के दौरान अधूरी ज्वेलरी के टूटे भाग।",
          image: localAssetUrl("broken-jewellery"),
        },
        {
          name: "पुरानी ज्वेलरी",
          description: "पुरानी और उपयोग से बाहर कीमती ज्वेलरी सामग्री।",
          image: localAssetUrl("broken-jewellery"),
        },
        {
          name: "क्षतिग्रस्त ज्वेलरी",
          description: "खराब या क्षतिग्रस्त गोल्ड-सिल्वर हार्डवेयर।",
          image: localAssetUrl("broken-jewellery"),
        },
        {
          name: "निर्माण वापसी",
          description: "ज्वेलरी निर्माण वापसी या त्रुटि से निकला स्क्रैप।",
          image: localAssetUrl("broken-jewellery"),
        },
      ],
    },
    {
      id: "electronic-precious",
      slug: "electronic-precious",
      symbol: "इ",
      title: "इलेक्ट्रॉनिक और गोल्ड प्लेटेड स्क्रैप",
      description:
        "कीमती धातुयुक्त प्रोसेसर, कनेक्टर, कॉन्टैक्ट और चयनित इलेक्ट्रॉनिक स्क्रैप।",
      heroText:
        "चयनित इलेक्ट्रॉनिक स्क्रैप जिसमें गोल्ड प्लेटेड कनेक्टर्स और संपर्क होते हैं।",
      image: "/images/materials/electronic-precious.svg",
      items: [
        {
          name: "CPU / प्रोसेसर",
          description: "सिरेमिक प्रोसेसर और कीमती कंटैक्ट के साथ बोर्ड पार्ट्स।",
          image: localAssetUrl("electronic-precious"),
        },
        {
          name: "आईसी",
          description: "इंटीग्रेटेड सर्किट जिसमें कीमती धातु प्लेटिंग हो सकती है।",
          image: localAssetUrl("electronic-precious"),
        },
        {
          name: "गोल्ड फिंगर्स",
          description: "PCB पर स्वर्ण-लेपित कनेक्शन फिंगर्स और पैड।",
          image: localAssetUrl("electronic-precious"),
        },
        {
          name: "गोल्ड प्लेटेड पिन",
          description: "स्वर्ण-लेपित पिन और संपर्क जो रिकवरी के लिए उपयुक्त हैं।",
          image: localAssetUrl("electronic-precious"),
        },
        {
          name: "कनेक्टर्स",
          description: "कीमती धातुयुक्त इलेक्ट्रॉनिक कनेक्टर्स और प्लग।",
          image: localAssetUrl("electronic-precious"),
        },
        {
          name: "कॉन्टैक्ट्स",
          description: "सर्किट के संपर्क प्वाइंट पर जमा स्वर्ण या धातु लेप।",
          image: localAssetUrl("electronic-precious"),
        },
      ],
    },
  ];
}

export function createDefaultAdminState(): AdminState {
  return {
    rates: {
      gold: "₹ 7,450 / 10g",
      silver: "₹ 95 / 10g",
      platinum: "₹ 3,200 / 10g",
      palladium: "₹ 2,800 / 10g",
    },
    materials: [
      {
        id: "gold",
        title: "गोल्ड स्क्रैप",
        description: "पुराने सोने के आभूषण, कच्चे टुकड़े और इलेक्ट्रॉनिक गोल्ड मटेरियल।",
        image: "https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "silver",
        title: "सिल्वर स्क्रैप",
        description: "सिल्वर वॉयर, प्लेटेड पार्ट्स और इंडस्ट्रियल सिल्वर मटेरियल।",
        image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "platinum",
        title: "प्लेटिनम स्क्रैप",
        description: "प्लेटिनम युक्त कनेक्टर, कैटलिटिक पार्ट्स और इंडस्ट्रियल स्क्रैप।",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
      },
      {
        id: "palladium",
        title: "पैलेडियम स्क्रैप",
        description: "पैलेडियम युक्त इलेक्ट्रॉनिक भाग और ऑटोमोटिव किट।",
        image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
      },
    ],
    categories: createDefaultCategories(),
    contact: {
      mobile: "+91 98765 43210",
      whatsapp: "+91 98765 43210",
      address: "दिल्ली, भारत",
      email: "info@niyarewala.com",
    },
    homepage: {
      heading: "कीमती धातुओं की प्रोफेशनल रीसाइक्लिंग",
      description: "सोना, चांदी, प्लेटिनम और पैलेडियम युक्त स्क्रैप की खरीद और रिकवरी।",
    },
    metalPriceSettings: getDefaultMetalPriceSettings(),
  };
}

export function loadAdminState(): AdminState {
  if (typeof window === "undefined") {
    return createDefaultAdminState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return createDefaultAdminState();
    }

    const parsed = JSON.parse(raw) as Partial<AdminState>;
    const defaults = createDefaultAdminState();

    return {
      rates: {
        ...defaults.rates,
        ...parsed.rates,
      },
      materials: parsed.materials?.length ? parsed.materials : defaults.materials,
      categories: parsed.categories?.length ? parsed.categories : defaults.categories,
      contact: {
        ...defaults.contact,
        ...parsed.contact,
      },
      homepage: {
        ...defaults.homepage,
        ...parsed.homepage,
      },
      metalPriceSettings: {
        ...defaults.metalPriceSettings,
        ...parsed.metalPriceSettings,
        gold999Adjustment: {
          ...defaults.metalPriceSettings.gold999Adjustment,
          ...parsed.metalPriceSettings?.gold999Adjustment,
        },
        gold995Adjustment: {
          ...defaults.metalPriceSettings.gold995Adjustment,
          ...parsed.metalPriceSettings?.gold995Adjustment,
        },
        silver999Adjustment: {
          ...defaults.metalPriceSettings.silver999Adjustment,
          ...parsed.metalPriceSettings?.silver999Adjustment,
        },
        manualPrices: {
          ...defaults.metalPriceSettings.manualPrices,
          ...parsed.metalPriceSettings?.manualPrices,
        },
      },
    };
  } catch {
    return createDefaultAdminState();
  }
}

export function saveAdminState(state: AdminState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
