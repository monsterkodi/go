// monsterkodi/kode 0.237.0

var _k_

var childp, GNU

childp = require('kxk').childp


GNU = (function ()
{
    function GNU (game)
    {
        this.game = game
    
        this["onData"] = this["onData"].bind(this)
        this.gnu = childp.spawn('/usr/local/bin/gnugo',['--mode','gtp'])
        this.gnu.stdout.on('data',this.onData)
    }

    GNU.prototype["newGame"] = function (boardsize, color = 'white')
    {
        this.color = color
    
        this.send(`boardsize ${boardsize}`)
        if (this.color === 'white')
        {
            return this.human = 'black'
        }
        else
        {
            this.human = 'white'
            return this.send(`genmove ${this.color}`)
        }
    }

    GNU.prototype["humanMove"] = function (c)
    {
        var p

        p = this.game.pos([c.x,c.y])
        this.game.play(this.human,p)
        this.send(`play ${this.human} ${p}`)
        return this.send(`genmove ${this.color}`)
    }

    GNU.prototype["send"] = function (msg)
    {
        this.msg = msg
    
        return this.gnu.stdin.write(msg + '\n')
    }

    GNU.prototype["onData"] = function (chunk)
    {
        var data

        data = String(chunk)
        while (data.startsWith('= \n\n'))
        {
            data = data.slice(4)
        }
        if (data[0] === '=')
        {
            data = data.slice(2)
            if (this.msg.startsWith('genmove'))
            {
                return this.game.play(this.color,data.split('\n')[0])
            }
        }
    }

    return GNU
})()

module.exports = GNU