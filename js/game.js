// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var $, alpha, elem, Game, kxk, stone

kxk = require('kxk')
elem = kxk.elem
$ = kxk.$

alpha = 'ABCDEFGHJKLMNOPQRST'
stone = {black:'○',white:'●',empty:' ',B:'○',W:'●',b:'○',w:'●'}

Game = (function ()
{
    function Game (board)
    {
        this.board = board
    
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.boardsize(this.board.size)
    }

    Game.prototype["legal"] = function (color, c)
    {
        return this.stoneAt(c) === stone.empty && this.freedoms(color,c)
    }

    Game.prototype["all_legal"] = function (color)
    {
        var l, x, y

        color = (color != null ? color : this.nextColor())
        l = []
        for (var _33_17_ = y = 0, _33_21_ = this.size; (_33_17_ <= _33_21_ ? y < this.size : y > this.size); (_33_17_ <= _33_21_ ? ++y : --y))
        {
            for (var _34_21_ = x = 0, _34_25_ = this.size; (_34_21_ <= _34_25_ ? x < this.size : x > this.size); (_34_21_ <= _34_25_ ? ++x : --x))
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

    Game.prototype["group"] = function (c)
    {
        var f, fp, g, n, p, s

        s = this.stoneAt(c)
        g = [this.pos(c)]
        f = [this.pos(c)]
        while (fp = f.shift())
        {
            var list = _k_.list(this.neighbors(this.coord(fp)))
            for (var _67_18_ = 0; _67_18_ < list.length; _67_18_++)
            {
                n = list[_67_18_]
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
        for (var _77_14_ = 0; _77_14_ < list.length; _77_14_++)
        {
            p = list[_77_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _78_18_ = 0; _78_18_ < list1.length; _78_18_++)
            {
                n = list1[_78_18_]
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
        for (var _86_18_ = 0; _86_18_ < list.length; _86_18_++)
        {
            x = list[_86_18_][0]
            y = list[_86_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
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
        for (var _102_14_ = 0; _102_14_ < list.length; _102_14_++)
        {
            n = list[_102_14_]
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
            this.removeDead(this.opponent(color))
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

        if (color === 'empty')
        {
            this.board.delStone(c)
        }
        else
        {
            this.board.addStone(c,color)
        }
        r = this.rows[c[1]]
        return this.rows[c[1]] = r.slice(0,c[0]) + stone[color] + r.slice(c[0] + 1)
    }

    Game.prototype["removeDead"] = function (color)
    {
        var c, dc, dp, g, p

        var list = _k_.list(this.allstones(color))
        for (var _182_14_ = 0; _182_14_ < list.length; _182_14_++)
        {
            p = list[_182_14_]
            c = this.coord(p)
            if (this.liberties(c) < 1)
            {
                g = this.group(c)
                this.captures[this.opponent(color)] += g.length
                var list1 = _k_.list(g)
                for (var _187_23_ = 0; _187_23_ < list1.length; _187_23_++)
                {
                    dp = list1[_187_23_]
                    dc = this.coord(dp)
                    this.setStone(dc,'empty')
                }
                this.updateTitle()
                this.removeDead()
                return
            }
        }
    }

    Game.prototype["allstones"] = function (color)
    {
        var l, s, x, y

        s = stone[color]
        l = []
        for (var _198_17_ = y = 0, _198_21_ = this.size; (_198_17_ <= _198_21_ ? y < this.size : y > this.size); (_198_17_ <= _198_21_ ? ++y : --y))
        {
            for (var _199_21_ = x = 0, _199_25_ = this.size; (_199_21_ <= _199_25_ ? x < this.size : x > this.size); (_199_21_ <= _199_25_ ? ++x : --x))
            {
                if (s === this.stoneAt([x,y]))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Game.prototype["opponent"] = function (color)
    {
        var opp

        opp = {black:'white',B:'white',b:'white',white:'black',W:'black',w:'black'}
        return opp[color]
    }

    Game.prototype["next"] = function (num = 1)
    {
        var i

        for (var _217_17_ = i = 0, _217_21_ = num; (_217_17_ <= _217_21_ ? i < num : i > num); (_217_17_ <= _217_21_ ? ++i : --i))
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
        var y

        this.captures = {black:0,white:0}
        this.rows = []
        for (var _248_17_ = y = 0, _248_21_ = this.size; (_248_17_ <= _248_21_ ? y < this.size : y > this.size); (_248_17_ <= _248_21_ ? ++y : --y))
        {
            this.rows.push(_k_.rpad(this.size,''))
        }
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
            var r_264_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_264_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_264_34_.join('') : r_264_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _267_17_ = i = this.size, _267_24_ = 1; (_267_17_ <= _267_24_ ? i <= 1 : i >= 1); (_267_17_ <= _267_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _270_21_ = x = 0, _270_25_ = this.size; (_270_21_ <= _270_25_ ? x < this.size : x > this.size); (_270_21_ <= _270_25_ ? ++x : --x))
            {
                b += this.stoneAt([x,y]) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_277_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_277_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_277_34_.join('') : r_277_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    Game.prototype["updateTitle"] = function ()
    {
        var t, td

        t = $('.titlebar-title')
        t.innerHTML = ''
        td = elem('div',{class:'captures',parent:t})
        elem('span',{class:'capture black',text:this.captures.black + stone.black,parent:td})
        return elem('span',{class:'capture white',text:stone.white + this.captures.white,parent:td})
    }

    return Game
})()

module.exports = Game