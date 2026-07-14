import "./App.css";

function App() {
  return (
    <div className="app">
      {/* HEADER */}
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

      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <span className="hero-tag">PRECIOUS METAL RECYCLING</span>

          <h2>
            कीमती धातुओं की
            <br />
            <span>प्रोफेशनल रीसाइक्लिंग</span>
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

      {/* LIVE RATES */}
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

        <div className="rate-update">
          ♻ भाव बाजार के अनुसार बदल सकते हैं
        </div>
      </section>

      {/* MATERIALS */}
      <section id="materials" className="materials-section">
        <div className="section-heading">
          <span>WE BUY & RECYCLE</span>
          <h2>हम क्या खरीदते हैं</h2>
          <p>कीमती धातु युक्त विभिन्न प्रकार का स्क्रैप</p>
        </div>

        <div className="materials-grid">
          <div className="material-card">
            <div className="material-symbol">Au</div>
            <h3>गोल्ड स्क्रैप</h3>
            <p>
              गोल्ड युक्त इंडस्ट्रियल स्क्रैप, इलेक्ट्रॉनिक स्क्रैप और
              अन्य गोल्ड मटेरियल।
            </p>
          </div>

          <div className="material-card">
            <div className="material-symbol">Ag</div>
            <h3>सिल्वर स्क्रैप</h3>
            <p>
              सिल्वर कॉन्टैक्ट, सिल्वर प्लेटेड मटेरियल और इंडस्ट्रियल
              सिल्वर स्क्रैप।
            </p>
          </div>

          <div className="material-card">
            <div className="material-symbol">Pt</div>
            <h3>प्लेटिनम स्क्रैप</h3>
            <p>
              प्लेटिनम युक्त इंडस्ट्रियल मटेरियल और विभिन्न प्रकार के
              कीमती धातु स्क्रैप।
            </p>
          </div>

          <div className="material-card">
            <div className="material-symbol">Pd</div>
            <h3>पैलेडियम स्क्रैप</h3>
            <p>
              पैलेडियम युक्त इलेक्ट्रॉनिक और इंडस्ट्रियल स्क्रैप की
              खरीद एवं प्रोसेसिंग।
            </p>
          </div>

          <div className="material-card">
            <div className="material-symbol">PCB</div>
            <h3>ई-वेस्ट और PCB</h3>
            <p>
              मोबाइल बोर्ड, कंप्यूटर बोर्ड और कीमती धातु युक्त
              इलेक्ट्रॉनिक स्क्रैप।
            </p>
          </div>

          <div className="material-card">
            <div className="material-symbol">♻</div>
            <h3>इंडस्ट्रियल स्क्रैप</h3>
            <p>
              Precious metal bearing dust, crucible और अन्य प्रोसेस
              मटेरियल।
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS */}
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

      {/* ABOUT */}
      <section id="about" className="about-section">
        <div className="about-box">
          <div className="about-content">
            <span>ABOUT NIYARE WALA</span>

            <h2>कीमती धातु रिकवरी में अनुभव</h2>

            <p>
              NIYARE WALA सोना, चांदी, प्लेटिनम, पैलेडियम और अन्य
              कीमती धातु युक्त स्क्रैप की रीसाइक्लिंग और रिकवरी के
              क्षेत्र में कार्य करता है।
            </p>

            <p>
              हमारा उद्देश्य मटेरियल की सही पहचान, सही मूल्यांकन और
              प्रोफेशनल रीसाइक्लिंग है।
            </p>
          </div>

          <div className="experience-card">
            <strong>28+</strong>
            <span>वर्षों का अनुभव</span>
            <p>PRECIOUS METAL RECOVERY</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <div className="contact-content">
          <span>CONTACT US</span>

          <h2>अपना स्क्रैप बेचना चाहते हैं?</h2>

          <p>
            गोल्ड, सिल्वर, प्लेटिनम या पैलेडियम युक्त स्क्रैप के लिए
            हमसे संपर्क करें।
          </p>

          <button className="contact-btn">संपर्क करें</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div>
          <h2>NIYARE WALA</h2>
          <p>सोना चांदी रीसाइक्लिंग</p>
        </div>

        <div className="footer-metals">
          GOLD • SILVER • PLATINUM • PALLADIUM
        </div>

        <p>© NIYARE WALA</p>
      </footer>
    </div>
  );
}

export default App;
