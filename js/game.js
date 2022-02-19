// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var $, alpha, elem, Game, Grid, kxk, Moves, opponent, randInt, Score, stone

kxk = require('kxk')
randInt = kxk.randInt
elem = kxk.elem
$ = kxk.$

opponent = require('./util/util').opponent
alpha = require('./util/util').alpha
stone = require('./util/util').stone

Score = require('./score')
Moves = require('./util/moves')
Grid = require('./util/grid')

Game = (function ()
{
    _k_.extend(Game, Score)
    function Game (board, black, white, handicap)
    {
        this.handicap = handicap
    
        this.info = {}
        this.players = {black:black,white:white}
        Game.__super__.constructor.call(this,board.size)
        this.board = board
        this.moves = new Moves
        this.boardsize(this.board.size)
    }

    Game["fromMoves"] = function (moves)
    {
        var g, m

        moves = moves.replace(/\n+/g,' ')
        moves = moves.split(' ')
        g = new Game({size:19,'sgf':'sgf','sgf':'sgf',0:0})
        var list = _k_.list(moves)
        for (var _41_26_ = 0; _41_26_ < list.length; _41_26_++)
        {
            m = list[_41_26_]
            g.addMove(m)
        }
        return g
    }

    Game.prototype["boardsize"] = function (size)
    {
        this.size = size
    
        return this.clear_board()
    }

    Game.prototype["save"] = function ()
    {
        window.stash.set('moves',this.moves.history())
        return window.stash.set('grid',this.grid.toString())
    }

    Game.prototype["move_history"] = function ()
    {
        return this.moves.history()
    }

    Game.prototype["end"] = function ()
    {
        return this.moves.end()
    }

    Game.prototype["start"] = function ()
    {
        return this.moves.start()
    }

    Game.prototype["lastColor"] = function ()
    {
        return this.moves.lastColor()
    }

    Game.prototype["nextColor"] = function ()
    {
        return this.moves.nextColor()
    }

    Game.prototype["lastMove"] = function ()
    {
        return this.moves.last()
    }

    Game.prototype["lastPos"] = function ()
    {
        return this.lastMove().pos
    }

    Game.prototype["lastCoord"] = function ()
    {
        return this.coord(this.lastPos())
    }

    Game.prototype["genmove"] = function (color)
    {
        var l, p

        color = (color != null ? color : this.nextColor())
        l = this.all_legal(color)
        if (this.moves.lastIsPass())
        {
            return 'pass'
        }
        if (!_k_.empty(l))
        {
            p = l[randInt(l.length)]
            this.play(p)
            return p
        }
        else
        {
            return 'pass'
        }
    }

    Game.prototype["play"] = function (p)
    {
        var c, color, _110_27_, _95_27_

        color = this.nextColor()
        delete this.lastCaptures
        if (_k_.in(p.toLowerCase(),['pass','resign','illegal']))
        {
            this.moves.add(p.toLowerCase(),color)
            ;(typeof this.board.annotate === "function" ? this.board.annotate() : undefined)
            return ''
        }
        c = this.coord(p)
        if (!this.legal(color,c))
        {
            this.moves.add(`illegal_${color}_${p}`,color)
            console.error('illegal move:',color,this.moves.num(),p)
            return '? invalid move'
        }
        if (this.valid(c))
        {
            this.setStone(c,stone[color])
            this.lastCaptures = this.capture(color)
            this.moves.add(p,color,this.lastCaptures)
            this.calcScore()
            ;(typeof this.board.annotate === "function" ? this.board.annotate() : undefined)
            return ''
        }
        else
        {
            return '? invalid color or coordinate'
        }
    }

    Game.prototype["replay"] = function (moves, calcCaptures = false)
    {
        var c, color, m, p

        var list = _k_.list(moves)
        for (var _123_14_ = 0; _123_14_ < list.length; _123_14_++)
        {
            m = list[_123_14_]
            p = m.pos
            if (p === 'next')
            {
                break
            }
            c = this.coord(p)
            color = m.color
            this.setStone(c,stone[color])
            if (calcCaptures)
            {
                m.captures = this.capture(color)
            }
            this.moves.add(p,color,m.captures)
            this.removeStones(m.captures)
        }
        this.calcScore()
        return this.board.annotate()
    }

    Game.prototype["removeStones"] = function (posl)
    {
        var pos

        var list = _k_.list(posl)
        for (var _143_16_ = 0; _143_16_ < list.length; _143_16_++)
        {
            pos = list[_143_16_]
            this.removePos(pos)
        }
    }

    Game.prototype["capture"] = function (color)
    {
        var dead, pl, s

        s = stone[opponent[color]]
        this.calcGroups()
        pl = []
        var list = _k_.list(this.grps.filter(function (g)
        {
            return g.libs === 0 && g.stone === s
        }))
        for (var _152_17_ = 0; _152_17_ < list.length; _152_17_++)
        {
            dead = list[_152_17_]
            pl = pl.concat(dead.posl)
            this.removeStones(pl)
        }
        return pl
    }

    Game.prototype["addMove"] = function (p)
    {
        var c, captures, color, deadPos

        color = this.nextColor()
        if (_k_.in(p,['pass','resign']))
        {
            this.moves.add(p,color)
            return
        }
        c = this.coord(p)
        if (captures = this.legal(color,c))
        {
            var list = (captures != null ? captures : [])
            for (var _168_24_ = 0; _168_24_ < list.length; _168_24_++)
            {
                deadPos = list[_168_24_]
                this.removePos(deadPos)
            }
            this.setStone(c,stone[color])
            return this.moves.add(p,color,(captures != null ? captures : []))
        }
        else
        {
            console.error('illegal move:',color,this.moves.num(),p)
            return this.moves.add('pass',color)
        }
    }

    Game.prototype["setStone"] = function (c, s)
    {
        this.grid.set(c,s)
        if (s === stone.empty)
        {
            return this.board.delStone(c)
        }
        else
        {
            return this.board.addStone(c,s)
        }
    }

    Game.prototype["removePos"] = function (p)
    {
        return this.setStone(this.coord(p),stone.empty)
    }

    Game.prototype["undoMove"] = function (m)
    {
        var p

        this.removePos(m.pos)
        if (!_k_.empty(m.captures))
        {
            this.verb('undoMove captures',m)
            var list = _k_.list(m.captures)
            for (var _206_18_ = 0; _206_18_ < list.length; _206_18_++)
            {
                p = list[_206_18_]
                this.setStone(this.coord(p),stone[opponent[m.color]])
            }
        }
        this.calcScore()
        return this.board.annotate()
    }

    Game.prototype["next"] = function (num = 1)
    {
        var i

        for (var _214_17_ = i = 0, _214_21_ = num; (_214_17_ <= _214_21_ ? i < num : i > num); (_214_17_ <= _214_21_ ? ++i : --i))
        {
            this.genmove()
        }
        return this.showboard()
    }

    Game.prototype["black"] = function (p)
    {
        return this.play(p)
    }

    Game.prototype["white"] = function (p)
    {
        return this.play(p)
    }

    Game.prototype["color"] = function (p)
    {
        switch (this.stoneAt(this.coord(p)))
        {
            case '○':
                return 'black'

            case '●':
                return 'white'

            default:
                return 'empty'
        }

    }

    Game.prototype["clear_board"] = function ()
    {
        var _238_20_

        this.moves.clear()
        this.clear()
        this.grid.clear()
        ;(typeof this.board.clear === "function" ? this.board.clear() : undefined)
        this.updateTitle()
        return ''
    }

    Game.prototype["showboard"] = function ()
    {
        var b, i, s, x, y

        s = ' '
        b = '  '
        b += (function (o) {
            var r_252_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_252_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_252_34_.join('') : r_252_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _255_17_ = i = this.size, _255_24_ = 1; (_255_17_ <= _255_24_ ? i <= 1 : i >= 1); (_255_17_ <= _255_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _258_21_ = x = 0, _258_25_ = this.size; (_258_21_ <= _258_25_ ? x < this.size : x > this.size); (_258_21_ <= _258_25_ ? ++x : --x))
            {
                b += this.stoneAt(x,y) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_265_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_265_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_265_34_.join('') : r_265_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    Game.prototype["setScore"] = function (score)
    {
        var calc

        if (score.endsWith('.0'))
        {
            score = score.slice(0, -2)
        }
        this.info.score = score
        calc = this.calcScore()
        if (score !== calc)
        {
            console.error('game.setScore',score,'!=',calc)
        }
        return this.board.annotate()
    }

    Game.prototype["updateTitle"] = function ()
    {
        if (process.type === 'renderer')
        {
            return (window != null ? window.win.updateTitle() : undefined)
        }
    }

    Game.prototype["finalScore"] = function (score)
    {
        return this.setScore(score)
    }

    return Game
})()

module.exports = Game