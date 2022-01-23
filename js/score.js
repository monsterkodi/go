// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, dbg: function (f,l,c,m,...a) { console.log(f + ':' + l + ':' + c + (m ? ' ' + m + '\n' : '\n') + a.map(function (a) { return _k_.noon(a) }).join(' '))}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }}

var alpha, Grid, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
opponent = require('./util').opponent

noon = require('kxk').noon

Grid = require('./grid')

Score = (function ()
{
    function Score (size)
    {
        this.size = size
    
        this["pos"] = this["pos"].bind(this)
        this["coord"] = this["coord"].bind(this)
        this["valid"] = this["valid"].bind(this)
        this["stoneAt"] = this["stoneAt"].bind(this)
        this.grid = new Grid(this.size)
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
        var a, dead, final, finalScore, g, gi, gl, markDead, n, o, s, score

        _k_.profile('calcScore')
        this.grps = []
        this.areas = []
        for (s in this.allGroups())
        {
            gl = this.allGroups()[s]
            var list = _k_.list(gl)
            for (var _52_18_ = 0; _52_18_ < list.length; _52_18_++)
            {
                g = list[_52_18_]
                n = this.group_neighbors(g)
                if (s === stone.empty)
                {
                    this.areas.push({area:g,key:g.join(' '),grps:[],color:this.areaColor(g),state:'neutral',neighbors:n})
                }
                else
                {
                    this.grps.push({stone:s,group:g,areas:[],libs:n.filter((function (p)
                    {
                        return stone.empty === this.stoneAt(this.coord(p))
                    }).bind(this)).length,neighbors:n,key:g.join(' '),state:'unknown'})
                }
            }
        }
        dead = false
        score = this.clone()
        markDead = function (g)
        {
            var p

            dead = true
            g.state = 'dead'
            var list1 = _k_.list(g.group)
            for (var _78_18_ = 0; _78_18_ < list1.length; _78_18_++)
            {
                p = list1[_78_18_]
                score.captures[opponent[g.stone]]++
                score.grid.set(p,stone.empty)
            }
        }
        if (root)
        {
            this.linkAreas()
            var list1 = _k_.list(this.grps)
            for (var _84_18_ = 0; _84_18_ < list1.length; _84_18_++)
            {
                g = list1[_84_18_]
                if (g.areas.length === 1)
                {
                    a = this.areas[g.areas[0]]
                    var list2 = _k_.list(a.grps)
                    for (var _87_27_ = 0; _87_27_ < list2.length; _87_27_++)
                    {
                        gi = list2[_87_27_]
                        o = this.grps[gi]
                        if (o.stone !== g.stone && o.areas.length > 1)
                        {
                            markDead(g)
                            break
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
            var list3 = _k_.list(this.grps)
            for (var _98_18_ = 0; _98_18_ < list3.length; _98_18_++)
            {
                g = list3[_98_18_]
                if (g.libs === 1)
                {
                    markDead(g)
                }
            }
            final = score.calcScore(this)
            var list4 = _k_.list(final.areas)
            for (var _106_18_ = 0; _106_18_ < list4.length; _106_18_++)
            {
                a = list4[_106_18_]
                if (a.color !== '.')
                {
                    final.captures[stoneColor[a.color]] += a.area.length
                }
            }
            var list5 = _k_.list(this.grps)
            for (var _110_18_ = 0; _110_18_ < list5.length; _110_18_++)
            {
                g = list5[_110_18_]
                if (g.state === 'unknown')
                {
                    if (stone.empty === final.grid.at(g.group[0]))
                    {
                        g.state = 'dead'
                    }
                }
            }
            var list6 = _k_.list(this.areas)
            for (var _115_18_ = 0; _115_18_ < list6.length; _115_18_++)
            {
                a = list6[_115_18_]
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
            _k_.profilend('calcScore')
            return _k_.dbg(".", 123, 12, "finalScore", finalScore)
        }
        else if (dead)
        {
            _k_.profilend('calcScore')
            return final
        }
        else
        {
            _k_.profilend('calcScore')
            return this
        }
    }

    Score.prototype["linkAreas"] = function ()
    {
        var a, ai, g, gi, n

        var list = _k_.list(this.areas)
        for (var _138_14_ = 0; _138_14_ < list.length; _138_14_++)
        {
            a = list[_138_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _140_18_ = 0; _140_18_ < list1.length; _140_18_++)
            {
                n = list1[_140_18_]
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
                }
            }
        }
    }

    Score.prototype["areaAt"] = function (p)
    {
        var g

        var list = _k_.list(this.areas)
        for (var _150_14_ = 0; _150_14_ < list.length; _150_14_++)
        {
            g = list[_150_14_]
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
        for (var _156_14_ = 0; _156_14_ < list.length; _156_14_++)
        {
            g = list[_156_14_]
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
        if (!(_k_.in('○●',sl)) && !(_k_.in('●○',sl)) && sl.length > 0)
        {
            c = stoneColor[sl[0]][0]
            if (sl.length === g.length)
            {
                return c
            }
            else
            {
                return '.'
            }
        }
        else
        {
            return '.'
        }
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
            if (!(_k_.in('○●',p)) && !(_k_.in('●○',p)) && p.length > 0)
            {
                return p[0]
            }
        }
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
                n = this.group_neighbors(g)
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
        for (var _232_14_ = 0; _232_14_ < list.length; _232_14_++)
        {
            n = list[_232_14_]
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
            for (var _254_19_ = 0; _254_19_ < list.length; _254_19_++)
            {
                gp = list[_254_19_]
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
            for (var _266_18_ = 0; _266_18_ < list.length; _266_18_++)
            {
                n = list[_266_18_]
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

    Score.prototype["group_neighbors"] = function (g)
    {
        var gn, n, p

        gn = []
        var list = _k_.list(g)
        for (var _283_14_ = 0; _283_14_ < list.length; _283_14_++)
        {
            p = list[_283_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _284_18_ = 0; _284_18_ < list1.length; _284_18_++)
            {
                n = list1[_284_18_]
                if (!(_k_.in(n,g)) && !(_k_.in(n,gn)))
                {
                    gn.push(n)
                }
            }
        }
        return gn
    }

    Score.prototype["neighbors"] = function (c)
    {
        var n, ns, x, y

        ns = []
        var list = [[-1,0],[1,0],[0,-1],[0,1]]
        for (var _292_18_ = 0; _292_18_ < list.length; _292_18_++)
        {
            x = list[_292_18_][0]
            y = list[_292_18_][1]
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
        for (var _314_17_ = y = 0, _314_21_ = this.size; (_314_17_ <= _314_21_ ? y < this.size : y > this.size); (_314_17_ <= _314_21_ ? ++y : --y))
        {
            for (var _315_21_ = x = 0, _315_25_ = this.size; (_315_21_ <= _315_25_ ? x < this.size : x > this.size); (_315_21_ <= _315_25_ ? ++x : --x))
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
        for (var _323_14_ = 0; _323_14_ < list.length; _323_14_++)
        {
            n = list[_323_14_]
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
        for (var _339_17_ = y = 0, _339_21_ = this.size; (_339_17_ <= _339_21_ ? y < this.size : y > this.size); (_339_17_ <= _339_21_ ? ++y : --y))
        {
            for (var _340_21_ = x = 0, _340_25_ = this.size; (_340_21_ <= _340_25_ ? x < this.size : x > this.size); (_340_21_ <= _340_25_ ? ++x : --x))
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
        for (var _354_17_ = y = 0, _354_21_ = this.size; (_354_17_ <= _354_21_ ? y < this.size : y > this.size); (_354_17_ <= _354_21_ ? ++y : --y))
        {
            for (var _355_21_ = x = 0, _355_25_ = this.size; (_355_21_ <= _355_25_ ? x < this.size : x > this.size); (_355_21_ <= _355_25_ ? ++x : --x))
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

    return Score
})()

module.exports = Score