// monsterkodi/kode 0.243.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { m = -Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var elem, keyinfo, post, stopEvent, Varee

elem = require('kxk').elem
keyinfo = require('kxk').keyinfo
post = require('kxk').post
stopEvent = require('kxk').stopEvent

max = Math.max


Varee = (function ()
{
    function Varee (parent, tree, boardsize)
    {
        this.parent = parent
        this.tree = tree
        this.boardsize = boardsize
    
        this["onInputKey"] = this["onInputKey"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onMouseDown"] = this["onMouseDown"].bind(this)
        this["onTree"] = this["onTree"].bind(this)
        this.div = elem({class:'varee',parent:this.parent})
        this.div.addEventListener('mousedown',this.onMouseDown)
        this.chat = elem({class:'chat',parent:this.div})
        this.talk = elem({class:'talk',parent:this.div})
        this.input = elem('input',{class:'input',parent:this.talk,spellcheck:'false',value:'',dblclick:stopEvent,click:(function (event)
        {
            this.input.focus()
            return stopEvent(event)
        }).bind(this)})
        this.input.addEventListener('keydown',this.onInputKey)
        this.input.tabIndex = 1
        this.width = 110
        this.height = 800
        this.canvas = elem('canvas',{class:'treelines',parent:this.div})
        this.ctx = this.canvas.getContext('2d')
        this.hlt = elem({class:'highlts',parent:this.div})
        this.stn = elem({class:'stones',parent:this.div})
        this.crs = elem({class:'cursor',parent:this.hlt})
        post.on('resize',this.onResize)
        post.on('tree',this.onTree)
        this.onResize()
    }

    Varee.prototype["onTree"] = function ()
    {
        var color, column, columns, cursor, lines, pos, text, x, y

        this.tree.save()
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
                    case '':
                    case '-':
                        break
                    default:
                        text = ((pos === 'pass' ? '●' : pos))
                        color = ['black','white'][y % 2]
                        elem({class:`varii ${color}`,text:text,parent:this.stn,style:`left:${25 + x * 50}px; top:${25 + y * 50}px;`,col:x,row:y})
                }

            }
        }
        this.crs.classList.remove('black')
        this.crs.classList.remove('white')
        this.crs.classList.add(color = ['black','white'][cursor.y % 2])
        this.crs.style.left = `${cursor.x * 50 + 50}px`
        this.crs.style.top = `${cursor.y * 50 + 50}px`
        this.crs.scrollIntoViewIfNeeded()
        return this.drawLines(lines)
    }

    Varee.prototype["onMouseDown"] = function (event)
    {
        if (event.target.classList.contains('varii'))
        {
            this.tree.selectGrid(parseInt(event.target.getAttribute('col')),parseInt(event.target.getAttribute('row')))
            return post.emit('navigate','select')
        }
    }

    Varee.prototype["drawLines"] = function (lines)
    {
        var h00, h01, h10, h11, hl, hlines, mh, mw, v00, v01, v10, v11, vl, vlines

        hlines = lines.hlines
        vlines = lines.vlines

        this.canvas.width = this.width
        this.canvas.height = this.height
        mw = this.width
        mh = this.height
        var list = _k_.list(vlines)
        for (var _106_15_ = 0; _106_15_ < list.length; _106_15_++)
        {
            vl = list[_106_15_]
            v00 = 100 + vl[0][0] * 100
            v01 = 100 + vl[0][1] * 100
            v10 = 100 + vl[1][0] * 100
            v11 = 100 + vl[1][1] * 100
            this.ctx.beginPath()
            this.ctx.strokeStyle = '#800'
            this.ctx.moveTo(v00 - 1,v01)
            this.ctx.lineTo(v10 - 1,v11)
            this.ctx.stroke()
            this.ctx.strokeStyle = '#ff8'
            this.ctx.beginPath()
            this.ctx.moveTo(v00 + 2,v01)
            this.ctx.lineTo(v10 + 2,v11)
            mh = _k_.max(mh,100 + v11)
            this.ctx.stroke()
        }
        var list1 = _k_.list(hlines)
        for (var _124_15_ = 0; _124_15_ < list1.length; _124_15_++)
        {
            hl = list1[_124_15_]
            h00 = 100 + hl[0][0] * 100
            h01 = 100 + hl[0][1] * 100
            h10 = 100 + hl[1][0] * 100
            h11 = 100 + hl[1][1] * 100
            this.ctx.strokeStyle = '#800'
            this.ctx.beginPath()
            this.ctx.moveTo(h00,h01 - 1)
            this.ctx.lineTo(h10,h11 - 1)
            this.ctx.stroke()
            this.ctx.strokeStyle = '#ff8'
            this.ctx.beginPath()
            this.ctx.moveTo(h00,h01 + 2)
            this.ctx.lineTo(h10,h11 + 2)
            mw = _k_.max(mw,10 + h10)
            this.ctx.stroke()
        }
        if (mw > this.width || mh > this.height)
        {
            this.width = mw
            this.height = mh
            this.drawLines(lines)
        }
        return this
    }

    Varee.prototype["onResize"] = function ()
    {
        var br, rb, tb, w

        br = this.parent.getBoundingClientRect()
        tb = br.height / (this.boardsize + 1) - 2
        w = _k_.max(128,(br.width - br.height) / 2 - tb)
        rb = (br.width - br.height) / 2 - w
        if ((br.width - br.height) / 2 < 128)
        {
            this.div.style.display = 'none'
        }
        else
        {
            this.div.style.display = 'initial'
        }
        this.div.style.width = `${w}px`
        this.div.style.top = `${tb}px`
        this.div.style.bottom = `${tb}px`
        this.div.style.right = `${rb}px`
        return this.resizeChat()
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

    Varee.prototype["showChat"] = function (show)
    {
        this.chat.style.display = (show ? 'initial' : 'none')
        return this.talk.style.display = (show ? 'initial' : 'none')
    }

    Varee.prototype["addChat"] = function (line, fix)
    {
        var l

        l = elem({class:`chatline ${line.color}`,parent:this.chat,text:line.body})
        l.move_number = line.move_number
        l.style.left = `${30 + 50}px`
        l.style.top = `${line.move_number * 50 + 25}px`
        if (fix)
        {
            return this.fixChat()
        }
    }

    Varee.prototype["fixChat"] = function ()
    {
        var child, cr, my, so

        so = this.chat.getBoundingClientRect()
        my = 25
        var list = _k_.list(this.chat.children)
        for (var _206_18_ = 0; _206_18_ < list.length; _206_18_++)
        {
            child = list[_206_18_]
            cr = child.getBoundingClientRect()
            if (cr.top - so.top < my)
            {
                child.style.top = `${my}px`
                my += cr.height
            }
            else
            {
                my = _k_.max(my,cr.top - so.top + cr.height)
            }
        }
        my = _k_.max(my,this.tree.moves.length * 50 - 16)
        this.talk.style.top = `${my}px`
        return this.talk.scrollIntoViewIfNeeded()
    }

    Varee.prototype["resizeChat"] = function ()
    {
        var child

        var list = _k_.list(this.chat.children)
        for (var _219_18_ = 0; _219_18_ < list.length; _219_18_++)
        {
            child = list[_219_18_]
            child.style.top = `${child.move_number * 50 + 25}px`
        }
        return this.fixChat()
    }

    Varee.prototype["onInputKey"] = function (event)
    {
        var info

        info = keyinfo.forEvent(event)
        if (0 > info.mod.indexOf('ctrl'))
        {
            event.stopPropagation()
        }
        switch (info.combo)
        {
            case 'enter':
                post.emit('talk',this.input.value)
                return this.input.value = ''

        }

    }

    return Varee
})()

module.exports = Varee