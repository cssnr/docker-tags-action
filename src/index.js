const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        core.info('🏳️ Starting Docker Tags Action')

        // Debug
        // console.log('process.env:', process.env)
        // console.log('github.context:', github.context)
        console.log('github.context.ref:', github.context.ref)
        console.log('github.context.eventName:', github.context.eventName)
        console.log('prerelease:', github.context.payload.release?.prerelease)

        // Parse Ref
        let ref = github.context.ref.split('/')[2]
        if (github.context.ref.startsWith('refs/pull/')) {
            console.log('Pull Request Detected:', ref)
            ref = `pr-${ref}`
        }
        if (!ref) {
            return core.setFailed(`Unable to parse ref: ${github.context.ref}`)
        }
        core.info(`ref: \u001b[32;1m${ref}`)

        // Process Inputs
        const inputs = parseInputs()
        console.log('inputs:', inputs)

        // Set Variables
        const repo = github.context.payload.repository
        console.log('name:', repo.name)
        console.log('description:', repo.description)
        console.log('html_url:', repo.html_url)
        console.log('spdx_id:', repo.license?.spdx_id)

        // Process Tags
        core.info('⌛ Processing Tags')
        const collectedTags = []
        if (ref) {
            collectedTags.push(ref)
        }
        if (inputs.latest === 'default') {
            if (
                github.context.eventName === 'release' &&
                !github.context.payload.release?.prerelease
            ) {
                console.log('\u001b[33;1mAdding latest tag on: release')
                collectedTags.push('latest')
            }
        } else if (inputs.latest === 'true') {
            console.log('\u001b[33;1mAdding latest tag on: true')
            collectedTags.push('latest')
        }
        if (inputs.tags) {
            console.log('inputs.tags:', inputs.tags)
            collectedTags.push(...inputs.tags)
        }
        console.log('collectedTags:', collectedTags)
        const allTags = [...new Set(collectedTags)]
        console.log('allTags:', allTags)
        const dockerTags = []
        for (const image of inputs.images) {
            for (const tag of allTags) {
                dockerTags.push(`${image}:${tag}`)
            }
        }
        console.log('dockerTags:', dockerTags)

        // Process Labels
        core.info('⌛ Processing Labels')
        const defaultLabels = {
            'org.opencontainers.image.created': new Date().toISOString(),
            'org.opencontainers.image.revision': github.context.sha,
            'org.opencontainers.image.source': repo.html_url,
            'org.opencontainers.image.title': repo.name,
            'org.opencontainers.image.url': repo.html_url,
            'org.opencontainers.image.version': ref,
        }
        if (repo.description) {
            defaultLabels['org.opencontainers.image.description'] =
                repo.description
        }
        if (repo.license?.spdx_id) {
            defaultLabels['org.opencontainers.image.licenses'] =
                repo.license.spdx_id
        }
        // console.log('defaultLabels:', defaultLabels)
        if (inputs.labels.length) {
            console.log('inputs.labels:', inputs.labels)
            for (const label of inputs.labels) {
                if (!label.includes('=')) {
                    return core.setFailed(
                        `Label provided without an = symbol: ${label}`
                    )
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

        // Set Outputs
        core.info('📩 Setting Outputs')
        core.setOutput('tags', dockerTags.join(inputs.seperator))
        core.setOutput('labels', dockerLabels.join(inputs.seperator))

        // Write Summary
        if (inputs.summary) {
            core.info('📝 Writing Job Summary')
        }

        core.info('✅ \u001b[32;1mFinished Success')
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * @function parseInputs
 * @return {{images: array, tags: array, labels: array, seperator: string, latest: string, summary: boolean}}
 */
function parseInputs() {
    /** @type {String[]} */
    const images = parse(core.getInput('images', { required: true }), {
        delimiter: ',',
        trim: true,
        relax_column_count: true,
    }).flat()
    console.log('images:', images)
    /** @type {String[]} */
    const tags = parse(core.getInput('tags'), {
        delimiter: ',',
        trim: true,
        relax_column_count: true,
    }).flat()
    console.log('tags:', tags)
    /** @type {String[]} */
    const labels = parse(core.getInput('labels'), {
        delimiter: ',',
        trim: true,
        relax_column_count: true,
    }).flat()
    console.log('labels:', labels)
    return {
        images: images,
        tags: tags,
        labels: labels,
        seperator:
            core.getInput('seperator', { trimWhitespace: false }) || `\n`,
        latest: core.getInput('latest'),
        summary: core.getBooleanInput('summary'),
    }
}

/**
 * @function writeSummary
 * @param {Object} inputs
 * @param {String[]} dockerTags
 * @param {String[]} dockerLabels
 * @return {Promise<void>}
 */
async function writeSummary(inputs, dockerTags, dockerLabels) {
    core.summary.addRaw('## Docker Tags Action\n')
    core.summary.addRaw(
        `Generated **${dockerTags.length}** Tags and **${dockerLabels.length}** Labels for **${inputs.images.length}** Images.\n\n`
    )

    core.summary.addRaw('<details><summary>Docker Tags</summary>\n\n')
    core.summary.addCodeBlock(dockerTags.join('\n'), 'text')
    core.summary.addRaw('\n</details>\n')

    core.summary.addRaw('<details><summary>Docker Labels</summary>\n\n')
    core.summary.addCodeBlock(dockerLabels.join('\n'), 'text')
    core.summary.addRaw('\n</details>\n')

    core.summary.addRaw('<details><summary>Inputs</summary>')
    core.summary.addTable([
        [
            { data: 'Input', header: true },
            { data: 'Value', header: true },
        ],
        [
            { data: 'images' },
            { data: `<code>${inputs.images.join(',')}</code>` },
        ],
        [
            { data: 'tags' },
            {
                data: `<code>${inputs.tags.replaceAll('\n', ',')}</code>`,
            },
        ],
        [
            { data: 'labels' },
            {
                data: `<code>${inputs.labels.replaceAll('\n', ',')}</code>`,
            },
        ],
        [
            { data: 'seperator' },
            {
                data: `<code>${JSON.stringify(inputs.seperator)}</code>`,
            },
        ],
        [{ data: 'latest' }, { data: `<code>${inputs.latest}</code>` }],
        [{ data: 'summary' }, { data: `<code>${inputs.summary}</code>` }],
    ])
    core.summary.addRaw('</details>\n')

    const text = 'View Documentation, Report Issues or Request Features'
    const link = 'https://github.com/cssnr/docker-tags-action'
    core.summary.addRaw(`\n[${text}](${link}?tab=readme-ov-file#readme)\n\n---`)
    await core.summary.write()
}
