// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var childp, GNU, opponent, post, stone

childp = require('kxk').childp
post = require('kxk').post

stone = require('./util').stone
opponent = require('./util').opponent


GNU = (function ()
{
    function GNU (game)
    {
        this.game = game
    
        this["onData"] = this["onData"].bind(this)
        this.msg = []
        this.gnu = childp.spawn('/usr/local/bin/gnugo',['--mode','gtp','--autolevel','--never-resign'])
        this.gnu.stdout.on('data',this.onData)
    }

    GNU.prototype["newGame"] = function (boardsize, color, handicap)
    {
        this.color = color
        this.handicap = handicap
    
        this.send(`boardsize ${boardsize}`)
        this.send("time_settings 300 10 3")
        if (this.handicap > 1)
        {
            return this.send(`fixed_handicap ${handicap}`)
        }
    }

    GNU.prototype["genmove"] = function ()
    {
        return this.send(`genmove ${this.color}`)
    }

    GNU.prototype["opponentMove"] = function (p)
    {
        return this.send(`play ${opponent[this.color]} ${p}`)
    }

    GNU.prototype["estimateScore"] = function ()
    {
        return this.send('estimate_score')
    }

    GNU.prototype["undo"] = function ()
    {
        this.send('undo')
        return this.send('showboard')
    }

    GNU.prototype["send"] = function (m)
    {
        this.msg.push(m)
        return this.gnu.stdin.write(m + '\n')
    }

    GNU.prototype["onData"] = function (chunk)
    {
        var data, m, p

        data = String(chunk)
        if (this.partial)
        {
            data = this.partial + data
            delete this.partial
        }
        while (data.startsWith('= \n\n'))
        {
            data = data.slice(4)
            this.msg.shift()
        }
        if (!data.endsWith('\n\n'))
        {
            this.partial = data
            return
        }
        if (data[0] === '=')
        {
            m = this.msg.shift()
            data = data.slice(2)
            if (m.startsWith('genmove'))
            {
                p = data.split('\n')[0]
                if (p === 'PASS')
                {
                    p = 'pass'
                }
                return post.emit('gnuMove',p)
            }
            else if (m.startsWith('fixed_handicap'))
            {
                var list = _k_.list(data.split(' '))
                for (var _73_22_ = 0; _73_22_ < list.length; _73_22_++)
                {
                    p = list[_73_22_]
                    this.game.setStone(this.game.coord(p),stone.black)
                }
            }
            else if (m.startsWith('estimate_score'))
            {
                return this.game.setScore(data.split(' ')[0])
            }
            else if (m.startsWith('final_score'))
            {
                return this.game.finalScore(data)
            }
            else if (m.startsWith('showboard'))
            {
                return this.game.show(data)
            }
            else
            {
                console.log(m,data)
            }
        }
        else
        {
            m = this.msg.shift()
            console.error(m,data)
        }
    }

    return GNU
})()

module.exports = GNU