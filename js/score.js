// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var alpha, Grid, opponent, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha
opponent = require('./util').opponent

noon = require('kxk').noon

Grid = require('./grid')

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
        var a, dead, final, g, gi, gl, markDead, n, o, s, score

        this.grps = []
        this.areas = []
        for (s in this.allGroups())
        {
            gl = this.allGroups()[s]
            var list = _k_.list(gl)
            for (var _53_18_ = 0; _53_18_ < list.length; _53_18_++)
            {
                g = list[_53_18_]
                n = this.group_neighbors(g)
                if (s === stone.empty)
                {
                    this.areas.push({area:g,key:g.join(' '),grps:[],color:this.areaColor(g),state:'neutral',neighbors:n})
                }
                else
                {
                    this.grps.push({stone:s,group:g,areas:[],eyes:[],libs:n.filter((function (p)
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
            for (var _80_18_ = 0; _80_18_ < list1.length; _80_18_++)
            {
                p = list1[_80_18_]
                score.captures[opponent[g.stone]]++
                score.grid.set(p,stone.empty)
            }
        }
        if (root)
        {
            this.linkAreas()
            console.log(_k_.noon(this.areas))
            var list1 = _k_.list(this.grps)
            for (var _88_18_ = 0; _88_18_ < list1.length; _88_18_++)
            {
                g = list1[_88_18_]
                if (g.eyes.length < 1)
                {
                    a = this.areas[g.areas[0]]
                    var list2 = _k_.list(a.grps)
                    for (var _94_27_ = 0; _94_27_ < list2.length; _94_27_++)
                    {
                        gi = list2[_94_27_]
                        o = this.grps[gi]
                        if (o.stone !== g.stone && o.eyes.length > 1)
                        {
                            console.log('dead',g.group[0])
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
            for (var _106_18_ = 0; _106_18_ < list3.length; _106_18_++)
            {
                g = list3[_106_18_]
                if (g.libs === 1)
                {
                    markDead(g)
                }
            }
            final = score.calcScore(this)
            var list4 = _k_.list(final.areas)
            for (var _114_18_ = 0; _114_18_ < list4.length; _114_18_++)
            {
                a = list4[_114_18_]
                if (a.color !== '.')
                {
                    final.captures[stoneColor[a.color]] += a.area.length
                }
            }
            var list5 = _k_.list(this.grps)
            for (var _118_18_ = 0; _118_18_ < list5.length; _118_18_++)
            {
                g = list5[_118_18_]
                if (g.state === 'unknown')
                {
                    if (stone.empty === final.grid.at(g.group[0]))
                    {
                        g.state = 'dead'
                    }
                }
            }
            var list6 = _k_.list(this.areas)
            for (var _123_18_ = 0; _123_18_ < list6.length; _123_18_++)
            {
                a = list6[_123_18_]
                a.color = final.areaAt(a.area[0]).color
            }
            if (final.captures.white > final.captures.black)
            {
                this.finalScore = 'W+' + (final.captures.white - final.captures.black)
            }
            else
            {
                this.finalScore = 'B+' + (final.captures.black - final.captures.white)
            }
            return this.finalScore
        }
        else if (dead)
        {
            return final
        }
        else
        {
            return this
        }
    }

    Score.prototype["linkAreas"] = function ()
    {
        var a, ai, g, gi, n

        var list = _k_.list(this.areas)
        for (var _146_14_ = 0; _146_14_ < list.length; _146_14_++)
        {
            a = list[_146_14_]
            ai = this.areas.indexOf(a)
            var list1 = _k_.list(a.neighbors)
            for (var _148_18_ = 0; _148_18_ < list1.length; _148_18_++)
            {
                n = list1[_148_18_]
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
        for (var _161_14_ = 0; _161_14_ < list.length; _161_14_++)
        {
            g = list[_161_14_]
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
        for (var _167_14_ = 0; _167_14_ < list.length; _167_14_++)
        {
            g = list[_167_14_]
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
        for (var _243_14_ = 0; _243_14_ < list.length; _243_14_++)
        {
            n = list[_243_14_]
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
            for (var _265_19_ = 0; _265_19_ < list.length; _265_19_++)
            {
                gp = list[_265_19_]
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
            for (var _277_18_ = 0; _277_18_ < list.length; _277_18_++)
            {
                n = list[_277_18_]
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
        for (var _294_14_ = 0; _294_14_ < list.length; _294_14_++)
        {
            p = list[_294_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _295_18_ = 0; _295_18_ < list1.length; _295_18_++)
            {
                n = list1[_295_18_]
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
        for (var _303_18_ = 0; _303_18_ < list.length; _303_18_++)
        {
            x = list[_303_18_][0]
            y = list[_303_18_][1]
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
        for (var _325_17_ = y = 0, _325_21_ = this.size; (_325_17_ <= _325_21_ ? y < this.size : y > this.size); (_325_17_ <= _325_21_ ? ++y : --y))
        {
            for (var _326_21_ = x = 0, _326_25_ = this.size; (_326_21_ <= _326_25_ ? x < this.size : x > this.size); (_326_21_ <= _326_25_ ? ++x : --x))
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
        for (var _334_14_ = 0; _334_14_ < list.length; _334_14_++)
        {
            n = list[_334_14_]
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
        for (var _350_17_ = y = 0, _350_21_ = this.size; (_350_17_ <= _350_21_ ? y < this.size : y > this.size); (_350_17_ <= _350_21_ ? ++y : --y))
        {
            for (var _351_21_ = x = 0, _351_25_ = this.size; (_351_21_ <= _351_25_ ? x < this.size : x > this.size); (_351_21_ <= _351_25_ ? ++x : --x))
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
        for (var _365_17_ = y = 0, _365_21_ = this.size; (_365_17_ <= _365_21_ ? y < this.size : y > this.size); (_365_17_ <= _365_21_ ? ++y : --y))
        {
            for (var _366_21_ = x = 0, _366_25_ = this.size; (_366_21_ <= _366_25_ ? x < this.size : x > this.size); (_366_21_ <= _366_25_ ? ++x : --x))
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