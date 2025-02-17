const core = require('@actions/core')
const github = require('@actions/github')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        // Debug
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
        core.info(`ref: \u001b[32;1m${ref}`)

        // Process Inputs
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

        // Set Variables
        // const version = semver.parse(ref)
        // console.log('version:', version)

        // Collect Tags
        const collectedTags = []
        if (ref) {
            collectedTags.push(ref)
        }
        if (latest === 'default') {
            if (
                github.context.eventName === 'release' &&
                !github.context.payload.release?.prerelease
            ) {
                console.log('\u001b[33;1mAdding latest tag on release.')
                collectedTags.push('latest')
            }
        } else if (latest === 'true') {
            console.log('\u001b[33;1mAdding latest tag on true.')
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

        // Process Tags
        const dockerTags = []
        for (const image of images) {
            for (const tag of allTags) {
                dockerTags.push(`${image}:${tag}`)
            }
        }
        console.log('dockerTags:', dockerTags)

        // Process Labels
        let collectedLabels = []
        if (labels) {
            const parsedLabels = parse(labels, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedLabels:', parsedLabels)
            collectedLabels.push(...parsedLabels)
        }
        console.log('collectedLabels:', collectedLabels)
        const allLabels = [...new Set(collectedLabels)]
        console.log('allLabels:', allLabels)

        // Set Outputs
        core.setOutput('tags', dockerTags.join(seperator))
        core.setOutput('labels', allLabels.join(seperator))
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()
