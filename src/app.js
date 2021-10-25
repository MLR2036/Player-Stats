const express = require('express')
const app = express()
const fs = require('fs')

app.use(express.static('html'))

app.get('/data', function (req, res) {
    const playerStats = fs.readFileSync('data/player-stats.json','UTF8');    
    res.send(playerStats)  
})
 
app.listen(3000)