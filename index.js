const https = require("https")
const express = require("express")
const cheerio = require('cheerio')

const app = express()

app.get('/:username', (req, res) => {
    const username = req.params.username

    const options = {
        hostname: "www.hackerrank.com",
        path: `/profile/${username}`,
        method: 'GET',
        headers: { 'user-agent': 'node-js' }
    }

    const proxyRequest = https.request(options, (proxyResponse) => {
        const chunks = []
        proxyResponse.on("data", (chunk) => { chunks.push(chunk) })
        proxyResponse.on("end", () => {
            const buffer = Buffer.concat(chunks)
            const data = buffer.toString('utf8')
            console.log(data)
            const $ = cheerio.load(data)
            const $badges = $('.section-card').html()
            console.log($badges)
            const createSVG = (content) => {
                return `
                <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="500" height="500">
                <foreignObject width="100%" height="100%">
                    <body xmlns="http://www.w3.org/1999/xhtml">
                    ${content}
                    </body>
                </foreignObject>
                </svg>
            `
            }

            const svgContent = createSVG($badges);
            res.set('Content-Type', 'image/svg+xml');
            res.send(svgContent)
        })
    })

    proxyRequest.on("error", (err) => {
        console.error(err)
        res.status(500).send('Error fetching data:' + err)
    })

    proxyRequest.end()
})

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})