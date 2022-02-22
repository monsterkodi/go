// monsterkodi/kode 0.239.0

var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, clone: function (o,v) { v ??= new Map(); if (Array.isArray(o)) { if (!v.has(o)) {var r = []; v.set(o,r); for (var i=0; i < o.length; i++) {if (!v.has(o[i])) { v.set(o[i],_k_.clone(o[i],v)) }; r.push(v.get(o[i]))}}; return v.get(o) } else if (typeof o == 'string') { if (!v.has(o)) {v.set(o,''+o)}; return v.get(o) } else if (o != null && typeof o == 'object' && o.constructor.name == 'Object') { if (!v.has(o)) { var k, r = {}; v.set(o,r); for (k in o) { if (!v.has(o[k])) { v.set(o[k],_k_.clone(o[k],v)) }; r[k] = v.get(o[k]) }; }; return v.get(o) } else {return o} }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, max: function () { m = -Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }};_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.B3=_k_.k.B256(_k_.k.B(3));_k_.b7=_k_.k.F256(_k_.k.b(7));_k_.y4=_k_.k.F256(_k_.k.y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var kstr, opponent, post, Tree

kstr = require('kxk').kstr
noon = require('kxk').noon
post = require('kxk').post

opponent = require('./util/util').opponent

max = Math.max


Tree = (function ()
{
    function Tree (parent)
    {
        this.parent = parent
    
        this["toPOD"] = this["toPOD"].bind(this)
        if (!this.parent)
        {
            this.cursor = [-1]
        }
        this.id = 0
        this.moves = []
    }

    Tree.prototype["addMove"] = function (pos, captures = [], color)
    {
        var altmoves, mvi, nt, tr, _63_17_

        if (global.test)
        {
            console.log(_k_.r3('add'),_k_.y4(pos))
        }
        tr = this.cursorTree()
        mvi = this.cursor.slice(-1)[0]
        if (mvi > 0 && tr.moves[mvi].pos === '?')
        {
            this.cursor[this.cursor.length - 1]--
            mvi--
        }
        color = (color != null ? color : this.nextColor())
        if (pos.split(' ').length > 1)
        {
            pos = `${pos.split(' ').length}H`
        }
        if (mvi === tr.moves.length - 1)
        {
            this.cursor[this.cursor.length - 1] = tr.moves.length
            tr.moves.push({pos:pos,captures:captures,alt:[],color:color})
        }
        else
        {
            mvi++
            this.cursor[this.cursor.length - 1]++
            if (pos !== tr.moves[mvi].pos)
            {
                altmoves = tr.moves[mvi].alt.map(function (alt)
                {
                    return alt.moves[0].pos
                })
                if (_k_.in(pos,altmoves))
                {
                    this.cursor.push(altmoves.indexOf(pos) + 1)
                    this.cursor.push(0)
                }
                else
                {
                    this.cursor.push(tr.moves[mvi].alt.length + 1)
                    this.cursor.push(0)
                    nt = new Tree(tr)
                    nt.moves.push({pos:pos,captures:captures,alt:[],color:color})
                    tr.moves[mvi].alt.push(nt)
                }
            }
        }
        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["nextColor"] = function ()
    {
        var cm

        return ((cm = this.cursorMove()) ? opponent[cm.color] : 'black')
    }

    Tree.prototype["replay"] = function (moves, id)
    {
        var alt, mi, mv, mvi, pod, td, _76_58_, _89_17_

        this.id = id
    
        var list = _k_.list(moves)
        for (var _75_15_ = 0; _75_15_ < list.length; _75_15_++)
        {
            mv = list[_75_15_]
            this.moves.push({pos:mv.pos,captures:(((_76_58_=mv.captures) != null ? _76_58_ : [])),alt:[],color:mv.color})
        }
        mvi = this.moves.length - ((this.hasNext() ? 2 : 1))
        if (pod = window.stash.get(`tree▸${this.id}`))
        {
            for (mi in pod)
            {
                alt = pod[mi]
                var list1 = _k_.list(alt)
                for (var _82_23_ = 0; _82_23_ < list1.length; _82_23_++)
                {
                    td = list1[_82_23_]
                    if (this.moves[mi].pos !== td.moves[0].pos)
                    {
                        this.moves[mi].alt.push(new Tree(this).fromPOD(td))
                    }
                    else
                    {
                        console.log('skip alt with same move',mi,this.moves[mi].pos,_k_.noon(td))
                    }
                }
            }
        }
        this.cursor = [mvi]
        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["navigate"] = function (dir)
    {
        if (global.test)
        {
            console.log(_k_.g2('nav'),_k_.b7(dir))
        }
        switch (dir)
        {
            case 'up':
                this.navigateUp()
                break
            case 'down':
                this.navigateDown()
                break
            case 'right':
                this.navigateRight()
                break
            case 'left':
                this.navigateLeft()
                break
            case 'leftmost':
                this.navigateLeftmost()
                break
            case 'back':
                this.navigateBack()
                break
            case 'leftup':
                this.navigateLeftUp()
                break
            case 'rightdown':
                this.navigateRightDown()
                break
        }

        if (global.test)
        {
            console.log(this.toColors())
        }
    }

    Tree.prototype["navigateLeftUp"] = function ()
    {
        var ali, mvi

        mvi = this.cursor.slice(-1)[0]
        ali = this.cursor.slice(-2,-1)[0]
        this.navigateLeft()
        if (this.cursor.slice(-2,-1)[0] === ali && mvi === this.cursor.slice(-1)[0])
        {
            return this.navigateUp()
        }
    }

    Tree.prototype["navigateRightDown"] = function ()
    {
        var ali, mvi

        mvi = this.cursor.slice(-1)[0]
        ali = this.cursor.slice(-2,-1)[0]
        this.navigateRight()
        if (this.cursor.slice(-2,-1)[0] === ali && mvi === this.cursor.slice(-1)[0])
        {
            return this.navigateDown()
        }
    }

    Tree.prototype["navigateUp"] = function ()
    {
        var mvi, tr

        tr = this.cursorTree()
        mvi = this.cursor.slice(-1)[0]
        if (mvi > 0)
        {
            this.cursor[this.cursor.length - 1]--
            return this.cursorChanged()
        }
    }

    Tree.prototype["navigateDown"] = function ()
    {
        var mvi, tr

        tr = this.cursorTree()
        mvi = this.cursor.slice(-1)[0]
        if (mvi < tr.moves.length - 1)
        {
            this.cursor[this.cursor.length - 1]++
            return this.cursorChanged()
        }
    }

    Tree.prototype["navigateLeft"] = function ()
    {
        var ali, mvi, tr

        tr = this.cursorTree()
        mvi = this.cursor.slice(-1)[0]
        if (mvi === 0)
        {
            if (tr.parent)
            {
                ali = this.cursor.slice(-2,-1)[0]
                if (ali === 1)
                {
                    this.cursor.pop()
                    this.cursor.pop()
                }
                else
                {
                    this.cursor[this.cursor.length - 2]--
                }
                return this.cursorChanged()
            }
        }
    }

    Tree.prototype["navigateRight"] = function ()
    {
        var ali, mvi, tr

        tr = this.cursorTree()
        mvi = this.cursor.slice(-1)[0]
        if (mvi === 0)
        {
            if (tr.parent)
            {
                ali = this.cursor.slice(-2,-1)[0]
                mvi = this.cursor.slice(-3,-2)[0]
                if (ali < tr.parent.moves[mvi].alt.length)
                {
                    this.cursor[this.cursor.length - 2]++
                    return this.cursorChanged()
                }
            }
        }
        else
        {
            if (tr.moves[mvi].alt.length)
            {
                this.cursor.push(1)
                this.cursor.push(0)
                return this.cursorChanged()
            }
        }
    }

    Tree.prototype["navigateBack"] = function ()
    {
        this.navigateLeftmost()
        return this.navigateUp()
    }

    Tree.prototype["navigateLeftmost"] = function ()
    {
        if (this.cursor.length > 1)
        {
            if (this.cursor.slice(-1)[0] === 0)
            {
                this.cursor.pop()
                this.cursor.pop()
                return this.cursorChanged()
            }
        }
    }

    Tree.prototype["cursorChanged"] = function ()
    {
        var _190_31_

        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["selectGrid"] = function (col, row)
    {
        var columns, dir, hasLeft, hasUp, i, ocol, orow, path, r

        console.log('selectGrid',col,row)
        if (col === 0)
        {
            this.select(row)
            return
        }
        ocol = col
        orow = row
        columns = this.toColumns()
        hasLeft = function ()
        {
            var line

            var list = _k_.list(columns.lines.hlines)
            for (var _212_21_ = 0; _212_21_ < list.length; _212_21_++)
            {
                line = list[_212_21_]
                if ((line[0][1] === line[1][1] && line[1][1] === row))
                {
                    if (line[0][0] < col && line[1][0] >= col)
                    {
                        return true
                    }
                }
            }
        }
        hasUp = function ()
        {
            var line

            var list = _k_.list(columns.lines.vlines)
            for (var _218_21_ = 0; _218_21_ < list.length; _218_21_++)
            {
                line = list[_218_21_]
                if ((line[0][0] === line[1][0] && line[1][0] === col))
                {
                    if (line[0][1] < row && line[1][1] >= row)
                    {
                        return true
                    }
                }
            }
        }
        path = []
        while (col > 0)
        {
            if (hasLeft())
            {
                col--
                if (col >= 0 && columns.columns[col][row] !== '-')
                {
                    path.unshift('right',col,row)
                }
            }
            else if (hasUp())
            {
                path.unshift('down',col,row)
                row--
            }
            else
            {
                console.log('dafuk?')
            }
        }
        r = [path[2],0]
        i = 0
        dir = 'right'
        while (i <= path.length - 3)
        {
            if (path[i] === 'right')
            {
                if (dir === 'right')
                {
                    r[r.length - 1]++
                }
                else
                {
                    r.push(((path[i + 3] === 'down' || path[i - 3] === 'down') ? 1 : 0))
                    dir = 'right'
                }
            }
            else if (path[i] === 'down')
            {
                if (dir === 'down')
                {
                    r[r.length - 1]++
                }
                else
                {
                    r.push(1)
                    dir = 'down'
                }
            }
            i += 3
        }
        if (r.length % 2 === 0)
        {
            r.push(0)
        }
        return this.select.apply(this,r)
    }

    Tree.prototype["select"] = function ()
    {
        var miai

        miai = [].splice.call(arguments,0)
        if (!this.parent)
        {
            return this.cursor = miai
        }
    }

    Tree.prototype["canUndo"] = function ()
    {
        return this.cursor.length === 1 && this.cursor.slice(-1)[0] === this.moves.length - 1
    }

    Tree.prototype["undoMove"] = function (m)
    {
        var u, _272_17_

        this.cursor = [this.cursor[0] - 1]
        u = this.moves.pop()
        if (u.pos !== m.pos)
        {
            console.log('dafuk!')
        }
        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["cursorTree"] = function ()
    {
        var ali, ct, miai, mvi, tr

        if (this.cursor.length === 1)
        {
            return this
        }
        miai = _k_.clone(this.cursor)
        tr = this
        while (miai.length > 1)
        {
            mvi = miai.shift()
            ali = miai.shift()
            if (ct = tr.treeAt(mvi,ali))
            {
                tr = ct
            }
            else
            {
                console.log('cursorTree no tree at?',mvi,ali)
                break
            }
        }
        return tr
    }

    Tree.prototype["cursorMove"] = function ()
    {
        return this.cursorTree().moves[this.cursor.slice(-1)[0]]
    }

    Tree.prototype["deleteCursorMove"] = function ()
    {
        var alts, mvi, tr

        tr = this.cursorTree()
        mvi = this.cursor.slice(-1)[0]
        if (mvi === 0)
        {
            if (tr.parent)
            {
                tr.parent.moves[this.cursor.slice(-3,-2)[0]].alt.splice(this.cursor.slice(-2,-1)[0] - 1,1)
                if (this.cursor.slice(-2,-1)[0] > 1)
                {
                    return this.cursor[this.cursor.length - 2]--
                }
                else
                {
                    this.cursor.pop()
                    return this.cursor.pop()
                }
            }
        }
        else
        {
            if (tr.parent || this.noNext())
            {
                if (!_k_.empty(tr.moves[mvi].alt))
                {
                    console.log(this.toColors())
                    alts = tr.moves[mvi].alt
                    tr.moves.splice.apply(tr.moves,[mvi,tr.moves.length - mvi].concat(alts.shift().moves))
                    tr.moves[mvi].alt = alts
                    console.log(this.toColors())
                }
                else
                {
                    tr.moves = tr.moves.slice(0,mvi)
                    return this.cursor[this.cursor.length - 1]--
                }
            }
        }
    }

    Tree.prototype["noNext"] = function ()
    {
        return this.moves.slice(-1)[0].pos !== '?'
    }

    Tree.prototype["hasNext"] = function ()
    {
        return this.moves.slice(-1)[0].pos === '?'
    }

    Tree.prototype["clearVariations"] = function ()
    {
        var mv, _348_17_

        var list = _k_.list(this.moves)
        for (var _346_15_ = 0; _346_15_ < list.length; _346_15_++)
        {
            mv = list[_346_15_]
            mv.alt = []
        }
        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["cursorVariations"] = function ()
    {
        return []
    }

    Tree.prototype["treeAt"] = function (mvi, ali)
    {
        var mv

        if ((0 <= mvi && mvi < this.moves.length))
        {
            if (ali < 1)
            {
                return this
            }
            mv = this.moves[mvi]
            if ((0 < ali && ali <= mv.alt.length))
            {
                return mv.alt[ali - 1]
            }
        }
        console.log('no tree at',mvi,ali)
    }

    Tree.prototype["depth"] = function ()
    {
        return this.moves.length
    }

    Tree.prototype["width"] = function ()
    {
        var m, t, w

        w = 1
        var list = _k_.list(this.moves)
        for (var _387_14_ = 0; _387_14_ < list.length; _387_14_++)
        {
            m = list[_387_14_]
            var list1 = _k_.list(m.alt)
            for (var _388_18_ = 0; _388_18_ < list1.length; _388_18_++)
            {
                t = list1[_388_18_]
                w += t.width()
            }
        }
        return w
    }

    Tree.prototype["history"] = function ()
    {
        return this.moveHistory().map(function (m)
        {
            return m.pos
        })
    }

    Tree.prototype["moveHistory"] = function ()
    {
        var h, i, tr

        h = []
        tr = this
        i = 0
        while (true)
        {
            h = h.concat(tr.moves.slice(0, typeof this.cursor[i] === 'number' ? this.cursor[i] : -1))
            if (i === this.cursor.length - 1)
            {
                h.push(tr.moves[this.cursor[i]])
                break
            }
            else
            {
                tr = tr.moves[this.cursor[i]].alt[this.cursor[i + 1] - 1]
                i += 2
            }
        }
        return h
    }

    Tree.prototype["rowStrings"] = function (miai)
    {
        var a, i, li, lo, m, mi, mia, ps, rc, s, t, tl, tls, to, tw, _448_28_

        miai = (miai != null ? miai : this.cursor)
        s = []
        a = []
        for (var _429_18_ = mi = 0, _429_22_ = this.moves.length; (_429_18_ <= _429_22_ ? mi < this.moves.length : mi > this.moves.length); (_429_18_ <= _429_22_ ? ++mi : --mi))
        {
            m = this.moves[mi]
            ps = (m.alt.length ? '─' : ' ')
            if (miai.length === 1 && miai[0] === mi)
            {
                s.push(_k_.rpad(4,m.pos + '◂',ps))
            }
            else
            {
                s.push(_k_.rpad(4,m.pos,ps))
            }
            a.push(m.alt)
        }
        to = 0
        lo = 0
        for (var _440_17_ = i = a.length - 1, _440_29_ = 0; (_440_17_ <= _440_29_ ? i <= 0 : i >= 0); (_440_17_ <= _440_29_ ? ++i : --i))
        {
            var list = _k_.list(a[i])
            for (var _441_18_ = 0; _441_18_ < list.length; _441_18_++)
            {
                t = list[_441_18_]
                tw = 4
                li = 0
                mia = a[i].indexOf(t) + 1 === miai[1] && i === miai[0] ? miai.slice(2) : []
                tls = t.rowStrings(mia)
                var list1 = _k_.list(tls)
                for (var _447_23_ = 0; _447_23_ < list1.length; _447_23_++)
                {
                    tl = list1[_447_23_]
                    s[i + li] = ((_448_28_=s[i + li]) != null ? _448_28_ : _k_.rpad(4))
                    s[i + li] = _k_.rpad(lo,s[i + li],(li === 0 ? '─' : ' '))
                    s[i + li] += tl
                    if (li === 0 && a[i].indexOf(t) < a[i].length - 1)
                    {
                        rc = kstr.rcnt(s[i + li],' ')
                        s[i + li] = _k_.rtrim(s[i + li])
                        s[i + li] += _k_.rpad(rc,'','─')
                    }
                    tw = _k_.max(tw,tl.length)
                    li++
                }
                to += tw
                lo = to + 4
            }
        }
        return s
    }

    Tree.prototype["toString"] = function ()
    {
        return this.rowStrings().map(function (l)
        {
            return _k_.rtrim(l)
        }).join('\n')
    }

    Tree.prototype["toColors"] = function ()
    {
        var s

        if (!global.test)
        {
            return this.toString()
        }
        s = this.toString()
        s = s.replace(/─/g,_k_.w2('─'))
        return s = s.replace(/◂/g,_k_.B3(_k_.y5('◂')))
    }

    Tree.prototype["toColumns"] = function ()
    {
        var column, columns, cs, ct, cursor, hlines, mi, treeToColumn, vlines

        columns = []
        cursor = {x:0,y:0}
        hlines = []
        vlines = []
        ct = this.cursorTree()
        cs = this.cursor
        treeToColumn = function (tree, col, row)
        {
            var ai, alt, column, fillCol, lastTreeColumn, mi, mv, treeCol

            fillCol = function ()
            {
                while (col >= columns.length)
                {
                    columns.push([])
                }
            }
            fillCol()
            column = null
            while (!column)
            {
                column = columns[col]
                for (var _498_26_ = mi = tree.moves.length - 1, _498_47_ = 0; (_498_26_ <= _498_47_ ? mi <= 0 : mi >= 0); (_498_26_ <= _498_47_ ? ++mi : --mi))
                {
                    if (column[mi + row])
                    {
                        if (!column[row])
                        {
                            column[row] = '-'
                        }
                        col++
                        fillCol()
                        column = null
                        break
                    }
                }
            }
            treeCol = col
            vlines.push([[col,row],[col,row + tree.moves.length - 1]])
            for (var _510_22_ = mi = tree.moves.length - 1, _510_43_ = 0; (_510_22_ <= _510_43_ ? mi <= 0 : mi >= 0); (_510_22_ <= _510_43_ ? ++mi : --mi))
            {
                mv = tree.moves[mi]
                column[row + mi] = mv.pos
                if (tree === ct && mi === cs.slice(-1)[0])
                {
                    cursor.x = col
                    cursor.y = row + mi
                }
                lastTreeColumn = col
                for (var _519_26_ = ai = 0, _519_30_ = mv.alt.length; (_519_26_ <= _519_30_ ? ai < mv.alt.length : ai > mv.alt.length); (_519_26_ <= _519_30_ ? ++ai : --ai))
                {
                    alt = mv.alt[ai]
                    lastTreeColumn = treeToColumn(alt,col + ai + 1,row + mi)
                }
                if (mv.alt.length)
                {
                    hlines.push([[col,row + mi],[lastTreeColumn,row + mi]])
                }
            }
            return treeCol
        }
        treeToColumn(this,0,0)
        var list = _k_.list(columns)
        for (var _529_19_ = 0; _529_19_ < list.length; _529_19_++)
        {
            column = list[_529_19_]
            for (var _530_22_ = mi = 0, _530_26_ = column.length; (_530_22_ <= _530_26_ ? mi < column.length : mi > column.length); (_530_22_ <= _530_26_ ? ++mi : --mi))
            {
                if (!column[mi])
                {
                    column[mi] = ''
                }
            }
        }
        return {cursor:cursor,columns:columns,lines:{hlines:hlines,vlines:vlines}}
    }

    Tree.prototype["toPOD"] = function ()
    {
        var moves, pod

        moves = this.moves.map((function (m)
        {
            var o, _549_24_, _550_20_, _552_29_

            o = {pos:m.pos,color:m.color}
            if (!(m.alt != null))
            {
                return o
            }
            if ((m.alt != null ? m.alt.length : undefined))
            {
                o.alt = m.alt.map(function (a)
                {
                    return a.toPOD()
                })
            }
            else if (!(m.alt != null))
            {
                console.log('toPOD no alt???? ----------------------- ',this)
            }
            return o
        }).bind(this))
        pod = {moves:moves}
        if (this.cursor && !this.parent)
        {
            pod.cursor = this.cursor
        }
        return pod
    }

    Tree.prototype["fromPOD"] = function (pod)
    {
        if (!this.parent)
        {
            this.cursor = _k_.copy(pod.cursor)
        }
        this.moves = pod.moves.map((function (m)
        {
            var o

            o = {pos:m.pos,color:m.color,alt:[]}
            if (!_k_.empty(m.alt))
            {
                o.alt = m.alt.map((function (a)
                {
                    return new Tree(this).fromPOD(a)
                }).bind(this))
            }
            return o
        }).bind(this))
        return this
    }

    Tree.prototype["variationPOD"] = function ()
    {
        var i, mv, pod

        pod = {}
        var list = _k_.list(this.moves)
        for (i = 0; i < list.length; i++)
        {
            mv = list[i]
            if (!_k_.empty(mv.alt))
            {
                pod[i] = mv.alt.map(function (a)
                {
                    return a.toPOD()
                })
            }
        }
        return pod
    }

    Tree.prototype["save"] = function ()
    {
        var pod

        if (this.id)
        {
            pod = this.variationPOD()
            return window.stash.set(`tree▸${this.id}`,pod)
        }
    }

    Tree.prototype["load"] = function (pod)
    {
        this.fromPOD(pod)
        return post.emit('tree')
    }

    return Tree
})()

module.exports = Tree