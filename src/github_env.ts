import path from 'path'
import * as core from '@actions/core'

// /_work/self-hosted-sandbox/self-hosted-sandbox
export function getWorkspacePath(): string {
  if (process.env.GITHUB_WORKSPACE === undefined) {
    throw new Error('env GITHUB_WORKSPACE is undefined!');
  }
  return process.env.GITHUB_WORKSPACE;
}

// /_work/self-hosted-sandbox
export function getRunnerWorkspacePath (): string {
  if (process.env.RUNNER_WORKSPACE === undefined) throw new Error('env RUNNER_WORKSPACE is undefined!')
  return process.env.RUNNER_WORKSPACE
}

export function getWorkflowName(): string {
  const githubWorkflowRef = process.env.GITHUB_WORKFLOW_REF
  if (githubWorkflowRef) {
    // GITHUB_WORKFLOW_REF == ${{ github.workflow_ref }}:  `"Kesin11/setup-job-workspace-action/.github/workflows/test.yml@refs/heads/test_branch`,
    const workflowYaml = githubWorkflowRef.match(/(\w+\.ya?ml)/)![0]
    core.debug(`Found GITHUB_WORKFLOW_REF. workflow yaml: ${workflowYaml}`)

    const yamlExtName = path.extname(workflowYaml)
    return path.basename(workflowYaml, yamlExtName)
  }
  // GITHUB_WORKFLOW_REF does not appear if use old runner that before actions/runner@v2.300.0 
  // So it fallback for some case that must use old runner (e.g. GHES).
  else if (process.env.GITHUB_WORKFLOW) {
    core.debug(`Found GITHUB_WORKFLOW. workflow name: ${process.env.GITHUB_WORKFLOW}`)
    // GITHUB_WORKFLOW == ${{ github.workflow }} is `name` in yml: `name: 'build-test'`
    return process.env.GITHUB_WORKFLOW
  }
  else {
    throw new Error('Both env GITHUB_WORKFLOW_REF and GITHUB_WORKFLOW are undefined!')
  }
}
