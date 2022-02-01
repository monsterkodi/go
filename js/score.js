// monsterkodi/kode 0.237.0

var _k_ = {clone: function (o,v) { v ??= new Map(); if (o instanceof Array) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w6=_k_.k.F256(_k_.k.w(6));_k_.w8=_k_.k.F256(_k_.k.w(8))

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
        var ch, ci, fi, gi, _115_33_

        if ((g.chain != null))
        {
            return g.chain
        }
        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _117_15_ = 0; _117_15_ < list.length; _117_15_++)
        {
            ch = list[_117_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _119_19_ = 0; _119_19_ < list1.length; _119_19_++)
            {
                gi = list1[_119_19_]
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
        for (var _133_14_ = 0; _133_14_ < list.length; _133_14_++)
        {
            g = list[_133_14_]
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
                        for (var _140_31_ = 0; _140_31_ < list1.length; _140_31_++)
                        {
                            li = list1[_140_31_]
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
                for (var _148_23_ = 0; _148_23_ < list2.length; _148_23_++)
                {
                    li = list2[_148_23_]
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
        for (var _158_15_ = 0; _158_15_ < list3.length; _158_15_++)
        {
            ch = list3[_158_15_]
            var list4 = _k_.list(this.chains)
            for (var _159_19_ = 0; _159_19_ < list4.length; _159_19_++)
            {
                oc = list4[_159_19_]
                if (ch !== oc)
                {
                    var list5 = _k_.list(ch.grps)
                    for (var _161_27_ = 0; _161_27_ < list5.length; _161_27_++)
                    {
                        gi = list5[_161_27_]
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
        for (var _172_15_ = 0; _172_15_ < list6.length; _172_15_++)
        {
            ch = list6[_172_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list7 = _k_.list(ch.grps)
            for (var _177_19_ = 0; _177_19_ < list7.length; _177_19_++)
            {
                gi = list7[_177_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list8 = _k_.list(this.grps[gi].areas)
                for (var _179_23_ = 0; _179_23_ < list8.length; _179_23_++)
                {
                    ai = list8[_179_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list9 = _k_.list(this.grps[gi].eyes)
                for (var _181_23_ = 0; _181_23_ < list9.length; _181_23_++)
                {
                    ai = list9[_181_23_]
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
        battle = []
        var list10 = _k_.list(this.chains)
        for (var _198_15_ = 0; _198_15_ < list10.length; _198_15_++)
        {
            ch = list10[_198_15_]
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
        for (var _210_15_ = 0; _210_15_ < list11.length; _210_15_++)
        {
            ai = list11[_210_15_]
            this.areaBattle(ai)
        }
        var list12 = _k_.list(this.chains)
        for (var _213_15_ = 0; _213_15_ < list12.length; _213_15_++)
        {
            ch = list12[_213_15_]
            if (!ch.alive && !ch.dead)
            {
                this.chainBattle(ch)
            }
        }
        console.log(this.chainString.apply(this,this.chains))
        return this.deadOrAlive()
    }

    Score.prototype["chainBattle"] = function (ch)
    {
        var ai, lostAreas, oc

        console.log(`chainBattle ${this.chains.indexOf(ch)}`,ch)
        var list = _k_.list(this.chains)
        for (var _231_15_ = 0; _231_15_ < list.length; _231_15_++)
        {
            oc = list[_231_15_]
            if (oc !== ch && !oc.dead)
            {
                lostAreas = []
                var list1 = _k_.list(ch.areas)
                for (var _234_23_ = 0; _234_23_ < list1.length; _234_23_++)
                {
                    ai = list1[_234_23_]
                    if (_k_.in(ai,oc.areas))
                    {
                        if (oc.eyes.length > 1)
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
                    console.log('lost all areas!')
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
        for (var _249_15_ = 0; _249_15_ < list.length; _249_15_++)
        {
            ch = list[_249_15_]
            ch.dead = true
            var list1 = _k_.list(ch.grps)
            for (var _251_19_ = 0; _251_19_ < list1.length; _251_19_++)
            {
                gi = list1[_251_19_]
                console.log('dead',this.grps[gi].key)
                this.grps[gi].state = 'dead'
            }
        }
    }

    Score.prototype["aliveChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _257_15_ = 0; _257_15_ < list.length; _257_15_++)
        {
            ch = list[_257_15_]
            ch.alive = true
            var list1 = _k_.list(ch.grps)
            for (var _259_19_ = 0; _259_19_ < list1.length; _259_19_++)
            {
                gi = list1[_259_19_]
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
        for (var _288_15_ = 0; _288_15_ < list.length; _288_15_++)
        {
            ch = list[_288_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _291_19_ = 0; _291_19_ < list1.length; _291_19_++)
            {
                gi = list1[_291_19_]
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
        for (var _324_15_ = 0; _324_15_ < list.length; _324_15_++)
        {
            ag = list[_324_15_]
            var list1 = _k_.list(ag.areas)
            for (var _325_19_ = 0; _325_19_ < list1.length; _325_19_++)
            {
                ai = list1[_325_19_]
                challenged = false
                aa = this.areas[ai]
                var list2 = _k_.list(aa.grps)
                for (var _328_23_ = 0; _328_23_ < list2.length; _328_23_++)
                {
                    gi = list2[_328_23_]
                    gg = this.grps[gi]
                    if (gg.state === 'alive' && gg.stone !== ag.stone)
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
        this.calcAreas()
        dead = this.grps.filter(function (g)
        {
            return g.state === 'dead'
        })
        var list = _k_.list(this.grps)
        for (var _353_14_ = 0; _353_14_ < list.length; _353_14_++)
        {
            g = list[_353_14_]
            console.log(g.state,g.key)
        }
        this.deadOrAlive()
        points = this.captures
        console.log(points)
        var list1 = _k_.list(this.areas)
        for (var _373_14_ = 0; _373_14_ < list1.length; _373_14_++)
        {
            a = list1[_373_14_]
            if (_k_.in(a.color,'wb'))
            {
                points[stoneColor[a.color]] += a.posl.length
            }
        }
        console.log(points)
        var list2 = _k_.list(dead)
        for (var _379_15_ = 0; _379_15_ < list2.length; _379_15_++)
        {
            dg = list2[_379_15_]
            var list3 = _k_.list(dg.posl)
            for (var _380_19_ = 0; _380_19_ < list3.length; _380_19_++)
            {
                dp = list3[_380_19_]
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

    Score.prototype["calcScoreRecursive"] = function (root)
    {
        var a, ai, dead, final, finalScore, g, gi, markDead, o, p, points, score, w, weak

        this.calcGroups()
        markDead = (function (g, r)
        {
            var a, ai, gg, gi

            g.state = 'dead'
            var list = _k_.list(g.areas)
            for (var _412_19_ = 0; _412_19_ < list.length; _412_19_++)
            {
                ai = list[_412_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _414_23_ = 0; _414_23_ < list1.length; _414_23_++)
                {
                    gi = list1[_414_23_]
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
        for (var _421_14_ = 0; _421_14_ < list.length; _421_14_++)
        {
            g = list[_421_14_]
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
                for (var _441_23_ = 0; _441_23_ < list1.length; _441_23_++)
                {
                    gi = list1[_441_23_]
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
                    for (var _457_26_ = 0; _457_26_ < list2.length; _457_26_++)
                    {
                        w = list2[_457_26_]
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
                    for (var _463_27_ = 0; _463_27_ < list3.length; _463_27_++)
                    {
                        ai = list3[_463_27_]
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
            for (var _481_18_ = 0; _481_18_ < list4.length; _481_18_++)
            {
                g = list4[_481_18_]
                var list5 = _k_.list(g.posl)
                for (var _482_22_ = 0; _482_22_ < list5.length; _482_22_++)
                {
                    p = list5[_482_22_]
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
            for (var _494_18_ = 0; _494_18_ < list6.length; _494_18_++)
            {
                g = list6[_494_18_]
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
            for (var _501_18_ = 0; _501_18_ < list7.length; _501_18_++)
            {
                a = list7[_501_18_]
                a.color = final.areaAt(a.posl[0]).color
            }
            console.log(this.areaString())
            points = _k_.copy(final.captures)
            var list8 = _k_.list(final.areas)
            for (var _516_18_ = 0; _516_18_ < list8.length; _516_18_++)
            {
                a = list8[_516_18_]
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
        for (var _539_14_ = 0; _539_14_ < list.length; _539_14_++)
        {
            a = list[_539_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _541_18_ = 0; _541_18_ < list1.length; _541_18_++)
            {
                n = list1[_541_18_]
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
        for (var _554_14_ = 0; _554_14_ < list.length; _554_14_++)
        {
            a = list[_554_14_]
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
        for (var _559_14_ = 0; _559_14_ < list.length; _559_14_++)
        {
            g = list[_559_14_]
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
        for (var _604_14_ = 0; _604_14_ < list.length; _604_14_++)
        {
            c = list[_604_14_]
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
        for (var _632_14_ = 0; _632_14_ < list.length; _632_14_++)
        {
            n = list[_632_14_]
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
        for (var _638_14_ = 0; _638_14_ < list.length; _638_14_++)
        {
            d = list[_638_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _640_22_ = 0; _640_22_ < list1.length; _640_22_++)
                {
                    n = list1[_640_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        bad = false
                        var list2 = _k_.list(g.eyes)
                        for (var _643_31_ = 0; _643_31_ < list2.length; _643_31_++)
                        {
                            ei = list2[_643_31_]
                            if (_k_.in(n,this.areas[ei].posl) && this.areas[ei].posl.length === 1)
                            {
                                bad = true
                            }
                        }
                        var list3 = _k_.list(g.areas)
                        for (var _646_31_ = 0; _646_31_ < list3.length; _646_31_++)
                        {
                            ai = list3[_646_31_]
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
            for (var _658_18_ = 0; _658_18_ < list.length; _658_18_++)
            {
                n = list[_658_18_]
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
        for (var _668_15_ = 0; _668_15_ < list.length; _668_15_++)
        {
            gi = list[_668_15_]
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
            for (var _690_19_ = 0; _690_19_ < list.length; _690_19_++)
            {
                ai = list[_690_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _692_23_ = 0; _692_23_ < list1.length; _692_23_++)
                {
                    gi = list1[_692_23_]
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
                for (var _700_22_ = 0; _700_22_ < list2.length; _700_22_++)
                {
                    f = list2[_700_22_]
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
        for (var _749_14_ = 0; _749_14_ < list.length; _749_14_++)
        {
            n = list[_749_14_]
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
                for (var _771_23_ = 0; _771_23_ < list.length; _771_23_++)
                {
                    gp = list[_771_23_]
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
            for (var _783_18_ = 0; _783_18_ < list.length; _783_18_++)
            {
                n = list[_783_18_]
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
        for (var _800_14_ = 0; _800_14_ < list.length; _800_14_++)
        {
            p = list[_800_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _801_18_ = 0; _801_18_ < list1.length; _801_18_++)
            {
                n = list1[_801_18_]
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
        for (var _809_14_ = 0; _809_14_ < list.length; _809_14_++)
        {
            p = list[_809_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _810_19_ = 0; _810_19_ < list1.length; _810_19_++)
            {
                pn = list1[_810_19_]
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
        for (var _822_18_ = 0; _822_18_ < list.length; _822_18_++)
        {
            x = list[_822_18_][0]
            y = list[_822_18_][1]
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
        for (var _837_14_ = 0; _837_14_ < list.length; _837_14_++)
        {
            p = list[_837_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _838_18_ = 0; _838_18_ < list1.length; _838_18_++)
            {
                d = list1[_838_18_]
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
        for (var _846_18_ = 0; _846_18_ < list.length; _846_18_++)
        {
            x = list[_846_18_][0]
            y = list[_846_18_][1]
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
        for (var _868_17_ = y = 0, _868_21_ = this.size; (_868_17_ <= _868_21_ ? y < this.size : y > this.size); (_868_17_ <= _868_21_ ? ++y : --y))
        {
            for (var _869_21_ = x = 0, _869_25_ = this.size; (_869_21_ <= _869_25_ ? x < this.size : x > this.size); (_869_21_ <= _869_25_ ? ++x : --x))
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
        for (var _877_14_ = 0; _877_14_ < list.length; _877_14_++)
        {
            n = list[_877_14_]
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
        for (var _893_17_ = y = 0, _893_21_ = this.size; (_893_17_ <= _893_21_ ? y < this.size : y > this.size); (_893_17_ <= _893_21_ ? ++y : --y))
        {
            for (var _894_21_ = x = 0, _894_25_ = this.size; (_894_21_ <= _894_25_ ? x < this.size : x > this.size); (_894_21_ <= _894_25_ ? ++x : --x))
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
        for (var _909_17_ = y = 0, _909_21_ = this.size; (_909_17_ <= _909_21_ ? y < this.size : y > this.size); (_909_17_ <= _909_21_ ? ++y : --y))
        {
            for (var _910_21_ = x = 0, _910_25_ = this.size; (_910_21_ <= _910_25_ ? x < this.size : x > this.size); (_910_21_ <= _910_25_ ? ++x : --x))
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
        for (var _930_14_ = 0; _930_14_ < list.length; _930_14_++)
        {
            a = list[_930_14_]
            var list1 = _k_.list(a.posl)
            for (var _931_19_ = 0; _931_19_ < list1.length; _931_19_++)
            {
                aa = list1[_931_19_]
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
        for (var _938_14_ = 0; _938_14_ < list.length; _938_14_++)
        {
            a = list[_938_14_]
            var list1 = _k_.list(a.posl)
            for (var _939_19_ = 0; _939_19_ < list1.length; _939_19_++)
            {
                aa = list1[_939_19_]
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
        for (var _944_15_ = 0; _944_15_ < list2.length; _944_15_++)
        {
            gr = list2[_944_15_]
            var list3 = _k_.list(gr.posl)
            for (var _945_19_ = 0; _945_19_ < list3.length; _945_19_++)
            {
                gg = list3[_945_19_]
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
        for (var _960_15_ = 0; _960_15_ < list.length; _960_15_++)
        {
            gr = list[_960_15_]
            var list1 = _k_.list(gr.posl)
            for (var _961_19_ = 0; _961_19_ < list1.length; _961_19_++)
            {
                gg = list1[_961_19_]
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
        for (var _968_15_ = 0; _968_15_ < list.length; _968_15_++)
        {
            gr = list[_968_15_]
            var list1 = _k_.list(gr.posl)
            for (var _969_19_ = 0; _969_19_ < list1.length; _969_19_++)
            {
                gg = list1[_969_19_]
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
        for (var _988_15_ = 0; _988_15_ < list.length; _988_15_++)
        {
            gr = list[_988_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _990_23_ = 0; _990_23_ < list1.length; _990_23_++)
                {
                    gg = list1[_990_23_]
                    c = (arguments[idx].stone === '○' ? '◻' : '◼')
                    grid.set(gg,this.rainbow(idx,c))
                }
            }
            else
            {
                var list2 = _k_.list(gr.posl)
                for (var _994_23_ = 0; _994_23_ < list2.length; _994_23_++)
                {
                    gg = list2[_994_23_]
                    grid.set(gg,_k_.w2(grid.at(gg)))
                }
            }
        }
        var list3 = _k_.list(this.areas)
        for (var _996_15_ = 0; _996_15_ < list3.length; _996_15_++)
        {
            ar = list3[_996_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ar)))
            {
                var list4 = _k_.list(ar.posl)
                for (var _998_23_ = 0; _998_23_ < list4.length; _998_23_++)
                {
                    aa = list4[_998_23_]
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
        for (var _1005_15_ = 0; _1005_15_ < list.length; _1005_15_++)
        {
            gr = list[_1005_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _1007_23_ = 0; _1007_23_ < list1.length; _1007_23_++)
                {
                    gg = list1[_1007_23_]
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
        for (var _1016_15_ = 0; _1016_15_ < list.length; _1016_15_++)
        {
            ch = list[_1016_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ch)))
            {
                var list1 = _k_.list(ch.posl)
                for (var _1018_23_ = 0; _1018_23_ < list1.length; _1018_23_++)
                {
                    cp = list1[_1018_23_]
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
        for (var _1032_17_ = i = 0, _1032_21_ = as.length; (_1032_17_ <= _1032_21_ ? i < as.length : i > as.length); (_1032_17_ <= _1032_21_ ? ++i : --i))
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
        for (var _1050_17_ = i = 0, _1050_21_ = as.length; (_1050_17_ <= _1050_21_ ? i < as.length : i > as.length); (_1050_17_ <= _1050_21_ ? ++i : --i))
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