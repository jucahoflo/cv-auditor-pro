const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

function run(cmd, cwd) {
  console.log(`\n▶ ${cmd}`);
  execSync(cmd, {
    cwd,
    stdio: "inherit",
    shell: true
  });
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Carpeta creada: ${dirPath}`);
  }
}

function writeFile(filePath, content = "") {
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`📄 Archivo creado: ${filePath}`);
}

const root = path.join(process.cwd(), "cv-auditor-pro");

ensureDir(root);

// ===== FRONTEND =====
const frontend = path.join(root, "frontend");
ensureDir(frontend);

if (!fs.existsSync(path.join(frontend, "package.json"))) {
  run("npm create vite@latest . -- --template react", frontend);
  run("npm install", frontend);
  run("npm install marked", frontend);
} else {
  console.log("ℹ️ Frontend ya existe, se omite creación.");
}

// ===== BACKEND =====
const backend = path.join(root, "backend");
ensureDir(backend);

if (!fs.existsSync(path.join(backend, "package.json"))) {
  run("npm init -y", backend);
  run("npm install express cors multer dotenv node-fetch pdf-parse stripe", backend);
} else {
  console.log("ℹ️ Backend ya existe, se omite npm init.");
}

ensureDir(path.join(backend, "routes"));
ensureDir(path.join(backend, "services"));

writeFile(path.join(backend, "server.js"));
writeFile(path.join(backend, ".env"));
writeFile(path.join(backend, "routes", "analyze.js"));
writeFile(path.join(backend, "routes", "optimize.js"));
writeFile(path.join(backend, "routes", "payments.js"));
writeFile(path.join(backend, "services", "groqService.js"));
writeFile(path.join(backend, "services", "pdfService.js"));

console.log("\n✅ Estructura completa creada correctamente.");
console.log(`📍 Ruta: ${root}`);