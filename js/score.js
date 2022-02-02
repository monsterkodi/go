// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        this.captures = {black:0,white:0}
        return Score.__super__.constructor.apply(this, arguments)
    }

    Score.prototype["clear"] = function ()
    {
        this.captures = {black:0,white:0}
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
        for (var _54_14_ = 0; _54_14_ < list.length; _54_14_++)
        {
            g = list[_54_14_]
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
        points = _k_.copy(this.captures)
        var list1 = _k_.list(this.areas)
        for (var _72_14_ = 0; _72_14_ < list1.length; _72_14_++)
        {
            a = list1[_72_14_]
            if (_k_.in(a.color,'wb'))
            {
                points[stoneColor[a.color]] += a.posl.length
            }
        }
        var list2 = _k_.list(dead)
        for (var _76_15_ = 0; _76_15_ < list2.length; _76_15_++)
        {
            dg = list2[_76_15_]
            var list3 = _k_.list(dg.posl)
            for (var _77_19_ = 0; _77_19_ < list3.length; _77_19_++)
            {
                dp = list3[_77_19_]
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
        for (var _95_14_ = 0; _95_14_ < list.length; _95_14_++)
        {
            g = list[_95_14_]
            if (!g.alive && !g.dead)
            {
                wc = this.weakCollection(g)
                if (!_k_.empty(wc))
                {
                    this.verb(this.groupString(g))
                    this.verb(this.groupString.apply(this,wc))
                    weak = 0
                    var list1 = _k_.list(wc)
                    for (var _102_27_ = 0; _102_27_ < list1.length; _102_27_++)
                    {
                        wg = list1[_102_27_]
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
                        for (var _107_31_ = 0; _107_31_ < list2.length; _107_31_++)
                        {
                            ai = list2[_107_31_]
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
            for (var _128_18_ = 0; _128_18_ < list.length; _128_18_++)
            {
                g = list[_128_18_]
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
        for (var _174_14_ = 0; _174_14_ < list.length; _174_14_++)
        {
            g = list[_174_14_]
            var list1 = _k_.list(g.diagonals)
            for (var _175_19_ = 0; _175_19_ < list1.length; _175_19_++)
            {
                dp = list1[_175_19_]
                if (dg = this.groupAt(dp))
                {
                    if (dg.stone === g.stone)
                    {
                        union = this.poslUnion(this.posNeighbors(dp),g.neighbors)
                        for (var _180_33_ = i = 0, _180_37_ = union.length; (_180_33_ <= _180_37_ ? i < union.length : i > union.length); (_180_33_ <= _180_37_ ? ++i : --i))
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
        for (var _187_15_ = 0; _187_15_ < list.length; _187_15_++)
        {
            ai = list[_187_15_]
            var list1 = _k_.list(b.areas)
            for (var _188_19_ = 0; _188_19_ < list1.length; _188_19_++)
            {
                bi = list1[_188_19_]
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
        var ch, ci, fi, gi, _194_33_

        if ((g.chain != null))
        {
            return g.chain
        }
        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _196_15_ = 0; _196_15_ < list.length; _196_15_++)
        {
            ch = list[_196_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _198_19_ = 0; _198_19_ < list1.length; _198_19_++)
            {
                gi = list1[_198_19_]
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
        for (var _212_14_ = 0; _212_14_ < list.length; _212_14_++)
        {
            g = list[_212_14_]
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
                        for (var _219_31_ = 0; _219_31_ < list1.length; _219_31_++)
                        {
                            li = list1[_219_31_]
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
                for (var _227_23_ = 0; _227_23_ < list2.length; _227_23_++)
                {
                    li = list2[_227_23_]
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
        for (var _237_15_ = 0; _237_15_ < list3.length; _237_15_++)
        {
            ch = list3[_237_15_]
            var list4 = _k_.list(this.chains)
            for (var _238_19_ = 0; _238_19_ < list4.length; _238_19_++)
            {
                oc = list4[_238_19_]
                if (ch !== oc)
                {
                    var list5 = _k_.list(ch.grps)
                    for (var _240_27_ = 0; _240_27_ < list5.length; _240_27_++)
                    {
                        gi = list5[_240_27_]
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
        for (var _251_15_ = 0; _251_15_ < list6.length; _251_15_++)
        {
            ch = list6[_251_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list7 = _k_.list(ch.grps)
            for (var _256_19_ = 0; _256_19_ < list7.length; _256_19_++)
            {
                gi = list7[_256_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list8 = _k_.list(this.grps[gi].areas)
                for (var _258_23_ = 0; _258_23_ < list8.length; _258_23_++)
                {
                    ai = list8[_258_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list9 = _k_.list(this.grps[gi].eyes)
                for (var _260_23_ = 0; _260_23_ < list9.length; _260_23_++)
                {
                    ai = list9[_260_23_]
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
        for (var _281_15_ = 0; _281_15_ < list10.length; _281_15_++)
        {
            ch = list10[_281_15_]
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
        for (var _293_15_ = 0; _293_15_ < list11.length; _293_15_++)
        {
            ai = list11[_293_15_]
            this.areaBattle(ai)
        }
        var list12 = _k_.list(this.chains)
        for (var _296_15_ = 0; _296_15_ < list12.length; _296_15_++)
        {
            ch = list12[_296_15_]
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
        for (var _318_15_ = 0; _318_15_ < list.length; _318_15_++)
        {
            ch = list[_318_15_]
            ownedAreas = 0
            var list1 = _k_.list(ch.areas)
            for (var _322_19_ = 0; _322_19_ < list1.length; _322_19_++)
            {
                ai = list1[_322_19_]
                aliveOpponent = 0
                deadOpponent = 0
                ar = this.areas[ai]
                var list2 = _k_.list(ar.grps)
                for (var _326_23_ = 0; _326_23_ < list2.length; _326_23_++)
                {
                    gi = list2[_326_23_]
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
        for (var _353_15_ = 0; _353_15_ < list.length; _353_15_++)
        {
            oc = list[_353_15_]
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
                for (var _374_23_ = 0; _374_23_ < list1.length; _374_23_++)
                {
                    ai = list1[_374_23_]
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
        for (var _399_15_ = 0; _399_15_ < list.length; _399_15_++)
        {
            ch = list[_399_15_]
            ch.dead = true
            var list1 = _k_.list(ch.grps)
            for (var _401_19_ = 0; _401_19_ < list1.length; _401_19_++)
            {
                gi = list1[_401_19_]
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
        for (var _409_15_ = 0; _409_15_ < list.length; _409_15_++)
        {
            gr = list[_409_15_]
            this.verb('dead',gr.key)
            gr.state = 'dead'
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["aliveChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _417_15_ = 0; _417_15_ < list.length; _417_15_++)
        {
            ch = list[_417_15_]
            ch.alive = true
            var list1 = _k_.list(ch.grps)
            for (var _419_19_ = 0; _419_19_ < list1.length; _419_19_++)
            {
                gi = list1[_419_19_]
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
        for (var _448_15_ = 0; _448_15_ < list.length; _448_15_++)
        {
            ch = list[_448_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _451_19_ = 0; _451_19_ < list1.length; _451_19_++)
            {
                gi = list1[_451_19_]
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