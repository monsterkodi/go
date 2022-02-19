// monsterkodi/kode 0.237.0

var _k_ = {k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }};_k_.r3=_k_.k.F256(_k_.k.r(3));_k_.g2=_k_.k.F256(_k_.k.g(2));_k_.B3=_k_.k.B256(_k_.k.B(3));_k_.b7=_k_.k.F256(_k_.k.b(7));_k_.y4=_k_.k.F256(_k_.k.y(4));_k_.y5=_k_.k.F256(_k_.k.y(5));_k_.w2=_k_.k.F256(_k_.k.w(2))

var kstr, opponent, post, Tree

kstr = require('kxk').kstr
post = require('kxk').post

opponent = require('./util/util').opponent

max = Math.max


Tree = (function ()
{
    function Tree (parent)
    {
        this.parent = parent
    
        this["toPOD"] = this["toPOD"].bind(this)
        this.moves = []
    }

    Tree.prototype["addMove"] = function (pos, captures = [], color)
    {
        var altmoves, tr, _43_25_, _59_25_

        if (tr = this.cursorTree())
        {
            return tr.addMove(pos,captures)
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
            if (this.cursor.mvi > 0 && this.moves[this.cursor.mvi].pos === 'next')
            {
                this.cursor.mvi--
            }
            color = (color != null ? color : this.nextColor())
            if (this.cursor.mvi === this.moves.length - 1)
            {
                this.cursor.ali = 0
                this.cursor.mvi = this.moves.length
                this.moves.push({pos:pos,captures:captures,alt:[],color:color})
                return (typeof post.emit === "function" ? post.emit('tree') : undefined)
            }
            else
            {
                this.cursor.mvi++
                if (pos !== this.moves[this.cursor.mvi].pos)
                {
                    altmoves = this.moves[this.cursor.mvi].alt.map(function (alt)
                    {
                        return alt.moves[0].pos
                    })
                    if (_k_.in(pos,altmoves))
                    {
                        this.cursor.ali = altmoves.indexOf(pos) + 1
                        tr = this.moves[this.cursor.mvi].alt
                        tr.cursor = {ali:0,mvi:0}
                    }
                    else
                    {
                        this.cursor.ali = this.moves[this.cursor.mvi].alt.length + 1
                        tr = new Tree(this)
                        this.moves[this.cursor.mvi].alt.push(tr)
                        tr.addMove(pos,captures,color)
                        return
                    }
                }
                return (typeof post.emit === "function" ? post.emit('tree') : undefined)
            }
        }
    }

    Tree.prototype["nextColor"] = function ()
    {
        var cm

        return ((cm = this.cursorMove()) ? opponent[cm.color] : 'black')
    }

    Tree.prototype["replay"] = function (moves)
    {
        var mv, mvi, _72_58_, _76_17_

        var list = _k_.list(moves)
        for (var _71_15_ = 0; _71_15_ < list.length; _71_15_++)
        {
            mv = list[_71_15_]
            this.moves.push({pos:mv.pos,captures:(((_72_58_=mv.captures) != null ? _72_58_ : [])),alt:[],color:mv.color})
        }
        mvi = this.moves.length - ((this.moves.slice(-1)[0].pos === 'next' ? 2 : 1))
        this.cursor = {ali:0,mvi:mvi}
        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
    }

    Tree.prototype["navigate"] = function (dir)
    {
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
            case 'leftup':
                this.navigateLeftUp()
                break
            case 'rightdown':
                this.navigateRightDown()
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
    }

    Tree.prototype["navigateLeftUp"] = function ()
    {
        var ali

        ali = this.cursor.ali
        this.navigateLeft()
        if (this.cursor.ali === ali)
        {
            return this.navigateUp()
        }
    }

    Tree.prototype["navigateRightDown"] = function ()
    {
        var ali

        ali = this.cursor.ali
        this.navigateRight()
        if (this.cursor.ali === ali)
        {
            return this.navigateDown()
        }
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
                this.cursor.mvi--
                return this.cursorChanged()
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
            this.cursor.mvi++
            return this.cursorChanged()
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
                this.moves[this.cursor.mvi].alt[this.cursor.ali - 1].cursor = {mvi:0,ali:0}
            }
            return this.cursorChanged()
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
            this.moves[this.cursor.mvi].alt[this.cursor.ali - 1].cursor = {mvi:0,ali:0}
            return this.cursorChanged()
        }
    }

    Tree.prototype["cursorChanged"] = function ()
    {
        var _164_17_

        return (typeof post.emit === "function" ? post.emit('tree') : undefined)
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
        var tr, _186_24_

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

    Tree.prototype["selectGrid"] = function (col, row)
    {
        var columns, dir, hasLeft, hasUp, i, ocol, orow, path, r

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
            for (var _209_21_ = 0; _209_21_ < list.length; _209_21_++)
            {
                line = list[_209_21_]
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
            for (var _215_21_ = 0; _215_21_ < list.length; _215_21_++)
            {
                line = list[_215_21_]
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
        var ali, miai, mvi, tr

        if (!this.parent)
        {
            this.deselect()
        }
        miai = [].splice.call(arguments,0)
        var _259_19_ = miai; mvi = _259_19_[0]; ali = _259_19_[1]

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

    Tree.prototype["canUndo"] = function ()
    {
        return this.cursor.ali === 0 && this.cursor.mvi === this.moves.length - 1
    }

    Tree.prototype["undoMove"] = function (m)
    {
        var u

        this.cursor.mvi--
        u = this.moves.pop()
        if (u.pos !== m.pos)
        {
            console.log('dafuk!')
        }
        return (post != null ? post.emit('tree') : undefined)
    }

    Tree.prototype["cursorTree"] = function ()
    {
        var tr, _294_18_

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

    Tree.prototype["cursorMove"] = function ()
    {
        var cm, tr

        if (tr = this.cursorTree())
        {
            if (cm = tr.cursorMove())
            {
                return cm
            }
        }
        if (this.cursor)
        {
            return this.moves[this.cursor.mvi]
        }
    }

    Tree.prototype["deleteCursorMove"] = function ()
    {
        var tr

        if (tr = this.cursorTree())
        {
            return tr.deleteCursorMove()
        }
        else if (this.cursor && this.cursor.ali)
        {
            if (this.cursor.mvi === 0)
            {
                if (this.parent && this.parent.cursor.ali)
                {
                    this.parent.moves[this.parent.cursor.mvi].alt.splice(this.parent.cursor.ali - 1,1)
                    this.parent.cursor.ali--
                }
            }
            else
            {
                this.moves = this.moves.slice(0,this.cursor.mvi)
                this.cursor.mvi--
            }
            return (post != null ? post.emit('tree') : undefined)
        }
    }

    Tree.prototype["cursorVariations"] = function ()
    {
        var alt, cm, tm, tr, _343_36_, _343_50_, _344_36_

        if (cm = this.cursorMove())
        {
            if (cm.alt.length)
            {
                return cm.alt.map(function (a)
                {
                    return a.moves[0]
                })
            }
            else
            {
                if (tr = this.cursorTree())
                {
                    if (!(tr.cursor != null) || (tr.cursor != null ? tr.cursor.mvi : undefined) === 0)
                    {
                        if ((tr.parent != null))
                        {
                            alt = tr.parent.moves[tr.parent.cursor.mvi].alt.map(function (t)
                            {
                                return t.moves[0]
                            })
                            alt.splice(tr.parent.cursor.ali - 1,1)
                            tm = tr.parent.moves[tr.parent.cursor.mvi]
                            if (tm.pos !== 'next')
                            {
                                alt.push(tm)
                            }
                            return alt
                        }
                    }
                    else
                    {
                        return tr.cursorVariations()
                    }
                }
            }
        }
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
        for (var _371_14_ = 0; _371_14_ < list.length; _371_14_++)
        {
            m = list[_371_14_]
            var list1 = _k_.list(m.alt)
            for (var _372_18_ = 0; _372_18_ < list1.length; _372_18_++)
            {
                t = list1[_372_18_]
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

    Tree.prototype["moveHistory"] = function ()
    {
        var h, tr

        if (this.cursor.mvi)
        {
            if (tr = this.cursorTree())
            {
                h = this.moves.slice(0, typeof this.cursor.mvi === 'number' ? this.cursor.mvi : -1)
                h = h.concat(tr.moveHistory())
            }
            else
            {
                h = this.moves.slice(0, typeof this.cursor.mvi === 'number' ? this.cursor.mvi+1 : Infinity)
            }
        }
        else
        {
            if (this.moves.length)
            {
                h = [this.moves[0]]
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
        var a, i, li, lo, m, mi, ps, rc, s, t, tl, tls, to, tw, _425_22_, _439_28_

        s = []
        a = []
        for (var _422_18_ = mi = 0, _422_22_ = this.moves.length; (_422_18_ <= _422_22_ ? mi < this.moves.length : mi > this.moves.length); (_422_18_ <= _422_22_ ? ++mi : --mi))
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
        for (var _433_17_ = i = a.length - 1, _433_29_ = 0; (_433_17_ <= _433_29_ ? i <= 0 : i >= 0); (_433_17_ <= _433_29_ ? ++i : --i))
        {
            var list = _k_.list(a[i])
            for (var _434_18_ = 0; _434_18_ < list.length; _434_18_++)
            {
                t = list[_434_18_]
                tw = 4
                li = 0
                tls = t.rowStrings()
                var list1 = _k_.list(tls)
                for (var _438_23_ = 0; _438_23_ < list1.length; _438_23_++)
                {
                    tl = list1[_438_23_]
                    s[i + li] = ((_439_28_=s[i + li]) != null ? _439_28_ : _k_.rpad(4))
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
            var ai, alt, column, fillCol, lastTreeColumn, mi, mv, treeCol, _501_30_

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
                for (var _486_26_ = mi = tree.moves.length - 1, _486_47_ = 0; (_486_26_ <= _486_47_ ? mi <= 0 : mi >= 0); (_486_26_ <= _486_47_ ? ++mi : --mi))
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
            for (var _498_22_ = mi = tree.moves.length - 1, _498_43_ = 0; (_498_22_ <= _498_43_ ? mi <= 0 : mi >= 0); (_498_22_ <= _498_43_ ? ++mi : --mi))
            {
                mv = tree.moves[mi]
                column[row + mi] = mv.pos
                if ((tree.cursor != null ? tree.cursor.mvi : undefined) === mi)
                {
                    cursor.x = col + tree.cursor.ali
                    cursor.y = row + mi
                }
                lastTreeColumn = col
                for (var _507_26_ = ai = 0, _507_30_ = mv.alt.length; (_507_26_ <= _507_30_ ? ai < mv.alt.length : ai > mv.alt.length); (_507_26_ <= _507_30_ ? ++ai : --ai))
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
        for (var _517_19_ = 0; _517_19_ < list.length; _517_19_++)
        {
            column = list[_517_19_]
            for (var _518_22_ = mi = 0, _518_26_ = column.length; (_518_22_ <= _518_26_ ? mi < column.length : mi > column.length); (_518_22_ <= _518_26_ ? ++mi : --mi))
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
            var o, _537_24_, _538_20_, _540_29_

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
        if (this.cursor)
        {
            pod.cursor = this.cursor
        }
        return pod
    }

    Tree.prototype["fromPOD"] = function (pod)
    {
        this.cursor = pod.cursor
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

    Tree.prototype["save"] = function ()
    {
        return window.stash.set('tree',this.toPOD())
    }

    Tree.prototype["load"] = function (pod)
    {
        this.fromPOD(pod)
        return post.emit('tree')
    }

    return Tree
})()

module.exports = Tree