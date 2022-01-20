// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var alpha, Grid, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha

Grid = require('./grid')

Score = (function ()
{
    function Score ()
    {}

    Score.prototype["rayColor"] = function (c, d)
    {
        var n, s

        n = [c[0] + d[0],c[1] + d[1]]
        s = this.stoneAt(n)
        return (s === stone.empty ? this.rayColor(n,d) : s)
    }

    Score.prototype["rayColors"] = function (c)
    {
        return [[1,0],[0,1],[-1,0],[0,-1]].map((function (r)
        {
            return this.rayColor(c,r)
        }).bind(this))
    }

    Score.prototype["isEye"] = function (c)
    {
        var p, rc

        if (stone.empty === this.stoneAt(c))
        {
            rc = this.rayColors(c)
            p = rc.filter(function (r)
            {
                return (r != null)
            }).join('')
            if (!(_k_.in('○●',p)) && !(_k_.in('●○',p)) && p.length > 0)
            {
                return stoneColor(p[0])
            }
        }
    }

    Score.prototype["potentialOwner"] = function (c)
    {
        var p, rc

        if (stone.empty === this.stoneAt(c))
        {
            rc = this.rayColors(c)
            p = rc.filter(function (r)
            {
                return (r != null)
            }).join('')
            if (!(_k_.in('○●',p)) && !(_k_.in('●○',p)) && p.length > 0)
            {
                return p[0]
            }
        }
    }

    Score.prototype["areaColor"] = function (g)
    {
        var cl, sl

        cl = g.map((function (p)
        {
            return this.potentialOwner(this.coord(p))
        }).bind(this))
        sl = cl.filter(function (r)
        {
            return (r != null)
        }).join('')
        if (!(_k_.in('○●',sl)) && !(_k_.in('●○',sl)) && sl.length > 0)
        {
            return stoneColor(sl[0])[0]
        }
        else
        {
            return '.'
        }
    }

    Score.prototype["allPos"] = function ()
    {
        var p, x, y

        p = []
        for (var _48_17_ = y = 0, _48_21_ = this.size; (_48_17_ <= _48_21_ ? y < this.size : y > this.size); (_48_17_ <= _48_21_ ? ++y : --y))
        {
            for (var _49_21_ = x = 0, _49_25_ = this.size; (_49_21_ <= _49_25_ ? x < this.size : x > this.size); (_49_21_ <= _49_25_ ? ++x : --x))
            {
                p.push(alpha[x] + (this.size - y))
            }
        }
        return p
    }

    Score.prototype["allGroups"] = function ()
    {
        var allp, g, gp, grps, i, p, s

        grps = {'○':[],'●':[],' ':[]}
        allp = this.allPos()
        while (allp.length)
        {
            p = allp.pop()
            s = this.stoneAt(p)
            g = this.group(this.coord(p))
            var list = _k_.list(g)
            for (var _61_19_ = 0; _61_19_ < list.length; _61_19_++)
            {
                gp = list[_61_19_]
                if (0 <= (i = allp.indexOf(gp)))
                {
                    allp.splice(i,1)
                }
            }
            grps[s].push(g.sort())
        }
        return grps
    }

    Score.prototype["calcScore"] = function ()
    {
        var g, gl, gr, grps, p, s, t

        console.log('%c groups','font-size: 24px; color:red;')
        grps = this.allGroups()
        gr = new Grid(this.size)
        for (s in grps)
        {
            gl = grps[s]
            var list = _k_.list(gl)
            for (var _73_18_ = 0; _73_18_ < list.length; _73_18_++)
            {
                g = list[_73_18_]
                t = s
                if (s === stone.empty)
                {
                    t = this.areaColor(g)
                }
                console.log(t,g.join(' '))
                var list1 = _k_.list(g)
                for (var _78_22_ = 0; _78_22_ < list1.length; _78_22_++)
                {
                    p = list1[_78_22_]
                    gr.set(p,t)
                }
            }
        }
        console.log(gr.grid)
        return gr
    }

    return Score
})()

module.exports = Score