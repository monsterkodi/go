// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this.msg = []
    }

    GNU.prototype["newGame"] = function (boardsize, color = 'white', handicap = 0)
    {
        this.color = color
        this.handicap = handicap
    
        this.send(`boardsize ${boardsize}`)
        if (this.handicap > 1)
        {
            this.send(`fixed_handicap ${handicap}`)
        }
        if (this.color === 'white')
        {
            this.human = 'black'
            if (this.handicap > 1)
            {
                return this.send(`genmove ${this.color}`)
            }
        }
        else
        {
            this.human = 'white'
            if (this.handicap < 2)
            {
                return this.send(`genmove ${this.color}`)
            }
        }
    }

    GNU.prototype["humanMove"] = function (p)
    {
        this.game.play(this.human,p)
        this.send(`play ${this.human} ${p}`)
        this.calcscore()
        return this.send(`genmove ${this.color}`)
    }

    GNU.prototype["calcscore"] = function ()
    {
        return this.send('estimate_score')
    }

    GNU.prototype["undo"] = function ()
    {
        this.send('undo')
        this.send('undo')
        this.game.moves.pop()
        this.game.moves.pop()
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
                console.log('play',this.color,p)
                if (_k_.in(p,['PASS','resign']))
                {
                    this.send('final_score')
                }
                return this.game.play(this.color,p)
            }
            else if (m.startsWith('final_score'))
            {
                console.log(m,data)
                return this.game.finalScore(data)
            }
            else if (m.startsWith('fixed_handicap'))
            {
                var list = _k_.list(data.split(' '))
                for (var _79_22_ = 0; _79_22_ < list.length; _79_22_++)
                {
                    p = list[_79_22_]
                    this.game.board.addStone(this.game.coord(p),'black')
                }
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
    }

    return GNU
})()

module.exports = GNU