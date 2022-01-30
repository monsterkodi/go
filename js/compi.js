// monsterkodi/kode 0.237.0

var _k_ = {profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        this.send("komi 0")
        if (this.handicap > 1)
        {
            return this.send(`fixed_handicap ${handicap}`)
        }
    }

    Compi.prototype["genmove"] = function ()
    {
        _k_.profile('genmove')
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

    Compi.prototype["onDataError"] = function (chunk)
    {
        var data

        data = String(chunk)
        if (_k_.in("a b c d e f g h j k l m n o p q r s t",data))
        {
            console.log(data)
        }
        return this.onStderr(data)
    }

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
        for (var _82_19_ = 0; _82_19_ < list.length; _82_19_++)
        {
            answer = list[_82_19_]
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
                _k_.profilend('genmove')
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
                    for (var _106_26_ = 0; _106_26_ < list.length; _106_26_++)
                    {
                        p = list[_106_26_]
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