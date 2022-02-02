// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var alpha, Calc, opponent, Print, stone, stoneColor

stoneColor = require('./util/util').stoneColor
opponent = require('./util/util').opponent
stone = require('./util/util').stone
alpha = require('./util/util').alpha
stoneColor = require('./util/util').stoneColor

Print = require('./util/print')

Calc = (function ()
{
    _k_.extend(Calc, Print)
    function Calc ()
    {
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        return Calc.__super__.constructor.apply(this, arguments)
    }

    Calc.prototype["linkAreas"] = function ()
    {
        var a, ai, g, gi, n

        var list = _k_.list(this.areas)
        for (var _22_14_ = 0; _22_14_ < list.length; _22_14_++)
        {
            a = list[_22_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _24_18_ = 0; _24_18_ < list1.length; _24_18_++)
            {
                n = list1[_24_18_]
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

    Calc.prototype["areaAt"] = function (p)
    {
        var a

        var list = _k_.list(this.areas)
        for (var _37_14_ = 0; _37_14_ < list.length; _37_14_++)
        {
            a = list[_37_14_]
            if (_k_.in(p,a.posl))
            {
                return a
            }
        }
    }

    Calc.prototype["groupAt"] = function (p)
    {
        var g

        var list = _k_.list(this.grps)
        for (var _42_14_ = 0; _42_14_ < list.length; _42_14_++)
        {
            g = list[_42_14_]
            if (_k_.in(p,g.posl))
            {
                return g
            }
        }
    }

    Calc.prototype["areaColor"] = function (g)
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
            return '?'
        }
    }

    Calc.prototype["calcAreas"] = function ()
    {
        var aa, ag, ai, alive, challenged, gg, gi

        alive = this.grps.filter(function (g)
        {
            return g.state === 'alive'
        })
        var list = _k_.list(alive)
        for (var _60_15_ = 0; _60_15_ < list.length; _60_15_++)
        {
            ag = list[_60_15_]
            var list1 = _k_.list(ag.areas)
            for (var _61_19_ = 0; _61_19_ < list1.length; _61_19_++)
            {
                ai = list1[_61_19_]
                challenged = false
                aa = this.areas[ai]
                var list2 = _k_.list(aa.grps)
                for (var _64_23_ = 0; _64_23_ < list2.length; _64_23_++)
                {
                    gi = list2[_64_23_]
                    gg = this.grps[gi]
                    if (gg.state !== 'dead' && gg.stone !== ag.stone)
                    {
                        challenged = true
                    }
                }
                if (!challenged)
                {
                    aa.color = stoneColor[ag.stone][0]
                }
            }
        }
    }

    Calc.prototype["deadShape"] = function (a)
    {
        var af, cs, ss

        if (a.posl.length < 6)
        {
            af = a.posl.filter((function (p)
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

    Calc.prototype["minCoords"] = function (cs)
    {
        var c, mx, my

        mx = my = Infinity
        var list = _k_.list(cs)
        for (var _101_14_ = 0; _101_14_ < list.length; _101_14_++)
        {
            c = list[_101_14_]
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

    Calc.prototype["potentialOwner"] = function (c)
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
            else
            {
                return '?'
            }
        }
    }

    Calc.prototype["potentialGroup"] = function (g)
    {
        var n

        var list = _k_.list(g.neighbors)
        for (var _131_14_ = 0; _131_14_ < list.length; _131_14_++)
        {
            n = list[_131_14_]
            if (this.stoneAt(n) === stone.empty && g.stone === this.potentialOwner(this.coord(n)))
            {
                return true
            }
        }
    }

    Calc.prototype["potentialConnection"] = function (g)
    {
        var ai, bad, d, ei, n

        var list = _k_.list(g.diagonals)
        for (var _137_14_ = 0; _137_14_ < list.length; _137_14_++)
        {
            d = list[_137_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _139_22_ = 0; _139_22_ < list1.length; _139_22_++)
                {
                    n = list1[_139_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        bad = false
                        var list2 = _k_.list(g.eyes)
                        for (var _142_31_ = 0; _142_31_ < list2.length; _142_31_++)
                        {
                            ei = list2[_142_31_]
                            if (_k_.in(n,this.areas[ei].posl) && this.areas[ei].posl.length === 1)
                            {
                                bad = true
                            }
                        }
                        var list3 = _k_.list(g.areas)
                        for (var _145_31_ = 0; _145_31_ < list3.length; _145_31_++)
                        {
                            ai = list3[_145_31_]
                            if (_k_.in(n,this.areas[ai].posl) && this.areas[ai].posl.length === 1)
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

    Calc.prototype["potentialEye"] = function (g, a)
    {
        var cnt, n

        if (a.posl.length < 2)
        {
            return false
        }
        if (a.posl.length === 2)
        {
            cnt = {'○':0,'●':0,' ':0}
            var list = _k_.list(a.neighbors)
            for (var _157_18_ = 0; _157_18_ < list.length; _157_18_++)
            {
                n = list[_157_18_]
                cnt[this.stoneAt(n)]++
            }
            if (cnt['○'] === cnt['●'])
            {
                return false
            }
        }
        return true
    }

    Calc.prototype["suicidalEye"] = function (g, a)
    {
        var gi, opponentGroups, opponentSuicides

        if (a.posl.length > 2)
        {
            return false
        }
        opponentGroups = []
        opponentSuicides = []
        var list = _k_.list(a.grps)
        for (var _167_15_ = 0; _167_15_ < list.length; _167_15_++)
        {
            gi = list[_167_15_]
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

    Calc.prototype["weakEye"] = function (g, a)
    {
        return a.grps.length > 2
    }

    Calc.prototype["weakCollection"] = function (g)
    {
        var a, ai, f, friends, gi

        friends = []
        if ((1 <= g.eyes.length && g.eyes.length <= 2))
        {
            var list = _k_.list(g.areas)
            for (var _189_19_ = 0; _189_19_ < list.length; _189_19_++)
            {
                ai = list[_189_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _191_23_ = 0; _191_23_ < list1.length; _191_23_++)
                {
                    gi = list1[_191_23_]
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
                for (var _199_22_ = 0; _199_22_ < list2.length; _199_22_++)
                {
                    f = list2[_199_22_]
                    if (f.eyes.length > 1)
                    {
                        return []
                    }
                }
            }
        }
        return friends
    }

    Calc.prototype["rayColor"] = function (c, d)
    {
        var n, s

        n = [c[0] + d[0],c[1] + d[1]]
        s = this.stoneAt(n)
        return (s === stone.empty ? this.rayColor(n,d) : s)
    }

    Calc.prototype["rayColors"] = function (c)
    {
        return [[1,0],[0,1],[-1,0],[0,-1]].map((function (r)
        {
            return this.rayColor(c,r)
        }).bind(this))
    }

    Calc.prototype["countlib"] = function (p)
    {
        return this.liberties(this.coord(p))
    }

    Calc.prototype["liberties"] = function (c)
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

    Calc.prototype["free"] = function (color, p)
    {
        return this.freedoms(color,this.coord(p))
    }

    Calc.prototype["freedoms"] = function (color, c)
    {
        var l, n, s

        l = 0
        var list = _k_.list(this.neighbors(c))
        for (var _248_14_ = 0; _248_14_ < list.length; _248_14_++)
        {
            n = list[_248_14_]
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

    Calc.prototype["allGroups"] = function ()
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
                for (var _270_23_ = 0; _270_23_ < list.length; _270_23_++)
                {
                    gp = list[_270_23_]
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

    Calc.prototype["group"] = function (c)
    {
        var f, fp, g, n, p, s

        s = this.stoneAt(c)
        g = [this.pos(c)]
        f = [this.pos(c)]
        while (fp = f.shift())
        {
            var list = _k_.list(this.neighbors(this.coord(fp)))
            for (var _282_18_ = 0; _282_18_ < list.length; _282_18_++)
            {
                n = list[_282_18_]
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

    Calc.prototype["groupNeighbors"] = function (g)
    {
        var gn, n, p

        gn = []
        var list = _k_.list(g)
        for (var _299_14_ = 0; _299_14_ < list.length; _299_14_++)
        {
            p = list[_299_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _300_18_ = 0; _300_18_ < list1.length; _300_18_++)
            {
                n = list1[_300_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Calc.prototype["poslNeighbors"] = function (pl)
    {
        var nl, p, pn

        nl = []
        var list = _k_.list(pl)
        for (var _308_14_ = 0; _308_14_ < list.length; _308_14_++)
        {
            p = list[_308_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _309_19_ = 0; _309_19_ < list1.length; _309_19_++)
            {
                pn = list1[_309_19_]
                if (!(_k_.in(pn,pl)) && !(_k_.in(pn,nl)))
                {
                    nl.push(pn)
                }
            }
        }
        return nl
    }

    Calc.prototype["posNeighbors"] = function (p)
    {
        return this.poslist(this.neighbors(this.coord(p)))
    }

    Calc.prototype["neighbors"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,0],[1,0],[0,-1],[0,1]]
        for (var _321_18_ = 0; _321_18_ < list.length; _321_18_++)
        {
            x = list[_321_18_][0]
            y = list[_321_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
    }

    Calc.prototype["groupDiagonals"] = function (g, n)
    {
        var d, dn, p

        dn = []
        var list = _k_.list(g)
        for (var _336_14_ = 0; _336_14_ < list.length; _336_14_++)
        {
            p = list[_336_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _337_18_ = 0; _337_18_ < list1.length; _337_18_++)
            {
                d = list1[_337_18_]
                if (!(_k_.in(d,g)) && !(_k_.in(d,dn)) && !(_k_.in(d,n)))
                {
                    dn.push(d)
                }
            }
        }
        return dn
    }

    Calc.prototype["diagonals"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,-1],[1,1],[-1,1],[1,-1]]
        for (var _345_18_ = 0; _345_18_ < list.length; _345_18_++)
        {
            x = list[_345_18_][0]
            y = list[_345_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
    }

    Calc.prototype["legal"] = function (color, c)
    {
        var fr, lg, mc

        fr = this.freedoms(color,c)
        mc = this.movecaptures(color,c)
        lg = (fr || mc) && this.stoneAt(c) === stone.empty
        if (!lg)
        {
            console.log(color,c,fr,mc,this.stoneAt(c))
        }
        return lg
    }

    Calc.prototype["all_legal"] = function (color)
    {
        var l, x, y

        color = (color != null ? color : this.nextColor())
        l = []
        for (var _370_17_ = y = 0, _370_21_ = this.size; (_370_17_ <= _370_21_ ? y < this.size : y > this.size); (_370_17_ <= _370_21_ ? ++y : --y))
        {
            for (var _371_21_ = x = 0, _371_25_ = this.size; (_371_21_ <= _371_25_ ? x < this.size : x > this.size); (_371_21_ <= _371_25_ ? ++x : --x))
            {
                if (this.legal(color,[x,y]))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Calc.prototype["movecaptures"] = function (color, c)
    {
        var m, n, s

        m = stone[color]
        var list = _k_.list(this.neighbors(c))
        for (var _379_14_ = 0; _379_14_ < list.length; _379_14_++)
        {
            n = list[_379_14_]
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

    Calc.prototype["allPos"] = function ()
    {
        var p, x, y

        p = []
        for (var _395_17_ = y = 0, _395_21_ = this.size; (_395_17_ <= _395_21_ ? y < this.size : y > this.size); (_395_17_ <= _395_21_ ? ++y : --y))
        {
            for (var _396_21_ = x = 0, _396_25_ = this.size; (_396_21_ <= _396_25_ ? x < this.size : x > this.size); (_396_21_ <= _396_25_ ? ++x : --x))
            {
                p.push(alpha[x] + (this.size - y))
            }
        }
        return p
    }

    Calc.prototype["poslUnion"] = function (a, b)
    {
        return a.filter(function (ai)
        {
            return _k_.in(ai,b)
        })
    }

    Calc.prototype["poslist"] = function (cl)
    {
        return cl.map(this.pos)
    }

    Calc.prototype["chainAreaLibs"] = function (ch, ai)
    {
        return this.poslUnion(ch.neighbors,this.areas[ai].posl).length
    }

    Calc.prototype["chainsForArea"] = function (ai)
    {
        return this.chains.filter(function (ch)
        {
            return _k_.in(ai,ch.areas)
        })
    }

    Calc.prototype["allStones"] = function (color)
    {
        var l, s, x, y

        s = stone[color]
        l = []
        for (var _434_17_ = y = 0, _434_21_ = this.size; (_434_17_ <= _434_21_ ? y < this.size : y > this.size); (_434_17_ <= _434_21_ ? ++y : --y))
        {
            for (var _435_21_ = x = 0, _435_25_ = this.size; (_435_21_ <= _435_25_ ? x < this.size : x > this.size); (_435_21_ <= _435_25_ ? ++x : --x))
            {
                if (s === this.stoneAt(x,y))
                {
                    l.push(this.pos([x,y]))
                }
            }
        }
        return l
    }

    Calc.prototype["stoneAt"] = function (x, y)
    {
        return this.grid.at(x,y)
    }

    Calc.prototype["valid"] = function (c)
    {
        return (0 <= c[0] && c[0] < this.size) && (0 <= c[1] && c[1] < this.size)
    }

    Calc.prototype["coord"] = function (p)
    {
        return [alpha.indexOf(p[0].toUpperCase()),this.size - parseInt(p.slice(1))]
    }

    Calc.prototype["pos"] = function (c)
    {
        return alpha[c[0]] + (this.size - c[1])
    }

    return Calc
})()

module.exports = Calc