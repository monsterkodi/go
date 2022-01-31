// monsterkodi/kode 0.237.0

var _k_ = {clone: function (o,v) { v ??= new Map(); if (o instanceof Array) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

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
                    this.areas.push({area:g,posl:g,key:g.join(' '),grps:[],color:this.areaColor(g),state:'neutral',neighbors:n})
                }
                else
                {
                    this.grps.push({stone:s,group:g,posl:g,areas:[],eyes:[],links:[],libs:n.filter((function (p)
                    {
                        return stone.empty === this.stoneAt(this.coord(p))
                    }).bind(this)).length,neighbors:n,diagonals:this.groupDiagonals(g,n),key:g.join(' '),state:'unknown'})
                }
            }
        }
        console.log(this.groupString.apply(this,this.grps))
        console.log(this.groupString.apply(this,this.areas))
    }

    Score.prototype["groupIndex"] = function (g)
    {
        return this.grps.indexOf(g)
    }

    Score.prototype["isLinked"] = function (a, b)
    {
        return _k_.in(this.groupIndex(b),a.links)
    }

    Score.prototype["createLink"] = function (a, b)
    {
        var ai, bi

        if (this.isLinked(a,b))
        {
            return
        }
        ai = this.groupIndex(a)
        bi = this.groupIndex(b)
        if (!(_k_.in(bi,a.links)))
        {
            a.links.push(bi)
        }
        if (!(_k_.in(ai,b.links)))
        {
            return b.links.push(ai)
        }
    }

    Score.prototype["linkGroups"] = function ()
    {
        var dg, dp, g

        var list = _k_.list(this.grps)
        for (var _100_14_ = 0; _100_14_ < list.length; _100_14_++)
        {
            g = list[_100_14_]
            var list1 = _k_.list(g.diagonals)
            for (var _101_19_ = 0; _101_19_ < list1.length; _101_19_++)
            {
                dp = list1[_101_19_]
                if (dg = this.groupAt(dp))
                {
                    if (dg.stone === g.stone && this.groupsShareArea(g,dg))
                    {
                        this.createLink(g,dg)
                    }
                }
            }
        }
    }

    Score.prototype["groupsShareArea"] = function (a, b)
    {
        var ai, bi

        var list = _k_.list(a.areas)
        for (var _108_15_ = 0; _108_15_ < list.length; _108_15_++)
        {
            ai = list[_108_15_]
            var list1 = _k_.list(b.areas)
            for (var _109_19_ = 0; _109_19_ < list1.length; _109_19_++)
            {
                bi = list1[_109_19_]
                if (ai === bi)
                {
                    return true
                }
            }
        }
        return false
    }

    Score.prototype["chainIndexForGroup"] = function (g)
    {
        var ch, ci, fi, gi

        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _116_15_ = 0; _116_15_ < list.length; _116_15_++)
        {
            ch = list[_116_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _118_19_ = 0; _118_19_ < list1.length; _118_19_++)
            {
                gi = list1[_118_19_]
                if (fi === gi)
                {
                    return ci
                }
            }
        }
        return -1
    }

    Score.prototype["calcChains"] = function ()
    {
        var ai, battle, ch, ci, g, gi, li, n

        this.chains = []
        var list = _k_.list(this.grps)
        for (var _132_14_ = 0; _132_14_ < list.length; _132_14_++)
        {
            g = list[_132_14_]
            gi = this.groupIndex(g)
            if (!_k_.empty(g.links))
            {
                ci = g.chain
                if (!ci)
                {
                    ci = this.chainIndexForGroup(g)
                    if (ci === -1)
                    {
                        var list1 = _k_.list(g.links)
                        for (var _139_31_ = 0; _139_31_ < list1.length; _139_31_++)
                        {
                            li = list1[_139_31_]
                            ci = this.chainIndexForGroup(this.grps[li])
                            if (ci !== -1)
                            {
                                break
                            }
                        }
                    }
                    if (ci === -1)
                    {
                        ci = this.chains.length
                        this.chains.push({grps:[]})
                    }
                }
                ch = this.chains[ci]
                if (!(_k_.in(gi,ch.grps)))
                {
                    ch.grps.push(gi)
                }
                var list2 = _k_.list(g.links)
                for (var _147_23_ = 0; _147_23_ < list2.length; _147_23_++)
                {
                    li = list2[_147_23_]
                    if (!(_k_.in(li,ch.grps)))
                    {
                        ch.grps.push(li)
                    }
                }
                g.chain = ci
            }
            else
            {
                ci = this.chains.length
                this.chains.push({grps:[gi]})
                g.chain = ci
            }
        }
        var list3 = _k_.list(this.chains)
        for (var _155_15_ = 0; _155_15_ < list3.length; _155_15_++)
        {
            ch = list3[_155_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list4 = _k_.list(ch.grps)
            for (var _160_19_ = 0; _160_19_ < list4.length; _160_19_++)
            {
                gi = list4[_160_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list5 = _k_.list(this.grps[gi].areas)
                for (var _162_23_ = 0; _162_23_ < list5.length; _162_23_++)
                {
                    ai = list5[_162_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list6 = _k_.list(this.grps[gi].eyes)
                for (var _164_23_ = 0; _164_23_ < list6.length; _164_23_++)
                {
                    ai = list6[_164_23_]
                    if (!(_k_.in(ai,ch.eyes)))
                    {
                        ch.eyes.push(ai)
                    }
                }
            }
            n = this.poslistNeighbors(ch.posl)
            ch.libs = n.filter((function (p)
            {
                return stone.empty === this.stoneAt(this.coord(p))
            }).bind(this)).length
            if (ch.eyes.length > 1)
            {
                this.aliveChains([ch])
            }
        }
        battle = []
        var list7 = _k_.list(this.chains)
        for (var _174_15_ = 0; _174_15_ < list7.length; _174_15_++)
        {
            ch = list7[_174_15_]
            if (!ch.alive)
            {
                if (ch.areas.length === 1)
                {
                    if (!(_k_.in(ch.areas[0],battle)))
                    {
                        battle.push(ch.areas[0])
                    }
                }
            }
        }
        var list8 = _k_.list(battle)
        for (var _186_15_ = 0; _186_15_ < list8.length; _186_15_++)
        {
            ai = list8[_186_15_]
            this.chainBattle(ai)
        }
        var list9 = _k_.list(this.chains)
        for (var _189_15_ = 0; _189_15_ < list9.length; _189_15_++)
        {
            ch = list9[_189_15_]
            if (!ch.alive && !ch.dead)
            {
                console.log(`chain ${this.chains.indexOf(ch)}`,ch)
            }
        }
    }

    Score.prototype["deadChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _201_15_ = 0; _201_15_ < list.length; _201_15_++)
        {
            ch = list[_201_15_]
            ch.dead = true
            var list1 = _k_.list(ch.grps)
            for (var _203_19_ = 0; _203_19_ < list1.length; _203_19_++)
            {
                gi = list1[_203_19_]
                this.grps[gi].state = 'dead'
            }
        }
    }

    Score.prototype["aliveChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _208_15_ = 0; _208_15_ < list.length; _208_15_++)
        {
            ch = list[_208_15_]
            ch.alive = true
            var list1 = _k_.list(ch.grps)
            for (var _210_19_ = 0; _210_19_ < list1.length; _210_19_++)
            {
                gi = list1[_210_19_]
                this.grps[gi].state = 'alive'
            }
        }
    }

    Score.prototype["chainBattle"] = function (ai)
    {
        var a, bc, ch, chains, deadAlive, gi, gs, wc

        deadAlive = (function (dead, alive)
        {
            this.deadChains(dead)
            return this.aliveChains(alive)
        }).bind(this)
        a = this.areas[ai]
        chains = this.chainsForArea(ai)
        if (chains.length < 2)
        {
            return
        }
        gs = []
        wc = []
        bc = []
        var list = _k_.list(chains)
        for (var _230_15_ = 0; _230_15_ < list.length; _230_15_++)
        {
            ch = list[_230_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _233_19_ = 0; _233_19_ < list1.length; _233_19_++)
            {
                gi = list1[_233_19_]
                if (!(_k_.in(gi,gs)))
                {
                    gs.push(this.grps[gi])
                }
            }
        }
        if (wc.length && bc.length)
        {
            wc.sort(function (a, b)
            {
                return a.libs - b.libs
            })
            bc.sort(function (a, b)
            {
                return a.libs - b.libs
            })
            if (wc[0].libs - bc[0].libs > 2)
            {
                return deadAlive(bc,wc)
            }
            else if (bc[0].libs - wc[0].libs > 2)
            {
                return deadAlive(wc,bc)
            }
        }
    }

    Score.prototype["chainsForArea"] = function (ai)
    {
        return this.chains.filter(function (ch)
        {
            return _k_.in(ai,ch.areas)
        })
    }

    Score.prototype["calcScore"] = function ()
    {
        var a, dead, finalScore, g, points

        this.calcGroups()
        this.linkAreas()
        this.linkGroups()
        this.calcChains()
        dead = this.grps.filter(function (g)
        {
            return g.state === 'dead'
        })
        var list = _k_.list(this.grps)
        for (var _270_14_ = 0; _270_14_ < list.length; _270_14_++)
        {
            g = list[_270_14_]
            console.log(g.state,g.key)
        }
        console.log(this.areaString(1))
        console.log(this.deadString(1))
        points = this.captures
        var list1 = _k_.list(this.areas)
        for (var _286_14_ = 0; _286_14_ < list1.length; _286_14_++)
        {
            a = list1[_286_14_]
            if (_k_.in(a.color,'wb'))
            {
                points[stoneColor[a.color]] += a.posl.length
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

    Score.prototype["calcScoreRecursive"] = function (root)
    {
        var a, ai, dead, final, finalScore, g, gi, markDead, o, p, points, score, w, weak

        this.calcGroups()
        markDead = (function (g, r)
        {
            var a, ai, gg, gi

            g.state = 'dead'
            var list = _k_.list(g.areas)
            for (var _317_19_ = 0; _317_19_ < list.length; _317_19_++)
            {
                ai = list[_317_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _319_23_ = 0; _319_23_ < list1.length; _319_23_++)
                {
                    gi = list1[_319_23_]
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
        for (var _326_14_ = 0; _326_14_ < list.length; _326_14_++)
        {
            g = list[_326_14_]
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
                if (!a)
                {
                    console.log(g)
                }
                var list1 = _k_.list(a.grps)
                for (var _346_23_ = 0; _346_23_ < list1.length; _346_23_++)
                {
                    gi = list1[_346_23_]
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
                    for (var _362_26_ = 0; _362_26_ < list2.length; _362_26_++)
                    {
                        w = list2[_362_26_]
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
                    for (var _368_27_ = 0; _368_27_ < list3.length; _368_27_++)
                    {
                        ai = list3[_368_27_]
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
            for (var _385_18_ = 0; _385_18_ < list4.length; _385_18_++)
            {
                g = list4[_385_18_]
                var list5 = _k_.list(g.posl)
                for (var _386_22_ = 0; _386_22_ < list5.length; _386_22_++)
                {
                    p = list5[_386_22_]
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
            for (var _398_18_ = 0; _398_18_ < list6.length; _398_18_++)
            {
                g = list6[_398_18_]
                if (g.state === 'unknown')
                {
                    if (stone.empty === final.grid.at(g.posl[0]))
                    {
                        console.log('late death',g)
                        markDead(g,'late death')
                    }
                }
            }
            var list7 = _k_.list(this.areas)
            for (var _405_18_ = 0; _405_18_ < list7.length; _405_18_++)
            {
                a = list7[_405_18_]
                a.color = final.areaAt(a.posl[0]).color
            }
            console.log(this.areaString())
            points = _k_.copy(final.captures)
            var list8 = _k_.list(final.areas)
            for (var _420_18_ = 0; _420_18_ < list8.length; _420_18_++)
            {
                a = list8[_420_18_]
                if (_k_.in(a.color,'wb'))
                {
                    points[stoneColor[a.color]] += a.posl.length
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
        for (var _443_14_ = 0; _443_14_ < list.length; _443_14_++)
        {
            a = list[_443_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _445_18_ = 0; _445_18_ < list1.length; _445_18_++)
            {
                n = list1[_445_18_]
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
        var a

        var list = _k_.list(this.areas)
        for (var _458_14_ = 0; _458_14_ < list.length; _458_14_++)
        {
            a = list[_458_14_]
            if (_k_.in(p,a.posl))
            {
                return a
            }
        }
    }

    Score.prototype["groupAt"] = function (p)
    {
        var g

        var list = _k_.list(this.grps)
        for (var _463_14_ = 0; _463_14_ < list.length; _463_14_++)
        {
            g = list[_463_14_]
            if (_k_.in(p,g.posl))
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

    Score.prototype["minCoords"] = function (cs)
    {
        var c, mx, my

        mx = my = Infinity
        var list = _k_.list(cs)
        for (var _508_14_ = 0; _508_14_ < list.length; _508_14_++)
        {
            c = list[_508_14_]
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
        for (var _536_14_ = 0; _536_14_ < list.length; _536_14_++)
        {
            n = list[_536_14_]
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
        for (var _542_14_ = 0; _542_14_ < list.length; _542_14_++)
        {
            d = list[_542_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _544_22_ = 0; _544_22_ < list1.length; _544_22_++)
                {
                    n = list1[_544_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        bad = false
                        var list2 = _k_.list(g.eyes)
                        for (var _547_31_ = 0; _547_31_ < list2.length; _547_31_++)
                        {
                            ei = list2[_547_31_]
                            if (_k_.in(n,this.areas[ei].posl) && this.areas[ei].posl.length === 1)
                            {
                                bad = true
                            }
                        }
                        var list3 = _k_.list(g.areas)
                        for (var _550_31_ = 0; _550_31_ < list3.length; _550_31_++)
                        {
                            ai = list3[_550_31_]
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

    Score.prototype["potentialEye"] = function (g, a)
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
            for (var _562_18_ = 0; _562_18_ < list.length; _562_18_++)
            {
                n = list[_562_18_]
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

        if (a.posl.length > 2)
        {
            return false
        }
        opponentGroups = []
        opponentSuicides = []
        var list = _k_.list(a.grps)
        for (var _572_15_ = 0; _572_15_ < list.length; _572_15_++)
        {
            gi = list[_572_15_]
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
            for (var _594_19_ = 0; _594_19_ < list.length; _594_19_++)
            {
                ai = list[_594_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _596_23_ = 0; _596_23_ < list1.length; _596_23_++)
                {
                    gi = list1[_596_23_]
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
                for (var _604_22_ = 0; _604_22_ < list2.length; _604_22_++)
                {
                    f = list2[_604_22_]
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
        for (var _653_14_ = 0; _653_14_ < list.length; _653_14_++)
        {
            n = list[_653_14_]
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
                for (var _675_23_ = 0; _675_23_ < list.length; _675_23_++)
                {
                    gp = list[_675_23_]
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
            for (var _687_18_ = 0; _687_18_ < list.length; _687_18_++)
            {
                n = list[_687_18_]
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
        for (var _704_14_ = 0; _704_14_ < list.length; _704_14_++)
        {
            p = list[_704_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _705_18_ = 0; _705_18_ < list1.length; _705_18_++)
            {
                n = list1[_705_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Score.prototype["poslistNeighbors"] = function (pl)
    {
        var nl, p, pn

        nl = []
        var list = _k_.list(pl)
        for (var _713_14_ = 0; _713_14_ < list.length; _713_14_++)
        {
            p = list[_713_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _714_19_ = 0; _714_19_ < list1.length; _714_19_++)
            {
                pn = list1[_714_19_]
                if (!(_k_.in(pn,pl)) && !(_k_.in(pn,nl)))
                {
                    nl.push(pn)
                }
            }
        }
        return nl
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
        for (var _726_18_ = 0; _726_18_ < list.length; _726_18_++)
        {
            x = list[_726_18_][0]
            y = list[_726_18_][1]
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
        for (var _741_14_ = 0; _741_14_ < list.length; _741_14_++)
        {
            p = list[_741_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _742_18_ = 0; _742_18_ < list1.length; _742_18_++)
            {
                d = list1[_742_18_]
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
        for (var _750_18_ = 0; _750_18_ < list.length; _750_18_++)
        {
            x = list[_750_18_][0]
            y = list[_750_18_][1]
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
        return (fr || mc) && this.stoneAt(c) === stone.empty
    }

    Score.prototype["all_legal"] = function (color)
    {
        var l, x, y

        color = (color != null ? color : this.nextColor())
        l = []
        for (var _772_17_ = y = 0, _772_21_ = this.size; (_772_17_ <= _772_21_ ? y < this.size : y > this.size); (_772_17_ <= _772_21_ ? ++y : --y))
        {
            for (var _773_21_ = x = 0, _773_25_ = this.size; (_773_21_ <= _773_25_ ? x < this.size : x > this.size); (_773_21_ <= _773_25_ ? ++x : --x))
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
        for (var _781_14_ = 0; _781_14_ < list.length; _781_14_++)
        {
            n = list[_781_14_]
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
        for (var _797_17_ = y = 0, _797_21_ = this.size; (_797_17_ <= _797_21_ ? y < this.size : y > this.size); (_797_17_ <= _797_21_ ? ++y : --y))
        {
            for (var _798_21_ = x = 0, _798_25_ = this.size; (_798_21_ <= _798_25_ ? x < this.size : x > this.size); (_798_21_ <= _798_25_ ? ++x : --x))
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
        for (var _813_17_ = y = 0, _813_21_ = this.size; (_813_17_ <= _813_21_ ? y < this.size : y > this.size); (_813_17_ <= _813_21_ ? ++y : --y))
        {
            for (var _814_21_ = x = 0, _814_25_ = this.size; (_814_21_ <= _814_25_ ? x < this.size : x > this.size); (_814_21_ <= _814_25_ ? ++x : --x))
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
        for (var _834_14_ = 0; _834_14_ < list.length; _834_14_++)
        {
            a = list[_834_14_]
            var list1 = _k_.list(a.posl)
            for (var _835_19_ = 0; _835_19_ < list1.length; _835_19_++)
            {
                aa = list1[_835_19_]
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
        for (var _848_15_ = 0; _848_15_ < list.length; _848_15_++)
        {
            gr = list[_848_15_]
            var list1 = _k_.list(gr.posl)
            for (var _849_19_ = 0; _849_19_ < list1.length; _849_19_++)
            {
                gg = list1[_849_19_]
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
        for (var _864_15_ = 0; _864_15_ < list.length; _864_15_++)
        {
            gr = list[_864_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _866_23_ = 0; _866_23_ < list1.length; _866_23_++)
                {
                    gg = list1[_866_23_]
                    c = (arguments[idx].stone === '○' ? '◻' : '◼')
                    grid.set(gg,[y5,r4,m4,b7,w4,g2,b2][idx % 6](c))
                }
            }
        }
        var list2 = _k_.list(this.areas)
        for (var _869_15_ = 0; _869_15_ < list2.length; _869_15_++)
        {
            ar = list2[_869_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ar)))
            {
                var list3 = _k_.list(ar.posl)
                for (var _871_23_ = 0; _871_23_ < list3.length; _871_23_++)
                {
                    aa = list3[_871_23_]
                    grid.set(aa,[y5,r4,m4,b7,w4,g2,b2][idx % 6](this.areas.indexOf(ar)))
                }
            }
        }
        return grid.toAnsi(1)
    }

    return Score
})()

module.exports = Score