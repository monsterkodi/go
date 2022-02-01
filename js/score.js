// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w6=_k_.k.F256(_k_.k.w(6));_k_.w8=_k_.k.F256(_k_.k.w(8))

var alpha, DeadStones, fs, Grid, ilpha, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
ilpha = require('./util').ilpha
opponent = require('./util').opponent

fs = require('kxk').fs
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
        var dg, dp, g

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
        for (var _101_15_ = 0; _101_15_ < list.length; _101_15_++)
        {
            ai = list[_101_15_]
            var list1 = _k_.list(b.areas)
            for (var _102_19_ = 0; _102_19_ < list1.length; _102_19_++)
            {
                bi = list1[_102_19_]
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
        var ch, ci, fi, gi, _108_33_

        if ((g.chain != null))
        {
            return g.chain
        }
        fi = this.grps.indexOf(g)
        var list = _k_.list(this.chains)
        for (var _110_15_ = 0; _110_15_ < list.length; _110_15_++)
        {
            ch = list[_110_15_]
            ci = this.chains.indexOf(ch)
            var list1 = _k_.list(ch.grps)
            for (var _112_19_ = 0; _112_19_ < list1.length; _112_19_++)
            {
                gi = list1[_112_19_]
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
        var ai, aliveOpponent, ar, battle, ch, ci, deadOpponent, g, gi, li, n, oc, ownedAreas, undecided

        this.chains = []
        var list = _k_.list(this.grps)
        for (var _126_14_ = 0; _126_14_ < list.length; _126_14_++)
        {
            g = list[_126_14_]
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
                        for (var _133_31_ = 0; _133_31_ < list1.length; _133_31_++)
                        {
                            li = list1[_133_31_]
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
                for (var _141_23_ = 0; _141_23_ < list2.length; _141_23_++)
                {
                    li = list2[_141_23_]
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
        for (var _151_15_ = 0; _151_15_ < list3.length; _151_15_++)
        {
            ch = list3[_151_15_]
            var list4 = _k_.list(this.chains)
            for (var _152_19_ = 0; _152_19_ < list4.length; _152_19_++)
            {
                oc = list4[_152_19_]
                if (ch !== oc)
                {
                    var list5 = _k_.list(ch.grps)
                    for (var _154_27_ = 0; _154_27_ < list5.length; _154_27_++)
                    {
                        gi = list5[_154_27_]
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
        for (var _165_15_ = 0; _165_15_ < list6.length; _165_15_++)
        {
            ch = list6[_165_15_]
            ch.areas = []
            ch.posl = []
            ch.eyes = []
            ch.stone = this.grps[ch.grps[0]].stone
            var list7 = _k_.list(ch.grps)
            for (var _170_19_ = 0; _170_19_ < list7.length; _170_19_++)
            {
                gi = list7[_170_19_]
                ch.posl = ch.posl.concat(this.grps[gi].posl)
                var list8 = _k_.list(this.grps[gi].areas)
                for (var _172_23_ = 0; _172_23_ < list8.length; _172_23_++)
                {
                    ai = list8[_172_23_]
                    if (!(_k_.in(ai,ch.areas)))
                    {
                        ch.areas.push(ai)
                    }
                }
                var list9 = _k_.list(this.grps[gi].eyes)
                for (var _174_23_ = 0; _174_23_ < list9.length; _174_23_++)
                {
                    ai = list9[_174_23_]
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
        for (var _193_15_ = 0; _193_15_ < list10.length; _193_15_++)
        {
            ch = list10[_193_15_]
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
        for (var _205_15_ = 0; _205_15_ < list11.length; _205_15_++)
        {
            ai = list11[_205_15_]
            this.areaBattle(ai)
        }
        var list12 = _k_.list(this.chains)
        for (var _208_15_ = 0; _208_15_ < list12.length; _208_15_++)
        {
            ch = list12[_208_15_]
            if (!ch.alive && !ch.dead)
            {
                this.chainBattle(ch)
            }
        }
        undecided = this.chains.filter(function (ch)
        {
            return !ch.alive && !ch.dead
        })
        console.log(_k_.noon(undecided))
        var list13 = _k_.list(undecided)
        for (var _216_15_ = 0; _216_15_ < list13.length; _216_15_++)
        {
            ch = list13[_216_15_]
            ownedAreas = 0
            var list14 = _k_.list(ch.areas)
            for (var _220_19_ = 0; _220_19_ < list14.length; _220_19_++)
            {
                ai = list14[_220_19_]
                aliveOpponent = 0
                deadOpponent = 0
                ar = this.areas[ai]
                var list15 = _k_.list(ar.grps)
                for (var _224_23_ = 0; _224_23_ < list15.length; _224_23_++)
                {
                    gi = list15[_224_23_]
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
        console.log(this.chainString.apply(this,this.chains))
        return this.deadOrAlive()
    }

    Score.prototype["chainBattle"] = function (ch)
    {
        var ai, lostAreas, oc, sameAreas

        console.log(`chainBattle ${this.chains.indexOf(ch)}`,ch)
        var list = _k_.list(this.chains)
        for (var _255_15_ = 0; _255_15_ < list.length; _255_15_++)
        {
            oc = list[_255_15_]
            if (oc !== ch && !oc.dead)
            {
                lostAreas = []
                sameAreas = []
                var list1 = _k_.list(ch.areas)
                for (var _259_23_ = 0; _259_23_ < list1.length; _259_23_++)
                {
                    ai = list1[_259_23_]
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
                    console.log('lost all areas!')
                    this.deadChains([ch])
                    return
                }
                if (sameAreas.length === ch.areas.length && oc.areas.length > ch.areas.length)
                {
                    console.log('shares all areas and has less!')
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
        for (var _281_15_ = 0; _281_15_ < list.length; _281_15_++)
        {
            ch = list[_281_15_]
            ch.dead = true
            var list1 = _k_.list(ch.grps)
            for (var _283_19_ = 0; _283_19_ < list1.length; _283_19_++)
            {
                gi = list1[_283_19_]
                console.log('dead',this.grps[gi].key)
                this.grps[gi].state = 'dead'
            }
        }
    }

    Score.prototype["aliveChains"] = function (chains)
    {
        var ch, gi

        var list = _k_.list(chains)
        for (var _289_15_ = 0; _289_15_ < list.length; _289_15_++)
        {
            ch = list[_289_15_]
            ch.alive = true
            var list1 = _k_.list(ch.grps)
            for (var _291_19_ = 0; _291_19_ < list1.length; _291_19_++)
            {
                gi = list1[_291_19_]
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
        for (var _320_15_ = 0; _320_15_ < list.length; _320_15_++)
        {
            ch = list[_320_15_]
            if (ch.stone === stone.white)
            {
                wc.push(ch)
            }
            if (ch.stone === stone.black)
            {
                bc.push(ch)
            }
            var list1 = _k_.list(ch.grps)
            for (var _323_19_ = 0; _323_19_ < list1.length; _323_19_++)
            {
                gi = list1[_323_19_]
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
        for (var _356_15_ = 0; _356_15_ < list.length; _356_15_++)
        {
            ag = list[_356_15_]
            var list1 = _k_.list(ag.areas)
            for (var _357_19_ = 0; _357_19_ < list1.length; _357_19_++)
            {
                ai = list1[_357_19_]
                challenged = false
                aa = this.areas[ai]
                var list2 = _k_.list(aa.grps)
                for (var _360_23_ = 0; _360_23_ < list2.length; _360_23_++)
                {
                    gi = list2[_360_23_]
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
        for (var _388_14_ = 0; _388_14_ < list.length; _388_14_++)
        {
            g = list[_388_14_]
            console.log(g.state,g.key)
        }
        this.deadOrAlive()
        points = _k_.copy(this.captures)
        console.log(points)
        var list1 = _k_.list(this.areas)
        for (var _408_14_ = 0; _408_14_ < list1.length; _408_14_++)
        {
            a = list1[_408_14_]
            if (_k_.in(a.color,'wb'))
            {
                points[stoneColor[a.color]] += a.posl.length
            }
        }
        console.log(points)
        var list2 = _k_.list(dead)
        for (var _414_15_ = 0; _414_15_ < list2.length; _414_15_++)
        {
            dg = list2[_414_15_]
            var list3 = _k_.list(dg.posl)
            for (var _415_19_ = 0; _415_19_ < list3.length; _415_19_++)
            {
                dp = list3[_415_19_]
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
        for (var _435_14_ = 0; _435_14_ < list.length; _435_14_++)
        {
            a = list[_435_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _437_18_ = 0; _437_18_ < list1.length; _437_18_++)
            {
                n = list1[_437_18_]
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
        for (var _450_14_ = 0; _450_14_ < list.length; _450_14_++)
        {
            a = list[_450_14_]
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
        for (var _455_14_ = 0; _455_14_ < list.length; _455_14_++)
        {
            g = list[_455_14_]
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
        for (var _500_14_ = 0; _500_14_ < list.length; _500_14_++)
        {
            c = list[_500_14_]
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
        for (var _528_14_ = 0; _528_14_ < list.length; _528_14_++)
        {
            n = list[_528_14_]
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
        for (var _534_14_ = 0; _534_14_ < list.length; _534_14_++)
        {
            d = list[_534_14_]
            if (g.stone === this.stoneAt(d))
            {
                var list1 = _k_.list(this.posNeighbors(d))
                for (var _536_22_ = 0; _536_22_ < list1.length; _536_22_++)
                {
                    n = list1[_536_22_]
                    if (_k_.in(n,g.neighbors) && stone.empty === this.stoneAt(n))
                    {
                        bad = false
                        var list2 = _k_.list(g.eyes)
                        for (var _539_31_ = 0; _539_31_ < list2.length; _539_31_++)
                        {
                            ei = list2[_539_31_]
                            if (_k_.in(n,this.areas[ei].posl) && this.areas[ei].posl.length === 1)
                            {
                                bad = true
                            }
                        }
                        var list3 = _k_.list(g.areas)
                        for (var _542_31_ = 0; _542_31_ < list3.length; _542_31_++)
                        {
                            ai = list3[_542_31_]
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
            for (var _554_18_ = 0; _554_18_ < list.length; _554_18_++)
            {
                n = list[_554_18_]
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
        for (var _564_15_ = 0; _564_15_ < list.length; _564_15_++)
        {
            gi = list[_564_15_]
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
            for (var _586_19_ = 0; _586_19_ < list.length; _586_19_++)
            {
                ai = list[_586_19_]
                a = this.areas[ai]
                var list1 = _k_.list(a.grps)
                for (var _588_23_ = 0; _588_23_ < list1.length; _588_23_++)
                {
                    gi = list1[_588_23_]
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
                for (var _596_22_ = 0; _596_22_ < list2.length; _596_22_++)
                {
                    f = list2[_596_22_]
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
        for (var _645_14_ = 0; _645_14_ < list.length; _645_14_++)
        {
            n = list[_645_14_]
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
                for (var _667_23_ = 0; _667_23_ < list.length; _667_23_++)
                {
                    gp = list[_667_23_]
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
            for (var _679_18_ = 0; _679_18_ < list.length; _679_18_++)
            {
                n = list[_679_18_]
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
        for (var _696_14_ = 0; _696_14_ < list.length; _696_14_++)
        {
            p = list[_696_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _697_18_ = 0; _697_18_ < list1.length; _697_18_++)
            {
                n = list1[_697_18_]
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
        for (var _705_14_ = 0; _705_14_ < list.length; _705_14_++)
        {
            p = list[_705_14_]
            var list1 = _k_.list(this.posNeighbors(p))
            for (var _706_19_ = 0; _706_19_ < list1.length; _706_19_++)
            {
                pn = list1[_706_19_]
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
        for (var _718_18_ = 0; _718_18_ < list.length; _718_18_++)
        {
            x = list[_718_18_][0]
            y = list[_718_18_][1]
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
        for (var _733_14_ = 0; _733_14_ < list.length; _733_14_++)
        {
            p = list[_733_14_]
            var list1 = _k_.list(this.poslist(this.diagonals(this.coord(p))))
            for (var _734_18_ = 0; _734_18_ < list1.length; _734_18_++)
            {
                d = list1[_734_18_]
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
        for (var _742_18_ = 0; _742_18_ < list.length; _742_18_++)
        {
            x = list[_742_18_][0]
            y = list[_742_18_][1]
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
        for (var _764_17_ = y = 0, _764_21_ = this.size; (_764_17_ <= _764_21_ ? y < this.size : y > this.size); (_764_17_ <= _764_21_ ? ++y : --y))
        {
            for (var _765_21_ = x = 0, _765_25_ = this.size; (_765_21_ <= _765_25_ ? x < this.size : x > this.size); (_765_21_ <= _765_25_ ? ++x : --x))
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
        for (var _773_14_ = 0; _773_14_ < list.length; _773_14_++)
        {
            n = list[_773_14_]
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
        for (var _789_17_ = y = 0, _789_21_ = this.size; (_789_17_ <= _789_21_ ? y < this.size : y > this.size); (_789_17_ <= _789_21_ ? ++y : --y))
        {
            for (var _790_21_ = x = 0, _790_25_ = this.size; (_790_21_ <= _790_25_ ? x < this.size : x > this.size); (_790_21_ <= _790_25_ ? ++x : --x))
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
        for (var _805_17_ = y = 0, _805_21_ = this.size; (_805_17_ <= _805_21_ ? y < this.size : y > this.size); (_805_17_ <= _805_21_ ? ++y : --y))
        {
            for (var _806_21_ = x = 0, _806_25_ = this.size; (_806_21_ <= _806_25_ ? x < this.size : x > this.size); (_806_21_ <= _806_25_ ? ++x : --x))
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
        for (var _826_14_ = 0; _826_14_ < list.length; _826_14_++)
        {
            a = list[_826_14_]
            var list1 = _k_.list(a.posl)
            for (var _827_19_ = 0; _827_19_ < list1.length; _827_19_++)
            {
                aa = list1[_827_19_]
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
        for (var _834_14_ = 0; _834_14_ < list.length; _834_14_++)
        {
            a = list[_834_14_]
            var list1 = _k_.list(a.posl)
            for (var _835_19_ = 0; _835_19_ < list1.length; _835_19_++)
            {
                aa = list1[_835_19_]
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
        for (var _840_15_ = 0; _840_15_ < list2.length; _840_15_++)
        {
            gr = list2[_840_15_]
            var list3 = _k_.list(gr.posl)
            for (var _841_19_ = 0; _841_19_ < list3.length; _841_19_++)
            {
                gg = list3[_841_19_]
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
        for (var _856_15_ = 0; _856_15_ < list.length; _856_15_++)
        {
            gr = list[_856_15_]
            var list1 = _k_.list(gr.posl)
            for (var _857_19_ = 0; _857_19_ < list1.length; _857_19_++)
            {
                gg = list1[_857_19_]
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
        for (var _864_15_ = 0; _864_15_ < list.length; _864_15_++)
        {
            gr = list[_864_15_]
            var list1 = _k_.list(gr.posl)
            for (var _865_19_ = 0; _865_19_ < list1.length; _865_19_++)
            {
                gg = list1[_865_19_]
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
        for (var _884_15_ = 0; _884_15_ < list.length; _884_15_++)
        {
            gr = list[_884_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _886_23_ = 0; _886_23_ < list1.length; _886_23_++)
                {
                    gg = list1[_886_23_]
                    c = (arguments[idx].stone === '○' ? '◻' : '◼')
                    grid.set(gg,this.rainbow(idx,c))
                }
            }
            else
            {
                var list2 = _k_.list(gr.posl)
                for (var _890_23_ = 0; _890_23_ < list2.length; _890_23_++)
                {
                    gg = list2[_890_23_]
                    grid.set(gg,_k_.w2(grid.at(gg)))
                }
            }
        }
        var list3 = _k_.list(this.areas)
        for (var _892_15_ = 0; _892_15_ < list3.length; _892_15_++)
        {
            ar = list3[_892_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ar)))
            {
                var list4 = _k_.list(ar.posl)
                for (var _894_23_ = 0; _894_23_ < list4.length; _894_23_++)
                {
                    aa = list4[_894_23_]
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
        for (var _901_15_ = 0; _901_15_ < list.length; _901_15_++)
        {
            gr = list[_901_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _903_23_ = 0; _903_23_ < list1.length; _903_23_++)
                {
                    gg = list1[_903_23_]
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
        for (var _912_15_ = 0; _912_15_ < list.length; _912_15_++)
        {
            ch = list[_912_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ch)))
            {
                var list1 = _k_.list(ch.posl)
                for (var _914_23_ = 0; _914_23_ < list1.length; _914_23_++)
                {
                    cp = list1[_914_23_]
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
        for (var _928_17_ = i = 0, _928_21_ = as.length; (_928_17_ <= _928_21_ ? i < as.length : i > as.length); (_928_17_ <= _928_21_ ? ++i : --i))
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
        for (var _946_17_ = i = 0, _946_21_ = as.length; (_946_17_ <= _946_21_ ? i < as.length : i > as.length); (_946_17_ <= _946_21_ ? ++i : --i))
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