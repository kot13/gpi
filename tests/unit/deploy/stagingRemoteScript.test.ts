import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const scriptPath = resolve(process.cwd(), 'scripts/deploy/staging-remote.sh')

function readScript(): string {
  return readFileSync(scriptPath, 'utf8')
}

function stepIndex(source: string, needle: string): number {
  const index = source.indexOf(needle)
  expect(index, `Expected step "${needle}" in deploy script`).toBeGreaterThanOrEqual(0)
  return index
}

describe('staging-remote.sh', () => {
  it('has bash shebang and strict mode', () => {
    const source = readScript()
    expect(source.startsWith('#!/usr/bin/env bash')).toBe(true)
    expect(source).toContain('set -euo pipefail')
  })

  it('requires --commit and --run-id arguments', () => {
    const source = readScript()
    expect(source).toContain('--commit')
    expect(source).toContain('--run-id')
    expect(source).toContain('exit 2')
  })

  it('runs db:push before build and pm2 reload after build', () => {
    const source = readScript()
    const dbPush = stepIndex(source, 'npm run db:push')
    const build = stepIndex(source, 'npm run build')
    const reload = stepIndex(source, 'pm2 reload gpi-staging')
    expect(dbPush).toBeLessThan(build)
    expect(build).toBeLessThan(reload)
  })

  it('updates code via git fetch and reset', () => {
    const source = readScript()
    expect(source).toContain('git fetch origin main')
    expect(source).toContain('git reset --hard')
    expect(source).toContain('npm ci')
  })

  it('aborts with set -e before pm2 reload when db:push or build fail', () => {
    const source = readScript()
    const build = stepIndex(source, 'npm run build')
    const reload = stepIndex(source, 'pm2 reload')
    expect(source).toContain('set -euo pipefail')
    expect(build).toBeLessThan(reload)
    expect(source).not.toContain('pm2 reload || true')
  })

  it('fails with exit 2 when .env is missing', () => {
    const source = readScript()
    expect(source).toContain('Missing .env')
    expect(source).toContain('source .env')
  })

  it('does not log secret env values', () => {
    const source = readScript()
    expect(source).not.toMatch(/echo\s+.*PAYLOAD_SECRET/)
    expect(source).not.toMatch(/echo\s+.*DATABASE_URI/)
    expect(source).not.toMatch(/printenv/)
  })

  it('appends deploy log with run id and commit sha', () => {
    const source = readScript()
    expect(source).toContain('logs/deploy.log')
    expect(source).toContain('run=${RUN_ID}')
    expect(source).toContain('sha=${COMMIT_SHA}')
  })
})
