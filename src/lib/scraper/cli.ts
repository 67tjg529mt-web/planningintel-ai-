#!/usr/bin/env node
// ============================================================
// PlanningIntel AI — CLI Scrape Runner
// Run: npx tsx src/lib/scraper/cli.ts [mode]
// Modes: real, mock, hybrid (default: hybrid)
// ============================================================

import { runScrapeCycle } from './index';

async function main() {
  const args = process.argv.slice(2);
  const mode = (args[0] as 'real' | 'mock' | 'hybrid') || 'hybrid';
  const targetLpas = args[1] ? args[1].split(',') : undefined;

  if (!['real', 'mock', 'hybrid'].includes(mode)) {
    console.error('Usage: npx tsx src/lib/scraper/cli.ts [real|mock|hybrid] [lpaId1,lpaId2,...]');
    process.exit(1);
  }

  console.log(`\n🔍 PlanningIntel AI Scraper`);
  console.log(`   Mode: ${mode}`);
  console.log(`   Target LPAs: ${targetLpas?.join(', ') || 'all (sample)'}`);
  console.log(`   OpenAI Key: ${process.env.OPENAI_API_KEY ? '✅ Set' : '❌ Not set (AI analysis will use defaults)'}`);
  console.log('');

  try {
    const report = await runScrapeCycle({ mode, targetLpas });

    console.log(`\n📊 Scrape Cycle Complete`);
    console.log(`   Duration: ${(report.durationMs / 1000).toFixed(1)}s`);
    console.log(`   LPAs: ${report.successful}/${report.totalLpas} successful`);
    console.log(`   Failed: ${report.failed}`);
    console.log(`   Changes Detected: ${report.changesDetected}`);
    console.log(`   Opportunities Created: ${report.opportunitiesCreated}`);

    if (report.errors.length > 0) {
      console.log(`\n❌ Errors (${report.errors.length}):`);
      report.errors.slice(0, 10).forEach((e) => console.log(`   - ${e}`));
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Scrape cycle failed:', error);
    process.exit(1);
  }
}

main();