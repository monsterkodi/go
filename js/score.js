// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var alpha, Calc, DeadStones, fs, Grid, ilpha, opponent, Score, stone, stoneColor

stoneColor = require('./util/util').stoneColor
stone = require('./util/util').stone
alpha = require('./util/util').alpha
ilpha = require('./util/util').ilpha
opponent = require('./util/util').opponent

fs = require('kxk').fs

min = Math.min

Grid = require('./util/grid')
Calc = require('./calc')
DeadStones = require('@sabaki/deadstones')

Score = (function ()
{
    _k_.extend(Score, Calc)
    function Score (a)
    {
        this.grid = new Grid(a)
        this.size = this.grid.size
        return Score.__super__.constructor.apply(this, arguments)
    }

    Score.prototype["clear"] = function ()
    {
        return this.grid.clear(this.size)
    }

    Score.prototype["calcScore"] = function (verbose)
    {
        var a, dead, dg, dp, finalScore, g, points

        this.verbose = verbose
    
        this.calcGroups()
        this.linkAreas()
        this.linkGroups()
        this.calcChains()
        this.verb('before calcAreas')
        if (this.verbose)
        {
            this.deadOrAlive()
        }
        this.calcAreas()
        if (this.chains.length < 2)
        {
            return 'B+0'
        }
        if (this.areas.length < 2)
        {
            return 'B+0'
        }
        this.weaklings()
        var list = _k_.list(this.grps)
        for (var _52_14_ = 0; _52_14_ < list.length; _52_14_++)
        {
            g = list[_52_14_]
            this.verb(g.state,g.key)
        }
        if (this.verbose)
        {
            this.deadOrAlive()
        }
        dead = this.grps.filter(function (g)
        {
            return g.state === 'dead'
        })
        if (this.moves)
        {
            points = {black:this.moves.p[0],white:this.moves.p[1]}
        }
        else
        {
            points = {black:0,white:0}
        }
        var list1 = _k_.list(this.areas)
        for (var _74_14_ = 0; _74_14_ < list1.length; _74_14_++)
        {
            a = list1[_74_14_]
            if (_k_.in(a.color,'wb'))
            {
                points[stoneColor[a.color]] += a.posl.length
            }
        }
        var list2 = _k_.list(dead)
        for (var _78_15_ = 0; _78_15_ < list2.length; _78_15_++)
        {
            dg = list2[_78_15_]
            var list3 = _k_.list(dg.posl)
            for (var _79_19_ = 0; _79_19_ < list3.length; _79_19_++)
            {
                dp = list3[_79_19_]
                points[opponent[stoneColor[dg.stone]]] += 2
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

    Score.prototype["weaklings"] = function ()
    {
        var ai, g, wc, weak, wg

        var list = _k_.list(this.grps)
        for (var _97_14_ = 0; _97_14_ < list.length; _97_14_++)
        {
            g = list[_97_14_]
            if (!g.alive && !g.dead)
            {
                wc = this.weakCollection(g)
                if (!_k_.empty(wc))
                {
                    this.verb(this.groupString(g))
                    this.verb(this.groupString.apply(this,wc))
                    weak = 0
                    var list1 = _k_.list(wc)
                    for (var _104_27_ = 0; _104_27_ < list1.length; _104_27_++)
                    {
                        wg = list1[_104_27_]
                        if (wg.libs === 1)
                        {
                            weak = wc.length
                            break
                        }
                        if (wg.libs > 3)
                        {
                            break
                        }
                        var list2 = _k_.list(wg.eyes)
                        for (var _109_31_ = 0; _109_31_ < list2.length; _109_31_++)
                        {
                            ai = list2[_109_31_]
                            if (this.weakEye(wg,this.areas[ai]))
                            {
                                this.verb('weakEye',ai)
                                weak++
                            }
                        }
                    }
                    if (weak >= wc.length)
                    {
                        this.verb('seems weak!')
                        this.deadGroups(wc)
                    }
                }
            }
        }
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
            for (var _130_18_ = 0; _130_18_ < list.length; _130_18_++)
            {
                g = list[_130_18_]
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
        var dg, dp, g, i, union

        var list = _k_.list(this.grps)
        for (var _176_14_ = 0; _176_14_ < list.length; _176_14_++)
        {
            g = list[_176_14_]
            var list1 = _k_.list(g.diagonals)
            for (var _177_19_ = 0; _177_19_ < list1.length; _177_19_++)
            {
                dp = list1[_177_19_]
                if (dg = this.groupAt(dp))
                {
                    if (dg.stone === g.stone)
                    {
                        union = this.poslUnion(this.posNeighbors(dp),g.neighbors)
                        for (var _182_33_ = i = 0, _182_37_ = union.length; (_182_33_ <= _182_37_ ? i < union.length : i > union.length); (_182_33_ <= _182_37_ ? ++i : --i))
                        {
                            if (this.stoneAt(union[i]) === stone.empty)
                            {
                                this.createLink(g,dg)
                                break
                            }
                        }
                    }
                }
            }
        }
    }

    Score.prototype["groupsShareArea"] = function (a, b)
    {
        var ai, bi

        var list = _k_.list(a.areas)
        for (var _189_15_ = 0; _189_15_ < list.length; _189_15_++)
        {
            ai = list[_189_15_]
            var list1 = _k_.list(b.areas)
            for (var _190_19_ = 0; _190_19_ < list1.length; _190_19_++)
            {
                bi = list1[_190_19_]
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
        var ch, ci, fi, gi, _196_33_

        if ((g.chain != null))
        {
            return g.chain
        }
        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _198_15_ = 0; _198_15_ < list.length; _198_15_++)
        {
            ch = list[_198_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _200_19_ = 0; _200_19_ < list1.length; _200_19_++)
            {
                gi = list1[_200_19_]
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
        var ai, battle, ch, ci, g, gi, li, n, oc, onelib

        this.chains = []
        var list = _k_.list(this.grps)
        for (var _214_14_ = 0; _214_14_ < list.length; _214_14_++)
        {
            g = list[_214_14_]
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
                        for (var _221_31_ = 0; _221_31_ < list1.length; _221_31_++)
                        {
                            li = list1[_221_31_]
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
                for (var _229_23_ = 0; _229_23_ < list2.length; _229_23_++)
                {
                    li = list2[_229_23_]
                    if (!(_k_.in(li,ch.grps)))
                    {
                        this.grps[li].chain = ci
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
        for (var _239_15_ = 0; _239_15_ < list3.length; _239_15_++)
        {
            ch = list3[_239_15_]
            var list4 = _k_.list(this.chains)
            for (var _240_19_ = 0; _240_19_ < list4.length; _240_19_++)
            {
                oc = list4[_240_19_]
                if (ch !== oc)
                {
                    var list5 = _k_.list(ch.grps)
                    for (var _242_27_ = 0; _242_27_ < list5.length; _242_27_++)
                    {
                        gi = list5[_242_27_]
                        if (_k_.in(gi,oc.grps))
                        {
                            if (ch.grps.length > oc.grps.length)
                            {
                                this.chains.splice(this.chains.indexOf(oc),1)
                                break
                            }
                            else
                            {
                                this.chains.splice(this.chains.indexOf(ch),1)
                                break
                            }
                        }
                    }
                }
            }
        }
        var list6 = _k_.list(this.chains)
        for (var _253_15_ = 0; _253_15_ < list6.length; _253_15_++)
        {
            ch = list6[_253_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list7 = _k_.list(ch.grps)
            for (var _258_19_ = 0; _258_19_ < list7.length; _258_19_++)
            {
                gi = list7[_258_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list8 = _k_.list(this.grps[gi].areas)
                for (var _260_23_ = 0; _260_23_ < list8.length; _260_23_++)
                {
                    ai = list8[_260_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list9 = _k_.list(this.grps[gi].eyes)
                for (var _262_23_ = 0; _262_23_ < list9.length; _262_23_++)
                {
                    ai = list9[_262_23_]
                    if (!(_k_.in(ai,ch.eyes)))
                    {
                        ch.eyes.push(ai)
                    }
                }
            }
            n = this.poslNeighbors(ch.posl)
            ch.neighbors = n
            ch.libs = n.filter((function (p)
            {
                return stone.empty === this.stoneAt(this.coord(p))
            }).bind(this)).length
            if (ch.eyes.length > 1)
            {
                onelib = ch.grps.map((function (gi)
                {
                    return this.grps[gi]
                }).bind(this)).filter(function (gr)
                {
                    return gr.libs === 1
                })
                if (_k_.empty(onelib))
                {
                    this.aliveChains([ch])
                }
            }
        }
        if (this.verbose)
        {
            this.fancySchmanzy()
            this.deadOrAlive()
        }
        if (this.areas.length < 2)
        {
            return
        }
        battle = []
        var list10 = _k_.list(this.chains)
        for (var _283_15_ = 0; _283_15_ < list10.length; _283_15_++)
        {
            ch = list10[_283_15_]
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
        var list11 = _k_.list(battle)
        for (var _295_15_ = 0; _295_15_ < list11.length; _295_15_++)
        {
            ai = list11[_295_15_]
            this.areaBattle(ai)
        }
        var list12 = _k_.list(this.chains)
        for (var _298_15_ = 0; _298_15_ < list12.length; _298_15_++)
        {
            ch = list12[_298_15_]
            if (!ch.alive && !ch.dead)
            {
                this.chainBattle(ch)
            }
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["reevaluateAreaColors"] = function ()
    {
        var ai, aliveOpponent, ar, ch, deadOpponent, g, gi, ownedAreas, undecided

        undecided = this.chains.filter(function (ch)
        {
            return !ch.alive && !ch.dead
        })
        var list = _k_.list(undecided)
        for (var _320_15_ = 0; _320_15_ < list.length; _320_15_++)
        {
            ch = list[_320_15_]
            ownedAreas = 0
            var list1 = _k_.list(ch.areas)
            for (var _324_19_ = 0; _324_19_ < list1.length; _324_19_++)
            {
                ai = list1[_324_19_]
                aliveOpponent = 0
                deadOpponent = 0
                ar = this.areas[ai]
                var list2 = _k_.list(ar.grps)
                for (var _328_23_ = 0; _328_23_ < list2.length; _328_23_++)
                {
                    gi = list2[_328_23_]
                    g = this.grps[gi]
                    if (!(_k_.in(gi,ch.grps)) && g.stone !== ch.stone)
                    {
                        if (g.state !== 'dead')
                        {
                            aliveOpponent++
                        }
                        else
                        {
                            deadOpponent++
                        }
                    }
                }
                if (!aliveOpponent && deadOpponent)
                {
                    ar.color = stoneColor[ch.stone][0]
                    this.aliveChains([ch])
                }
                if (ar.color === stoneColor[ch.stone][0])
                {
                    ownedAreas++
                }
            }
            if (ownedAreas === ch.areas.length && !ch.alive)
            {
                this.aliveChains([ch])
            }
        }
    }

    Score.prototype["chainBattle"] = function (ch)
    {
        var ai, chlib, lostAreas, oc, sameAreas

        var list = _k_.list(this.chains)
        for (var _355_15_ = 0; _355_15_ < list.length; _355_15_++)
        {
            oc = list[_355_15_]
            if (oc !== ch && !oc.dead)
            {
                if (ch.libs === 1 && (oc.alive || oc.libs > 1))
                {
                    this.deadChains([ch])
                    return
                }
                if (ch.libs === 2 && (oc.alive || oc.libs > 2))
                {
                    this.deadChains([ch])
                    return
                }
                if (ch.libs < 5 && ch.areas.length === 1)
                {
                    if (this.deadShape(this.areas[ch.areas[0]]))
                    {
                        this.deadChains([ch])
                        return
                    }
                }
                lostAreas = []
                sameAreas = []
                var list1 = _k_.list(ch.areas)
                for (var _376_23_ = 0; _376_23_ < list1.length; _376_23_++)
                {
                    ai = list1[_376_23_]
                    if (_k_.in(ai,oc.areas))
                    {
                        if (this.areas[ai].grps.map((function (gi)
                            {
                                return this.grps[gi]
                            }).bind(this)).filter(function (gr)
                            {
                                return gr.stone === ch.stone
                            }).length === 1)
                        {
                            if (this.areas[ai].posl.length < 10)
                            {
                                sameAreas.push(ai)
                            }
                        }
                        if (oc.eyes.length > 0)
                        {
                            chlib = this.chainAreaLibs(ch,ai)
                            if (chlib < 6 && chlib < this.chainAreaLibs(oc,ai) && this.areas[ai].posl.length < 10)
                            {
                                if (this.areas[ai].grps.map((function (gi)
                                    {
                                        return this.grps[gi]
                                    }).bind(this)).filter(function (gr)
                                    {
                                        return gr.stone === ch.stone
                                    }).length === 1)
                                {
                                    lostAreas.push(ai)
                                }
                            }
                        }
                    }
                }
                if (lostAreas.length === ch.areas.length)
                {
                    this.verb('lost all areas!',oc)
                    this.deadChains([ch])
                    return
                }
                if (sameAreas.length === ch.areas.length && ch.areas.length <= 2 && oc.alive)
                {
                    this.verb('shares all areas and has less or other is alive!',oc)
                    this.deadChains([ch])
                    return
                }
            }
        }
    }

    Score.prototype["deadChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _401_15_ = 0; _401_15_ < list.length; _401_15_++)
        {
            ch = list[_401_15_]
            ch.dead = true
            var list1 = _k_.list(ch.grps)
            for (var _403_19_ = 0; _403_19_ < list1.length; _403_19_++)
            {
                gi = list1[_403_19_]
                this.verb('dead',this.grps[gi].key)
                this.grps[gi].state = 'dead'
            }
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["deadGroups"] = function (groups)
    {
        var gr

        var list = _k_.list(groups)
        for (var _411_15_ = 0; _411_15_ < list.length; _411_15_++)
        {
            gr = list[_411_15_]
            this.verb('dead',gr.key)
            gr.state = 'dead'
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["aliveChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _419_15_ = 0; _419_15_ < list.length; _419_15_++)
        {
            ch = list[_419_15_]
            ch.alive = true
            var list1 = _k_.list(ch.grps)
            for (var _421_19_ = 0; _421_19_ < list1.length; _421_19_++)
            {
                gi = list1[_421_19_]
                this.grps[gi].state = 'alive'
            }
        }
    }

    Score.prototype["areaBattle"] = function (ai)
    {
        var a, bc, bl, ch, chains, deadAlive, gi, gs, wc, wl

        deadAlive = (function (dead, alive)
        {
            this.deadChains(dead.filter(function (dc)
            {
                return dc.areas.length === 1
            }))
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
        for (var _450_15_ = 0; _450_15_ < list.length; _450_15_++)
        {
            ch = list[_450_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _453_19_ = 0; _453_19_ < list1.length; _453_19_++)
            {
                gi = list1[_453_19_]
                if (!(_k_.in(gi,gs)))
                {
                    gs.push(this.grps[gi])
                }
            }
        }
        if (wc.length && bc.length)
        {
            wc.sort((function (a, b)
            {
                return this.chainAreaLibs(a,ai) - this.chainAreaLibs(b,ai)
            }).bind(this))
            bc.sort((function (a, b)
            {
                return this.chainAreaLibs(a,ai) - this.chainAreaLibs(b,ai)
            }).bind(this))
            wl = this.chainAreaLibs(wc[0],ai)
            bl = this.chainAreaLibs(bc[0],ai)
            if ((wl - bl) > 2 && bl < 4)
            {
                this.verb('white more libs',wl,bl)
                return deadAlive(bc,wc)
            }
            else if ((bl - wl) > 2 && wl < 4)
            {
                this.verb('black more libs',bl,wl)
                return deadAlive(wc,bc)
            }
        }
    }

    Score.prototype["verb"] = function ()
    {
        if (this.verbose)
        {
            return console.log.apply(null,arguments)
        }
    }

    return Score
})()

module.exports = Score