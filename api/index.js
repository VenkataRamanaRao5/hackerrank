const https = require("https")
const express = require("express")
const cheerio = require('cheerio')
const fs = require('fs')

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
            //console.log(data)
            const $ = cheerio.load(data)
            console.log($('.profile-title-wrapper :first').text())
            const badges = $('.hacker-badges-v2 .hacker-badge');
            const numBadges = badges.length
            const width = 500, height = (numBadges < 5) ? 160 : 270

            // Initialize SVG header
            let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${width}px" height="${height}px" style="border:solid black 1px; border-radius:2px; box-sizing: border-box;" href="https://hackerrank.com/profile/${username}">`;
            svgContent += `<text x="10" y="23" font-size="24" font-weight="bold" font-family="Satoshi, Open Sans, sans-serif">${$('.profile-title-wrapper :first').text()}</text>`
            svgContent += `<text x="10" y="40" font-size="14" font-family="Satoshi, Open Sans, sans-serif">@${username}</text>`
            svgContent += `<g transform="translate(410,5)">${$('.hacker-badges .section-card-header :first').html()}`
            svgContent += `<text x="27" y="17" font-size="16" font-weight="bold" font-family="Satoshi, Open Sans, sans-serif">Badges</text></g>`;

            // Loop through the badges and extract SVGs
            badges.each((index, element) => {
                const name = $(element)._findBySelector('image.badge-icon').attr().href.split('/').reverse()[0]
                console.log(name)
                const data = `<svg x="25.5" y="22" height="27" width="40">${fs.readFileSync('assets/' + name, 'utf-8')}</svg>`
                $(element)._findBySelector('image.badge-icon').replaceWith(data)
                const badgeSvg = $(element).find('svg').html() // Extract the inner SVG content
                svgContent += `<svg width="91" height="100" x="${(index % 5) * 95 + 10}" y="${Math.floor(index / 5) * 110 + 55}" style="text-anchor:middle">${badgeSvg}</svg>`; // Position badges vertically
                
            });

            svgContent += '</svg>';

            // Set the response content type to text/xml for SVG
            res.set('Content-Type', 'image/svg+xml');
            res.send(svgContent);
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