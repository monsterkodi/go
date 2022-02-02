// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, assert: function (f,l,c,m,t) { if (!t) {console.log(f + ':' + l + ':' + c + ' ▴ ' + m)}}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w6=_k_.k.F256(_k_.k.w(6));_k_.w8=_k_.k.F256(_k_.k.w(8))

var alpha, DeadStones, fs, Grid, ilpha, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
ilpha = require('./util').ilpha
opponent = require('./util').opponent

fs = require('kxk').fs

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
            for (var _47_18_ = 0; _47_18_ < list.length; _47_18_++)
            {
                g = list[_47_18_]
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
        var dg, dp, g, union

        var list = _k_.list(this.grps)
        for (var _93_14_ = 0; _93_14_ < list.length; _93_14_++)
        {
            g = list[_93_14_]
            var list1 = _k_.list(g.diagonals)
            for (var _94_19_ = 0; _94_19_ < list1.length; _94_19_++)
            {
                dp = list1[_94_19_]
                if (dg = this.groupAt(dp))
                {
                    if (dg.stone === g.stone)
                    {
                        union = this.poslUnion(this.posNeighbors(dp),g.neighbors)
                        _k_.assert(".", 99, 24, "assert failed!" + " union.length === 2", union.length === 2)
                        if (this.stoneAt(union[0]) === stone.empty || this.stoneAt(union[1]) === stone.empty)
                        {
                            this.createLink(g,dg)
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
        for (var _105_15_ = 0; _105_15_ < list.length; _105_15_++)
        {
            ai = list[_105_15_]
            var list1 = _k_.list(b.areas)
            for (var _106_19_ = 0; _106_19_ < list1.length; _106_19_++)
            {
                bi = list1[_106_19_]
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
        var ch, ci, fi, gi, _112_33_

        if ((g.chain != null))
        {
            return g.chain
        }
        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _114_15_ = 0; _114_15_ < list.length; _114_15_++)
        {
            ch = list[_114_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _116_19_ = 0; _116_19_ < list1.length; _116_19_++)
            {
                gi = list1[_116_19_]
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
        var ai, battle, ch, ci, g, gi, li, n, oc

        this.chains = []
        var list = _k_.list(this.grps)
        for (var _130_14_ = 0; _130_14_ < list.length; _130_14_++)
        {
            g = list[_130_14_]
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
                        for (var _137_31_ = 0; _137_31_ < list1.length; _137_31_++)
                        {
                            li = list1[_137_31_]
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
                for (var _145_23_ = 0; _145_23_ < list2.length; _145_23_++)
                {
                    li = list2[_145_23_]
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
        for (var _155_15_ = 0; _155_15_ < list3.length; _155_15_++)
        {
            ch = list3[_155_15_]
            var list4 = _k_.list(this.chains)
            for (var _156_19_ = 0; _156_19_ < list4.length; _156_19_++)
            {
                oc = list4[_156_19_]
                if (ch !== oc)
                {
                    var list5 = _k_.list(ch.grps)
                    for (var _158_27_ = 0; _158_27_ < list5.length; _158_27_++)
                    {
                        gi = list5[_158_27_]
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
        for (var _169_15_ = 0; _169_15_ < list6.length; _169_15_++)
        {
            ch = list6[_169_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list7 = _k_.list(ch.grps)
            for (var _174_19_ = 0; _174_19_ < list7.length; _174_19_++)
            {
                gi = list7[_174_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list8 = _k_.list(this.grps[gi].areas)
                for (var _176_23_ = 0; _176_23_ < list8.length; _176_23_++)
                {
                    ai = list8[_176_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list9 = _k_.list(this.grps[gi].eyes)
                for (var _178_23_ = 0; _178_23_ < list9.length; _178_23_++)
                {
                    ai = list9[_178_23_]
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
                this.aliveChains([ch])
            }
        }
        this.fancySchmanzy()
        this.deadOrAlive()
        if (this.areas.length < 2)
        {
            return
        }
        battle = []
        var list10 = _k_.list(this.chains)
        for (var _197_15_ = 0; _197_15_ < list10.length; _197_15_++)
        {
            ch = list10[_197_15_]
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
        for (var _209_15_ = 0; _209_15_ < list11.length; _209_15_++)
        {
            ai = list11[_209_15_]
            this.areaBattle(ai)
        }
        var list12 = _k_.list(this.chains)
        for (var _212_15_ = 0; _212_15_ < list12.length; _212_15_++)
        {
            ch = list12[_212_15_]
            if (!ch.alive && !ch.dead)
            {
                this.chainBattle(ch)
            }
        }
        this.reevaluateAreaColors()
        console.log(this.chainString.apply(this,this.chains))
        return this.deadOrAlive()
    }

    Score.prototype["reevaluateAreaColors"] = function ()
    {
        var ai, aliveOpponent, ar, ch, deadOpponent, g, gi, ownedAreas, undecided

        undecided = this.chains.filter(function (ch)
        {
            return !ch.alive && !ch.dead
        })
        var list = _k_.list(undecided)
        for (var _228_15_ = 0; _228_15_ < list.length; _228_15_++)
        {
            ch = list[_228_15_]
            ownedAreas = 0
            var list1 = _k_.list(ch.areas)
            for (var _232_19_ = 0; _232_19_ < list1.length; _232_19_++)
            {
                ai = list1[_232_19_]
                aliveOpponent = 0
                deadOpponent = 0
                ar = this.areas[ai]
                var list2 = _k_.list(ar.grps)
                for (var _236_23_ = 0; _236_23_ < list2.length; _236_23_++)
                {
                    gi = list2[_236_23_]
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
                    console.log('set area color',ai,stoneColor[ch.stone][0])
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
        var ai, lostAreas, oc, sameAreas

        console.log(`chainBattle ${this.chains.indexOf(ch)}`,ch)
        var list = _k_.list(this.chains)
        for (var _263_15_ = 0; _263_15_ < list.length; _263_15_++)
        {
            oc = list[_263_15_]
            if (oc !== ch && !oc.dead)
            {
                if (ch.libs === 1 && (oc.alive || oc.libs > 1))
                {
                    console.log('only 1 lib!')
                    this.deadChains([ch])
                    return
                }
                lostAreas = []
                sameAreas = []
                var list1 = _k_.list(ch.areas)
                for (var _273_23_ = 0; _273_23_ < list1.length; _273_23_++)
                {
                    ai = list1[_273_23_]
                    if (_k_.in(ai,oc.areas))
                    {
                        sameAreas.push(ai)
                        if (oc.eyes.length > 0)
                        {
                            if (this.chainAreaLibs(ch,ai) < this.chainAreaLibs(oc,ai))
                            {
                                console.log(`lost area ${ai}`,this.chainAreaLibs(ch,ai),this.chainAreaLibs(oc,ai))
                                lostAreas.push(ai)
                            }
                        }
                    }
                }
                console.log(lostAreas,lostAreas.length,ch.areas.length)
                if (lostAreas.length === ch.areas.length)
                {
                    console.log('lost all areas!',oc)
                    this.deadChains([ch])
                    return
                }
                if (sameAreas.length === ch.areas.length && ch.areas.length <= 2 && (oc.alive || oc.areas.length > ch.areas.length))
                {
                    console.log('shares all areas and has less or other is alive!',oc)
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
        for (var _295_15_ = 0; _295_15_ < list.length; _295_15_++)
        {
            ch = list[_295_15_]
            ch.dead = true
            var list1 = _k_.list(ch.grps)
            for (var _297_19_ = 0; _297_19_ < list1.length; _297_19_++)
            {
                gi = list1[_297_19_]
                console.log('dead',this.grps[gi].key)
                this.grps[gi].state = 'dead'
            }
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["aliveChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _305_15_ = 0; _305_15_ < list.length; _305_15_++)
        {
            ch = list[_305_15_]
            ch.alive = true
            var list1 = _k_.list(ch.grps)
            for (var _307_19_ = 0; _307_19_ < list1.length; _307_19_++)
            {
                gi = list1[_307_19_]
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
        for (var _336_15_ = 0; _336_15_ < list.length; _336_15_++)
        {
            ch = list[_336_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _339_19_ = 0; _339_19_ < list1.length; _339_19_++)
            {
                gi = list1[_339_19_]
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
            if ((wl - bl) > 2)
            {
                return deadAlive(bc,wc)
            }
            else if ((bl - wl) > 2)
            {
                return deadAlive(wc,bc)
            }
        }
    }

    Score.prototype["poslUnion"] = function (a, b)
    {
        return a.filter(function (ai)
        {
            return _k_.in(ai,b)
        })
    }

    Score.prototype["chainAreaLibs"] = function (ch, ai)
    {
        return this.poslUnion(ch.neighbors,this.areas[ai].posl).length
    }

    Score.prototype["chainsForArea"] = function (ai)
    {
        return this.chains.filter(function (ch)
        {
            return _k_.in(ai,ch.areas)
        })
    }

    Score.prototype["calcAreas"] = function ()
    {
        var aa, ag, ai, alive, challenged, gg, gi

        alive = this.grps.filter(function (g)
        {
            return g.state === 'alive'
        })
        var list = _k_.list(alive)
        for (var _372_15_ = 0; _372_15_ < list.length; _372_15_++)
        {
            ag = list[_372_15_]
            var list1 = _k_.list(ag.areas)
            for (var _373_19_ = 0; _373_19_ < list1.length; _373_19_++)
            {
                ai = list1[_373_19_]
                challenged = false
                aa = this.areas[ai]
                var list2 = _k_.list(aa.grps)
                for (var _376_23_ = 0; _376_23_ < list2.length; _376_23_++)
                {
                    gi = list2[_376_23_]
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

    Score.prototype["calcScore"] = function ()
    {
        var a, dead, dg, dp, finalScore, g, points

        this.calcGroups()
        this.linkAreas()
        this.linkGroups()
        this.calcChains()
        console.log('before calcAreas')
        this.deadOrAlive()
        this.calcAreas()
        if (this.chains.length < 2)
        {
            return 'B+0'
        }
        if (this.areas.length < 2)
        {
            return 'B+0'
        }
        dead = this.grps.filter(function (g)
        {
            return g.state === 'dead'
        })
        var list = _k_.list(this.grps)
        for (var _408_14_ = 0; _408_14_ < list.length; _408_14_++)
        {
            g = list[_408_14_]
            console.log(g.state,g.key)
        }
        this.deadOrAlive()
        points = _k_.copy(this.captures)
        console.log(points)
        var list1 = _k_.list(this.areas)
        for (var _428_14_ = 0; _428_14_ < list1.length; _428_14_++)
        {
            a = list1[_428_14_]
            if (_k_.in(a.color,'wb'))
            {
                points[stoneColor[a.color]] += a.posl.length
            }
        }
        console.log(points)
        var list2 = _k_.list(dead)
        for (var _434_15_ = 0; _434_15_ < list2.length; _434_15_++)
        {
            dg = list2[_434_15_]
            var list3 = _k_.list(dg.posl)
            for (var _435_19_ = 0; _435_19_ < list3.length; _435_19_++)
            {
                dp = list3[_435_19_]
                points[opponent[stoneColor[dg.stone]]] += 2
            }
        }
        console.log(points)
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

    Score.prototype["linkAreas"] = function ()
    {
        var a, ai, g, gi, n

        var list = _k_.list(this.areas)
        for (var _455_14_ = 0; _455_14_ < list.length; _455_14_++)
        {
            a = list[_455_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _457_18_ = 0; _457_18_ < list1.length; _457_18_++)
            {
                n = list1[_457_18_]
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
        for (var _470_14_ = 0; _470_14_ < list.length; _470_14_++)
        {
            a = list[_470_14_]
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
        for (var _475_14_ = 0; _475_14_ < list.length; _475_14_++)
        {
            g = list[_475_14_]
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
            return '?'
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
        for (var _520_14_ = 0; _520_14_ < list.length; _520_14_++)
        {
            c = list[_520_14_]
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
            else
            {
                return '?'
            }
        }
    }

    Score.prototype["potentialGroup"] = function (g)
    {
        var n

        var list = _k_.list(g.neighbors)
        for (var _550_14_ = 0; _550_14_ < list.length; _550_14_++)
        {
            n = list[_550_14_]
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
        for (var _556_14_ = 0; _556_14_ < list.length; _556_14_++)
        {
            d = list[_556_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _558_22_ = 0; _558_22_ < list1.length; _558_22_++)
                {
                    n = list1[_558_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        bad = false
                        var list2 = _k_.list(g.eyes)
                        for (var _561_31_ = 0; _561_31_ < list2.length; _561_31_++)
                        {
                            ei = list2[_561_31_]
                            if (_k_.in(n,this.areas[ei].posl) && this.areas[ei].posl.length === 1)
                            {
                                bad = true
                            }
                        }
                        var list3 = _k_.list(g.areas)
                        for (var _564_31_ = 0; _564_31_ < list3.length; _564_31_++)
                        {
                            ai = list3[_564_31_]
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
            for (var _576_18_ = 0; _576_18_ < list.length; _576_18_++)
            {
                n = list[_576_18_]
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
        for (var _586_15_ = 0; _586_15_ < list.length; _586_15_++)
        {
            gi = list[_586_15_]
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
            for (var _608_19_ = 0; _608_19_ < list.length; _608_19_++)
            {
                ai = list[_608_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _610_23_ = 0; _610_23_ < list1.length; _610_23_++)
                {
                    gi = list1[_610_23_]
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
                for (var _618_22_ = 0; _618_22_ < list2.length; _618_22_++)
                {
                    f = list2[_618_22_]
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
        for (var _667_14_ = 0; _667_14_ < list.length; _667_14_++)
        {
            n = list[_667_14_]
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
                for (var _689_23_ = 0; _689_23_ < list.length; _689_23_++)
                {
                    gp = list[_689_23_]
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
            for (var _701_18_ = 0; _701_18_ < list.length; _701_18_++)
            {
                n = list[_701_18_]
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
        for (var _718_14_ = 0; _718_14_ < list.length; _718_14_++)
        {
            p = list[_718_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _719_18_ = 0; _719_18_ < list1.length; _719_18_++)
            {
                n = list1[_719_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Score.prototype["poslNeighbors"] = function (pl)
    {
        var nl, p, pn

        nl = []
        var list = _k_.list(pl)
        for (var _727_14_ = 0; _727_14_ < list.length; _727_14_++)
        {
            p = list[_727_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _728_19_ = 0; _728_19_ < list1.length; _728_19_++)
            {
                pn = list1[_728_19_]
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
        for (var _740_18_ = 0; _740_18_ < list.length; _740_18_++)
        {
            x = list[_740_18_][0]
            y = list[_740_18_][1]
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
        for (var _755_14_ = 0; _755_14_ < list.length; _755_14_++)
        {
            p = list[_755_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _756_18_ = 0; _756_18_ < list1.length; _756_18_++)
            {
                d = list1[_756_18_]
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
        for (var _764_18_ = 0; _764_18_ < list.length; _764_18_++)
        {
            x = list[_764_18_][0]
            y = list[_764_18_][1]
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
        for (var _786_17_ = y = 0, _786_21_ = this.size; (_786_17_ <= _786_21_ ? y < this.size : y > this.size); (_786_17_ <= _786_21_ ? ++y : --y))
        {
            for (var _787_21_ = x = 0, _787_25_ = this.size; (_787_21_ <= _787_25_ ? x < this.size : x > this.size); (_787_21_ <= _787_25_ ? ++x : --x))
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
        for (var _795_14_ = 0; _795_14_ < list.length; _795_14_++)
        {
            n = list[_795_14_]
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
        for (var _811_17_ = y = 0, _811_21_ = this.size; (_811_17_ <= _811_21_ ? y < this.size : y > this.size); (_811_17_ <= _811_21_ ? ++y : --y))
        {
            for (var _812_21_ = x = 0, _812_25_ = this.size; (_812_21_ <= _812_25_ ? x < this.size : x > this.size); (_812_21_ <= _812_25_ ? ++x : --x))
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
        for (var _827_17_ = y = 0, _827_21_ = this.size; (_827_17_ <= _827_21_ ? y < this.size : y > this.size); (_827_17_ <= _827_21_ ? ++y : --y))
        {
            for (var _828_21_ = x = 0, _828_25_ = this.size; (_828_21_ <= _828_25_ ? x < this.size : x > this.size); (_828_21_ <= _828_25_ ? ++x : --x))
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
        for (var _848_14_ = 0; _848_14_ < list.length; _848_14_++)
        {
            a = list[_848_14_]
            var list1 = _k_.list(a.posl)
            for (var _849_19_ = 0; _849_19_ < list1.length; _849_19_++)
            {
                aa = list1[_849_19_]
                g.set(aa,a.color)
            }
        }
        return g.toString(legend)
    }

    Score.prototype["areaColors"] = function (legend)
    {
        var a, aa, g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.areas)
        for (var _856_14_ = 0; _856_14_ < list.length; _856_14_++)
        {
            a = list[_856_14_]
            var list1 = _k_.list(a.posl)
            for (var _857_19_ = 0; _857_19_ < list1.length; _857_19_++)
            {
                aa = list1[_857_19_]
                switch (a.color)
                {
                    case '?':
                        g.set(aa,_k_.b6('?'))
                        break
                    case 'w':
                        g.set(aa,_k_.w8('.'))
                        break
                    case 'b':
                        g.set(aa,_k_.w3('.'))
                        break
                }

            }
        }
        var list2 = _k_.list(this.grps)
        for (var _862_15_ = 0; _862_15_ < list2.length; _862_15_++)
        {
            gr = list2[_862_15_]
            var list3 = _k_.list(gr.posl)
            for (var _863_19_ = 0; _863_19_ < list3.length; _863_19_++)
            {
                gg = list3[_863_19_]
                switch (g.at(gg))
                {
                    case '○':
                        g.set(gg,_k_.w4('○'))
                        break
                    case '●':
                        g.set(gg,_k_.w6('●'))
                        break
                }

            }
        }
        return g.toAnsi(legend)
    }

    Score.prototype["deadString"] = function (legend)
    {
        var g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _878_15_ = 0; _878_15_ < list.length; _878_15_++)
        {
            gr = list[_878_15_]
            var list1 = _k_.list(gr.posl)
            for (var _879_19_ = 0; _879_19_ < list1.length; _879_19_++)
            {
                gg = list1[_879_19_]
                if (gr.state === 'dead')
                {
                    g.set(gg,'X')
                }
            }
        }
        return g.toString(legend)
    }

    Score.prototype["deadColors"] = function (legend)
    {
        var g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _886_15_ = 0; _886_15_ < list.length; _886_15_++)
        {
            gr = list[_886_15_]
            var list1 = _k_.list(gr.posl)
            for (var _887_19_ = 0; _887_19_ < list1.length; _887_19_++)
            {
                gg = list1[_887_19_]
                if (gr.state === 'dead')
                {
                    g.set(gg,_k_.r6('X'))
                }
                else
                {
                    g.set(gg,_k_.w4(g.at(gg)))
                }
            }
        }
        return g.toAnsi(legend)
    }

    Score.prototype["rainbow"] = function (idx, c)
    {
        return [y5,r5,g2,b8,m3,b4,w4,w8][idx % 8](c)
    }

    Score.prototype["groupString"] = function ()
    {
        var aa, ar, c, gg, gr, grid, idx

        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _906_15_ = 0; _906_15_ < list.length; _906_15_++)
        {
            gr = list[_906_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _908_23_ = 0; _908_23_ < list1.length; _908_23_++)
                {
                    gg = list1[_908_23_]
                    c = (arguments[idx].stone === '○' ? '◻' : '◼')
                    grid.set(gg,this.rainbow(idx,c))
                }
            }
            else
            {
                var list2 = _k_.list(gr.posl)
                for (var _912_23_ = 0; _912_23_ < list2.length; _912_23_++)
                {
                    gg = list2[_912_23_]
                    grid.set(gg,_k_.w2(grid.at(gg)))
                }
            }
        }
        var list3 = _k_.list(this.areas)
        for (var _914_15_ = 0; _914_15_ < list3.length; _914_15_++)
        {
            ar = list3[_914_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ar)))
            {
                var list4 = _k_.list(ar.posl)
                for (var _916_23_ = 0; _916_23_ < list4.length; _916_23_++)
                {
                    aa = list4[_916_23_]
                    grid.set(aa,this.rainbow(idx,this.areas.indexOf(ar)))
                }
            }
        }
        return grid.toAnsi(1)
    }

    Score.prototype["grpsString"] = function ()
    {
        var c, gg, gr, grid, idx

        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _923_15_ = 0; _923_15_ < list.length; _923_15_++)
        {
            gr = list[_923_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _925_23_ = 0; _925_23_ < list1.length; _925_23_++)
                {
                    gg = list1[_925_23_]
                    c = this.grps.indexOf(gr)
                    if (c > 9)
                    {
                        c = ilpha[c - 10]
                    }
                    grid.set(gg,this.rainbow(idx,c))
                }
            }
        }
        return grid.toAnsi(1)
    }

    Score.prototype["chainString"] = function ()
    {
        var c, ch, cp, grid, idx

        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.chains)
        for (var _934_15_ = 0; _934_15_ < list.length; _934_15_++)
        {
            ch = list[_934_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ch)))
            {
                var list1 = _k_.list(ch.posl)
                for (var _936_23_ = 0; _936_23_ < list1.length; _936_23_++)
                {
                    cp = list1[_936_23_]
                    c = this.chains.indexOf(ch)
                    grid.set(cp,this.rainbow(idx,c))
                }
            }
        }
        return grid.toAnsi(1)
    }

    Score.prototype["fancySchmanzy"] = function ()
    {
        var as, cs, gs, i, pl

        as = this.groupString.apply(this,this.areas).split('\n')
        gs = this.grpsString.apply(this,this.grps).split('\n')
        cs = this.chainString.apply(this,this.chains).split('\n')
        pl = this.size * 2 + 6
        fs = [_k_.w2(_k_.rpad(pl,' areas') + _k_.rpad(pl,' groups') + _k_.rpad(pl,' chains'))]
        for (var _950_17_ = i = 0, _950_21_ = as.length; (_950_17_ <= _950_21_ ? i < as.length : i > as.length); (_950_17_ <= _950_21_ ? ++i : --i))
        {
            if (i === 0 || i === as.length - 2)
            {
                fs.push(as[i] + '   ' + gs[i] + '   ' + cs[i])
            }
            else if (i === as.length - 1)
            {
                fs.push(as[i] + '     ' + gs[i] + '     ' + cs[i])
            }
            else
            {
                fs.push(as[i] + ' ' + gs[i] + ' ' + cs[i])
            }
        }
        console.log(fs.join('\n'))
        console.log('')
    }

    Score.prototype["deadOrAlive"] = function ()
    {
        var as, cs, gs, i, pl

        as = this.areaColors.apply(this,this.areas).split('\n')
        gs = this.deadColors(1).split('\n')
        cs = this.groupString.apply(this,this.grps.filter(function (g)
        {
            return g.state === 'alive'
        })).split('\n')
        pl = this.size * 2 + 6
        fs = [_k_.w2(_k_.rpad(pl,' color') + _k_.rpad(pl,' dead') + _k_.rpad(pl,' alive'))]
        for (var _968_17_ = i = 0, _968_21_ = as.length; (_968_17_ <= _968_21_ ? i < as.length : i > as.length); (_968_17_ <= _968_21_ ? ++i : --i))
        {
            if (i === 0 || i === as.length - 2)
            {
                fs.push(as[i] + '   ' + gs[i] + '   ' + cs[i])
            }
            else if (i === as.length - 1)
            {
                fs.push(as[i] + '     ' + gs[i] + '     ' + cs[i])
            }
            else
            {
                fs.push(as[i] + ' ' + gs[i] + ' ' + cs[i])
            }
        }
        console.log(fs.join('\n'))
        console.log('')
    }

    return Score
})()

module.exports = Score