import React from 'react';
function Landing() {
  return (
    <>
      {/* HERO */}
      <section className="hero">
  <div className="hero-content">
    <h1>
      Smart Waste <br /> Management Platform
    </h1>
    <p>
      A modern system to manage urban waste operations efficiently.
    </p>
    <a href="/authority" className="btn">
      View Dashboard
    </a>
  </div>
</section>


      <section className="section-light">
  <div className="container split-section">
    <div>
      <h2>The Problem</h2>
      <p>
        Urban waste management often suffers from poor coordination,
        lack of visibility, and inefficient resource utilization.
      </p>
    </div>

    <div>
      <h2>The Solution</h2>
      <p>
        A centralized platform that manages bins, vehicles, drivers,
        and authorities through structured data and workflows.
      </p>
    </div>
  </div>
</section>

      <section className="section-muted">
  <div className="container">
    <h2>Core Capabilities</h2>

    <div className="feature-grid">
      <div className="feature-card">
        🗑️
        <h4>Smart Bin Monitoring</h4>
        <p>Track bin status and collection needs.</p>
      </div>

      <div className="feature-card">
        🚛
        <h4>Fleet Management</h4>
        <p>Manage vehicles and optimize routes.</p>
      </div>

      <div className="feature-card">
        👷
        <h4>Driver Assignment</h4>
        <p>Assign and manage collection drivers.</p>
      </div>

      <div className="feature-card">
        📊
        <h4>Data-Driven System</h4>
        <p>Structured relational DBMS backend.</p>
      </div>
    </div>
  </div>
</section>


      <section>
  <div className="cta-box">
    <h2>Ready to Manage Waste Smarter?</h2>
    <p>Access the internal dashboard and start managing operations.</p>
    <a href="/authority" className="btn">
      Go to Dashboard
    </a>
  </div>
</section>

    </>
  );
}

export default Landing;
