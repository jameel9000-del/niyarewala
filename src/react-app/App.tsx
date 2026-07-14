import "./App.css";

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="brand">
          <div className="logo">♻</div>
          <div>
            <h1>NIYARE WALA</h1>
            <p>सोना चांदी रीसाइकलिंग</p>
          </div>
        </div>
      </header>

      <main className="container">
        <div className="title">
          <h2>आज का सोना चांदी भाव</h2>
          <p>Gold & Silver Rate</p>
        </div>

        <div className="rate-card gold">
          <div className="rate-info">
            <span className="icon">●</span>
            <div>
              <h3>GOLD 999</h3>
              <p>24 कैरेट सोना</p>
            </div>
          </div>

          <div className="price">
            <span>₹</span>
            <strong>--</strong>
          </div>
        </div>

        <div className="rate-card silver">
          <div className="rate-info">
            <span className="icon">●</span>
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

        <div className="update">
          भाव बाजार के अनुसार बदल सकते हैं
        </div>
      </main>

      <footer>
        © NIYARE WALA
      </footer>
    </div>
  );
}

export default App;
