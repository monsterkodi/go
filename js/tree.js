// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Tree


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

    Tree.prototype["cursorTree"] = function ()
    {
        if (this.cursor.ali)
        {
            return this.moves[this.cursor.mvi].alt[this.cursor.ali - 1]
        }
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
        var tr, _113_23_, _114_23_

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

    Tree.prototype["select"] = function (mvi, ali)
    {
        var mv, tr

        if ((0 <= mvi && mvi < this.moves.length))
        {
            if (ali)
            {
                if (mv = this.moves[mvi])
                {
                    if (tr = mv.alt[ali - 1])
                    {
                        this.deselect()
                        this.cursor.mvi = mvi
                        this.cursor.ali = ali
                        tr.cursor.mvi = 0
                        tr.cursor.ali = 0
                        console.log(this.toString() + '\n')
                        return
                    }
                    else
                    {
                        console.log('FORK!')
                    }
                }
                else
                {
                    console.log('FARK!')
                }
            }
            else
            {
                this.deselect()
                this.cursor.mvi = mvi
                this.cursor.ali = 0
                console.log(this.toString() + '\n')
                return
            }
        }
        if (tr = this.treeAtMviAli(mvi,ali))
        {
            this.deselect()
            this.cursor.mvi = this.mviForTree(tr)
            this.cursor.ali = this.aliForTree(tr)
            tr.cursor.mvi = this.relativeMvi(mvi,tr)
            tr.cursor.ali = 0
            console.log(this.toString() + '\n')
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

    Tree.prototype["treeAtMviAli"] = function (mvi, ali)
    {
        var mv

        while (mvi > 0)
        {
            if (mv = this.moves[mvi])
            {
                if (ali <= mv.alt.length)
                {
                    return mv.alt[ali - 1]
                }
            }
            mvi--
        }
    }

    Tree.prototype["mviForTree"] = function (tr)
    {
        var mvi

        mvi = 0
        while (tr.parent)
        {
            mvi += tr.parentCursor.mvi
            tr = tr.parent
        }
        return mvi
    }

    Tree.prototype["aliForTree"] = function (tr)
    {
        var ali

        ali = 0
        while (tr.parent)
        {
            ali += tr.parentCursor.ali
            tr = tr.parent
        }
        return ali
    }

    Tree.prototype["relativeMvi"] = function (mvi, tr)
    {
        return mvi - this.mviForTree(tr)
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
        for (var _215_14_ = 0; _215_14_ < list.length; _215_14_++)
        {
            m = list[_215_14_]
            var list1 = _k_.list(m.alt)
            for (var _216_18_ = 0; _216_18_ < list1.length; _216_18_++)
            {
                t = list1[_216_18_]
                w += t.width()
            }
        }
        return w
    }

    Tree.prototype["toLines"] = function ()
    {
        var a, i, li, m, mi, s, t, tl, _242_28_

        s = []
        a = []
        for (var _230_18_ = mi = 0, _230_22_ = this.moves.length; (_230_18_ <= _230_22_ ? mi < this.moves.length : mi > this.moves.length); (_230_18_ <= _230_22_ ? ++mi : --mi))
        {
            m = this.moves[mi]
            if (this.cursor.ali === 0 && this.cursor.mvi === mi)
            {
                s.push(_k_.rpad(4,m.pos + '◂'))
            }
            else
            {
                s.push(_k_.rpad(4,m.pos))
            }
            a.push(m.alt)
        }
        for (var _238_17_ = i = a.length - 1, _238_29_ = 0; (_238_17_ <= _238_29_ ? i <= 0 : i >= 0); (_238_17_ <= _238_29_ ? ++i : --i))
        {
            var list = _k_.list(a[i])
            for (var _239_18_ = 0; _239_18_ < list.length; _239_18_++)
            {
                t = list[_239_18_]
                li = 0
                var list1 = _k_.list(t.toLines())
                for (var _241_23_ = 0; _241_23_ < list1.length; _241_23_++)
                {
                    tl = list1[_241_23_]
                    s[i + li] = ((_242_28_=s[i + li]) != null ? _242_28_ : _k_.rpad(4))
                    s[i + li] += tl
                    li++
                }
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