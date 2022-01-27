// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var args, childp, Compi, opponent, post, stone

stone = require('./util').stone
opponent = require('./util').opponent

args = require('kxk').args
childp = require('kxk').childp
post = require('kxk').post


Compi = (function ()
{
    function Compi (game, name, cmd, args)
    {
        this.game = game
        this.name = name
    
        this["onData"] = this["onData"].bind(this)
        this.msg = []
        this.proc = childp.spawn(cmd,args)
        this.proc.stdout.on('data',this.onData)
    }

    Compi.prototype["newGame"] = function (boardsize, color, handicap)
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

    Compi.prototype["genmove"] = function ()
    {
        return this.send(`genmove ${this.color}`)
    }

    Compi.prototype["opponentMove"] = function (p)
    {
        return this.send(`play ${opponent[this.color]} ${p}`)
    }

    Compi.prototype["estimateScore"] = function ()
    {
        return this.send('estimate_score')
    }

    Compi.prototype["undo"] = function ()
    {
        this.send('undo')
        return this.send('showboard')
    }

    Compi.prototype["send"] = function (m)
    {
        this.msg.push(m)
        return this.proc.stdin.write(m + '\n')
    }

    Compi.prototype["onData"] = function (chunk)
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
        console.log(this.msg,this.name,data)
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
                return post.emit('playerMove',p,this.name)
            }
            else if (m.startsWith('fixed_handicap'))
            {
                if (this.color === 'black')
                {
                    var list = _k_.list(data.split(' '))
                    for (var _73_26_ = 0; _73_26_ < list.length; _73_26_++)
                    {
                        p = list[_73_26_]
                        this.game.setStone(this.game.coord(p),stone.black)
                    }
                    return this.game.moves.push(`black ${data}`)
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

    return Compi
})()

module.exports = Compi