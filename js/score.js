// monsterkodi/kode 0.237.0

var _k_ = {profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var alpha, Grid, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
opponent = require('./util').opponent

noon = require('kxk').noon

Grid = require('./grid')

Score = (function ()
{
    function Score (size)
    {
        this.size = size
    
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.grid = new Grid(this.size)
    }

    Score.prototype["calcScore"] = function ()
    {
        var g, gl, n, s

        _k_.profile('calcScore')
        this.grps = []
        this.areas = []
        for (s in this.allGroups())
        {
            gl = this.allGroups()[s]
            var list = _k_.list(gl)
            for (var _33_18_ = 0; _33_18_ < list.length; _33_18_++)
            {
                g = list[_33_18_]
                if (s === stone.empty)
                {
                    this.areas.push({area:g,key:g.join(' '),grps:[],color:this.areaColor(g),state:'neutral'})
                }
                else
                {
                    n = this.group_neighbors(g)
                    this.grps.push({stone:s,group:g,areas:[],libs:n.filter((function (p)
                    {
                        return stone.empty === this.stoneAt(this.coord(p))
                    }).bind(this)).length,neighbors:n,key:g.join(' '),state:'unknown'})
                }
            }
        }
        var list1 = _k_.list(this.grps)
        for (var _57_14_ = 0; _57_14_ < list1.length; _57_14_++)
        {
            g = list1[_57_14_]
            if (g.libs === 1)
            {
                g.state = 'dead'
                var list2 = _k_.list(g.neighbors)
                for (var _61_22_ = 0; _61_22_ < list2.length; _61_22_++)
                {
                    n = list2[_61_22_]
                    console.log(n,this.countlib(n),this.stoneAt(n))
                }
            }
        }
        _k_.profilend('calcScore')
    }

    Score.prototype["areaColor"] = function (g)
    {
        var c, cl, sl

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
            c = stoneColor[sl[0]][0]
            if (sl.length === g.length)
            {
                return c
            }
            else
            {
                return '.'
            }
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

    Score.prototype["countlib"] = function (p)
    {
        return this.liberties(this.coord(p))
    }

    Score.prototype["liberties"] = function (c)
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

    Score.prototype["free"] = function (color, p)
    {
        return this.freedoms(color,this.coord(p))
    }

    Score.prototype["freedoms"] = function (color, c)
    {
        var l, n, s

        l = 0
        var list = _k_.list(this.neighbors(c))
        for (var _142_14_ = 0; _142_14_ < list.length; _142_14_++)
        {
            n = list[_142_14_]
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
            for (var _164_19_ = 0; _164_19_ < list.length; _164_19_++)
            {
                gp = list[_164_19_]
                if (0 <= (i = allp.indexOf(gp)))
                {
                    allp.splice(i,1)
                }
            }
            grps[s].push(g.sort())
        }
        return grps
    }

    Score.prototype["group"] = function (c)
    {
        var f, fp, g, n, p, s

        s = this.stoneAt(c)
        g = [this.pos(c)]
        f = [this.pos(c)]
        while (fp = f.shift())
        {
            var list = _k_.list(this.neighbors(this.coord(fp)))
            for (var _176_18_ = 0; _176_18_ < list.length; _176_18_++)
            {
                n = list[_176_18_]
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

    Score.prototype["group_neighbors"] = function (g)
    {
        var gn, n, p

        gn = []
        var list = _k_.list(g)
        for (var _193_14_ = 0; _193_14_ < list.length; _193_14_++)
        {
            p = list[_193_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _194_18_ = 0; _194_18_ < list1.length; _194_18_++)
            {
                n = list1[_194_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Score.prototype["neighbors"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,0],[1,0],[0,-1],[0,1]]
        for (var _202_18_ = 0; _202_18_ < list.length; _202_18_++)
        {
            x = list[_202_18_][0]
            y = list[_202_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
    }

    Score.prototype["legal"] = function (color, c)
    {
        var fr, mc

        fr = this.freedoms(color,c)
        mc = this.movecaptures(color,c)
        return this.stoneAt(c) === stone.empty && (fr || mc)
    }

    Score.prototype["all_legal"] = function (color)
    {
        var l, x, y

        color = (color != null ? color : this.nextColor())
        l = []
        for (var _224_17_ = y = 0, _224_21_ = this.size; (_224_17_ <= _224_21_ ? y < this.size : y > this.size); (_224_17_ <= _224_21_ ? ++y : --y))
        {
            for (var _225_21_ = x = 0, _225_25_ = this.size; (_225_21_ <= _225_25_ ? x < this.size : x > this.size); (_225_21_ <= _225_25_ ? ++x : --x))
            {
                if (this.legal(color,[x,y]))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Score.prototype["movecaptures"] = function (color, c)
    {
        var m, n, s

        m = stone[color]
        var list = _k_.list(this.neighbors(c))
        for (var _233_14_ = 0; _233_14_ < list.length; _233_14_++)
        {
            n = list[_233_14_]
            s = this.stoneAt(n)
            if (s !== 'empty' && s !== m)
            {
                if (1 === this.freedoms(opponent[color],n))
                {
                    return true
                }
            }
        }
        return false
    }

    Score.prototype["allPos"] = function ()
    {
        var p, x, y

        p = []
        for (var _249_17_ = y = 0, _249_21_ = this.size; (_249_17_ <= _249_21_ ? y < this.size : y > this.size); (_249_17_ <= _249_21_ ? ++y : --y))
        {
            for (var _250_21_ = x = 0, _250_25_ = this.size; (_250_21_ <= _250_25_ ? x < this.size : x > this.size); (_250_21_ <= _250_25_ ? ++x : --x))
            {
                p.push(alpha[x] + (this.size - y))
            }
        }
        return p
    }

    Score.prototype["allStones"] = function (color)
    {
        var l, s, x, y

        s = stone[color]
        l = []
        for (var _264_17_ = y = 0, _264_21_ = this.size; (_264_17_ <= _264_21_ ? y < this.size : y > this.size); (_264_17_ <= _264_21_ ? ++y : --y))
        {
            for (var _265_21_ = x = 0, _265_25_ = this.size; (_265_21_ <= _265_25_ ? x < this.size : x > this.size); (_265_21_ <= _265_25_ ? ++x : --x))
            {
                if (s === this.stoneAt(x,y))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Score.prototype["stoneAt"] = function (x, y)
    {
        return this.grid.at(x,y)
    }

    Score.prototype["valid"] = function (c)
    {
        return (0 <= c[0] && c[0] < this.size) && (0 <= c[1] && c[1] < this.size)
    }

    Score.prototype["coord"] = function (p)
    {
        return [alpha.indexOf(p[0].toUpperCase()),this.size - parseInt(p.slice(1))]
    }

    Score.prototype["pos"] = function (c)
    {
        return alpha[c[0]] + (this.size - c[1])
    }

    Score.prototype["poslist"] = function (cl)
    {
        return cl.map(this.pos)
    }

    return Score
})()

module.exports = Score