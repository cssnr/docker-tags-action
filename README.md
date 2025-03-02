[![Release](https://img.shields.io/github/actions/workflow/status/cssnr/docker-tags-action/release.yaml?logo=github&logoColor=white&label=release)](https://github.com/cssnr/docker-tags-action/actions/workflows/release.yaml)
[![Test](https://img.shields.io/github/actions/workflow/status/cssnr/docker-tags-action/test.yaml?logo=github&logoColor=white&label=test)](https://github.com/cssnr/docker-tags-action/actions/workflows/test.yaml)
[![Lint](https://img.shields.io/github/actions/workflow/status/cssnr/docker-tags-action/lint.yaml?logo=github&logoColor=white&label=lint)](https://github.com/cssnr/docker-tags-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_docker-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_docker-tags-action)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/docker-tags-action?logo=github)](https://github.com/cssnr/docker-tags-action/releases/latest)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/docker-tags-action?logo=github&logoColor=white&label=updated)](https://github.com/cssnr/docker-tags-action/graphs/commit-activity)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/docker-tags-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/docker-tags-action)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/docker-tags-action?logo=htmx&logoColor=white)](https://github.com/cssnr/docker-tags-action)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&logoColor=white)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)

# Docker Tags Action

- [Inputs](#Inputs)
  - [Tags](#tags)
  - [Labels](#labels)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Support](#Support)
- [Contributing](#Contributing)

Generate Docker Tags and Labels for building Docker images with GitHub Actions.

For a more detailed implementation see: https://github.com/docker/metadata-action

> [!NOTE]  
> Please submit a [Feature Request](https://github.com/cssnr/docker-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/docker-tags-action/issues) if you find any bugs.

## Inputs

| input     | required | default                            | description                               |
| --------- | -------- | ---------------------------------- | ----------------------------------------- |
| images    | No       | `ghcr.io/${{ github.repository }}` | Images for Tag Generation, CSV or Newline |
| tags      | No       | _[see tags](#tags)_                | Extra Tags to Generate, CSV or Newline    |
| labels    | No       | _[see labels](#labels)_            | Extra Labels to Generate, CSV or Newline  |
| seperator | No       | `\n`                               | Output Seperator                          |
| latest    | No       | `default`                          | Latest Tag: [true, false, default] \*     |
| summary   | No       | `true`                             | Add Summary to Job \*                     |

This works with no inputs, but you can customize the resulting tags and labels with inputs.

```yaml
- name: 'Docker Tags'
  id: tags
  uses: cssnr/docker-tags-action@v1
```

**seperator** - Output seperator. Newline is default and that works as the input for the docker build actions.

**latest** - Default behavior only adds `latest` tag to a release that are not a pre-release.

**summary** - Write a Summary for the job. To disable this set to `false`.

<details><summary>👀 View Example Summary</summary>

---

Generated **2** Tags and **8** Labels for **1** Images. Parsed ref: `pr-6`

<details><summary>Docker Tags</summary>

<pre lang="text"><code>ghcr.io/cssnr/docker-tags-action:pr-6
ghcr.io/cssnr/docker-tags-action:latest</code></pre>

</details>
<details><summary>Docker Labels</summary>

<pre lang="text"><code>org.opencontainers.image.created=2025-02-20T02:33:28.010Z
org.opencontainers.image.revision=fb2319bda85e745c78981bc0ec6b316f07b602b5
org.opencontainers.image.source=https://github.com/cssnr/docker-tags-action
org.opencontainers.image.title=docker-tags-action
org.opencontainers.image.url=https://github.com/cssnr/docker-tags-action
org.opencontainers.image.version=pr-6
org.opencontainers.image.description=Generate Docker Tags and Labels for building Docker images with GitHub Actions.
org.opencontainers.image.authors=smashedr</code></pre>

</details>
<details><summary>Inputs</summary><table><tr><th>Input</th><th>Value</th></tr><tr><td>images</td><td><code>ghcr.io/cssnr/docker-tags-action</code></td></tr><tr><td>tags</td><td><code></code></td></tr><tr><td>labels</td><td><code>org.opencontainers.image.licenses=,org.opencontainers.image.authors=smashedr</code></td></tr><tr><td>seperator</td><td><code>"\n"</code></td></tr><tr><td>latest</td><td><code>true</code></td></tr><tr><td>summary</td><td><code>true</code></td></tr></table>
</details>

---

</details>

To see a workflow run you can view a recent
[test.yaml workflow run](https://github.com/cssnr/docker-tags-action/actions/workflows/test.yaml)
_(requires login)_.

### tags

| Event             | Ref                 | Tags     |
| ----------------- | ------------------- | -------- |
| `tag` / `release` | `refs/tags/v1.0.0`  | `v1.0.0` |
| `push` / `other`  | `refs/heads/master` | `master` |
| `pull_request`    | `refs/pull/1/merge` | `pr-1`   |

This is the default tag added which is also set as the version for the label.

Coming Soon: Add an option called `default` to disable or override the default tag.

### labels

```shell
org.opencontainers.image.description=Example Repository Description
org.opencontainers.image.revision=32b96cee5b4e940b4023f78261702470d59c8001
org.opencontainers.image.source=https://github.com/cssnr/docker-tags-action
org.opencontainers.image.title=repository-name
org.opencontainers.image.url=https://github.com/cssnr/docker-tags-action
org.opencontainers.image.version=v1.0.0
org.opencontainers.image.licenses=GPL-3.0
```

These are the default labels. You can add them or remove them by providing a key with no value.

The description and license are only added if they are defined on your repository.

Example removing `org.opencontainers.image.licenses` and adding `org.opencontainers.image.authors`.

```yaml
labels: |
  org.opencontainers.image.licenses=
  org.opencontainers.image.authors=smashedr
```

## Outputs

| output      | description           |
| ----------- | --------------------- |
| tags        | Generated Tags        |
| labels      | Generated Labels      |
| annotations | Generated Annotations |

All outputs are seperated by the inputs `seperator` which defaults to a newline.

```yaml
- name: 'Docker Tags'
  id: tags
  uses: cssnr/docker-tags-action@v1

- name: 'Echo Result'
  run: |
    echo -e "tags: \n${{ steps.tags.outputs.tags }}"
    echo -e "labels: \n${{ steps.tags.outputs.labels }}"
    echo -e "annotations: \n${{ steps.tags.outputs.annotations }}"
```

## Examples

With all inputs:

```yaml
- name: 'Docker Tags'
  id: tags
  uses: cssnr/docker-tags-action@v1
  with:
    images: 'ghcr.io/${{ github.repository }}'
    tags: v1,v1.0
    labels: |
      org.opencontainers.image.licenses=
      org.opencontainers.image.authors=smashedr
    seperator: ','
    latest: true
```

Full Example:

```yaml
name: 'Release'

on:
  release:
    types: [published]

jobs:
  build:
    name: 'Build'
    runs-on: ubuntu-latest
    timeout-minutes: 5
    permissions:
      packages: write

    steps:
      - name: 'Checkout'
        uses: actions/checkout@v4

      - name: 'Docker Tags'
        id: tags
        uses: cssnr/docker-tags-action@v1
        with:
          images: 'ghcr.io/${{ github.repository }}'
          tags: ${{ github.ref_name }}
          latest: false

      - name: 'Echo Tags'
        run: |
          echo -e "tags: \n${{ steps.tags.outputs.tags }}"
          echo -e "labels: \n${{ steps.tags.outputs.labels }}"

      - name: 'Docker Login'
        uses: docker/login-action@v3
        with:
          registry: 'ghcr.io'
          username: ${{ vars.GHCR_USER }}
          password: ${{ secrets.GHCR_PASS }}

      - name: 'Setup Buildx'
        uses: docker/setup-buildx-action@v3

      - name: 'Build and Push'
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.tags.outputs.tags }}
          labels: ${{ steps.tags.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

To see this used in a release workflow, see: https://github.com/cssnr/cloudflare-purge-cache-action/blob/master/.github/workflows/release.yaml

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/docker-tags-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/docker-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/docker-tags-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General
  Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20JSON%20Value)

# Contributing

Currently, the best way to contribute to this project is to star this project on GitHub.

If you would like to submit a PR, please review the [CONTRIBUTING.md](CONTRIBUTING.md).

Additionally, you can support other GitHub Actions I have published:

- [Stack Deploy Action](https://github.com/cssnr/stack-deploy-action?tab=readme-ov-file#readme)
- [Portainer Stack Deploy](https://github.com/cssnr/portainer-stack-deploy-action?tab=readme-ov-file#readme)
- [VirusTotal Action](https://github.com/cssnr/virustotal-action?tab=readme-ov-file#readme)
- [Mirror Repository Action](https://github.com/cssnr/mirror-repository-action?tab=readme-ov-file#readme)
- [Update Version Tags Action](https://github.com/cssnr/update-version-tags-action?tab=readme-ov-file#readme)
- [Update JSON Value Action](https://github.com/cssnr/update-json-value-action?tab=readme-ov-file#readme)
- [Parse Issue Form Action](https://github.com/cssnr/parse-issue-form-action?tab=readme-ov-file#readme)
- [Cloudflare Purge Cache Action](https://github.com/cssnr/cloudflare-purge-cache-action?tab=readme-ov-file#readme)
- [Mozilla Addon Update Action](https://github.com/cssnr/mozilla-addon-update-action?tab=readme-ov-file#readme)
- [Docker Tags Action](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)

For a full list of current projects to support visit: [https://cssnr.github.io/](https://cssnr.github.io/)
