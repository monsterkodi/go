// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var $, alpha, elem, Game, Grid, kxk, opponent, randInt, Score, stone

kxk = require('kxk')
randInt = kxk.randInt
elem = kxk.elem
$ = kxk.$

opponent = require('./util').opponent
alpha = require('./util').alpha
stone = require('./util').stone

Score = require('./score')
Grid = require('./grid')

Game = (function ()
{
    _k_.extend(Game, Score)
    function Game (board)
    {
        this.board = board
    
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.grid = new Grid()
        this.moves = []
        this.boardsize(this.board.size)
        return Game.__super__.constructor.apply(this, arguments)
    }

    Game.prototype["boardsize"] = function (size)
    {
        this.size = size
    
        return this.clear_board()
    }

    Game.prototype["save"] = function ()
    {
        window.stash.set('moves',this.moves)
        return window.stash.set('grid',this.grid.grid)
    }

    Game.prototype["legal"] = function (color, c)
    {
        var fr, mc

        fr = this.freedoms(color,c)
        mc = this.movecaptures(color,c)
        return this.stoneAt(c) === stone.empty && (fr || mc)
    }

    Game.prototype["all_legal"] = function (color)
    {
        var l, x, y

        color = (color != null ? color : this.nextColor())
        l = []
        for (var _48_17_ = y = 0, _48_21_ = this.size; (_48_17_ <= _48_21_ ? y < this.size : y > this.size); (_48_17_ <= _48_21_ ? ++y : --y))
        {
            for (var _49_21_ = x = 0, _49_25_ = this.size; (_49_21_ <= _49_25_ ? x < this.size : x > this.size); (_49_21_ <= _49_25_ ? ++x : --x))
            {
                if (this.legal(color,[x,y]))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Game.prototype["movecaptures"] = function (color, c)
    {
        var m, n, s

        m = stone[color]
        var list = _k_.list(this.neighbors(c))
        for (var _57_14_ = 0; _57_14_ < list.length; _57_14_++)
        {
            n = list[_57_14_]
            s = this.stoneAt(n)
            if (s !== 'empty' && s !== m)
            {
                if (1 === this.freedoms(opponent(color),n))
                {
                    return true
                }
            }
        }
        return false
    }

    Game.prototype["move_history"] = function ()
    {
        return this.moves.join('\n')
    }

    Game.prototype["nextColor"] = function ()
    {
        switch (this.moves.length % 2)
        {
            case 0:
                return 'B'

            default:
                return 'W'
        }

    }

    Game.prototype["genmove"] = function (color)
    {
        var l, p

        color = (color != null ? color : this.nextColor())
        l = this.all_legal(color)
        if (this.moves.length && this.moves.slice(-1)[0].endsWith('pass'))
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
        var c

        if (p.toLowerCase() === 'pass')
        {
            this.moves.push(color + ' ' + p.toLowerCase())
            this.updateTitle()
            return ''
        }
        if (!p)
        {
            p = color
            color = this.nextColor()
        }
        c = this.coord(p)
        if (this.valid(c))
        {
            this.setStone(c,color)
            this.moves.push(color + ' ' + p)
            this.capture(opponent(color))
            this.board.lastMove(color,c)
            return ''
        }
        else
        {
            return '? invalid color or coordinate'
        }
    }

    Game.prototype["setStone"] = function (c, color)
    {
        this.grid.set(c,stone[color])
        if (color === 'empty')
        {
            return this.board.delStone(c)
        }
        else
        {
            return this.board.addStone(c,color)
        }
    }

    Game.prototype["show"] = function (data)
    {
        var captured, r, rs, x, y

        this.board.clear()
        this.grid.clear()
        rs = data.split('\n').slice(2)
        rs = rs.map((function (r)
        {
            return r.slice(3).split(' ').join('')
        }).bind(this))
        for (var _146_17_ = y = 0, _146_21_ = this.size; (_146_17_ <= _146_21_ ? y < this.size : y > this.size); (_146_17_ <= _146_21_ ? ++y : --y))
        {
            r = rs[y]
            for (var _148_21_ = x = 0, _148_25_ = this.size; (_148_21_ <= _148_25_ ? x < this.size : x > this.size); (_148_21_ <= _148_25_ ? ++x : --x))
            {
                switch (r[x])
                {
                    case 'X':
                        this.setStone([x,y],'black')
                        break
                    case 'O':
                        this.setStone([x,y],'white')
                        break
                }

            }
            if (_k_.in('hascaptured',r))
            {
                captured = parseInt(r.split('hascaptured')[1])
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
        this.board.liberties()
        return this.updateTitle()
    }

    Game.prototype["capture"] = function (color)
    {
        var c, dc, dp, g, p

        var list = _k_.list(this.allStones(color))
        for (var _171_14_ = 0; _171_14_ < list.length; _171_14_++)
        {
            p = list[_171_14_]
            c = this.coord(p)
            if (this.liberties(c) < 1)
            {
                g = this.group(c)
                this.captures[opponent(color)] += g.length
                var list1 = _k_.list(g)
                for (var _176_23_ = 0; _176_23_ < list1.length; _176_23_++)
                {
                    dp = list1[_176_23_]
                    dc = this.coord(dp)
                    this.setStone(dc,'empty')
                }
                this.updateTitle()
                this.capture()
                return
            }
        }
    }

    Game.prototype["allStones"] = function (color)
    {
        var l, s, x, y

        s = stone[color]
        l = []
        for (var _187_17_ = y = 0, _187_21_ = this.size; (_187_17_ <= _187_21_ ? y < this.size : y > this.size); (_187_17_ <= _187_21_ ? ++y : --y))
        {
            for (var _188_21_ = x = 0, _188_25_ = this.size; (_188_21_ <= _188_25_ ? x < this.size : x > this.size); (_188_21_ <= _188_25_ ? ++x : --x))
            {
                if (s === this.stoneAt(x,y))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Game.prototype["next"] = function (num = 1)
    {
        var i

        for (var _195_17_ = i = 0, _195_21_ = num; (_195_17_ <= _195_21_ ? i < num : i > num); (_195_17_ <= _195_21_ ? ++i : --i))
        {
            this.genmove()
        }
        return this.showboard()
    }

    Game.prototype["stoneAt"] = function (x, y)
    {
        return this.grid.at(x,y)
    }

    Game.prototype["valid"] = function (c)
    {
        return (0 <= c[0] && c[0] < this.size) && (0 <= c[1] && c[1] < this.size)
    }

    Game.prototype["coord"] = function (p)
    {
        return [alpha.indexOf(p[0].toUpperCase()),this.size - parseInt(p.slice(1))]
    }

    Game.prototype["pos"] = function (c)
    {
        return alpha[c[0]] + (this.size - c[1])
    }

    Game.prototype["poslist"] = function (cl)
    {
        return cl.map(this.pos)
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
        this.captures = {black:0,white:0}
        this.grid.clear(this.size)
        this.moves = []
        this.updateTitle()
        return ''
    }

    Game.prototype["showboard"] = function ()
    {
        var b, i, s, x, y

        s = ' '
        b = '  '
        b += (function (o) {
            var r_238_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_238_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_238_34_.join('') : r_238_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _241_17_ = i = this.size, _241_24_ = 1; (_241_17_ <= _241_24_ ? i <= 1 : i >= 1); (_241_17_ <= _241_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _244_21_ = x = 0, _244_25_ = this.size; (_244_21_ <= _244_25_ ? x < this.size : x > this.size); (_244_21_ <= _244_25_ ? ++x : --x))
            {
                b += this.stoneAt(x,y) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_251_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_251_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_251_34_.join('') : r_251_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    Game.prototype["dump"] = function ()
    {
        console.log(this.showboard())
        console.log('white',this.allStones('w').length,this.allStones('w'))
        console.log('black',this.allStones('b').length,this.allStones('b'))
        console.log(this.grid.grid)
    }

    Game.prototype["setScore"] = function (score)
    {
        this.score = score
    
        console.log(this.score)
        this.calcScore()
        return this.updateTitle()
    }

    Game.prototype["updateTitle"] = function ()
    {
        var bs, t, td, ws, _280_19_, _281_19_

        t = $('.titlebar-title')
        t.innerHTML = ''
        td = elem('div',{class:'captures',parent:t})
        bs = ((this.score != null ? this.score[0] : undefined) === 'B' ? this.score.slice(2) : '  ')
        ws = ((this.score != null ? this.score[0] : undefined) === 'W' ? this.score.slice(2) : '  ')
        elem('span',{class:'capture black',text:bs + ' ' + this.captures.black + stone.black,parent:td})
        return elem('span',{class:'capture white',text:stone.white + this.captures.white + ' ' + ws,parent:td})
    }

    Game.prototype["finalScore"] = function (score)
    {
        var t, td

        t = $('.titlebar-title')
        t.innerHTML = ''
        return td = elem('div',{class:'captures',text:score,parent:t})
    }

    return Game
})()

module.exports = Game