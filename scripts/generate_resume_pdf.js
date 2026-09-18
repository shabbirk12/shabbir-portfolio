const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shabbir Khan — Resume / CV</title>
  <style>
    @page {
      size: A4;
      margin: 14mm 16mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      color: #111;
      background: #fff;
      line-height: 1.45;
      font-size: 9.5pt;
    }
    .header {
      margin-bottom: 14px;
    }
    h1 {
      font-size: 22pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: -0.5px;
      line-height: 1.1;
      color: #000;
    }
    .subtitle {
      font-family: monospace;
      font-size: 9pt;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #1a7a3e;
      margin-top: 4px;
    }
    .contacts {
      margin-top: 8px;
      font-family: monospace;
      font-size: 8pt;
      color: #444;
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .contacts a {
      color: #111;
      text-decoration: none;
    }
    .divider {
      border: none;
      border-top: 1.5px solid #222;
      margin: 12px 0 14px 0;
    }
    .section {
      margin-bottom: 14px;
    }
    .section-title {
      font-family: monospace;
      font-size: 8.5pt;
      font-weight: 800;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #000;
      border-bottom: 1px solid #ccc;
      padding-bottom: 3px;
      margin-bottom: 6px;
    }
    .summary-text {
      font-size: 9pt;
      line-height: 1.5;
      color: #222;
    }
    .skills-row {
      display: flex;
      margin-bottom: 5px;
      font-size: 8.5pt;
    }
    .skills-label {
      width: 110px;
      font-weight: 700;
      font-family: monospace;
      color: #000;
      flex-shrink: 0;
    }
    .skills-val {
      color: #333;
    }
    .exp-item {
      margin-bottom: 11px;
    }
    .exp-header {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .exp-title {
      font-size: 10pt;
      font-weight: 700;
      text-transform: uppercase;
      color: #000;
    }
    .exp-dates {
      font-family: monospace;
      font-size: 8pt;
      font-weight: 600;
      color: #333;
    }
    .exp-sub {
      font-family: monospace;
      font-size: 8pt;
      color: #555;
      margin-top: 1px;
      margin-bottom: 4px;
    }
    ul {
      list-style-type: square;
      padding-left: 16px;
      font-size: 8.5pt;
      color: #222;
    }
    li {
      margin-bottom: 3px;
      line-height: 1.4;
    }
    .edu-row {
      display: flex;
      justify-content: space-between;
      align-items: baseline;
    }
    .edu-title {
      font-weight: 700;
      font-size: 9pt;
      color: #000;
    }
    .edu-sub {
      font-size: 8pt;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Shabbir Khan</h1>
    <div class="subtitle">Web Developer &amp; Graphic Designer</div>
    <div class="contacts">
      <a href="mailto:contact@shabbirkhan.dev">contact@shabbirkhan.dev</a> ·
      <span>Islamabad, Pakistan</span> ·
      <a href="https://shabbirkhan.dev">shabbirkhan.dev</a> ·
      <a href="https://linkedin.com/in/shabbirk">linkedin.com/in/shabbirk</a> ·
      <a href="https://github.com/shabbirk12">github.com/shabbirk12</a> ·
      <a href="https://instagram.com/shabbirk.design">instagram.com/shabbirk.design</a>
    </div>
  </div>

  <hr class="divider" />

  <div class="section">
    <div class="section-title">Executive Profile &amp; Summary</div>
    <p class="summary-text">
      Hybrid designer-developer with multidisciplinary expertise architecting distinct brand identities and engineering production-grade full-stack web applications. Specializing in high-impact campaign systems for the hospitality and events scene, custom Next.js applications, and conversion-focused digital products. Proven track record turning complex briefs into iconic visual languages and clean, scalable code.
    </p>
  </div>

  <div class="section">
    <div class="section-title">Core Skills &amp; Toolkit</div>
    <div class="skills-row">
      <span class="skills-label">DESIGN</span>
      <span class="skills-val">Brand Identity Systems, Art Direction, Adobe Photoshop, Illustrator, InDesign, Figma, Typography, Print &amp; Packaging</span>
    </div>
    <div class="skills-row">
      <span class="skills-label">ENGINEERING</span>
      <span class="skills-val">React, Next.js 14, TypeScript, Node.js · Express, PostgreSQL, Supabase, Tailwind CSS, Python, REST APIs</span>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Professional Experience</div>

    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-title">Lead Freelance Designer &amp; Creative Developer</span>
        <span class="exp-dates">2021 — PRESENT</span>
      </div>
      <div class="exp-sub">Self-employed · Global Clients — Brand &amp; Full-Stack Web Platforms</div>
      <ul>
        <li>Designed end-to-end brand identity and multi-page web platform for luxury asset firm The Camden Brokers in London.</li>
        <li>Shipped 15+ bespoke brand systems for London and international nightlife, club nights, and hospitality venues.</li>
        <li>Engineered custom Next.js/React web applications with interactive 3D particle shaders and sub-second load times.</li>
        <li>Delivered physical menu systems, packaging, and large-format festival key art ready for high-volume commercial print.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-title">Full-Stack Product Engineer — WatBee WhatsApp SaaS</span>
        <span class="exp-dates">2025 — PRESENT</span>
      </div>
      <div class="exp-sub">WatBee Product Team · Automated Conversational Platform</div>
      <ul>
        <li>Architected frontend UI and backend microservice sidecar keeping WhatsApp Web QR sessions alive independently.</li>
        <li>Built responsive client portal and campaign broadcasting queue with FastAPI, Node.js, and MongoDB.</li>
        <li>Reduced onboarding friction by 60% through streamlined conversational QR scanning and interactive preview states.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <span class="exp-title">Brand &amp; Visual Designer</span>
        <span class="exp-dates">2021 — 2024</span>
      </div>
      <div class="exp-sub">Hospitality, Events &amp; Creative Venues — Visual Identity &amp; Digital Collateral</div>
      <ul>
        <li>Crafted visual identity packages, typographic layouts, and social campaign assets for high-profile hospitality brands.</li>
        <li>Collaborated closely with venue managers, event promoters, and marketing teams to meet strict turnaround deadlines.</li>
      </ul>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Education &amp; Credentials</div>
    <div class="edu-row">
      <div>
        <div class="edu-title">Bachelor of Science in Computer Science / Visual Media</div>
        <div class="edu-sub">Specialization in Human-Computer Interaction &amp; Digital Design</div>
      </div>
      <div class="exp-dates">Islamabad, PK</div>
    </div>
  </div>
</body>
</html>`;

const tempHtmlPath = path.resolve(__dirname, "../temp_resume.html");
const outputPdfPath = path.resolve(__dirname, "../public/cv.pdf");

fs.writeFileSync(tempHtmlPath, htmlContent);

const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

let bin = "";
if (fs.existsSync(chromePath)) bin = chromePath;
else if (fs.existsSync(edgePath)) bin = edgePath;
else throw new Error("No Chrome or Edge browser found to render PDF.");

console.log(`Using browser: ${bin}`);
execSync(`"${bin}" --headless --disable-gpu --run-all-compositor-stages-before-draw --no-pdf-header-footer --print-to-pdf="${outputPdfPath}" "file:///${tempHtmlPath.replace(/\\\\/g, "/")}"`);

console.log(`Generated: ${outputPdfPath}`);
fs.unlinkSync(tempHtmlPath);
