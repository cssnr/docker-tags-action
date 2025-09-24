[![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/docker-tags-action?sort=semver&filter=!v*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-tags-action/tags)
[![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/docker-tags-action?sort=semver&filter=!v*.*.*&logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-tags-action/releases)
[![GitHub Release Version](https://img.shields.io/github/v/release/cssnr/docker-tags-action?logo=git&logoColor=white&labelColor=585858&label=%20)](https://github.com/cssnr/docker-tags-action/releases/latest)
[![GitHub Dist Size](https://img.shields.io/github/size/cssnr/docker-tags-action/dist%2Findex.js?logo=bookstack&logoColor=white&label=dist%20size)](https://github.com/cssnr/docker-tags-action/blob/master/src/index.js)
[![Workflow Release](https://img.shields.io/github/actions/workflow/status/cssnr/docker-tags-action/release.yaml?logo=cachet&label=release)](https://github.com/cssnr/docker-tags-action/actions/workflows/release.yaml)
[![Workflow Test](https://img.shields.io/github/actions/workflow/status/cssnr/docker-tags-action/test.yaml?logo=cachet&label=test)](https://github.com/cssnr/docker-tags-action/actions/workflows/test.yaml)
[![Workflow Lint](https://img.shields.io/github/actions/workflow/status/cssnr/docker-tags-action/lint.yaml?logo=cachet&label=lint)](https://github.com/cssnr/docker-tags-action/actions/workflows/lint.yaml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=cssnr_docker-tags-action&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=cssnr_docker-tags-action)
[![GitHub Last Commit](https://img.shields.io/github/last-commit/cssnr/docker-tags-action?logo=github&label=updated)](https://github.com/cssnr/docker-tags-action/pulse)
[![Codeberg Last Commit](https://img.shields.io/gitea/last-commit/cssnr/docker-tags-action/master?gitea_url=https%3A%2F%2Fcodeberg.org%2F&logo=codeberg&logoColor=white&label=updated)](https://codeberg.org/cssnr/docker-tags-action)
[![GitHub Contributors](https://img.shields.io/github/contributors/cssnr/docker-tags-action?logo=github)](https://github.com/cssnr/docker-tags-action/graphs/contributors)
[![GitHub Repo Size](https://img.shields.io/github/repo-size/cssnr/docker-tags-action?logo=bookstack&logoColor=white&label=repo%20size)](https://github.com/cssnr/docker-tags-action?tab=readme-ov-file#readme)
[![GitHub Top Language](https://img.shields.io/github/languages/top/cssnr/docker-tags-action?logo=htmx)](https://github.com/cssnr/docker-tags-action)
[![GitHub Forks](https://img.shields.io/github/forks/cssnr/docker-tags-action?style=flat&logo=github)](https://github.com/cssnr/docker-tags-action/forks)
[![GitHub Repo Stars](https://img.shields.io/github/stars/cssnr/docker-tags-action?style=flat&logo=github)](https://github.com/cssnr/docker-tags-action/stargazers)
[![GitHub Org Stars](https://img.shields.io/github/stars/cssnr?style=flat&logo=github&label=org%20stars)](https://cssnr.github.io/)
[![Discord](https://img.shields.io/discord/899171661457293343?logo=discord&logoColor=white&label=discord&color=7289da)](https://discord.gg/wXy6m2X8wY)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-72a5f2?logo=kofi&label=support)](https://ko-fi.com/cssnr)

# Docker Tags Action

- [Inputs](#Inputs)
  - [Tags](#docker-tags)
  - [Labels](#docker-labels)
- [Outputs](#Outputs)
- [Examples](#Examples)
- [Tags](#Tags)
- [Support](#Support)
- [Contributing](#Contributing)

Generate Docker Tags and Labels for building Docker images with GitHub Actions.

For a more detailed implementation see: https://github.com/docker/metadata-action

> [!NOTE]  
> Please submit a [Feature Request](https://github.com/cssnr/docker-tags-action/discussions/categories/feature-requests)
> for new features or [Open an Issue](https://github.com/cssnr/docker-tags-action/issues) if you find any bugs.

## Inputs

|   Input   | Default&nbsp;Value                 | Input&nbsp;Description                      |
| :-------: | :--------------------------------- | :------------------------------------------ |
|  images   | `ghcr.io/${{ github.repository }}` | Images for Tag Generation, CSV or Newline   |
|   tags    | _[see tags](#docker-tags)_         | Extra Tags to Generate, CSV or Newline      |
|  labels   | _[see labels](#docker-labels)_     | Extra Labels to Generate, CSV or Newline    |
| seperator | `\n`                               | Output Seperator                            |
|  latest   | `default`                          | Latest Tag: [`true`, `false`, `default`] \* |
|  summary  | `true`                             | Add Summary to Job \*                       |

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

To view a workflow run, click on a recent [Test](https://github.com/cssnr/docker-tags-action/actions/workflows/test.yaml) job _(requires login)_.

### docker tags

| Event             | Ref                 | Tags     |
| :---------------- | :------------------ | :------- |
| `tag` / `release` | `refs/tags/v1.0.0`  | `v1.0.0` |
| `push` / `other`  | `refs/heads/master` | `master` |
| `pull_request`    | `refs/pull/1/merge` | `pr-1`   |

This is the default tag added which is also set as the version for the label.

Coming Soon: Add an option called `default` to disable or override the default tag.

### docker labels

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

| Output      | Output&nbsp;Description |
| :---------- | :---------------------- |
| tags        | Generated Tags          |
| labels      | Generated Labels        |
| annotations | Generated Annotations   |

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

For more examples, you can check out other projects using this action:  
https://github.com/cssnr/docker-tags-action/network/dependents

## Tags

The following rolling [tags](https://github.com/cssnr/docker-tags-action/tags) are maintained.

| Version&nbsp;Tag                                                                                                                                                                                                     | Rolling | Bugs | Feat. |   Name    |  Target  | Example  |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-----: | :--: | :---: | :-------: | :------: | :------- |
| [![GitHub Tag Major](https://img.shields.io/github/v/tag/cssnr/docker-tags-action?sort=semver&filter=!v*.*&style=for-the-badge&label=%20&color=44cc10)](https://github.com/cssnr/docker-tags-action/releases/latest) |   ✅    |  ✅  |  ✅   | **Major** | `vN.x.x` | `vN`     |
| [![GitHub Tag Minor](https://img.shields.io/github/v/tag/cssnr/docker-tags-action?sort=semver&filter=!v*.*.*&style=for-the-badge&label=%20&color=blue)](https://github.com/cssnr/docker-tags-action/releases/latest) |   ✅    |  ✅  |  ❌   | **Minor** | `vN.N.x` | `vN.N`   |
| [![GitHub Release](https://img.shields.io/github/v/release/cssnr/docker-tags-action?style=for-the-badge&label=%20&color=red)](https://github.com/cssnr/docker-tags-action/releases/latest)                           |   ❌    |  ❌  |  ❌   | **Micro** | `vN.N.N` | `vN.N.N` |

You can view the release notes for each version on the [releases](https://github.com/cssnr/docker-tags-action/releases) page.

The **Major** tag is recommended. It is the most up-to-date and always backwards compatible.
Breaking changes would result in a **Major** version bump. At a minimum you should use a **Minor** tag.

# Support

For general help or to request a feature, see:

- Q&A Discussion: https://github.com/cssnr/docker-tags-action/discussions/categories/q-a
- Request a Feature: https://github.com/cssnr/docker-tags-action/discussions/categories/feature-requests

If you are experiencing an issue/bug or getting unexpected results, you can:

- Report an Issue: https://github.com/cssnr/docker-tags-action/issues
- Chat with us on Discord: https://discord.gg/wXy6m2X8wY
- Provide General Feedback: [https://cssnr.github.io/feedback/](https://cssnr.github.io/feedback/?app=Update%20JSON%20Value)

For more information, see the CSSNR [SUPPORT.md](https://github.com/cssnr/.github/blob/master/.github/SUPPORT.md#support).

# Contributing

Please consider making a donation to support the development of this project
and [additional](https://cssnr.com/) open source projects.

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/cssnr)

If you would like to submit a PR, please review the [CONTRIBUTING.md](#contributing-ov-file).

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
- [Package Changelog Action](https://github.com/cssnr/package-changelog-action?tab=readme-ov-file#readme)
- [NPM Outdated Check Action](https://github.com/cssnr/npm-outdated-action?tab=readme-ov-file#readme)
- [Label Creator Action](https://github.com/cssnr/label-creator-action?tab=readme-ov-file#readme)
- [Algolia Crawler Action](https://github.com/cssnr/algolia-crawler-action?tab=readme-ov-file#readme)
- [Upload Release Action](https://github.com/cssnr/upload-release-action?tab=readme-ov-file#readme)

For a full list of current projects visit: [https://cssnr.github.io/](https://cssnr.github.io/)
