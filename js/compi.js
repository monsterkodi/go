// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        this["onExit"] = this["onExit"].bind(this)
        this.msg = []
        this.proc = childp.spawn(cmd,args,{shell:true,detached:true})
        this.proc.stdout.on('data',this.onData)
        this.proc.once('exit',this.onExit)
    }

    Compi.prototype["onExit"] = function (signal)
    {
        delete this.proc
        console.log(`${this.name} stopped ${signal}`)
    }

    Compi.prototype["newGame"] = function (boardsize, color, handicap)
    {
        this.color = color
        this.handicap = handicap
    
        this.send(`boardsize ${boardsize}`)
        if (this.handicap > 1)
        {
            return this.send(`fixed_handicap ${handicap}`)
        }
    }

    Compi.prototype["genmove"] = function ()
    {
        console.log(`${this.name}: genmove ${this.color}`)
        return this.send(`genmove ${this.color}`)
    }

    Compi.prototype["opponentMove"] = function (p)
    {
        this.send(`play ${opponent[this.color]} ${p}`)
        return this.send('showboard')
    }

    Compi.prototype["estimateScore"] = function ()
    {
        return this.send('estimate_score')
    }

    Compi.prototype["undo"] = function ()
    {
        if ((this.msg.slice(-1)[0] != null ? this.msg.slice(-1)[0].startsWith('genmove') : undefined))
        {
            this.send('undo')
        }
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
        var answer, answers, data

        data = String(chunk)
        console.log(this.name,'onData msgs',this.msg,`'${data}'`)
        if (this.partial)
        {
            data = this.partial + `'${data}'`
            delete this.partial
        }
        answers = data.split('\n\n')
        this.partial = answers.pop()
        console.log(this.name,answers)
        var list = _k_.list(answers)
        for (var _73_19_ = 0; _73_19_ < list.length; _73_19_++)
        {
            answer = list[_73_19_]
            if (answer[0] === '=')
            {
                this.ok(this.msg.shift(),answer.slice(2))
            }
            else
            {
                console.error(this.msg.shift(),answer.slice(2))
            }
        }
    }

    Compi.prototype["ok"] = function (m, data)
    {
        var p

        switch (m.split(' ')[0])
        {
            case 'genmove':
                if (!(_k_.in('undo',this.msg)))
                {
                    p = data.split('\n')[0]
                    if (p === 'PASS')
                    {
                        p = 'pass'
                    }
                    return post.emit('playerMove',p,this.name)
                }
                break
            case 'fixed_handicap':
                if (this.color === 'black')
                {
                    var list = _k_.list(data.split(' '))
                    for (var _94_26_ = 0; _94_26_ < list.length; _94_26_++)
                    {
                        p = list[_94_26_]
                        this.game.setStone(this.game.coord(p),stone.black)
                    }
                    return this.game.moves.push(`black ${data}`)
                }
                break
            case 'estimate_score':
                return this.game.setScore(data.split(' ')[0])

            case 'final_score':
                return this.game.finalScore(data)

            case 'showboard':
                console.log(data)
                break
        }

    }

    return Compi
})()

module.exports = Compi