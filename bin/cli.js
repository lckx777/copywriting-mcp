#!/usr/bin/env node
'use strict';
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

const SERVER_DIR = path.join(__dirname, '..', 'server');
const CLAUDE_HOME = path.join(os.homedir(), '.claude');
const PLUGIN_DIR = path.join(CLAUDE_HOME, 'plugins', 'copywriting-mcp');

const args = process.argv.slice(2);
const cmd = args[0] || 'help';

switch (cmd) {
  case 'install': {
    console.log('Copywriting MCP Server — Installing...\n');

    // 1. Copy server to plugin directory
    console.log('[1/4] Copying server files...');
    fs.mkdirSync(PLUGIN_DIR, { recursive: true });
    fs.cpSync(SERVER_DIR, PLUGIN_DIR, { recursive: true, force: true });
    console.log(`   Installed to: ${PLUGIN_DIR}`);

    // 2. Install dependencies
    console.log('[2/4] Installing dependencies...');
    execSync('npm install', { cwd: PLUGIN_DIR, stdio: 'inherit' });

    // 3. Build
    console.log('[3/4] Building server...');
    try {
      // Try bun build first (faster)
      execSync('bun build src/server.ts --outdir dist --target node', { cwd: PLUGIN_DIR, stdio: 'pipe' });
      console.log('   Built with Bun');
    } catch {
      // Fallback to npx tsx or esbuild
      try {
        execSync('npx esbuild src/server.ts --bundle --platform=node --target=node18 --outfile=dist/server.js --format=esm --external:better-sqlite3 --external:fastembed',
          { cwd: PLUGIN_DIR, stdio: 'pipe' });
        console.log('   Built with esbuild');
      } catch (e) {
        console.log('   WARNING: Build failed — server can still run via: npx tsx src/server.ts');
      }
    }

    // 4. Init database
    console.log('[4/4] Initializing database...');
    fs.mkdirSync(path.join(PLUGIN_DIR, 'data'), { recursive: true });
    try {
      execSync('node dist/server.js --init-db 2>/dev/null || true', { cwd: PLUGIN_DIR, stdio: 'pipe' });
    } catch { /* db init optional */ }

    // 5. Update mcp.json
    const mcpPath = path.join(CLAUDE_HOME, 'mcp.json');
    let mcpConfig = {};
    if (fs.existsSync(mcpPath)) {
      try { mcpConfig = JSON.parse(fs.readFileSync(mcpPath, 'utf8')); } catch {}
    }
    mcpConfig.mcpServers = mcpConfig.mcpServers || {};
    mcpConfig.mcpServers.copywriting = {
      command: 'node',
      args: [path.join(PLUGIN_DIR, 'dist', 'server.js')],
      env: {
        COPYWRITING_ECOSYSTEM: process.env.COPYWRITING_ECOSYSTEM || path.join(os.homedir(), 'copywriting-ecosystem')
      }
    };
    fs.writeFileSync(mcpPath, JSON.stringify(mcpConfig, null, 2) + '\n');
    console.log('   mcp.json updated');

    console.log('\nCopywriting MCP Server installed!');
    console.log('   Tools: validate_gate, blind_critic, black_validation, emotional_stress_test,');
    console.log('          layered_review, write_chapter, mecanismo_unico, phase_context,');
    console.log('          semantic_memory_search, voc_search');
    break;
  }

  case 'start': {
    console.log('Starting Copywriting MCP Server...');
    const distServer = path.join(PLUGIN_DIR, 'dist', 'server.js');
    if (fs.existsSync(distServer)) {
      execSync(`node ${distServer}`, { stdio: 'inherit' });
    } else {
      console.log('Server not built. Run: copywriting-mcp install');
      process.exit(1);
    }
    break;
  }

  case 'tools': {
    console.log('Available MCP Tools:');
    console.log('  validate_gate          — Phase gate validation');
    console.log('  blind_critic           — Blind copy critique');
    console.log('  black_validation       — Final quality gate');
    console.log('  emotional_stress_test  — Emotional stress test');
    console.log('  layered_review         — Multi-layer review');
    console.log('  write_chapter          — Write VSL chapter');
    console.log('  mecanismo_unico        — Manage unique mechanism');
    console.log('  phase_context          — Get phase context');
    console.log('  semantic_memory_search  — Search semantic memory');
    console.log('  voc_search             — Search VOC database');
    break;
  }

  default:
    console.log('Copywriting MCP Server');
    console.log('');
    console.log('Commands:');
    console.log('  install  — Install server to ~/.claude/plugins/copywriting-mcp/');
    console.log('  start    — Start MCP server');
    console.log('  tools    — List available tools');
}
