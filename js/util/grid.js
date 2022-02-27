// monsterkodi/kode 0.243.0

var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, isArr: function (o) {return Array.isArray(o)}, dbg: function (f,l,c,m,...a) { console.log(f + ':' + l + ':' + c + (m ? ' ' + m + '\n' : '\n') + a.map(function (a) { return _k_.noon(a) }).join(' '))}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, each_r: function (o) {return Array.isArray(o) ? [] : typeof o == 'string' ? o.split('') : {}}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }};_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3))

var alpha, Grid, splice, stone

splice = require('./util').splice
alpha = require('./util').alpha
stone = require('./util').stone


Grid = (function ()
{
    function Grid (a = 0)
    {
        if (_k_.isStr(a))
        {
            this.fromString(a)
        }
        else
        {
            this.size = a
            this.clear()
        }
    }

    Grid.prototype["copy"] = function (g)
    {
        this.size = g.size
        return this.rows = _k_.clone(g.rows)
    }

    Grid.prototype["clear"] = function (size)
    {
        var row, x, y

        if ((size != null))
        {
            this.size = size
        }
        this.rows = []
        for (var _35_17_ = y = 0, _35_21_ = this.size; (_35_17_ <= _35_21_ ? y < this.size : y > this.size); (_35_17_ <= _35_21_ ? ++y : --y))
        {
            row = []
            for (var _37_21_ = x = 0, _37_25_ = this.size; (_37_21_ <= _37_25_ ? x < this.size : x > this.size); (_37_21_ <= _37_25_ ? ++x : --x))
            {
                row.push(' ')
            }
            this.rows.push(row)
        }
        return this
    }

    Grid.prototype["rowCol"] = function (x, y)
    {
        var c, r

        if (!(y != null))
        {
            if (_k_.isArr(x))
            {
                c = x[0]
                r = x[1]
            }
            else if (_k_.isStr(x))
            {
                c = alpha.indexOf(x[0].toUpperCase())
                r = this.size - parseInt(x.slice(1))
            }
            else
            {
                _k_.dbg(".", 59, 20, null, 'dafuk')
            }
        }
        else
        {
            c = x
            r = y
        }
        if ((0 <= c && c < this.size) && (0 <= r && r < this.size))
        {
            return [r,c]
        }
        else
        {
            return []
        }
    }

    Grid.prototype["at"] = function (x, y)
    {
        var c, r

        var _77_14_ = this.rowCol(x,y); r = _77_14_[0]; c = _77_14_[1]

        if ((r != null))
        {
            return this.rows[r][c]
        }
    }

    Grid.prototype["set"] = function (x, y, s)
    {
        var c, r

        if (!(s != null))
        {
            var _88_29_ = [y,undefined]; s = _88_29_[0]; y = _88_29_[1]

        }
        var _90_14_ = this.rowCol(x,y); r = _90_14_[0]; c = _90_14_[1]

        if ((r != null))
        {
            return this.rows[r][c] = s
        }
    }

    Grid.prototype["fromString"] = function (str)
    {
        var c, spl, t, x, y

        spl = str.split('\n')
        while (_k_.trim(spl.slice(-1)[0]).length === 0)
        {
            spl.pop()
        }
        if (_k_.ltrim(spl[0])[0] === 'A')
        {
            spl.shift()
            spl.pop()
            t = (spl.slice(-1)[0][0] !== ' ' ? 2 : 3)
            spl = spl.map(function (s)
            {
                return s.slice(t)
            })
            spl = spl.map(function (s)
            {
                return s.slice(0, spl.length * 2)
            })
        }
        else if (spl[0][0] === '┌')
        {
            spl.shift()
            spl.pop()
            spl = spl.map(function (s)
            {
                return s.slice(2)
            })
            spl = spl.map(function (s)
            {
                return s.slice(0, spl.length * 2)
            })
        }
        this.size = spl.length
        this.clear()
        for (var _123_17_ = y = 0, _123_21_ = this.size; (_123_17_ <= _123_21_ ? y < this.size : y > this.size); (_123_17_ <= _123_21_ ? ++y : --y))
        {
            if (y < spl.length)
            {
                for (var _125_25_ = x = 0, _125_29_ = this.size; (_125_25_ <= _125_29_ ? x < this.size : x > this.size); (_125_25_ <= _125_29_ ? ++x : --x))
                {
                    if (x * 2 < spl[y].length)
                    {
                        c = spl[y][x * 2]
                        if (c === '.')
                        {
                            c = ' '
                        }
                        this.set(x,y,c)
                    }
                }
            }
        }
    }

    Grid.prototype["toString"] = function (legend)
    {
        var ri, row, s

        s = '┌─' + _k_.lpad(this.size * 2,'','─') + '┐'
        var list = _k_.list(this.rows)
        for (ri = 0; ri < list.length; ri++)
        {
            row = list[ri]
            s += '\n│ '
            s += (            (function (o) {
                var r_142_22_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return v + ' '
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_142_22_[k] = m
                    }
                }
                return typeof o == 'string' ? r_142_22_.join('') : r_142_22_
            })(row)).join('')
            s += '│'
            if (legend)
            {
                s += ' ' + (this.size - ri)
            }
        }
        s += '\n'
        s += '└─' + _k_.lpad(this.size * 2,'','─') + '┘'
        if (legend)
        {
            s += '\n ' + (function (o) {
                var r_148_42_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return ' ' + v
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_148_42_[k] = m
                    }
                }
                return typeof o == 'string' ? r_148_42_.join('') : r_148_42_
            })(alpha.slice(0, typeof this.size === 'number' ? this.size : -1))
        }
        return s
    }

    Grid.prototype["toAnsi"] = function (legend)
    {
        var ri, row, s

        if (!global.test)
        {
            return this.toString(legend)
        }
        s = _k_.w2('┌─' + _k_.lpad(this.size * 2,'','─') + '┐')
        var list = _k_.list(this.rows)
        for (ri = 0; ri < list.length; ri++)
        {
            row = list[ri]
            s += '\n' + _k_.w2('│ ')
            s += (            (function (o) {
                var r_158_22_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return v + ' '
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_158_22_[k] = m
                    }
                }
                return typeof o == 'string' ? r_158_22_.join('') : r_158_22_
            })(row)).join('')
            s += _k_.w2('│')
            if (legend)
            {
                s += ' ' + _k_.w3(this.size - ri)
            }
        }
        s += '\n'
        s += _k_.w2('└─' + _k_.lpad(this.size * 2,'','─') + '┘')
        if (legend)
        {
            s += '\n ' + _k_.w3(            (function (o) {
                var r_164_45_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return ' ' + v
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_164_45_[k] = m
                    }
                }
                return typeof o == 'string' ? r_164_45_.join('') : r_164_45_
            })(alpha.slice(0, typeof this.size === 'number' ? this.size : -1)))
        }
        return s
    }

    Grid.prototype["toBinarray"] = function ()
    {
        return this.rows.map(function (r)
        {
            return r.map(function (c)
            {
                switch (c)
                {
                    case stone.black:
                        return 1

                    case stone.white:
                        return -1

                    default:
                        return 0
                }

            })
        })
    }

    return Grid
})()

module.exports = Grid