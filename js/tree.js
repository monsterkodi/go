// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var kstr, post, Tree

kstr = require('kxk').kstr
post = require('kxk').post

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
        var tr

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
                this.moves.push({pos:pos,cpt:cpt,alt:[],color:this.nextColor()})
                post.emit('tree')
            }
            else
            {
                this.cursor.mvi++
                this.cursor.ali = this.moves[this.cursor.mvi].alt.length + 1
                tr = new Tree(this)
                this.moves[this.cursor.mvi].alt.push(tr)
                tr.addMove(pos,cpt)
            }
        }
        console.log(this.toString() + '\n')
    }

    Tree.prototype["nextColor"] = function ()
    {
        return ['black','white'][this.history().length % 2]
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
        return post.emit('tree')
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

        if (tr = this.cursorTree())
        {
            if (tr.cursor.mvi > 0)
            {
                return tr.navigateRight()
            }
            else
            {
                mv = this.moves[this.cursor.mvi]
                if (this.cursor.ali < mv.alt.length)
                {
                    tr.cursor.mvi = -1
                    this.cursor.ali++
                    tr = this.cursorTree()
                    return tr.cursor.mvi = 0
                }
            }
        }
        else
        {
            mv = this.moves[this.cursor.mvi]
            if (this.cursor.ali < mv.alt.length)
            {
                this.cursor.ali++
                tr = this.cursorTree()
                return tr.cursor.mvi = 0
            }
        }
    }

    Tree.prototype["navigateBack"] = function ()
    {
        var tr, _130_23_, _131_23_

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
        var _156_19_ = miai; mvi = _156_19_[0]; ali = _156_19_[1]

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
        for (var _201_14_ = 0; _201_14_ < list.length; _201_14_++)
        {
            m = list[_201_14_]
            var list1 = _k_.list(m.alt)
            for (var _202_18_ = 0; _202_18_ < list1.length; _202_18_++)
            {
                t = list1[_202_18_]
                w += t.width()
            }
        }
        return w
    }

    Tree.prototype["history"] = function ()
    {
        var h, tr

        if (this.cursor.mvi)
        {
            if (tr = this.cursorTree())
            {
                h = this.moves.slice(0, typeof this.cursor.mvi === 'number' ? this.cursor.mvi : -1).map(function (m)
                {
                    return m.pos
                })
                h = h.concat(tr.history())
            }
            else
            {
                h = this.moves.slice(0, typeof this.cursor.mvi === 'number' ? this.cursor.mvi+1 : Infinity).map(function (m)
                {
                    return m.pos
                })
            }
        }
        else
        {
            if (this.moves.length)
            {
                h = [this.moves[0].pos]
            }
            else
            {
                h = []
            }
        }
        return h
    }

    Tree.prototype["toLines"] = function ()
    {
        var a, i, li, lo, m, mi, ps, rc, s, t, tl, tls, to, tw, _254_28_

        s = []
        a = []
        for (var _237_18_ = mi = 0, _237_22_ = this.moves.length; (_237_18_ <= _237_22_ ? mi < this.moves.length : mi > this.moves.length); (_237_18_ <= _237_22_ ? ++mi : --mi))
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
        for (var _248_17_ = i = a.length - 1, _248_29_ = 0; (_248_17_ <= _248_29_ ? i <= 0 : i >= 0); (_248_17_ <= _248_29_ ? ++i : --i))
        {
            var list = _k_.list(a[i])
            for (var _249_18_ = 0; _249_18_ < list.length; _249_18_++)
            {
                t = list[_249_18_]
                tw = 4
                li = 0
                tls = t.toLines()
                var list1 = _k_.list(tls)
                for (var _253_23_ = 0; _253_23_ < list1.length; _253_23_++)
                {
                    tl = list1[_253_23_]
                    s[i + li] = ((_254_28_=s[i + li]) != null ? _254_28_ : _k_.rpad(4))
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