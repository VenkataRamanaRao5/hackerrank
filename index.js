const https = require("https")
const express = require("express")
const { gzip } = require("zlib")

const app = express()

app.get('/:username', (req, res) => {
    const username = req.params.username

    const options = {
        hostname: "www.hackerrank.com",
        path: `/profile/${username}`,
        method: 'GET',
        headers: {'user-agent': 'node-js'}
    }

    const proxyRequest = https.request(options, (proxyResponse) => {
        const chunks = []
        proxyResponse.on("data", (chunk) => {chunks.push(chunk)})
        proxyResponse.on("end", () => {
            const buffer = Buffer.concat(chunks)
            const data = buffer.toString('utf8')
            console.log(data)
            res.status(proxyResponse.statusCode).send(data)
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