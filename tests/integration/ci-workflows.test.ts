import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

const ciWorkflowPath = resolve(process.cwd(), '.github/workflows/ci.yml')
const deployWorkflowPath = resolve(process.cwd(), '.github/workflows/deploy-staging.yml')

function readWorkflow(path: string): string {
  return readFileSync(path, 'utf8')
}

describe('ci.yml workflow', () => {
  const source = readWorkflow(ciWorkflowPath)

  it('defines lint, test-unit, test-integration, and build jobs', () => {
    expect(source).toMatch(/^  lint:/m)
    expect(source).toMatch(/^  test-unit:/m)
    expect(source).toMatch(/^  test-integration:/m)
    expect(source).toMatch(/^  build:/m)
  })

  it('uses postgres:16 service and DATABASE_URI in build job', () => {
    expect(source).toContain('postgres:16')
    expect(source).toContain('DATABASE_URI: postgresql://gpi:gpi@localhost:5432/gpi')
  })

  it('triggers on push and pull_request to main', () => {
    expect(source).toContain('push:')
    expect(source).toContain('pull_request:')
    expect(source).toContain('branches: [main]')
  })

  it('supports workflow_call for deploy reuse', () => {
    expect(source).toContain('workflow_call:')
  })

  it('uses CI_PAYLOAD_SECRET for build, not hardcoded credentials', () => {
    expect(source).toContain('secrets.CI_PAYLOAD_SECRET')
    expect(source).not.toMatch(/PAYLOAD_SECRET:\s*['"][^$]/)
  })
})

describe('deploy-staging.yml workflow', () => {
  const source = readWorkflow(deployWorkflowPath)

  it('triggers on push to main with staging-deploy concurrency', () => {
    expect(source).toContain('branches: [main]')
    expect(source).toContain('group: staging-deploy')
    expect(source).toContain('cancel-in-progress: false')
  })

  it('reuses ci workflow and gates deploy on ci success', () => {
    expect(source).toContain('uses: ./.github/workflows/ci.yml')
    expect(source).toContain('needs: ci')
  })

  it('supports workflow_dispatch with ref input default main', () => {
    expect(source).toContain('workflow_dispatch:')
    expect(source).toContain('ref:')
    expect(source).toContain('default: main')
  })

  it('deploys via SSH secrets without hardcoded credentials', () => {
    expect(source).toContain('secrets.STAGING_SSH_PRIVATE_KEY')
    expect(source).toContain('secrets.STAGING_SSH_HOST')
    expect(source).toContain('secrets.STAGING_APP_PATH')
    expect(source).not.toMatch(/postgresql:\/\//)
  })

  it('runs staging-remote.sh with commit and run id', () => {
    expect(source).toContain('staging-remote.sh')
    expect(source).toContain('--commit')
    expect(source).toContain('--run-id')
  })

  it('includes smoke-check for /ru and /admin', () => {
    expect(source).toContain('smoke-check')
    expect(source).toContain('/ru')
    expect(source).toContain('/admin')
  })

  it('uses staging environment with public URL variable', () => {
    expect(source).toContain('name: staging')
    expect(source).toContain('vars.STAGING_PUBLIC_URL')
  })
})
