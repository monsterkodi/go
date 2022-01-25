// monsterkodi/kode 0.237.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var childp, GNU, stone

childp = require('kxk').childp

stone = require('./util').stone


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

    GNU.prototype["newGame"] = function (boardsize, color, handicap, genmove)
    {
        this.color = color
        this.handicap = handicap
    
        this.send(`boardsize ${boardsize}`)
        this.send("time_settings 300 10 3")
        if (this.handicap > 1)
        {
            this.send(`fixed_handicap ${handicap}`)
        }
        if (this.color === 'white')
        {
            this.human = 'black'
            if (genmove && this.handicap > 1)
            {
                return this.send(`genmove ${this.color}`)
            }
        }
        else
        {
            this.human = 'white'
            if (genmove && this.handicap < 2)
            {
                return this.send(`genmove ${this.color}`)
            }
        }
    }

    GNU.prototype["humanMove"] = function (p)
    {
        delete this.redos
        this.game.play(this.human,p)
        this.send(`play ${this.human} ${p}`)
        this.calcscore()
        return this.send(`genmove ${this.color}`)
    }

    GNU.prototype["calcscore"] = function ()
    {
        return this.send('estimate_score')
    }

    GNU.prototype["firstMove"] = function ()
    {
        if (_k_.empty(this.game.moves))
        {
            return
        }
        this.redos = this.game.moves.concat(this.redos)
        this.send(`boardsize ${this.game.size}`)
        return this.game.clear_board()
    }

    GNU.prototype["undo"] = function ()
    {
        var _60_15_

        if (_k_.empty(this.game.moves))
        {
            return
        }
        if (!_k_.empty(this.msg))
        {
            return
        }
        this.redos = ((_60_15_=this.redos) != null ? _60_15_ : [])
        this.send('undo')
        this.redos.unshift(this.game.moves.pop())
        this.send('showboard')
        return this.calcscore()
    }

    GNU.prototype["lastMove"] = function ()
    {
        var color, move, p

        if (_k_.empty(this.redos))
        {
            return
        }
        while (!_k_.empty(this.redos))
        {
            move = this.redos.shift()
            var _71_23_ = move.split(' '); color = _71_23_[0]; p = _71_23_[1]

            this.game.play(color,p)
            this.send(`play ${color} ${p}`)
        }
        return this.calcscore()
    }

    GNU.prototype["redo"] = function ()
    {
        var color, move, p

        if (_k_.empty(this.redos))
        {
            return
        }
        if (!_k_.empty(this.msg))
        {
            return
        }
        move = this.redos.shift()
        var _83_19_ = move.split(' '); color = _83_19_[0]; p = _83_19_[1]

        this.game.play(color,p)
        this.send(`play ${color} ${p}`)
        if (this.game.moves.length > 2)
        {
            return this.calcscore()
        }
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
                if (_k_.in(p,['PASS','resign']))
                {
                    this.send('final_score')
                }
                this.game.play(this.color,p)
                this.game.calcScore()
                return this.game.board.annotate()
            }
            else if (m.startsWith('fixed_handicap'))
            {
                var list = _k_.list(data.split(' '))
                for (var _120_22_ = 0; _120_22_ < list.length; _120_22_++)
                {
                    p = list[_120_22_]
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