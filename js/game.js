// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}}

var alpha, Game, randInt, stone

randInt = require('kxk').randInt

alpha = 'ABCDEFGHJKLMNOPQRST'
stone = {black:'○',white:'●',empty:' ',B:'○',W:'●',b:'○',w:'●'}

Game = (function ()
{
    function Game ()
    {
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.boardsize(9)
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
        for (var _31_17_ = y = 0, _31_21_ = this.size; (_31_17_ <= _31_21_ ? y < this.size : y > this.size); (_31_17_ <= _31_21_ ? ++y : --y))
        {
            for (var _32_21_ = x = 0, _32_25_ = this.size; (_32_21_ <= _32_25_ ? x < this.size : x > this.size); (_32_21_ <= _32_25_ ? ++x : --x))
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
            for (var _53_18_ = 0; _53_18_ < list.length; _53_18_++)
            {
                n = list[_53_18_]
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
        for (var _63_14_ = 0; _63_14_ < list.length; _63_14_++)
        {
            p = list[_63_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _64_18_ = 0; _64_18_ < list1.length; _64_18_++)
            {
                n = list1[_64_18_]
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
        for (var _72_18_ = 0; _72_18_ < list.length; _72_18_++)
        {
            x = list[_72_18_][0]
            y = list[_72_18_][1]
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
        for (var _82_14_ = 0; _82_14_ < list.length; _82_14_++)
        {
            n = list[_82_14_]
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

    Game.prototype["valid"] = function (c)
    {
        return (0 <= c[0] && c[0] < this.size) && (0 <= c[1] && c[1] < this.size)
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
        var c, r

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
            r = this.rows[c[1]]
            this.rows[c[1]] = r.slice(0,c[0]) + stone[color] + r.slice(c[0] + 1)
            this.moves.push(color + ' ' + p)
            return ''
        }
        else
        {
            return '? invalid color or coordinate'
        }
    }

    Game.prototype["next"] = function (num = 1)
    {
        var i

        for (var _134_17_ = i = 0, _134_21_ = num; (_134_17_ <= _134_21_ ? i < num : i > num); (_134_17_ <= _134_21_ ? ++i : --i))
        {
            this.genmove()
        }
        return this.showboard()
    }

    Game.prototype["stoneAt"] = function (c)
    {
        return this.rows[c[1]][c[0]]
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

        this.rows = []
        for (var _158_17_ = y = 0, _158_21_ = this.size; (_158_17_ <= _158_21_ ? y < this.size : y > this.size); (_158_17_ <= _158_21_ ? ++y : --y))
        {
            this.rows.push(_k_.rpad(this.size,''))
        }
        this.moves = []
        return ''
    }

    Game.prototype["showboard"] = function ()
    {
        var b, i, s, x, y

        s = ' '
        b = '  '
        b += (function (o) {
            var r_167_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_167_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_167_34_.join('') : r_167_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _170_17_ = i = this.size, _170_24_ = 1; (_170_17_ <= _170_24_ ? i <= 1 : i >= 1); (_170_17_ <= _170_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _173_21_ = x = 0, _173_25_ = this.size; (_173_21_ <= _173_25_ ? x < this.size : x > this.size); (_173_21_ <= _173_25_ ? ++x : --x))
            {
                b += this.stoneAt([x,y]) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_180_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_180_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_180_34_.join('') : r_180_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    return Game
})()

module.exports = Game