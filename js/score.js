// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var alpha, Grid, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
opponent = require('./util').opponent

noon = require('kxk').noon

min = Math.min

Grid = require('./grid')

Score = (function ()
{
    function Score (a)
    {
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.grid = new Grid(a)
        this.size = this.grid.size
        this.captures = {black:0,white:0}
    }

    Score.prototype["clone"] = function ()
    {
        var s

        s = new Score(this.size)
        s.captures = _k_.copy(this.captures)
        s.grid.copy(this.grid)
        return s
    }

    Score.prototype["clear"] = function ()
    {
        this.captures = {black:0,white:0}
        return this.grid.clear(this.size)
    }

    Score.prototype["calcScore"] = function (root)
    {
        var a, ai, canMakeEye, dead, final, finalScore, g, gi, gl, markDead, n, o, s, score

        this.grps = []
        this.areas = []
        for (s in this.allGroups())
        {
            gl = this.allGroups()[s]
            var list = _k_.list(gl)
            for (var _54_18_ = 0; _54_18_ < list.length; _54_18_++)
            {
                g = list[_54_18_]
                n = this.groupNeighbors(g)
                if (s === stone.empty)
                {
                    this.areas.push({area:g,key:g.join(' '),grps:[],color:this.areaColor(g),state:'neutral',neighbors:n})
                }
                else
                {
                    this.grps.push({stone:s,group:g,areas:[],eyes:[],libs:n.filter((function (p)
                    {
                        return stone.empty === this.stoneAt(this.coord(p))
                    }).bind(this)).length,neighbors:n,diagonals:this.groupDiagonals(g,n),key:g.join(' '),state:'unknown'})
                }
            }
        }
        dead = false
        score = this.clone()
        markDead = (function (g, r)
        {
            var p

            console.log('dead:',r,g)
            dead = true
            g.state = 'dead'
            var list1 = _k_.list(g.group)
            for (var _84_18_ = 0; _84_18_ < list1.length; _84_18_++)
            {
                p = list1[_84_18_]
                score.captures[opponent[g.stone]]++
                score.grid.set(p,stone.empty)
            }
            console.log(this.deadString(1))
        }).bind(this)
        if (root)
        {
            this.linkAreas()
            var list1 = _k_.list(this.grps)
            for (var _95_18_ = 0; _95_18_ < list1.length; _95_18_++)
            {
                g = list1[_95_18_]
                if (g.eyes.length < 2)
                {
                    if (this.potentialConnection(g))
                    {
                        continue
                    }
                    a = (g.eyes.length ? this.areas[g.eyes[0]] : this.areas[g.areas[0]])
                    var list2 = _k_.list(a.grps)
                    for (var _102_27_ = 0; _102_27_ < list2.length; _102_27_++)
                    {
                        gi = list2[_102_27_]
                        o = this.grps[gi]
                        if (o.stone !== g.stone && o.eyes.length > 1)
                        {
                            if (!this.potentialGroup(g))
                            {
                                markDead(g,'dead no eyes and no potential')
                                break
                            }
                        }
                    }
                    if (!dead)
                    {
                        if (g.areas.length === 1 && this.deadShape(a))
                        {
                            markDead(g,'dead shape')
                        }
                    }
                    if (!dead)
                    {
                        canMakeEye = false
                        var list3 = _k_.list(g.areas)
                        for (var _115_31_ = 0; _115_31_ < list3.length; _115_31_++)
                        {
                            ai = list3[_115_31_]
                            if (!this.deadShape(this.areas[ai]))
                            {
                                canMakeEye = true
                                break
                            }
                        }
                        if (!canMakeEye)
                        {
                            if (g.areas.length === 2)
                            {
                                var list4 = _k_.list(g.areas)
                                for (var _122_39_ = 0; _122_39_ < list4.length; _122_39_++)
                                {
                                    ai = list4[_122_39_]
                                    if (!(_k_.in(ai,g.eyes)))
                                    {
                                        if (!this.potentialEye(g,this.areas[ai]))
                                        {
                                            markDead(g,'no potential 2nd eye')
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (dead)
            {
                final = score.calcScore(this)
            }
        }
        if (!root)
        {
            var list5 = _k_.list(this.grps)
            for (var _131_18_ = 0; _131_18_ < list5.length; _131_18_++)
            {
                g = list5[_131_18_]
                if (g.libs === 1)
                {
                    markDead(g)
                }
            }
            final = score.calcScore(this)
            var list6 = _k_.list(final.areas)
            for (var _137_18_ = 0; _137_18_ < list6.length; _137_18_++)
            {
                a = list6[_137_18_]
                if (a.color !== '.')
                {
                    final.captures[stoneColor[a.color]] += a.area.length
                }
            }
            var list7 = _k_.list(this.grps)
            for (var _141_18_ = 0; _141_18_ < list7.length; _141_18_++)
            {
                g = list7[_141_18_]
                if (g.state === 'unknown')
                {
                    if (stone.empty === final.grid.at(g.group[0]))
                    {
                        g.state = 'dead'
                    }
                }
            }
            var list8 = _k_.list(this.areas)
            for (var _146_18_ = 0; _146_18_ < list8.length; _146_18_++)
            {
                a = list8[_146_18_]
                a.color = final.areaAt(a.area[0]).color
            }
            if (final.captures.white > final.captures.black)
            {
                finalScore = 'W+' + (final.captures.white - final.captures.black)
            }
            else
            {
                finalScore = 'B+' + (final.captures.black - final.captures.white)
            }
            return finalScore
        }
        else if (dead)
        {
            return final
        }
        else
        {
            return this
        }
    }

    Score.prototype["linkAreas"] = function ()
    {
        var a, ai, g, gi, n

        var list = _k_.list(this.areas)
        for (var _169_14_ = 0; _169_14_ < list.length; _169_14_++)
        {
            a = list[_169_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _171_18_ = 0; _171_18_ < list1.length; _171_18_++)
            {
                n = list1[_171_18_]
                if (g = this.groupAt(n))
                {
                    gi = this.grps.indexOf(g)
                    if (!(_k_.in(gi,a.grps)))
                    {
                        a.grps.push(gi)
                    }
                    if (!(_k_.in(ai,g.areas)))
                    {
                        g.areas.push(ai)
                    }
                    if (a.color === stoneColor[g.stone][0])
                    {
                        if (!(_k_.in(ai,g.eyes)))
                        {
                            g.eyes.push(ai)
                        }
                    }
                }
            }
        }
    }

    Score.prototype["areaAt"] = function (p)
    {
        var g

        var list = _k_.list(this.areas)
        for (var _184_14_ = 0; _184_14_ < list.length; _184_14_++)
        {
            g = list[_184_14_]
            if (_k_.in(p,g.area))
            {
                return g
            }
        }
    }

    Score.prototype["groupAt"] = function (p)
    {
        var g

        var list = _k_.list(this.grps)
        for (var _190_14_ = 0; _190_14_ < list.length; _190_14_++)
        {
            g = list[_190_14_]
            if (_k_.in(p,g.group))
            {
                return g
            }
        }
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
        if (_k_.in('?',sl))
        {
            return '?'
        }
        else if (!(_k_.in('○●',sl)) && !(_k_.in('●○',sl)) && sl.length > 0)
        {
            return c = stoneColor[sl[0]][0]
        }
        else
        {
            return '.'
        }
    }

    Score.prototype["deadShape"] = function (a)
    {
        var af, cs, ss

        if (a.area.length < 6)
        {
            af = a.area.filter((function (p)
            {
                return '?' !== this.potentialOwner(this.coord(p))
            }).bind(this))
            if (af.length < 4)
            {
                return true
            }
            cs = this.minCoords(af.map(this.coord))
            ss = cs.map(function (c)
            {
                return '' + c[0] + c[1]
            }).join(' ')
            return _k_.in(ss,['00 01 11 02 12','10 01 11 02 12','00 10 20 11 21','01 10 20 11 21','00 10 01 11 20','00 10 01 11 21','00 10 01 11 02','00 10 01 11 12','00 10 01 11'])
        }
        return false
    }

    Score.prototype["minCoords"] = function (cs)
    {
        var c, mx, my

        mx = my = Infinity
        var list = _k_.list(cs)
        for (var _235_14_ = 0; _235_14_ < list.length; _235_14_++)
        {
            c = list[_235_14_]
            mx = _k_.min(c[0],mx)
            my = _k_.min(c[1],my)
        }
        cs = cs.map(function (c)
        {
            return [c[0] - mx,c[1] - my]
        })
        return cs.sort(function (a, b)
        {
            if (a[1] !== b[1])
            {
                return a[1] - b[1]
            }
            else
            {
                return a[0] - b[0]
            }
        })
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
            if (_k_.in('○●',p) || _k_.in('●○',p))
            {
                return '?'
            }
            else if (p.length)
            {
                return p[0]
            }
        }
    }

    Score.prototype["potentialGroup"] = function (g)
    {
        var n

        var list = _k_.list(g.neighbors)
        for (var _263_14_ = 0; _263_14_ < list.length; _263_14_++)
        {
            n = list[_263_14_]
            if (this.stoneAt(n) === stone.empty && g.stone === this.potentialOwner(this.coord(n)))
            {
                return true
            }
        }
    }

    Score.prototype["potentialEye"] = function (g, a)
    {
        var cnt, n

        if (a.area.length < 2)
        {
            return false
        }
        if (a.area.length === 2)
        {
            cnt = {'○':0,'●':0,' ':0}
            var list = _k_.list(a.neighbors)
            for (var _272_18_ = 0; _272_18_ < list.length; _272_18_++)
            {
                n = list[_272_18_]
                cnt[this.stoneAt(n)]++
            }
            if (cnt['○'] === cnt['●'])
            {
                return false
            }
        }
        return true
    }

    Score.prototype["potentialConnection"] = function (g)
    {
        var d, n

        var list = _k_.list(g.diagonals)
        for (var _279_14_ = 0; _279_14_ < list.length; _279_14_++)
        {
            d = list[_279_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _281_22_ = 0; _281_22_ < list1.length; _281_22_++)
                {
                    n = list1[_281_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        return true
                    }
                }
            }
        }
        return false
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
                n = this.groupNeighbors(g)
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
        for (var _330_14_ = 0; _330_14_ < list.length; _330_14_++)
        {
            n = list[_330_14_]
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
            for (var _352_19_ = 0; _352_19_ < list.length; _352_19_++)
            {
                gp = list[_352_19_]
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
            for (var _364_18_ = 0; _364_18_ < list.length; _364_18_++)
            {
                n = list[_364_18_]
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

    Score.prototype["groupNeighbors"] = function (g)
    {
        var gn, n, p

        gn = []
        var list = _k_.list(g)
        for (var _381_14_ = 0; _381_14_ < list.length; _381_14_++)
        {
            p = list[_381_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _382_18_ = 0; _382_18_ < list1.length; _382_18_++)
            {
                n = list1[_382_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Score.prototype["posNeighbors"] = function (p)
    {
        return this.poslist(this.neighbors(this.coord(p)))
    }

    Score.prototype["neighbors"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,0],[1,0],[0,-1],[0,1]]
        for (var _394_18_ = 0; _394_18_ < list.length; _394_18_++)
        {
            x = list[_394_18_][0]
            y = list[_394_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
    }

    Score.prototype["groupDiagonals"] = function (g, n)
    {
        var d, dn, p

        dn = []
        var list = _k_.list(g)
        for (var _409_14_ = 0; _409_14_ < list.length; _409_14_++)
        {
            p = list[_409_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _410_18_ = 0; _410_18_ < list1.length; _410_18_++)
            {
                d = list1[_410_18_]
                if (!(_k_.in(d,g)) && !(_k_.in(d,dn)) && !(_k_.in(d,n)))
                {
                    dn.push(d)
                }
            }
        }
        return dn
    }

    Score.prototype["diagonals"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,-1],[1,1],[-1,1],[1,-1]]
        for (var _418_18_ = 0; _418_18_ < list.length; _418_18_++)
        {
            x = list[_418_18_][0]
            y = list[_418_18_][1]
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
        for (var _440_17_ = y = 0, _440_21_ = this.size; (_440_17_ <= _440_21_ ? y < this.size : y > this.size); (_440_17_ <= _440_21_ ? ++y : --y))
        {
            for (var _441_21_ = x = 0, _441_25_ = this.size; (_441_21_ <= _441_25_ ? x < this.size : x > this.size); (_441_21_ <= _441_25_ ? ++x : --x))
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
        for (var _449_14_ = 0; _449_14_ < list.length; _449_14_++)
        {
            n = list[_449_14_]
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
        for (var _465_17_ = y = 0, _465_21_ = this.size; (_465_17_ <= _465_21_ ? y < this.size : y > this.size); (_465_17_ <= _465_21_ ? ++y : --y))
        {
            for (var _466_21_ = x = 0, _466_25_ = this.size; (_466_21_ <= _466_25_ ? x < this.size : x > this.size); (_466_21_ <= _466_25_ ? ++x : --x))
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
        for (var _481_17_ = y = 0, _481_21_ = this.size; (_481_17_ <= _481_21_ ? y < this.size : y > this.size); (_481_17_ <= _481_21_ ? ++y : --y))
        {
            for (var _482_21_ = x = 0, _482_25_ = this.size; (_482_21_ <= _482_25_ ? x < this.size : x > this.size); (_482_21_ <= _482_25_ ? ++x : --x))
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

    Score.prototype["areaString"] = function (legend)
    {
        var a, aa, g

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.areas)
        for (var _502_14_ = 0; _502_14_ < list.length; _502_14_++)
        {
            a = list[_502_14_]
            var list1 = _k_.list(a.area)
            for (var _503_19_ = 0; _503_19_ < list1.length; _503_19_++)
            {
                aa = list1[_503_19_]
                g.set(aa,a.color)
            }
        }
        return g.toString(legend)
    }

    Score.prototype["deadString"] = function (legend)
    {
        var g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _516_15_ = 0; _516_15_ < list.length; _516_15_++)
        {
            gr = list[_516_15_]
            var list1 = _k_.list(gr.group)
            for (var _517_19_ = 0; _517_19_ < list1.length; _517_19_++)
            {
                gg = list1[_517_19_]
                if (gr.state === 'dead')
                {
                    g.set(gg,'X')
                }
            }
        }
        return g.toString(legend)
    }

    return Score
})()

module.exports = Score