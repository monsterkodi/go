// monsterkodi/kode 0.242.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var args, childp, Compi, opponent, post, stone

stone = require('../util/util').stone
opponent = require('../util/util').opponent

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
        this["onDataError"] = this["onDataError"].bind(this)
        this["onExit"] = this["onExit"].bind(this)
        this.msg = []
        this.proc = childp.spawn(cmd,args,{shell:true,detached:true})
        this.proc.stdout.on('data',this.onData)
        this.proc.stderr.on('data',this.onDataError)
        this.proc.once('exit',this.onExit)
    }

    Compi.prototype["onExit"] = function (signal)
    {
        delete this.proc
        console.log(`${this.name} process exited ${signal}`)
    }

    Compi.prototype["newGame"] = function (boardsize, color, handicap)
    {
        this.color = color
        this.handicap = handicap
    
        this.send(`boardsize ${boardsize}`)
        if (this.handicap > 1)
        {
            this.send(`fixed_handicap ${handicap}`)
        }
        return this.send("komi 0")
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
        if ((this.msg.slice(-1)[0] != null ? this.msg.slice(-1)[0].startsWith('genmove') : undefined))
        {
            this.send('undo')
        }
        return this.send('undo')
    }

    Compi.prototype["send"] = function (m)
    {
        this.msg.push(m)
        return this.proc.stdin.write(m + '\n')
    }

    Compi.prototype["onDataError"] = function (chunk)
    {
        var data

        data = String(chunk)
        return this.onStderr(data)
    }

    Compi.prototype["onStderr"] = function ()
    {}

    Compi.prototype["onData"] = function (chunk)
    {
        var answer, answers, data

        data = String(chunk)
        if (this.partial)
        {
            data = this.partial + data
            delete this.partial
        }
        answers = data.split('\n\n')
        this.partial = answers.pop()
        var list = _k_.list(answers)
        for (var _77_19_ = 0; _77_19_ < list.length; _77_19_++)
        {
            answer = list[_77_19_]
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
                    return post.emit('playerMove',data,this.name)
                }
                break
            case 'estimate_score':
                return this.game.setScore(data.split(' ')[0])

            case 'final_score':
                console.log(this.name,'final_score',`'${data}'`)
                return this.game.finalScore(data)

            case 'showboard':
                console.log(data)
                break
        }

    }

    return Compi
})()

module.exports = Compi