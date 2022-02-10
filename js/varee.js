// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var elem, post, Varee

elem = require('kxk').elem
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
        this.width = 110
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
                    case '':
                    case '-':
                        break
                    default:
                        color = ['black','white'][y % 2]
                        elem({class:`varii ${color}`,text:pos,parent:this.stn,style:`left:${25 + x * 50}px; top:${25 + y * 50}px;`})
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

    Varee.prototype["drawLines"] = function (lines)
    {
        var hl, hlines, mh, mw, vl, vlines

        hlines = lines.hlines
        vlines = lines.vlines

        this.canvas.width = this.width
        this.canvas.height = this.height
        mw = this.width
        mh = this.height
        this.ctx.strokeStyle = '#800'
        this.ctx.beginPath()
        var list = _k_.list(vlines)
        for (var _84_15_ = 0; _84_15_ < list.length; _84_15_++)
        {
            vl = list[_84_15_]
            this.ctx.moveTo(100 + vl[0][0] * 100 - 1,100 + vl[0][1] * 100)
            this.ctx.lineTo(100 + vl[1][0] * 100 - 1,100 + vl[1][1] * 100)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#ff8'
        this.ctx.beginPath()
        var list1 = _k_.list(vlines)
        for (var _91_15_ = 0; _91_15_ < list1.length; _91_15_++)
        {
            vl = list1[_91_15_]
            this.ctx.moveTo(100 + vl[0][0] * 100 + 2,100 + vl[0][1] * 100)
            this.ctx.lineTo(100 + vl[1][0] * 100 + 2,100 + vl[1][1] * 100)
            mh = _k_.max(mh,200 + vl[1][1] * 100)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#800'
        this.ctx.beginPath()
        var list2 = _k_.list(hlines)
        for (var _99_15_ = 0; _99_15_ < list2.length; _99_15_++)
        {
            hl = list2[_99_15_]
            this.ctx.moveTo(100 + hl[0][0] * 100,100 + hl[0][1] * 100 - 1)
            this.ctx.lineTo(100 + hl[1][0] * 100,100 + hl[1][1] * 100 - 1)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#ff8'
        this.ctx.beginPath()
        var list3 = _k_.list(hlines)
        for (var _106_15_ = 0; _106_15_ < list3.length; _106_15_++)
        {
            hl = list3[_106_15_]
            this.ctx.moveTo(100 + hl[0][0] * 100,100 + hl[0][1] * 100 + 2)
            this.ctx.lineTo(100 + hl[1][0] * 100,100 + hl[1][1] * 100 + 2)
            mw = _k_.max(mw,110 + hl[1][0] * 100)
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