// monsterkodi/kode 0.237.0

var _k_ = {clone: function (o,v) { v ??= new Map(); if (o instanceof Array) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var alpha, DeadStones, Grid, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
opponent = require('./util').opponent

noon = require('kxk').noon

min = Math.min

Grid = require('./grid')
DeadStones = require('@sabaki/deadstones')

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
        s.captures = _k_.clone(this.captures)
        s.grid.copy(this.grid)
        return s
    }

    Score.prototype["clear"] = function ()
    {
        this.captures = {black:0,white:0}
        return this.grid.clear(this.size)
    }

    Score.prototype["calcGroups"] = function ()
    {
        var allg, g, gl, n, s

        this.grps = []
        this.areas = []
        allg = this.allGroups()
        for (s in allg)
        {
            gl = allg[s]
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
    }

    Score.prototype["calcScore"] = function (root)
    {
        var a, ai, dead, final, finalScore, g, gi, markDead, o, p, points, score, w, weak

        this.calcGroups()
        markDead = (function (g, r)
        {
            var a, ai, gg, gi

            g.state = 'dead'
            var list = _k_.list(g.areas)
            for (var _90_19_ = 0; _90_19_ < list.length; _90_19_++)
            {
                ai = list[_90_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _92_23_ = 0; _92_23_ < list1.length; _92_23_++)
                {
                    gi = list1[_92_23_]
                    gg = this.grps[gi]
                    if (gg.stone !== g.stone && gg.state === 'dead')
                    {
                        gg.state = 'undead'
                    }
                }
            }
        }).bind(this)
        this.linkAreas()
        var list = _k_.list(this.grps)
        for (var _99_14_ = 0; _99_14_ < list.length; _99_14_++)
        {
            g = list[_99_14_]
            if (g.state === 'dead')
            {
                continue
            }
            if (g.state.startsWith('alive'))
            {
                continue
            }
            if (g.libs === 1)
            {
                markDead(g,'single lib')
                continue
            }
            if (g.eyes.length < 2)
            {
                if (this.potentialConnection(g))
                {
                    g.state = 'alive_potentialConnection'
                    continue
                }
                a = (g.eyes.length ? this.areas[g.eyes[0]] : this.areas[g.areas[0]])
                var list1 = _k_.list(a.grps)
                for (var _115_23_ = 0; _115_23_ < list1.length; _115_23_++)
                {
                    gi = list1[_115_23_]
                    o = this.grps[gi]
                    if (o.stone !== g.stone && o.eyes.length > 1)
                    {
                        if (!this.potentialGroup(g))
                        {
                            markDead(g,'no eyes and no potential')
                            break
                        }
                    }
                }
                if (g.state === 'dead')
                {
                    continue
                }
                if (g.areas.length === 1 && this.deadShape(a))
                {
                    markDead(g,'dead shape')
                    continue
                }
                if (g.state.startsWith('alive'))
                {
                    continue
                }
                if (!_k_.empty((weak = this.weakCollection(g))))
                {
                    var list2 = _k_.list(weak)
                    for (var _131_26_ = 0; _131_26_ < list2.length; _131_26_++)
                    {
                        w = list2[_131_26_]
                        markDead(w,'weak collection')
                    }
                }
                if (g.state === 'dead')
                {
                    continue
                }
                if (g.areas.length === 2)
                {
                    var list3 = _k_.list(g.areas)
                    for (var _137_27_ = 0; _137_27_ < list3.length; _137_27_++)
                    {
                        ai = list3[_137_27_]
                        if (!(_k_.in(ai,g.eyes)))
                        {
                            if (!this.potentialEye(g,this.areas[ai]) && !this.suicidalEye(g,this.areas[ai]))
                            {
                                markDead(g,'no potential and no suicidal 2nd eye')
                            }
                        }
                    }
                }
            }
        }
        dead = this.grps.filter(function (g)
        {
            return g.state === 'dead'
        })
        if (!_k_.empty(dead))
        {
            score = this.clone()
            var list4 = _k_.list(dead)
            for (var _154_18_ = 0; _154_18_ < list4.length; _154_18_++)
            {
                g = list4[_154_18_]
                var list5 = _k_.list(g.group)
                for (var _155_22_ = 0; _155_22_ < list5.length; _155_22_++)
                {
                    p = list5[_155_22_]
                    score.captures[opponent[g.stone]]++
                    score.grid.set(p,' ')
                }
            }
            final = score.calcScore(this)
        }
        else
        {
            final = this
        }
        if (!root)
        {
            var list6 = _k_.list(this.grps)
            for (var _167_18_ = 0; _167_18_ < list6.length; _167_18_++)
            {
                g = list6[_167_18_]
                if (g.state === 'unknown')
                {
                    if (stone.empty === final.grid.at(g.group[0]))
                    {
                        g.state = 'dead'
                    }
                }
            }
            var list7 = _k_.list(this.areas)
            for (var _173_18_ = 0; _173_18_ < list7.length; _173_18_++)
            {
                a = list7[_173_18_]
                a.color = final.areaAt(a.area[0]).color
            }
            points = _k_.copy(final.captures)
            var list8 = _k_.list(final.areas)
            for (var _186_18_ = 0; _186_18_ < list8.length; _186_18_++)
            {
                a = list8[_186_18_]
                if (_k_.in(a.color,'wb'))
                {
                    points[stoneColor[a.color]] += a.area.length
                }
            }
            if (points.white > points.black)
            {
                finalScore = 'W+' + (points.white - points.black)
            }
            else
            {
                finalScore = 'B+' + (points.black - points.white)
            }
            return finalScore
        }
        else
        {
            return final
        }
    }

    Score.prototype["linkAreas"] = function ()
    {
        var a, ai, g, gi, n

        var list = _k_.list(this.areas)
        for (var _209_14_ = 0; _209_14_ < list.length; _209_14_++)
        {
            a = list[_209_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _211_18_ = 0; _211_18_ < list1.length; _211_18_++)
            {
                n = list1[_211_18_]
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
        for (var _224_14_ = 0; _224_14_ < list.length; _224_14_++)
        {
            g = list[_224_14_]
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
        for (var _230_14_ = 0; _230_14_ < list.length; _230_14_++)
        {
            g = list[_230_14_]
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
        for (var _275_14_ = 0; _275_14_ < list.length; _275_14_++)
        {
            c = list[_275_14_]
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
        for (var _303_14_ = 0; _303_14_ < list.length; _303_14_++)
        {
            n = list[_303_14_]
            if (this.stoneAt(n) === stone.empty && g.stone === this.potentialOwner(this.coord(n)))
            {
                return true
            }
        }
    }

    Score.prototype["potentialConnection"] = function (g)
    {
        var ai, bad, d, ei, n

        var list = _k_.list(g.diagonals)
        for (var _309_14_ = 0; _309_14_ < list.length; _309_14_++)
        {
            d = list[_309_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _311_22_ = 0; _311_22_ < list1.length; _311_22_++)
                {
                    n = list1[_311_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        bad = false
                        var list2 = _k_.list(g.eyes)
                        for (var _314_31_ = 0; _314_31_ < list2.length; _314_31_++)
                        {
                            ei = list2[_314_31_]
                            if (_k_.in(n,this.areas[ei].area) && this.areas[ei].area.length === 1)
                            {
                                bad = true
                            }
                        }
                        var list3 = _k_.list(g.areas)
                        for (var _317_31_ = 0; _317_31_ < list3.length; _317_31_++)
                        {
                            ai = list3[_317_31_]
                            if (_k_.in(n,this.areas[ai].area) && this.areas[ai].area.length === 1)
                            {
                                bad = true
                            }
                        }
                        if (!bad)
                        {
                            return true
                        }
                    }
                }
            }
        }
        return false
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
            for (var _329_18_ = 0; _329_18_ < list.length; _329_18_++)
            {
                n = list[_329_18_]
                cnt[this.stoneAt(n)]++
            }
            if (cnt['○'] === cnt['●'])
            {
                return false
            }
        }
        return true
    }

    Score.prototype["suicidalEye"] = function (g, a)
    {
        var gi, opponentGroups, opponentSuicides

        if (a.area.length > 2)
        {
            return false
        }
        opponentGroups = []
        opponentSuicides = []
        var list = _k_.list(a.grps)
        for (var _339_15_ = 0; _339_15_ < list.length; _339_15_++)
        {
            gi = list[_339_15_]
            if (this.grps[gi].stone !== g.stone)
            {
                opponentGroups.push(gi)
                if (this.grps[gi].eyes.length < 2 && this.grps[gi].libs <= 2)
                {
                    opponentSuicides.push(gi)
                }
            }
        }
        return opponentGroups.length === opponentSuicides.length
    }

    Score.prototype["weakEye"] = function (g, a)
    {
        return a.grps.length > 2
    }

    Score.prototype["weakCollection"] = function (g)
    {
        var a, ai, f, friends, gi

        friends = []
        if ((1 <= g.eyes.length && g.eyes.length <= 2))
        {
            var list = _k_.list(g.areas)
            for (var _361_19_ = 0; _361_19_ < list.length; _361_19_++)
            {
                ai = list[_361_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _363_23_ = 0; _363_23_ < list1.length; _363_23_++)
                {
                    gi = list1[_363_23_]
                    if (this.grps[gi].stone === g.stone)
                    {
                        if (!(_k_.in(this.grps[gi],friends)))
                        {
                            friends.push(this.grps[gi])
                        }
                    }
                }
            }
            if (friends.length <= g.areas.length)
            {
                friends = []
            }
            if (friends.length)
            {
                var list2 = _k_.list(friends)
                for (var _371_22_ = 0; _371_22_ < list2.length; _371_22_++)
                {
                    f = list2[_371_22_]
                    if (f.eyes.length > 1)
                    {
                        return []
                    }
                }
            }
        }
        return friends
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
        for (var _420_14_ = 0; _420_14_ < list.length; _420_14_++)
        {
            n = list[_420_14_]
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
            if (s = this.stoneAt(p))
            {
                g = this.group(this.coord(p))
                var list = _k_.list(g)
                for (var _442_23_ = 0; _442_23_ < list.length; _442_23_++)
                {
                    gp = list[_442_23_]
                    if (0 <= (i = allp.indexOf(gp)))
                    {
                        allp.splice(i,1)
                    }
                }
                grps[s].push(g.sort())
            }
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
            for (var _454_18_ = 0; _454_18_ < list.length; _454_18_++)
            {
                n = list[_454_18_]
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
        for (var _471_14_ = 0; _471_14_ < list.length; _471_14_++)
        {
            p = list[_471_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _472_18_ = 0; _472_18_ < list1.length; _472_18_++)
            {
                n = list1[_472_18_]
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
        for (var _484_18_ = 0; _484_18_ < list.length; _484_18_++)
        {
            x = list[_484_18_][0]
            y = list[_484_18_][1]
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
        for (var _499_14_ = 0; _499_14_ < list.length; _499_14_++)
        {
            p = list[_499_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _500_18_ = 0; _500_18_ < list1.length; _500_18_++)
            {
                d = list1[_500_18_]
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
        for (var _508_18_ = 0; _508_18_ < list.length; _508_18_++)
        {
            x = list[_508_18_][0]
            y = list[_508_18_][1]
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
        for (var _530_17_ = y = 0, _530_21_ = this.size; (_530_17_ <= _530_21_ ? y < this.size : y > this.size); (_530_17_ <= _530_21_ ? ++y : --y))
        {
            for (var _531_21_ = x = 0, _531_25_ = this.size; (_531_21_ <= _531_25_ ? x < this.size : x > this.size); (_531_21_ <= _531_25_ ? ++x : --x))
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
        for (var _539_14_ = 0; _539_14_ < list.length; _539_14_++)
        {
            n = list[_539_14_]
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
        for (var _555_17_ = y = 0, _555_21_ = this.size; (_555_17_ <= _555_21_ ? y < this.size : y > this.size); (_555_17_ <= _555_21_ ? ++y : --y))
        {
            for (var _556_21_ = x = 0, _556_25_ = this.size; (_556_21_ <= _556_25_ ? x < this.size : x > this.size); (_556_21_ <= _556_25_ ? ++x : --x))
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
        for (var _571_17_ = y = 0, _571_21_ = this.size; (_571_17_ <= _571_21_ ? y < this.size : y > this.size); (_571_17_ <= _571_21_ ? ++y : --y))
        {
            for (var _572_21_ = x = 0, _572_25_ = this.size; (_572_21_ <= _572_25_ ? x < this.size : x > this.size); (_572_21_ <= _572_25_ ? ++x : --x))
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
        for (var _592_14_ = 0; _592_14_ < list.length; _592_14_++)
        {
            a = list[_592_14_]
            var list1 = _k_.list(a.area)
            for (var _593_19_ = 0; _593_19_ < list1.length; _593_19_++)
            {
                aa = list1[_593_19_]
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
        for (var _606_15_ = 0; _606_15_ < list.length; _606_15_++)
        {
            gr = list[_606_15_]
            var list1 = _k_.list(gr.group)
            for (var _607_19_ = 0; _607_19_ < list1.length; _607_19_++)
            {
                gg = list1[_607_19_]
                if (gr.state === 'dead')
                {
                    g.set(gg,'X')
                }
            }
        }
        return g.toString(legend)
    }

    Score.prototype["groupString"] = function ()
    {
        var aa, ar, c, gg, gr, grid, group, idx

        group = arguments[0]
        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _622_15_ = 0; _622_15_ < list.length; _622_15_++)
        {
            gr = list[_622_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.group)
                for (var _624_23_ = 0; _624_23_ < list1.length; _624_23_++)
                {
                    gg = list1[_624_23_]
                    c = (arguments[idx].stone === '○' ? '◻' : '◼')
                    grid.set(gg,[y5,r4,m4,b7,w4,g2,b2][idx % 6](c))
                }
            }
        }
        var list2 = _k_.list(this.areas)
        for (var _627_15_ = 0; _627_15_ < list2.length; _627_15_++)
        {
            ar = list2[_627_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ar)))
            {
                var list3 = _k_.list(ar.area)
                for (var _629_23_ = 0; _629_23_ < list3.length; _629_23_++)
                {
                    aa = list3[_629_23_]
                    grid.set(aa,[y5,r4,m4,b7,w4,g2,b2][idx % 6](this.areas.indexOf(ar)))
                }
            }
        }
        return grid.toAnsi(1)
    }

    return Score
})()

module.exports = Score