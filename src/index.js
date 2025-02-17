const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        core.info(`🏳️ Starting Docker Tags Action`)

        // Debug
        // console.log('process.env:', process.env)
        // console.log('github.context:', github.context)

        console.log('github.context.ref:', github.context.ref)
        console.log('github.context.eventName:', github.context.eventName)
        console.log('prerelease:', github.context.payload.release?.prerelease)

        // Parse ref
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
        // core.info(`images: "${images}"`)
        const images = parse(core.getInput('images', { required: true }), {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        }).flat()
        console.log('images:', images)
        const tags = core.getInput('tags')
        console.log('tags:', tags)
        const labels = core.getInput('labels')
        console.log('labels:', labels)
        const seperator =
            core.getInput('seperator', { trimWhitespace: false }) || `\n`
        console.log('seperator:', JSON.stringify(seperator))
        const latest = core.getInput('latest')
        console.log('latest:', latest)
        const summary = core.getBooleanInput('summary')
        console.log('summary:', summary)

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
        if (latest === 'default') {
            if (
                github.context.eventName === 'release' &&
                !github.context.payload.release?.prerelease
            ) {
                console.log('\u001b[33;1mAdding latest tag on: release')
                collectedTags.push('latest')
            }
        } else if (latest === 'true') {
            console.log('\u001b[33;1mAdding latest tag on: true')
            collectedTags.push('latest')
        }
        if (tags) {
            const parsedTags = parse(tags, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        console.log('collectedTags:', collectedTags)
        const allTags = [...new Set(collectedTags)]
        console.log('allTags:', allTags)
        const dockerTags = []
        for (const image of images) {
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
        if (labels) {
            const parsedLabels = parse(labels, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedLabels:', parsedLabels)
            for (const label of parsedLabels) {
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
        core.setOutput('tags', dockerTags.join(seperator))
        core.setOutput('labels', dockerLabels.join(seperator))

        // Summary
        if (summary) {
            core.info('📝 Writing Job Summary')
            const inputs_table = gen_inputs_table({
                images: images.join(','),
                tags: tags.replaceAll('\n', ','),
                labels: labels.replaceAll('\n', ','),
                seperator: JSON.stringify(seperator),
                latest: latest,
                summary: summary,
            })
            core.summary.addRaw('### Docker Tags Action', true)
            core.summary.addRaw(
                `Generated **${dockerTags.length / images.length}** Tag(s) and **${dockerLabels.length / images.length}** Label(s) for **${images.length}** Image(s).\n`,
                true
            )
            core.summary.addRaw(`Docker Tags ${dockerTags.length}`, true)
            core.summary.addCodeBlock(dockerTags.join('\n'), 'plain')
            core.summary.addRaw(`Docker Labels ${dockerLabels.length}`, true)
            core.summary.addCodeBlock(dockerLabels.join('\n'), 'plain')
            core.summary.addRaw(inputs_table, true)
            core.summary.addRaw(
                '\n[View Documentation](https://github.com/smashedr/docker-tags-action/tree/refs/heads/updates?tab=readme-ov-file#readme) | '
            )
            core.summary.addRaw(
                '[Report an Issue or Request a Feature](https://github.com/smashedr/docker-tags-action/issues)',
                true
            )
            await core.summary.write()
        } else {
            core.info('⏩ Skipping Job Summary')
        }

        core.info(`✅ \u001b[32;1mFinished Success`)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()

/**
 * @function gen_inputs_table
 * @param {Object} inputs
 * @return String
 */
function gen_inputs_table(inputs) {
    const table = [
        '<details><summary>Inputs</summary>',
        '<table><tr><th>Input</th><th>Value</th></tr>',
    ]
    for (const [key, object] of Object.entries(inputs)) {
        const value = object.toString() || '-'
        table.push(`<tr><td>${key}</td><td>${value}</td></tr>`)
    }
    return table.join('') + '</table></details>'
}
