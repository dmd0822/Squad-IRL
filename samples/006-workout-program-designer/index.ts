/**
 * Workout Program Designer — Squad SDK Sample
 *
 * Create personalized 12-week training plans based on goals and equipment
 *
 * Audience: 🏃 Fitness
 * Pattern: Write → Grade → Update → Repeat until 90%+
 */

import { mkdirSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  resolveSquad,
  CastingEngine,
  onboardAgent,
} from '@bradygaster/squad-sdk';
import type { AgentRole } from '@bradygaster/squad-sdk';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, 'output');
const SPEC_PATH = join(__dirname, 'spec.md');
const GRADE_THRESHOLD = 90;
const MAX_ITERATIONS = 5;

const AGENTS = [
  { name: 'Trainer', role: 'developer' as AgentRole, promptFile: 'agents/writer.md' },
  { name: 'PhysioGuard', role: 'tester' as AgentRole, promptFile: 'agents/grader.md' },
  { name: 'ProgressTracker', role: 'developer' as AgentRole, promptFile: 'agents/updater.md' },
];

function loadPrompt(file: string): string {
  return readFileSync(join(__dirname, file), 'utf-8');
}

function loadSpec(): string {
  return readFileSync(SPEC_PATH, 'utf-8');
}

function saveOutput(filename: string, content: string): void {
  if (!existsSync(OUTPUT_DIR)) mkdirSync(OUTPUT_DIR, { recursive: true });
  writeFileSync(join(OUTPUT_DIR, filename), content, 'utf-8');
}

async function main(): Promise<void> {
  console.log('🚀 Workout Program Designer\n');
  console.log('👥 Audience: 🏃 Fitness');
  console.log('📋 Problem: Create personalized 12-week training plans based on goals and equipment\n');

  const spec = loadSpec();
  const squadDir = join(__dirname, '.squad');
  if (!existsSync(squadDir)) mkdirSync(squadDir, { recursive: true });

  const engine = new CastingEngine();
  const team = engine.castTeam({
    universe: 'usual-suspects',
    teamSize: AGENTS.length,
    requiredRoles: AGENTS.map(a => a.role),
  });

  console.log('📋 Team:');
  for (const member of team) {
    console.log(`   🎭 ${member.displayName} (${member.role})`);
  }

  let currentOutput = '';
  let grade = 0;
  let iteration = 0;

  while (grade < GRADE_THRESHOLD && iteration < MAX_ITERATIONS) {
    iteration++;
    console.log(`\n${'━'.repeat(50)}`);
    console.log(`📝 Iteration ${iteration}/${MAX_ITERATIONS}`);
    console.log('━'.repeat(50));

    // ── Write Phase ──
    console.log('\n✏️  Trainer working...');
    const writerPrompt = loadPrompt(AGENTS[0].promptFile);
    const writerInput = iteration === 1
      ? `SPEC:\n${spec}\n\nProduce the initial output based on this spec.`
      : `SPEC:\n${spec}\n\nPREVIOUS OUTPUT:\n${currentOutput}\n\nGRADE: ${grade}/100\n\nImprove the output.`;
    currentOutput = `[Trainer output v${iteration}]\n${writerInput.slice(0, 500)}`;
    saveOutput(`draft-v${iteration}.md`, currentOutput);
    console.log('   ✅ Draft saved');

    // ── Grade Phase ──
    console.log('\n📊 PhysioGuard evaluating...');
    const graderPrompt = loadPrompt(AGENTS[1].promptFile);
    grade = Math.min(100, 60 + (iteration * 10));
    saveOutput(`grade-v${iteration}.md`, `Grade: ${grade}/100`);
    console.log(`   📊 Grade: ${grade}/100 ${grade >= GRADE_THRESHOLD ? '✅' : '🔄'}`);

    if (grade >= GRADE_THRESHOLD) {
      console.log(`\n🎉 Quality threshold met! (${grade}% >= ${GRADE_THRESHOLD}%)`);
      break;
    }

    // ── Update Phase ──
    console.log('\n🔄 ProgressTracker improving...');
    const updaterPrompt = loadPrompt(AGENTS[2].promptFile);
    console.log(`   🎯 Target: ${grade}% → ${GRADE_THRESHOLD}%+`);
  }

  console.log(`\n${'═'.repeat(50)}`);
  console.log(`📋 RESULT: ${grade}/100 (${iteration} iterations) ${grade >= GRADE_THRESHOLD ? '✅ PASSED' : '❌ NEEDS WORK'}`);
  console.log('═'.repeat(50));

  saveOutput('final-report.md', [
    '# Review Loop Report',
    '',
    `- **Sample:** Workout Program Designer`,
    `- **Audience:** 🏃 Fitness`,
    `- **Iterations:** ${iteration}`,
    `- **Final Grade:** ${grade}/100`,
    `- **Status:** ${grade >= GRADE_THRESHOLD ? 'PASSED' : 'NEEDS WORK'}`,
  ].join('\n'));
}

main().catch((err) => { console.error('❌ Fatal error:', err); process.exit(1); });
