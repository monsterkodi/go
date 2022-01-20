// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var alpha, Grid, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha

Grid = require('./grid')

Score = (function ()
{
    function Score ()
    {}

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
            for (var _26_18_ = 0; _26_18_ < list.length; _26_18_++)
            {
                g = list[_26_18_]
                t = s
                if (s === stone.empty)
                {
                    t = this.areaColor(g)
                }
                var list1 = _k_.list(g)
                for (var _31_22_ = 0; _31_22_ < list1.length; _31_22_++)
                {
                    p = list1[_31_22_]
                    gr.set(p,t)
                }
            }
        }
        return gr
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
            for (var _50_19_ = 0; _50_19_ < list.length; _50_19_++)
            {
                gp = list[_50_19_]
                if (0 <= (i = allp.indexOf(gp)))
                {
                    allp.splice(i,1)
                }
            }
            grps[s].push(g.sort())
        }
        return grps
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

    Score.prototype["allPos"] = function ()
    {
        var p, x, y

        p = []
        for (var _107_17_ = y = 0, _107_21_ = this.size; (_107_17_ <= _107_21_ ? y < this.size : y > this.size); (_107_17_ <= _107_21_ ? ++y : --y))
        {
            for (var _108_21_ = x = 0, _108_25_ = this.size; (_108_21_ <= _108_25_ ? x < this.size : x > this.size); (_108_21_ <= _108_25_ ? ++x : --x))
            {
                p.push(alpha[x] + (this.size - y))
            }
        }
        return p
    }

    return Score
})()

module.exports = Score