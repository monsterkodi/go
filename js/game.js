// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var $, alpha, elem, Game, kxk, opponent, randInt, stone

kxk = require('kxk')
randInt = kxk.randInt
elem = kxk.elem
$ = kxk.$

opponent = require('./util').opponent
alpha = require('./util').alpha
stone = require('./util').stone


Game = (function ()
{
    function Game (board)
    {
        this.board = board
    
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.moves = []
        this.boardsize(this.board.size)
    }

    Game.prototype["save"] = function ()
    {
        window.stash.set('moves',this.moves)
        return window.stash.set('rows',this.rows)
    }

    Game.prototype["legal"] = function (color, c)
    {
        return this.stoneAt(c) === stone.empty && (this.freedoms(color,c) || this.movecaptures(color,c))
    }

    Game.prototype["all_legal"] = function (color)
    {
        var l, x, y

        color = (color != null ? color : this.nextColor())
        l = []
        for (var _39_17_ = y = 0, _39_21_ = this.size; (_39_17_ <= _39_21_ ? y < this.size : y > this.size); (_39_17_ <= _39_21_ ? ++y : --y))
        {
            for (var _40_21_ = x = 0, _40_25_ = this.size; (_40_21_ <= _40_25_ ? x < this.size : x > this.size); (_40_21_ <= _40_25_ ? ++x : --x))
            {
                if (this.legal(color,[x,y]))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Game.prototype["countlib"] = function (p)
    {
        return this.liberties(this.coord(p))
    }

    Game.prototype["liberties"] = function (c)
    {
        var g, n, s

        if (this.valid(c))
        {
            s = this.stoneAt(c)
            if (s !== stone.empty)
            {
                g = this.group(c)
                n = this.group_neighbors(g)
                n = n.filter((function (p)
                {
                    return stone.empty === this.stoneAt(this.coord(p))
                }).bind(this))
                return n.length
            }
        }
        return 0
    }

    Game.prototype["free"] = function (color, p)
    {
        return this.freedoms(color,this.coord(p))
    }

    Game.prototype["freedoms"] = function (color, c)
    {
        var l, n, s

        l = 0
        var list = _k_.list(this.neighbors(c))
        for (var _72_14_ = 0; _72_14_ < list.length; _72_14_++)
        {
            n = list[_72_14_]
            s = this.stoneAt(n)
            if (s === stone.empty)
            {
                l++
            }
            else if (s === stone[color])
            {
                if (this.liberties(n) > 1)
                {
                    l++
                }
            }
        }
        return l
    }

    Game.prototype["group"] = function (c)
    {
        var f, fp, g, n, p, s

        s = this.stoneAt(c)
        g = [this.pos(c)]
        f = [this.pos(c)]
        while (fp = f.shift())
        {
            var list = _k_.list(this.neighbors(this.coord(fp)))
            for (var _91_18_ = 0; _91_18_ < list.length; _91_18_++)
            {
                n = list[_91_18_]
                if (s === this.stoneAt(n))
                {
                    p = this.pos(n)
                    if (!(_k_.in(p,g)))
                    {
                        g.push(p)
                        if (!(_k_.in(p,f)))
                        {
                            f.push(p)
                        }
                    }
                }
            }
        }
        return g
    }

    Game.prototype["group_neighbors"] = function (g)
    {
        var gn, n, p

        gn = []
        var list = _k_.list(g)
        for (var _101_14_ = 0; _101_14_ < list.length; _101_14_++)
        {
            p = list[_101_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _102_18_ = 0; _102_18_ < list1.length; _102_18_++)
            {
                n = list1[_102_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Game.prototype["neighbors"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,0],[1,0],[0,-1],[0,1]]
        for (var _110_18_ = 0; _110_18_ < list.length; _110_18_++)
        {
            x = list[_110_18_][0]
            y = list[_110_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
    }

    Game.prototype["movecaptures"] = function (color, c)
    {
        var m, n, s

        m = stone[color]
        var list = _k_.list(this.neighbors(c))
        for (var _119_14_ = 0; _119_14_ < list.length; _119_14_++)
        {
            n = list[_119_14_]
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
            this.removeDead(opponent(color))
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
        var r

        r = this.rows[c[1]]
        this.rows[c[1]] = r.slice(0,c[0]) + stone[color] + r.slice(c[0] + 1)
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
        var captured, row, rows, x, y

        this.board.clear()
        this.clearRows()
        rows = data.split('\n').slice(2)
        rows = rows.map((function (r)
        {
            return r.slice(3).split(' ').join('')
        }).bind(this))
        for (var _198_17_ = y = 0, _198_21_ = this.size; (_198_17_ <= _198_21_ ? y < this.size : y > this.size); (_198_17_ <= _198_21_ ? ++y : --y))
        {
            row = rows[y]
            for (var _200_21_ = x = 0, _200_25_ = this.size; (_200_21_ <= _200_25_ ? x < this.size : x > this.size); (_200_21_ <= _200_25_ ? ++x : --x))
            {
                switch (row[x])
                {
                    case 'X':
                        this.setStone([x,y],'black')
                        break
                    case 'O':
                        this.setStone([x,y],'white')
                        break
                }

            }
            if (_k_.in('hascaptured',row))
            {
                captured = parseInt(row.split('hascaptured')[1])
                if (_k_.in('WHITE',row))
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

    Game.prototype["removeDead"] = function (color)
    {
        var c, dc, dp, g, p

        var list = _k_.list(this.allStones(color))
        for (var _223_14_ = 0; _223_14_ < list.length; _223_14_++)
        {
            p = list[_223_14_]
            c = this.coord(p)
            if (this.liberties(c) < 1)
            {
                g = this.group(c)
                this.captures[opponent(color)] += g.length
                var list1 = _k_.list(g)
                for (var _228_23_ = 0; _228_23_ < list1.length; _228_23_++)
                {
                    dp = list1[_228_23_]
                    dc = this.coord(dp)
                    this.setStone(dc,'empty')
                }
                this.updateTitle()
                this.removeDead()
                return
            }
        }
    }

    Game.prototype["allStones"] = function (color)
    {
        var l, s, x, y

        s = stone[color]
        l = []
        for (var _239_17_ = y = 0, _239_21_ = this.size; (_239_17_ <= _239_21_ ? y < this.size : y > this.size); (_239_17_ <= _239_21_ ? ++y : --y))
        {
            for (var _240_21_ = x = 0, _240_25_ = this.size; (_240_21_ <= _240_25_ ? x < this.size : x > this.size); (_240_21_ <= _240_25_ ? ++x : --x))
            {
                if (s === this.stoneAt([x,y]))
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

        for (var _247_17_ = i = 0, _247_21_ = num; (_247_17_ <= _247_21_ ? i < num : i > num); (_247_17_ <= _247_21_ ? ++i : --i))
        {
            this.genmove()
        }
        return this.showboard()
    }

    Game.prototype["stoneAt"] = function (c)
    {
        return this.rows[c[1]][c[0]]
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

    Game.prototype["boardsize"] = function (size)
    {
        this.size = size
    
        return this.clear_board()
    }

    Game.prototype["clear_board"] = function ()
    {
        this.captures = {black:0,white:0}
        this.clearRows()
        this.moves = []
        this.updateTitle()
        return ''
    }

    Game.prototype["clearRows"] = function ()
    {
        var y

        this.rows = []
        for (var _285_17_ = y = 0, _285_21_ = this.size; (_285_17_ <= _285_21_ ? y < this.size : y > this.size); (_285_17_ <= _285_21_ ? ++y : --y))
        {
            this.rows.push(_k_.rpad(this.size,''))
        }
    }

    Game.prototype["showboard"] = function ()
    {
        var b, i, s, x, y

        s = ' '
        b = '  '
        b += (function (o) {
            var r_298_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_298_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_298_34_.join('') : r_298_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _301_17_ = i = this.size, _301_24_ = 1; (_301_17_ <= _301_24_ ? i <= 1 : i >= 1); (_301_17_ <= _301_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _304_21_ = x = 0, _304_25_ = this.size; (_304_21_ <= _304_25_ ? x < this.size : x > this.size); (_304_21_ <= _304_25_ ? ++x : --x))
            {
                b += this.stoneAt([x,y]) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_311_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_311_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_311_34_.join('') : r_311_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    Game.prototype["setScore"] = function (score)
    {
        this.score = score
    
        console.log(this.score)
        return this.updateTitle()
    }

    Game.prototype["updateTitle"] = function ()
    {
        var bs, t, td, ws, _332_19_, _333_19_

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