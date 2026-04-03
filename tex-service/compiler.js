const express = require("express");
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const app = express();
app.use(express.json({ limit: "5mb" }));

app.get("/", (req, res) => {
  res.json({ status: "TeX Compiler Service Running", engine: "pdflatex" });
});

app.post("/compile", async (req, res) => {
  const { latex } = req.body;
  if (!latex) return res.status(400).json({ error: "Missing 'latex' field" });

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "texcompile-"));
  const texPath = path.join(tmpDir, "resume.tex");
  const pdfPath = path.join(tmpDir, "resume.pdf");

  try {
    fs.writeFileSync(texPath, latex);

    // Run pdflatex twice for cross-references
    execSync(`pdflatex -interaction=nonstopmode -output-directory=${tmpDir} ${texPath}`, {
      timeout: 30000,
    });
    execSync(`pdflatex -interaction=nonstopmode -output-directory=${tmpDir} ${texPath}`, {
      timeout: 30000,
    });

    if (!fs.existsSync(pdfPath)) {
      return res.status(500).json({ error: "PDF generation failed" });
    }

    const pdfBuffer = fs.readFileSync(pdfPath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=resume.pdf");
    res.send(pdfBuffer);
  } catch (err) {
    console.error("LaTeX Compilation Error:", err.message);
    res.status(500).json({ error: "LaTeX compilation failed", details: err.message });
  } finally {
    // Cleanup
    try {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    } catch {}
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`TeX Compiler Service running on port ${PORT}`);
});
