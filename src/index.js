const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        core.info('🏳️ Starting Docker Tags Action')

        // Debug
        core.startGroup('Debug')
        // console.log('process.env:', process.env)
        // console.log('github.context:', github.context)
        console.log('github.context.ref:', github.context.ref)
        console.log('github.context.eventName:', github.context.eventName)
        console.log('prerelease:', github.context.payload.release?.prerelease)
        core.endGroup() // Debug

        // Parse Ref: ref
        let ref = github.context.ref.split('/')[2]
        if (github.context.ref.startsWith('refs/pull/')) {
            core.info(`Pull Request: \u001b[36m${ref}`)
            ref = `pr-${ref}`
        }
        if (!ref) {
            return core.setFailed(`Unable to parse ref: ${github.context.ref}`)
        }
        core.info(`Parsed ref: \u001b[36m${ref}`)

        // Process Inputs: inputs
        core.startGroup('Inputs')
        const inputs = getInputs()
        console.log('inputs:', inputs)
        core.endGroup() // Inputs

        // Set Variables: repo
        core.startGroup('Repository')
        const repo = github.context.payload.repository
        console.log('name:', repo.name)
        console.log('description:', repo.description)
        console.log('html_url:', repo.html_url)
        console.log('spdx_id:', repo.license?.spdx_id)
        core.endGroup() // Repository

        // Process Tags: tags
        core.startGroup('Processing Tags')
        const tags = parseTags(inputs, ref)
        core.endGroup() // Repository

        // Process Labels: labels
        core.startGroup('Processing Labels')
        const labels = parseLabels(inputs, ref, repo)
        const annotations = labels.map((s) => `manifest:${s}`)
        core.endGroup() // Repository

        // Set Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('tags', tags.join(inputs.seperator))
        core.setOutput('labels', labels.join(inputs.seperator))
        core.setOutput('annotations', annotations.join(inputs.seperator))

        // Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
            try {
                await addSummary(inputs, tags, labels, ref)
            } catch (e) {
                console.log(e)
                core.error(`Error writing Job Summary ${e.message}`)
            }
        }

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * @function parseTags
 * @param {Inputs} inputs
 * @param {String} ref
 * @return {String[]}
 */
function parseTags(inputs, ref) {
    const tags = []
    if (ref) {
        tags.push(ref)
    }
    if (inputs.latest === 'default') {
        if (
            github.context.eventName === 'release' &&
            !github.context.payload.release?.prerelease
        ) {
            console.log('\u001b[33;1mAdding latest tag on: release')
            tags.push('latest')
        }
    } else if (inputs.latest === 'true') {
        console.log('\u001b[33;1mAdding latest tag on: true')
        tags.push('latest')
    }
    if (inputs.tags) {
        console.log('inputs.tags:', inputs.tags)
        tags.push(...inputs.tags)
    }
    console.log('tags:', tags)
    const allTags = [...new Set(tags)]
    console.log('allTags:', allTags)
    const dockerTags = []
    for (const image of inputs.images) {
        for (const tag of allTags) {
            dockerTags.push(`${image}:${tag}`)
        }
    }
    console.log('dockerTags:', dockerTags)
    return dockerTags
}

/**
 * @function parseLabels
 * @param {Inputs} inputs
 * @param {String} ref
 * @param {Object} repo
 * @return {String[]}
 */
function parseLabels(inputs, ref, repo) {
    const defaultLabels = {
        'org.opencontainers.image.created': new Date().toISOString(),
        'org.opencontainers.image.revision': github.context.sha,
        'org.opencontainers.image.source': repo.html_url,
        'org.opencontainers.image.title': repo.name,
        'org.opencontainers.image.url': repo.html_url,
        'org.opencontainers.image.version': ref,
    }
    if (repo.description) {
        defaultLabels['org.opencontainers.image.description'] = repo.description
    }
    if (repo.license?.spdx_id) {
        defaultLabels['org.opencontainers.image.licenses'] = repo.license.spdx_id
    }
    // console.log('defaultLabels:', defaultLabels)
    if (inputs.labels.length) {
        console.log('inputs.labels:', inputs.labels)
        for (const label of inputs.labels) {
            if (!label.includes('=')) {
                throw Error(`Label provided without an = symbol: ${label}`)
            }
            const [key, value] = label.split(/=(.*)/s).slice(0, 2)
            if (value) {
                console.log(`\u001b[32;1mAdding: \u001b[0m${key}=${value}`)
                defaultLabels[key] = value
            } else {
                console.log(`\u001b[31;1mDeleting: \u001b[0m${key}`)
                delete defaultLabels[key]
            }
        }
    }
    // console.log('defaultLabels:', defaultLabels)
    const dockerLabels = []
    for (const [key, value] of Object.entries(defaultLabels)) {
        dockerLabels.push(`${key}=${value}`)
    }
    console.log('dockerLabels:', dockerLabels)
    return dockerLabels
}

/**
 * Add Job Summary
 * @param {Inputs} inputs
 * @param {String[]} tags
 * @param {String[]} labels
 * @param {String} ref
 * @return {Promise<void>}
 */
async function addSummary(inputs, tags, labels, ref) {
    core.summary.addRaw('## Docker Tags Action\n')
    core.summary.addRaw(
        `Generated **${tags.length}** Tags and **${labels.length}** Labels for ` +
            `**${inputs.images.length}** Images. Parsed ref: \`${ref}\`\n\n`
    )

    core.summary.addRaw('<details><summary>Docker Tags</summary>\n\n')
    core.summary.addCodeBlock(tags.join('\n'), 'text')
    core.summary.addRaw('\n</details>\n')

    core.summary.addRaw('<details><summary>Docker Labels</summary>\n\n')
    core.summary.addCodeBlock(labels.join('\n'), 'text')
    core.summary.addRaw('\n</details>\n')

    const yaml = Object.entries(inputs)
        .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
        .join('\n')
    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addCodeBlock(yaml, 'yaml')
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/docker-tags-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}

/**
 * Get Inputs
 * @typedef {Object} Inputs
 * @property {String[]} images
 * @property {String[]} tags
 * @property {String[]} labels
 * @property {String} seperator
 * @property {String} latest
 * @property {Boolean} summary
 * @return {Inputs}
 */
function getInputs() {
    return {
        images: parse(core.getInput('images', { required: true }), {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        })
            .flat()
            .filter(Boolean),
        tags: parse(core.getInput('tags'), {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        })
            .flat()
            .filter(Boolean),
        labels: parse(core.getInput('labels'), {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        })
            .flat()
            .filter(Boolean),
        seperator: core.getInput('seperator', { trimWhitespace: false }) || `\n`,
        latest: core.getInput('latest'),
        summary: core.getBooleanInput('summary'),
    }
}
