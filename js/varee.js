// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var elem, post, Varee

elem = require('kxk').elem
noon = require('kxk').noon
post = require('kxk').post

max = Math.max


Varee = (function ()
{
    function Varee (parent, tree, boardsize)
    {
        this.parent = parent
        this.tree = tree
        this.boardsize = boardsize
    
        this["onResize"] = this["onResize"].bind(this)
        this["onTree"] = this["onTree"].bind(this)
        this.div = elem('div',{class:'varee',parent:this.parent})
        this.width = 100
        this.height = 800
        this.canvas = elem('canvas',{class:'treelines',parent:this.div})
        this.ctx = this.canvas.getContext('2d')
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.crs = elem('div',{class:'cursor',parent:this.hlt})
        post.on('resize',this.onResize)
        post.on('tree',this.onTree)
        this.onResize()
    }

    Varee.prototype["onTree"] = function ()
    {
        var color, column, columns, cursor, lines, pos, x, y

        this.stn.innerHTML = ''
        columns = this.tree.toColumns().columns
        cursor = this.tree.toColumns().cursor
        lines = this.tree.toColumns().lines

        var list = _k_.list(columns)
        for (x = 0; x < list.length; x++)
        {
            column = list[x]
            var list1 = _k_.list(column)
            for (y = 0; y < list1.length; y++)
            {
                pos = list1[y]
                switch (pos)
                {
                    case undefined:
                    case '-':
                        break
                    default:
                        color = ['black','white'][y % 2]
                        elem({class:`varii ${color}`,text:pos,parent:this.stn,style:`left:${x * 50}px; top:${y * 50}px;`})
                }

            }
        }
        this.crs.classList.remove('black')
        this.crs.classList.remove('white')
        this.crs.classList.add(color = ['black','white'][cursor.y % 2])
        this.crs.style.left = `${cursor.x * 50 + 25}px`
        this.crs.style.top = `${cursor.y * 50 + 25}px`
        this.crs.scrollIntoViewIfNeeded()
        return this.drawLines(lines)
    }

    Varee.prototype["drawLines"] = function (lines)
    {
        var hl, hlines, mh, mw, vl, vlines

        hlines = lines.hlines
        vlines = lines.vlines

        console.log(_k_.noon(lines))
        this.canvas.width = this.width
        this.canvas.height = this.height
        mw = this.width
        mh = this.height
        this.ctx.strokeStyle = '#800'
        this.ctx.beginPath()
        var list = _k_.list(vlines)
        for (var _85_15_ = 0; _85_15_ < list.length; _85_15_++)
        {
            vl = list[_85_15_]
            this.ctx.moveTo(50 + vl[0][0] * 100 - 2,50 + vl[0][1] * 100)
            this.ctx.lineTo(50 + vl[1][0] * 100 - 2,50 + vl[1][1] * 100)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#ff8'
        this.ctx.beginPath()
        var list1 = _k_.list(vlines)
        for (var _92_15_ = 0; _92_15_ < list1.length; _92_15_++)
        {
            vl = list1[_92_15_]
            this.ctx.moveTo(50 + vl[0][0] * 100 + 2,50 + vl[0][1] * 100)
            this.ctx.lineTo(50 + vl[1][0] * 100 + 2,50 + vl[1][1] * 100)
            mh = _k_.max(mh,100 + vl[1][1] * 100)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#800'
        this.ctx.beginPath()
        var list2 = _k_.list(hlines)
        for (var _100_15_ = 0; _100_15_ < list2.length; _100_15_++)
        {
            hl = list2[_100_15_]
            this.ctx.moveTo(50 + hl[0][0] * 100,50 + hl[0][1] * 100 - 2)
            this.ctx.lineTo(50 + hl[1][0] * 100,50 + hl[1][1] * 100 - 2)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#ff8'
        this.ctx.beginPath()
        var list3 = _k_.list(hlines)
        for (var _107_15_ = 0; _107_15_ < list3.length; _107_15_++)
        {
            hl = list3[_107_15_]
            this.ctx.moveTo(50 + hl[0][0] * 100,50 + hl[0][1] * 100 + 2)
            this.ctx.lineTo(50 + hl[1][0] * 100,50 + hl[1][1] * 100 + 2)
            mw = _k_.max(mw,100 + hl[1][0] * 100)
        }
        this.ctx.stroke()
        if (mw > this.width || mh > this.height)
        {
            this.width = mw
            this.height = mh
            console.log('redraw',this.width,this.height)
            return this.drawLines(lines)
        }
    }

    Varee.prototype["onResize"] = function ()
    {
        var br, rb, tb, w

        br = this.parent.getBoundingClientRect()
        tb = br.height / (this.boardsize + 1) - 2
        rb = tb
        w = _k_.max(0,(br.width - br.height) / 2 - tb)
        this.div.style.width = `${w}px`
        this.div.style.top = `${tb}px`
        this.div.style.bottom = `${tb}px`
        return this.div.style.right = `${rb}px`
    }

    Varee.prototype["remove"] = function ()
    {
        if (!this.div)
        {
            return
        }
        post.off('resize',this.onResize)
        post.off('tree',this.onTree)
        this.parent.removeChild(this.div)
        return delete this.div
    }

    return Varee
})()

module.exports = Varee