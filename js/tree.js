// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var kstr, Tree

kstr = require('kxk').kstr

max = Math.max


Tree = (function ()
{
    function Tree (parent)
    {
        this.parent = parent
    
        if (this.parent)
        {
            this.parentCursor = _k_.copy(this.parent.cursor)
        }
        this.moves = []
        this.cursor = {mvi:-1,ali:0}
    }

    Tree.prototype["addMove"] = function (pos, cpt = [])
    {
        var t, tr

        console.log('add\n')
        if (tr = this.cursorTree())
        {
            tr.addMove(pos,cpt)
        }
        else
        {
            if (this.cursor.mvi === this.moves.length - 1)
            {
                this.cursor.mvi = this.moves.length
                this.cursor.ali = 0
                this.moves.push({pos:pos,cpt:cpt,alt:[]})
            }
            else
            {
                this.cursor.mvi++
                this.cursor.ali = this.moves[this.cursor.mvi].alt.length + 1
                t = new Tree(this)
                this.moves[this.cursor.mvi].alt.push(t)
                t.addMove(pos,cpt)
            }
        }
        console.log(this.toString() + '\n')
    }

    Tree.prototype["navigate"] = function (dir)
    {
        console.log(dir + '\n')
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
            case 'back':
                this.navigateBack()
                break
        }

        console.log(this.toString() + '\n')
    }

    Tree.prototype["navigateUp"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            if (tr.cursor.mvi > 0)
            {
                tr.navigateUp()
                if (tr.cursor.mvi < 0)
                {
                    this.cursor.ali = 0
                    return this.cursor.mvi--
                }
            }
        }
        else
        {
            if (this.cursor.mvi > 0)
            {
                return this.cursor.mvi--
            }
        }
    }

    Tree.prototype["navigateDown"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            if (tr.cursor.mvi < tr.moves.length - 1)
            {
                return tr.navigateDown()
            }
        }
        else if (this.cursor.mvi < this.moves.length - 1)
        {
            return this.cursor.mvi++
        }
    }

    Tree.prototype["navigateLeft"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            if (tr.cursor.mvi > 0)
            {
                return tr.navigateLeft()
            }
            else
            {
                if (tr.cursor.mvi === 0)
                {
                    tr.cursor.mvi = -1
                }
                return this.cursor.ali--
            }
        }
    }

    Tree.prototype["navigateRight"] = function ()
    {
        var mv, tr

        mv = this.moves[this.cursor.mvi]
        if (this.cursor.ali < mv.alt.length)
        {
            this.cursor.ali++
            tr = mv.alt[this.cursor.ali - 1]
            return tr.cursor.mvi = 0
        }
    }

    Tree.prototype["navigateBack"] = function ()
    {
        var tr, _114_23_, _115_23_

        if (tr = this.cursorTree())
        {
            return tr.navigateBack()
        }
        else
        {
            if (this.cursor.mvi === 0)
            {
                ;(this.parent != null ? this.parent.navigateLeftmost() : undefined)
                return (this.parent != null ? this.parent.navigateUp() : undefined)
            }
            else
            {
                return this.navigateUp()
            }
        }
    }

    Tree.prototype["navigateLeftmost"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            if (tr.cursor.ali)
            {
                return tr.navigateLeftmost()
            }
            else
            {
                tr.cursor.mvi = -1
                return this.cursor.ali = 0
            }
        }
        else
        {
            if (this.parent)
            {
                return this.cursor.mvi = -1
            }
        }
    }

    Tree.prototype["select"] = function ()
    {
        var ali, miai, mvi, tr

        miai = [].splice.call(arguments,0)
        var _140_19_ = miai; mvi = _140_19_[0]; ali = _140_19_[1]

        if (ali)
        {
            if (tr = this.treeAt(mvi,ali))
            {
                this.cursor.mvi = mvi
                this.cursor.ali = ali
                return tr.select.apply(tr,miai.slice(2))
            }
            else
            {
                console.log('no tree')
            }
        }
        else
        {
            this.deselect()
            this.cursor.mvi = mvi
            this.cursor.ali = 0
            return
        }
    }

    Tree.prototype["deselect"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            tr.deselect()
        }
        this.cursor.mvi = -1
        return this.cursor.ali = 0
    }

    Tree.prototype["cursorTree"] = function ()
    {
        if (this.cursor.ali)
        {
            return this.moves[this.cursor.mvi].alt[this.cursor.ali - 1]
        }
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
        console.log(this.toString())
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
        for (var _185_14_ = 0; _185_14_ < list.length; _185_14_++)
        {
            m = list[_185_14_]
            var list1 = _k_.list(m.alt)
            for (var _186_18_ = 0; _186_18_ < list1.length; _186_18_++)
            {
                t = list1[_186_18_]
                w += t.width()
            }
        }
        return w
    }

    Tree.prototype["toLines"] = function ()
    {
        var a, i, li, lo, m, mi, ps, rc, s, t, tl, tls, to, tw, _217_28_

        s = []
        a = []
        for (var _200_18_ = mi = 0, _200_22_ = this.moves.length; (_200_18_ <= _200_22_ ? mi < this.moves.length : mi > this.moves.length); (_200_18_ <= _200_22_ ? ++mi : --mi))
        {
            m = this.moves[mi]
            ps = (m.alt.length ? '─' : ' ')
            if (this.cursor.ali === 0 && this.cursor.mvi === mi)
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
        for (var _211_17_ = i = a.length - 1, _211_29_ = 0; (_211_17_ <= _211_29_ ? i <= 0 : i >= 0); (_211_17_ <= _211_29_ ? ++i : --i))
        {
            var list = _k_.list(a[i])
            for (var _212_18_ = 0; _212_18_ < list.length; _212_18_++)
            {
                t = list[_212_18_]
                tw = 4
                li = 0
                tls = t.toLines()
                var list1 = _k_.list(tls)
                for (var _216_23_ = 0; _216_23_ < list1.length; _216_23_++)
                {
                    tl = list1[_216_23_]
                    s[i + li] = ((_217_28_=s[i + li]) != null ? _217_28_ : _k_.rpad(4))
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
        return this.toLines().map(function (l)
        {
            return _k_.rtrim(l)
        }).join('\n')
    }

    return Tree
})()

module.exports = Tree