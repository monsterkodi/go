// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var $, alpha, elem, Game, Grid, kxk, Moves, opponent, randInt, Score, stone

kxk = require('kxk')
randInt = kxk.randInt
elem = kxk.elem
$ = kxk.$

opponent = require('./util').opponent
alpha = require('./util').alpha
stone = require('./util').stone

Score = require('./score')
Moves = require('./moves')
Grid = require('./grid')

Game = (function ()
{
    _k_.extend(Game, Score)
    function Game (board, white, black, handicap)
    {
        this.handicap = handicap
    
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
        for (var _35_14_ = 0; _35_14_ < list.length; _35_14_++)
        {
            m = list[_35_14_]
            g.play(m)
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
            this.play(color,p)
            return p
        }
        else
        {
            return 'pass'
        }
    }

    Game.prototype["play"] = function (color, p)
    {
        var c, _108_27_

        if (!p)
        {
            p = color
            color = this.nextColor()
        }
        if (_k_.in(p.toLowerCase(),['pass','resign','illegal']))
        {
            this.moves.add(p.toLowerCase(),color)
            this.updateTitle()
            return ''
        }
        c = this.coord(p)
        if (!this.legal(color,c))
        {
            this.moves.add("illegal",color)
            console.error("illegal move:",color,this.moves.num(),p)
            return '? invalid move'
        }
        if (this.valid(c))
        {
            this.setStone(c,stone[color])
            this.moves.add(p,color,this.capture(color))
            this.calcScore()
            ;(typeof this.board.annotate === "function" ? this.board.annotate() : undefined)
            return ''
        }
        else
        {
            return '? invalid color or coordinate'
        }
    }

    Game.prototype["capture"] = function (color)
    {
        var dead, deadPos, s

        s = stone[opponent[color]]
        this.calcGroups()
        var list = _k_.list(this.grps.filter(function (g)
        {
            return g.libs === 0 && g.stone === s
        }))
        for (var _125_17_ = 0; _125_17_ < list.length; _125_17_++)
        {
            dead = list[_125_17_]
            this.captures[color] += dead.posl.length
            var list1 = _k_.list(dead.posl)
            for (var _128_24_ = 0; _128_24_ < list1.length; _128_24_++)
            {
                deadPos = list1[_128_24_]
                this.removePos(deadPos)
            }
        }
    }

    Game.prototype["setStone"] = function (c, s)
    {
        var _141_27_, _143_27_

        this.grid.set(c,s)
        if (s === stone.empty)
        {
            return (typeof this.board.delStone === "function" ? this.board.delStone(c) : undefined)
        }
        else
        {
            return (typeof this.board.addStone === "function" ? this.board.addStone(c,s) : undefined)
        }
    }

    Game.prototype["removePos"] = function (p)
    {
        return this.setStone(this.coord(p),stone.empty)
    }

    Game.prototype["undoMove"] = function (m)
    {
        this.removePos(m.pos)
        if (!_k_.empty(m.captures))
        {
            console.log('undoMove captures',m)
        }
        this.calcScore()
        return this.board.annotate()
    }

    Game.prototype["show"] = function (data)
    {
        var captured, r, rs, x, y

        this.grid.clear()
        this.board.clear()
        rs = data.split('\n').slice(2)
        rs = rs.map((function (r)
        {
            return r.slice(3).split(' ').join('')
        }).bind(this))
        for (var _171_17_ = y = 0, _171_21_ = this.size; (_171_17_ <= _171_21_ ? y < this.size : y > this.size); (_171_17_ <= _171_21_ ? ++y : --y))
        {
            r = rs[y]
            for (var _173_21_ = x = 0, _173_25_ = this.size; (_173_21_ <= _173_25_ ? x < this.size : x > this.size); (_173_21_ <= _173_25_ ? ++x : --x))
            {
                switch (r[x])
                {
                    case 'X':
                        this.setStone([x,y],stone.black)
                        break
                    case 'O':
                        this.setStone([x,y],stone.white)
                        break
                }

            }
            if (_k_.in('hascaptured',r))
            {
                captured = parseInt(r.split('hascaptured')[1])
                console.log('captured',r,captured)
                if (_k_.in('WHITE',r))
                {
                    this.captures.white = captured
                }
                else
                {
                    this.captures.black = captured
                }
            }
        }
        this.calcScore()
        return this.board.annotate()
    }

    Game.prototype["next"] = function (num = 1)
    {
        var i

        for (var _191_17_ = i = 0, _191_21_ = num; (_191_17_ <= _191_21_ ? i < num : i > num); (_191_17_ <= _191_21_ ? ++i : --i))
        {
            this.genmove()
        }
        return this.showboard()
    }

    Game.prototype["black"] = function (p)
    {
        return this.play('B',p)
    }

    Game.prototype["white"] = function (p)
    {
        return this.play('W',p)
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
        var _215_20_

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
            var r_229_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_229_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_229_34_.join('') : r_229_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _232_17_ = i = this.size, _232_24_ = 1; (_232_17_ <= _232_24_ ? i <= 1 : i >= 1); (_232_17_ <= _232_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _235_21_ = x = 0, _235_25_ = this.size; (_235_21_ <= _235_25_ ? x < this.size : x > this.size); (_235_21_ <= _235_25_ ? ++x : --x))
            {
                b += this.stoneAt(x,y) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_242_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_242_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_242_34_.join('') : r_242_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    Game.prototype["dump"] = function ()
    {
        console.log(this.showboard())
        console.log('white',this.allStones('w').length,this.allStones('w'))
        console.log('black',this.allStones('b').length,this.allStones('b'))
        console.log(this.grid.toString())
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