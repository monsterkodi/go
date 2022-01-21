// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var alpha, Grid, kstrcnt, Score, stone, stoneColor

stoneColor = require('./util').stoneColor
stone = require('./util').stone
alpha = require('./util').alpha

noon = require('kxk').noon

Grid = require('./grid')

kstrcnt = function (s, c)
{
    var m

    m = s.match(new RegExp(c,'g'))
    return ((m != null) ? m.length : 0)
}

Score = (function ()
{
    function Score ()
    {}

    Score.prototype["calcScore"] = function ()
    {
        var allg, areas, b, g, gl, grid, grps, p, s, w

        grid = new Grid(this.size)
        allg = this.allGroups()
        grps = []
        areas = []
        for (s in allg)
        {
            gl = allg[s]
            var list = _k_.list(gl)
            for (var _32_18_ = 0; _32_18_ < list.length; _32_18_++)
            {
                g = list[_32_18_]
                if (s === stone.empty)
                {
                    areas.push({area:g,key:g.join(' '),grps:[],color:this.areaColor(g),state:'neutral'})
                    var list1 = _k_.list(g)
                    for (var _40_26_ = 0; _40_26_ < list1.length; _40_26_++)
                    {
                        p = list1[_40_26_]
                        grid.set(p,areas.slice(-1)[0].color)
                    }
                }
                else
                {
                    grps.push({stone:s,group:g,areas:[],neighbors:this.group_neighbors(g),key:g.join(' '),state:'unknown'})
                    var list2 = _k_.list(g)
                    for (var _49_26_ = 0; _49_26_ < list2.length; _49_26_++)
                    {
                        p = list2[_49_26_]
                        grid.set(p,s)
                    }
                }
            }
        }
        console.log(grid.toString())
        console.log('%c areas','font-size: 20px; color:red;')
        console.log(_k_.noon(areas))
        console.log('%c groups','font-size: 20px; color:green;')
        console.log(_k_.noon(grps))
        w = kstrcnt(grid.grid,'w')
        b = kstrcnt(grid.grid,'b')
        console.log(w,b)
        return grid
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
        for (var _138_14_ = 0; _138_14_ < list.length; _138_14_++)
        {
            n = list[_138_14_]
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
            for (var _160_19_ = 0; _160_19_ < list.length; _160_19_++)
            {
                gp = list[_160_19_]
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
            for (var _172_18_ = 0; _172_18_ < list.length; _172_18_++)
            {
                n = list[_172_18_]
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
        for (var _189_14_ = 0; _189_14_ < list.length; _189_14_++)
        {
            p = list[_189_14_]
            var list1 = _k_.list(this.poslist(this.neighbors(this.coord(p))))
            for (var _190_18_ = 0; _190_18_ < list1.length; _190_18_++)
            {
                n = list1[_190_18_]
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
        for (var _197_18_ = 0; _197_18_ < list.length; _197_18_++)
        {
            x = list[_197_18_][0]
            y = list[_197_18_][1]
            n = [c[0] + x,c[1] + y]
            if (this.valid(n))
            {
                ns.push(n)
            }
        }
        return ns
    }

    Score.prototype["allPos"] = function ()
    {
        var p, x, y

        p = []
        for (var _211_17_ = y = 0, _211_21_ = this.size; (_211_17_ <= _211_21_ ? y < this.size : y > this.size); (_211_17_ <= _211_21_ ? ++y : --y))
        {
            for (var _212_21_ = x = 0, _212_25_ = this.size; (_212_21_ <= _212_25_ ? x < this.size : x > this.size); (_212_21_ <= _212_25_ ? ++x : --x))
            {
                p.push(alpha[x] + (this.size - y))
            }
        }
        return p
    }

    return Score
})()

module.exports = Score