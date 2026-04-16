#!/usr/bin/env node
/**
 * AI failure analysis script
 *
 * Reads test-results/results.json from a Playwright run,
 * extracts failed tests with their error messages and steps,
 * and asks Claude to produce a concise root-cause summary.
 *
 * Output: test-results/ai-summary.md
 *
 * Requires: ANTHROPIC_API_KEY environment variable
 *
 * Usage:
 *   npm run test:broken        # runs tests, writes test-results/results.json
 *   npm run analyze            # reads results, calls Claude, writes ai-summary.md
 */

const fs = require("fs");
const path = require("path");

const RESULTS_FILE = path.join(process.cwd(), "test-results", "results.json");
const OUTPUT_FILE = path.join(process.cwd(), "test-results", "ai-summary.md");

async function main() {
  // Check for API key up front — give a clear error rather than a silent no-op
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error("❌  ANTHROPIC_API_KEY is not set.");
    console.error("    Export it before running: export ANTHROPIC_API_KEY=sk-ant-...");
    process.exit(1);
  }

  console.log(`Looking for results at: ${RESULTS_FILE}`);

  if (!fs.existsSync(RESULTS_FILE)) {
    console.error(`❌  ${RESULTS_FILE} not found.`);
    console.error("    Run the tests first: npm run test:broken");
    process.exit(1);
  }

  const results = JSON.parse(fs.readFileSync(RESULTS_FILE, "utf8"));

  // Extract failed tests
  const failures = [];
  for (const suite of results.suites || []) {
    collectFailures(suite, failures);
  }

  if (failures.length === 0) {
    console.log("✅  No failures found in results.json — nothing to analyse.");
    process.exit(0);
  }

  console.log(`Found ${failures.length} failing test(s). Calling Claude for analysis...`);

  const prompt = buildPrompt(failures, results);
  const summary = await callClaude(prompt);

  // Ensure output directory exists and write the summary
  fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
  fs.writeFileSync(OUTPUT_FILE, summary, "utf8");

  console.log(`\n✅  AI summary written to: ${OUTPUT_FILE}`);
  console.log("\n" + "─".repeat(60) + "\n");
  console.log(summary);
  console.log("\n" + "─".repeat(60));
}

function collectFailures(suite, failures) {
  for (const spec of suite.specs || []) {
    for (const test of spec.tests || []) {
      for (const result of test.results || []) {
        if (result.status === "failed" || result.status === "timedOut") {
          failures.push({
            title: [...(suite.title ? [suite.title] : []), spec.title].join(" > "),
            file: spec.file || "",
            error: result.error?.message || "Unknown error",
            snippet: result.error?.snippet || "",
            duration: result.duration,
            retries: result.retry || 0,
            steps: (result.steps || [])
              .filter((s) => s.error)
              .map((s) => `${s.title}: ${s.error?.message || ""}`)
              .join("\n"),
          });
        }
      }
    }
  }
  for (const child of suite.suites || []) {
    collectFailures(child, failures);
  }
}

function buildPrompt(failures, results) {
  // Playwright JSON stats: unexpected = failures, expected = passes, skipped = skipped
  const stats = results.stats || {};
  const total = (stats.unexpected || 0) + (stats.expected || 0) + (stats.skipped || 0);
  const failed = stats.unexpected || 0;
  const passed = stats.expected || 0;

  const failureBlocks = failures
    .slice(0, 10)
    .map(
      (f, i) => `### Failure ${i + 1}: ${f.title}
File: ${f.file}
${f.retries > 0 ? `Retried: ${f.retries} time(s)\n` : ""}
Error:
\`\`\`
${f.error.substring(0, 800)}
\`\`\`
${f.snippet ? `\nCode at failure point:\n\`\`\`\n${f.snippet.substring(0, 300)}\n\`\`\`` : ""}
${f.steps ? `\nFailed steps:\n${f.steps}` : ""}`
    )
    .join("\n\n---\n\n");

  return `You are a test automation engineer reviewing a failed Playwright E2E test run.

## Test run summary
- Total tests: ${total}
- Passed: ${passed}
- Failed: ${failed}

## Failed tests

${failureBlocks}

## Your task

Write a concise failure analysis in Markdown with these sections:

1. **Summary** (2-3 sentences max): What broke and what type of failures are these?
2. **Root causes** (bullet list): The likely reason(s) for each distinct failure pattern. Group related failures together.
3. **Recommended fixes** (bullet list): Concrete next steps to resolve the failures.
4. **Flakiness assessment**: Are these failures likely flaky (timing/network issues) or structural (UI changed, logic broken)?

Keep the whole response under 400 words. Be direct and actionable — this will be posted as a PR comment.
Start with: ## 🎭 AI Test Failure Analysis`;
}

async function callClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Claude API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  return data.content[0]?.text || "No analysis returned.";
}

main().catch((err) => {
  console.error(`\n❌  Analysis failed: ${err.message}`);
  process.exit(1);
});
