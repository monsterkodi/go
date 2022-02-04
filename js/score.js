// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}};_k_.R2=_k_.k.B256(_k_.k.R(2));_k_.G2=_k_.k.B256(_k_.k.G(2));_k_.g5=_k_.k.F256(_k_.k.g(5));_k_.y5=_k_.k.F256(_k_.k.y(5))

var alpha, Calc, fs, Grid, ilpha, opponent, Score, short, SORT, stone, stoneColor

stoneColor = require('./util/util').stoneColor
stone = require('./util/util').stone
alpha = require('./util/util').alpha
ilpha = require('./util/util').ilpha
opponent = require('./util/util').opponent
short = require('./util/util').short

fs = require('kxk').fs

min = Math.min

Grid = require('./util/grid')
Calc = require('./calc')
SORT = true

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
        this.suicidals()
        var list = _k_.list(this.grps)
        for (var _51_14_ = 0; _51_14_ < list.length; _51_14_++)
        {
            g = list[_51_14_]
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
        this.verb('prisoners',points)
        var list1 = _k_.list(this.areas)
        for (var _69_14_ = 0; _69_14_ < list1.length; _69_14_++)
        {
            a = list1[_69_14_]
            if (_k_.in(a.color,'wb'))
            {
                this.verb('add area points',this.areas.indexOf(a),a.color,a.posl.length)
                points[stoneColor[a.color]] += a.posl.length
            }
        }
        var list2 = _k_.list(dead)
        for (var _74_15_ = 0; _74_15_ < list2.length; _74_15_++)
        {
            dg = list2[_74_15_]
            this.verb('add dead group points',this.grps.indexOf(dg),opponent[stoneColor[dg.stone]],dg.posl.length * 2)
            var list3 = _k_.list(dg.posl)
            for (var _76_19_ = 0; _76_19_ < list3.length; _76_19_++)
            {
                dp = list3[_76_19_]
                points[opponent[stoneColor[dg.stone]]] += 2
            }
        }
        this.verb('points',points)
        if (points.white > points.black)
        {
            finalScore = 'W+' + (points.white - points.black)
        }
        else
        {
            finalScore = 'B+' + (points.black - points.white)
        }
        this.verb('score.calcScore',finalScore)
        return finalScore
    }

    Score.prototype["weaklings"] = function ()
    {
        var g

        var list = _k_.list(this.grps)
        for (var _97_14_ = 0; _97_14_ < list.length; _97_14_++)
        {
            g = list[_97_14_]
            if (!(_k_.in(g.state,['alive','dead'])))
            {
                if (g.libs === 1)
                {
                    this.deadGroups([g],'weakling 1 lib')
                    continue
                }
            }
        }
    }

    Score.prototype["suicidals"] = function ()
    {
        var a, ai, ch, g

        var list = _k_.list(this.grps)
        for (var _104_14_ = 0; _104_14_ < list.length; _104_14_++)
        {
            g = list[_104_14_]
            if (!(_k_.in(g.state,['alive','dead'])))
            {
                if (g.areas.length === 2)
                {
                    var list1 = _k_.list(g.areas)
                    for (var _107_27_ = 0; _107_27_ < list1.length; _107_27_++)
                    {
                        ai = list1[_107_27_]
                        a = this.areas[ai]
                        if (this.suicidalArea(a))
                        {
                            ch = this.chains[g.chain]
                            if (ch.areas.length === ch.libs)
                            {
                                this.deadChains([ch],'chain at suicidal area with as many libs as areas!')
                                break
                            }
                        }
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
                if (SORT)
                {
                    g.sort()
                }
                if (SORT)
                {
                    n.sort()
                }
                if (s === stone.empty)
                {
                    this.areas.push({color:this.areaColor(g),key:g.join(' '),grps:[],posl:g,neighbors:n})
                }
                else
                {
                    this.grps.push({stone:s,key:g.join(' '),state:'unknown',areas:[],eyes:[],links:[],libs:n.filter((function (p)
                    {
                        return stone.empty === this.stoneAt(this.coord(p))
                    }).bind(this)).length,posl:g,neighbors:n,diagonals:this.poslDiagonals(g,n)})
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
        for (var _167_14_ = 0; _167_14_ < list.length; _167_14_++)
        {
            g = list[_167_14_]
            var list1 = _k_.list(g.diagonals)
            for (var _168_19_ = 0; _168_19_ < list1.length; _168_19_++)
            {
                dp = list1[_168_19_]
                if (dg = this.groupAt(dp))
                {
                    if (dg.stone === g.stone)
                    {
                        union = this.poslUnion(this.posNeighbors(dp),g.neighbors)
                        for (var _172_33_ = i = 0, _172_37_ = union.length; (_172_33_ <= _172_37_ ? i < union.length : i > union.length); (_172_33_ <= _172_37_ ? ++i : --i))
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
        for (var _179_15_ = 0; _179_15_ < list.length; _179_15_++)
        {
            ai = list[_179_15_]
            var list1 = _k_.list(b.areas)
            for (var _180_19_ = 0; _180_19_ < list1.length; _180_19_++)
            {
                bi = list1[_180_19_]
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
        var ch, ci, fi, gi, _186_33_

        if ((g.chain != null))
        {
            return g.chain
        }
        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _188_15_ = 0; _188_15_ < list.length; _188_15_++)
        {
            ch = list[_188_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _190_19_ = 0; _190_19_ < list1.length; _190_19_++)
            {
                gi = list1[_190_19_]
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
        for (var _204_14_ = 0; _204_14_ < list.length; _204_14_++)
        {
            g = list[_204_14_]
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
                        for (var _211_31_ = 0; _211_31_ < list1.length; _211_31_++)
                        {
                            li = list1[_211_31_]
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
                for (var _219_23_ = 0; _219_23_ < list2.length; _219_23_++)
                {
                    li = list2[_219_23_]
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
        for (var _229_15_ = 0; _229_15_ < list3.length; _229_15_++)
        {
            ch = list3[_229_15_]
            var list4 = _k_.list(this.chains)
            for (var _230_19_ = 0; _230_19_ < list4.length; _230_19_++)
            {
                oc = list4[_230_19_]
                if (ch !== oc)
                {
                    var list5 = _k_.list(ch.grps)
                    for (var _232_27_ = 0; _232_27_ < list5.length; _232_27_++)
                    {
                        gi = list5[_232_27_]
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
        for (var _241_15_ = 0; _241_15_ < list6.length; _241_15_++)
        {
            ch = list6[_241_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list7 = _k_.list(ch.grps)
            for (var _246_19_ = 0; _246_19_ < list7.length; _246_19_++)
            {
                gi = list7[_246_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list8 = _k_.list(this.grps[gi].areas)
                for (var _248_23_ = 0; _248_23_ < list8.length; _248_23_++)
                {
                    ai = list8[_248_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list9 = _k_.list(this.grps[gi].eyes)
                for (var _250_23_ = 0; _250_23_ < list9.length; _250_23_++)
                {
                    ai = list9[_250_23_]
                    if (!(_k_.in(ai,ch.eyes)))
                    {
                        ch.eyes.push(ai)
                    }
                }
            }
            n = this.poslNeighbors(ch.posl)
            if (SORT)
            {
                n.sort()
            }
            if (SORT)
            {
                ch.posl.sort()
            }
            ch.neighbors = n
            ch.diagonals = this.poslDiagonals(ch.posl,n)
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
                    this.aliveChains([ch],'instant alive!')
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
        for (var _271_15_ = 0; _271_15_ < list10.length; _271_15_++)
        {
            ch = list10[_271_15_]
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
        for (var _276_15_ = 0; _276_15_ < list11.length; _276_15_++)
        {
            ai = list11[_276_15_]
            this.areaBattle(ai)
        }
        var list12 = _k_.list(this.chains)
        for (var _279_15_ = 0; _279_15_ < list12.length; _279_15_++)
        {
            ch = list12[_279_15_]
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
        for (var _295_15_ = 0; _295_15_ < list.length; _295_15_++)
        {
            ch = list[_295_15_]
            ownedAreas = 0
            var list1 = _k_.list(ch.areas)
            for (var _299_19_ = 0; _299_19_ < list1.length; _299_19_++)
            {
                ai = list1[_299_19_]
                aliveOpponent = 0
                deadOpponent = 0
                ar = this.areas[ai]
                var list2 = _k_.list(ar.grps)
                for (var _303_23_ = 0; _303_23_ < list2.length; _303_23_++)
                {
                    gi = list2[_303_23_]
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
                    this.aliveChains([ch],'last opponent died')
                }
                if (ar.color === stoneColor[ch.stone][0] && !this.weakEye(ar))
                {
                    ownedAreas++
                }
            }
            if (ownedAreas === ch.areas.length && !ch.alive)
            {
                this.aliveChains([ch],'all areas owned')
            }
        }
    }

    Score.prototype["weakEye"] = function (a)
    {
        return a.grps.length > 2
    }

    Score.prototype["chainBattle"] = function (ch)
    {
        var ai, chlib, lostAreas, oc, sameAreas

        var list = _k_.list(this.chains)
        for (var _329_15_ = 0; _329_15_ < list.length; _329_15_++)
        {
            oc = list[_329_15_]
            if (oc !== ch && !oc.dead)
            {
                if (ch.libs === 1 && (oc.alive || oc.libs > 1))
                {
                    this.deadChains([ch],'only 1 lib!')
                    return
                }
                if (ch.libs === 2 && (oc.alive || oc.libs > 2))
                {
                    if (!this.looseChainConnection(ch))
                    {
                        this.deadChains([ch],'only 2 libs!')
                        return
                    }
                }
                if (ch.libs < 5 && ch.areas.length === 1)
                {
                    if (this.deadShape(this.areas[ch.areas[0]]))
                    {
                        this.deadChains([ch],'less than 5 libs in single area with dead shape!')
                        return
                    }
                }
                lostAreas = []
                sameAreas = []
                var list1 = _k_.list(ch.areas)
                for (var _350_23_ = 0; _350_23_ < list1.length; _350_23_++)
                {
                    ai = list1[_350_23_]
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
                    this.deadChains([ch],'lost all areas!' + oc)
                    return
                }
                if (sameAreas.length === ch.areas.length && ch.areas.length <= 2 && oc.alive)
                {
                    this.deadChains([ch],'shares all areas and has less or other is alive!' + oc)
                    return
                }
            }
        }
    }

    Score.prototype["deadChains"] = function (chains, reason)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _370_15_ = 0; _370_15_ < list.length; _370_15_++)
        {
            ch = list[_370_15_]
            ch.dead = true
            this.verb(_k_.R2(_k_.y5(_k_.rpad(12,'deadChains'))),reason,this.colorChain(ch))
            this.verb(this.chainString(ch))
            var list1 = _k_.list(ch.grps)
            for (var _374_19_ = 0; _374_19_ < list1.length; _374_19_++)
            {
                gi = list1[_374_19_]
                this.grps[gi].state = 'dead'
            }
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["deadGroups"] = function (groups, reason)
    {
        var gr

        var list = _k_.list(groups)
        for (var _381_15_ = 0; _381_15_ < list.length; _381_15_++)
        {
            gr = list[_381_15_]
            this.verb(_k_.R2(_k_.y5(_k_.rpad(12,'deadGroups'))),reason,gr.key)
            gr.state = 'dead'
        }
        return this.reevaluateAreaColors()
    }

    Score.prototype["aliveChains"] = function (chains, reason)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _389_15_ = 0; _389_15_ < list.length; _389_15_++)
        {
            ch = list[_389_15_]
            ch.alive = true
            this.verb(_k_.G2(_k_.g5(_k_.rpad(12,'aliveChains'))),reason,this.colorChain(ch))
            var list1 = _k_.list(ch.grps)
            for (var _392_19_ = 0; _392_19_ < list1.length; _392_19_++)
            {
                gi = list1[_392_19_]
                this.grps[gi].state = 'alive'
            }
        }
    }

    Score.prototype["areaBattle"] = function (ai)
    {
        var a, bc, bl, ch, chains, deadAlive, gi, gs, wc, wl

        a = this.areas[ai]
        if (a.posl.length > 30)
        {
            return
        }
        deadAlive = (function (dead, alive, reason)
        {
            this.deadChains(dead.filter(function (dc)
            {
                return dc.areas.length === 1
            }),reason)
            return this.aliveChains(alive,reason)
        }).bind(this)
        chains = this.chainsForArea(ai)
        if (chains.length < 2)
        {
            return
        }
        gs = []
        wc = []
        bc = []
        var list = _k_.list(chains)
        for (var _419_15_ = 0; _419_15_ < list.length; _419_15_++)
        {
            ch = list[_419_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _422_19_ = 0; _422_19_ < list1.length; _422_19_++)
            {
                gi = list1[_422_19_]
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
                return this.chainAreaLibs(b,ai) - this.chainAreaLibs(a,ai)
            }).bind(this))
            bc.sort((function (a, b)
            {
                return this.chainAreaLibs(b,ai) - this.chainAreaLibs(a,ai)
            }).bind(this))
            wl = this.chainAreaLibs(wc[0],ai)
            bl = this.chainAreaLibs(bc[0],ai)
            if ((wl - bl) > 2 && bl < 4)
            {
                if (!this.looseChainConnection(bc[0]))
                {
                    return deadAlive(bc,wc,`areaBattle ${ai} white more libs ${wl} > ${bl} area size ${a.posl.length}`)
                }
            }
            else if ((bl - wl) > 2 && wl < 4)
            {
                if (!this.looseChainConnection(wc[0]))
                {
                    return deadAlive(wc,bc,`areaBattle ${ai} black more libs ${bl} > ${wl} area size ${a.posl.length}`)
                }
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