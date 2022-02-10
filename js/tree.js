// monsterkodi/kode 0.237.0

var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}};_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.B3=_k_.k.B256(_k_.k.B(3));_k_.b7=_k_.k.F256(_k_.k.b(7));_k_.y4=_k_.k.F256(_k_.k.y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var kstr, post, Tree

kstr = require('kxk').kstr
post = require('kxk').post

max = Math.max


Tree = (function ()
{
    function Tree (parent)
    {
        this.parent = parent
    
        this["toPOD"] = this["toPOD"].bind(this)
        this.moves = []
    }

    Tree.prototype["addMove"] = function (pos, cpt = [])
    {
        var tr, _37_25_

        if (tr = this.cursorTree())
        {
            return tr.addMove(pos,cpt)
        }
        else
        {
            if (global.test)
            {
                console.log(_k_.r3('add'),_k_.y4(pos))
            }
            if (_k_.empty(this.moves))
            {
                this.cursor = {mvi:-1,ali:0}
            }
            if (this.cursor.mvi === this.moves.length - 1)
            {
                this.cursor.mvi = this.moves.length
                this.cursor.ali = 0
                this.moves.push({pos:pos,cpt:cpt,alt:[],color:this.nextColor()})
                return (typeof post.emit === "function" ? post.emit('tree') : undefined)
            }
            else
            {
                this.cursor.mvi++
                this.cursor.ali = this.moves[this.cursor.mvi].alt.length + 1
                tr = new Tree(this)
                this.moves[this.cursor.mvi].alt.push(tr)
                return tr.addMove(pos,cpt)
            }
        }
    }

    Tree.prototype["nextColor"] = function ()
    {
        return ['black','white'][this.history().length % 2]
    }

    Tree.prototype["navigate"] = function (dir)
    {
        var _66_17_

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

        if (global.test)
        {
            console.log(_k_.g2('nav'),_k_.b7(dir))
        }
        if (global.test)
        {
            console.log(this.toColors())
        }
        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["navigateUp"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            return tr.navigateUp()
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
            if (tr.cursor)
            {
                if (tr.cursor.ali > 0)
                {
                    tr.navigateLeft()
                    return
                }
                if (tr.cursor.mvi === 0 && this.cursor.ali > 0)
                {
                    tr.deselect()
                }
                else
                {
                    return
                }
            }
        }
        if (this.cursor.ali > 0)
        {
            this.cursor.ali--
            if (this.cursor.ali)
            {
                return this.moves[this.cursor.mvi].alt[this.cursor.ali - 1].cursor = {mvi:0,ali:0}
            }
        }
    }

    Tree.prototype["navigateRight"] = function ()
    {
        var canGoRight, tr

        canGoRight = this.cursor.ali < this.moves[this.cursor.mvi].alt.length
        if (tr = this.cursorTree())
        {
            if (tr.cursor.mvi)
            {
                tr.navigateRight()
                return
            }
            if (canGoRight)
            {
                tr.deselect()
            }
        }
        if (canGoRight)
        {
            this.cursor.ali++
            return this.moves[this.cursor.mvi].alt[this.cursor.ali - 1].cursor = {mvi:0,ali:0}
        }
    }

    Tree.prototype["navigateBack"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            return tr.navigateBack()
        }
        else
        {
            if (this.parent && this.cursor.mvi === 0)
            {
                delete this.cursor
                this.parent.navigateLeftmost()
                return this.parent.navigateUp()
            }
            else
            {
                return this.navigateUp()
            }
        }
    }

    Tree.prototype["navigateLeftmost"] = function ()
    {
        var tr, _133_24_

        if (tr = this.cursorTree())
        {
            if ((tr.cursor != null ? tr.cursor.ali : undefined))
            {
                return tr.navigateLeftmost()
            }
            else
            {
                return this.cursor.ali = 0
            }
        }
    }

    Tree.prototype["select"] = function ()
    {
        var ali, miai, mvi, tr

        miai = [].splice.call(arguments,0)
        var _147_19_ = miai; mvi = _147_19_[0]; ali = _147_19_[1]

        if (ali)
        {
            if (tr = this.treeAt(mvi,ali))
            {
                this.cursor = {mvi:mvi,ali:ali}
                return tr.select.apply(tr,miai.slice(2))
            }
        }
        else
        {
            this.deselect()
            return this.cursor = {mvi:mvi,ali:0}
        }
    }

    Tree.prototype["deselect"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            tr.deselect()
        }
        return delete this.cursor
    }

    Tree.prototype["cursorTree"] = function ()
    {
        var tr, _171_18_

        if ((this.cursor != null ? this.cursor.ali : undefined))
        {
            tr = (this.moves[this.cursor.mvi] != null ? this.moves[this.cursor.mvi].alt[this.cursor.ali - 1] : undefined)
            if (!tr)
            {
                console.log('ali but no cursor tree',this)
            }
            return tr
        }
        else
        {
            if (!this.parent && !_k_.empty(this.moves) && this.cursor.ali > 0)
            {
                console.log('no cursor tree',this)
            }
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
        for (var _196_14_ = 0; _196_14_ < list.length; _196_14_++)
        {
            m = list[_196_14_]
            var list1 = _k_.list(m.alt)
            for (var _197_18_ = 0; _197_18_ < list1.length; _197_18_++)
            {
                t = list1[_197_18_]
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

    Tree.prototype["rowStrings"] = function ()
    {
        var a, i, li, lo, m, mi, ps, rc, s, t, tl, tls, to, tw, _235_22_, _249_28_

        s = []
        a = []
        for (var _232_18_ = mi = 0, _232_22_ = this.moves.length; (_232_18_ <= _232_22_ ? mi < this.moves.length : mi > this.moves.length); (_232_18_ <= _232_22_ ? ++mi : --mi))
        {
            m = this.moves[mi]
            ps = (m.alt.length ? '─' : ' ')
            if ((this.cursor != null ? this.cursor.ali : undefined) === 0 && this.cursor.mvi === mi)
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
        for (var _243_17_ = i = a.length - 1, _243_29_ = 0; (_243_17_ <= _243_29_ ? i <= 0 : i >= 0); (_243_17_ <= _243_29_ ? ++i : --i))
        {
            var list = _k_.list(a[i])
            for (var _244_18_ = 0; _244_18_ < list.length; _244_18_++)
            {
                t = list[_244_18_]
                tw = 4
                li = 0
                tls = t.rowStrings()
                var list1 = _k_.list(tls)
                for (var _248_23_ = 0; _248_23_ < list1.length; _248_23_++)
                {
                    tl = list1[_248_23_]
                    s[i + li] = ((_249_28_=s[i + li]) != null ? _249_28_ : _k_.rpad(4))
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
        var column, columns, cursor, hlines, mi, treeToColumn, vlines

        columns = []
        cursor = {x:0,y:0}
        hlines = []
        vlines = []
        treeToColumn = function (tree, col, row)
        {
            var ai, alt, column, fillCol, lastTreeColumn, mi, mv, treeCol, _311_30_

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
                for (var _296_26_ = mi = tree.moves.length - 1, _296_47_ = 0; (_296_26_ <= _296_47_ ? mi <= 0 : mi >= 0); (_296_26_ <= _296_47_ ? ++mi : --mi))
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
            for (var _308_22_ = mi = tree.moves.length - 1, _308_43_ = 0; (_308_22_ <= _308_43_ ? mi <= 0 : mi >= 0); (_308_22_ <= _308_43_ ? ++mi : --mi))
            {
                mv = tree.moves[mi]
                column[row + mi] = mv.pos
                if ((tree.cursor != null ? tree.cursor.mvi : undefined) === mi)
                {
                    cursor.x = col + tree.cursor.ali
                    cursor.y = row + mi
                }
                lastTreeColumn = col
                for (var _317_26_ = ai = 0, _317_30_ = mv.alt.length; (_317_26_ <= _317_30_ ? ai < mv.alt.length : ai > mv.alt.length); (_317_26_ <= _317_30_ ? ++ai : --ai))
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
        for (var _327_19_ = 0; _327_19_ < list.length; _327_19_++)
        {
            column = list[_327_19_]
            for (var _328_22_ = mi = 0, _328_26_ = column.length; (_328_22_ <= _328_26_ ? mi < column.length : mi > column.length); (_328_22_ <= _328_26_ ? ++mi : --mi))
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
        var moves

        moves = this.moves.map((function (m)
        {
            var o, _347_24_, _350_20_, _352_29_

            o = {pos:m.pos}
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
        return {cursor:this.cursor,moves:moves}
    }

    Tree.prototype["fromPOD"] = function (pod)
    {
        this.cursor = pod.cursor
        this.moves = pod.moves.map((function (m)
        {
            var o

            o = {pos:m.pos,alt:[]}
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

    Tree.prototype["save"] = function ()
    {
        return window.stash.set('tree',this.toPOD())
    }

    Tree.prototype["load"] = function (pod)
    {
        console.log(pod)
        this.fromPOD(pod)
        console.log(this.toString())
        return post.emit('tree')
    }

    return Tree
})()

module.exports = Tree