#!/usr/bin/env node
/**
 * integrity-check.js
 * AXIOLEDGER Security — File Integrity Monitoring
 *
 * Cron: 0 0 * * * root /usr/bin/node /root/core/scripts/integrity-check.js >> /root/logs/security.log 2>&1
 *
 * Quét toàn vẹn tệp tin /root — phục vụ Legal Audit Trail
 * Thuật toán: SHA-256 checksum mỗi file quan trọng
 * So sánh với baseline snapshot → cảnh báo nếu có thay đổi bất thường
 */

"use strict";

const crypto = require("crypto");
const fs     = require("fs");
const path   = require("path");

const VERSION   = "0.0.0";
const SCAN_ROOT = process.env.SCAN_ROOT || "/root";
const BASELINE  = process.env.BASELINE_FILE || "/root/logs/integrity-baseline.json";
const LOG_DIR   = "/root/logs";

// Files and directories to monitor
const MONITOR_PATHS = [
  "/root/core/github/bootstrap.sh",
  "/root/core/github/modal.sh",
  "/root/core/github/w1-create-repo.sh",
  "/root/core/github/w2-security-patch.sh",
  "/root/core/github/w3-branch-protection.sh",
  "/root/core/github/w4-rotate-secrets.sh",
  "/root/core/github/w5-projects.sh",
  "/root/core/github/w6-trigger-actions.sh",
  "/root/core/github/w7-audit.sh",
  "/root/core/api/api-schema-v0.0.0.md",
  "/root/core/api/ans-service-spec.md",
  "/root/ssl/gpia/root-ca/gpia-root.crt",
  "/root/ssl/gpia/gateway/gateway.crt",
  "/etc/nginx/sites-available/axioledger-ecosystem.conf",
];

function log(level, msg, data = {}) {
  const ts = new Date().toISOString();
  console.log(JSON.stringify({ ts, level, service: "integrity-check", version: VERSION, msg, ...data }));
}

function sha256File(filePath) {
  try {
    const content = fs.readFileSync(filePath);
    return crypto.createHash("sha256").update(content).digest("hex");
  } catch {
    return null;
  }
}

function loadBaseline() {
  try {
    return JSON.parse(fs.readFileSync(BASELINE, "utf8"));
  } catch {
    return null;
  }
}

function saveBaseline(snapshot) {
  fs.mkdirSync(path.dirname(BASELINE), { recursive: true });
  fs.writeFileSync(BASELINE, JSON.stringify(snapshot, null, 2), "utf8");
}

async function main() {
  log("info", "File Integrity Monitor — starting scan", { paths: MONITOR_PATHS.length });

  const current_snapshot = {};
  for (const fp of MONITOR_PATHS) {
    const hash = sha256File(fp);
    current_snapshot[fp] = { sha256: hash, exists: hash !== null };
  }

  const baseline = loadBaseline();

  if (!baseline) {
    log("info", "No baseline found — creating initial snapshot");
    saveBaseline({ created_at: new Date().toISOString(), files: current_snapshot });
    log("info", "Baseline created", { files: Object.keys(current_snapshot).length });
    return;
  }

  // Compare
  const alerts = [];
  for (const [fp, curr] of Object.entries(current_snapshot)) {
    const prev = baseline.files[fp];
    if (!prev) {
      alerts.push({ type: "NEW_FILE", path: fp });
    } else if (prev.exists && !curr.exists) {
      alerts.push({ type: "FILE_DELETED", path: fp });
    } else if (curr.exists && prev.sha256 !== curr.sha256) {
      alerts.push({ type: "HASH_CHANGED", path: fp, prev: prev.sha256, curr: curr.sha256 });
    }
  }

  if (alerts.length === 0) {
    log("info", "Integrity check PASSED — all files unchanged", { files_checked: MONITOR_PATHS.length });
  } else {
    for (const alert of alerts) {
      log("warn", "INTEGRITY ALERT", alert);
    }
    log("warn", "Integrity check FLAGGED", { alerts: alerts.length });
  }

  // Update baseline with current snapshot
  saveBaseline({ created_at: new Date().toISOString(), files: current_snapshot });
}

main().catch(err => {
  console.error(JSON.stringify({ ts: new Date().toISOString(), level: "error", service: "integrity-check", error: err.message }));
  process.exit(1);
});
