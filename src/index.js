const core = require('@actions/core')
const github = require('@actions/github')
// const semver = require('semver')
const { parse } = require('csv-parse/sync')

;(async () => {
    try {
        // console.log('github.context:', github.context)

        // Parse Ref
        console.log('github.context.ref:', github.context.ref)
        console.log('github.context.eventName:', github.context.eventName)
        console.log('prerelease:', github.context.payload.release?.prerelease)

        const value = github.context.ref.split('/', 2).join('/') + '/'
        console.log('value:', value)
        const ref = github.context.ref.replace(value, '')
        console.log('ref:', ref)

        // Process Inputs
        const images = core.getInput('images')
        console.log('images:', images)
        const extra = core.getInput('extra')
        console.log('extra:', extra)
        const seperator =
            core.getInput('seperator', { trimWhitespace: false }) || `\n`
        console.log('seperator:', JSON.stringify(seperator))
        const latest = core.getInput('latest')
        console.log('latest:', latest)
        // const prefix = core.getInput('prefix')
        // console.log('prefix:', prefix)

        // // Set Variables
        // const { owner, repo } = github.context.repo
        // console.log('owner:', owner)
        // console.log('repo:', repo)
        // const version = semver.parse(ref)
        // console.log('version:', version)

        // Parse Images
        const parsedImages = parse(images, {
            delimiter: ',',
            trim: true,
            relax_column_count: true,
        }).flat()
        console.log('parsedImages:', parsedImages)

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
                console.log('++++ LATEST +++++')
                collectedTags.push('latest')
            }
        } else if (latest === 'true') {
            collectedTags.push('latest')
        }

        if (extra) {
            const parsedTags = parse(extra, {
                delimiter: ',',
                trim: true,
                relax_column_count: true,
            }).flat()
            console.log('parsedTags:', parsedTags)
            collectedTags.push(...parsedTags)
        }
        console.log('collectedTags:', collectedTags)

        const tags = [...new Set(collectedTags)]
        console.log('tags:', tags)

        // Process Results
        const dockerTags = []
        for (const image of parsedImages) {
            for (const tag of tags) {
                dockerTags.push(`${image}:${tag}`)
            }
        }
        console.log('dockerTags:', dockerTags)
        const output = dockerTags.join(seperator)
        console.log('output:', output)
        core.setOutput('tags', output)
    } catch (e) {
        core.debug(e)
        core.info(e.message)
        core.setFailed(e.message)
    }
})()
