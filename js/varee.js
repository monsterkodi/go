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
        var h00, h01, h10, h11, hl, hlines, mh, mw, v00, v01, v10, v11, vl, vlines

        hlines = lines.hlines
        vlines = lines.vlines

        this.canvas.width = this.width
        this.canvas.height = this.height
        mw = this.width
        mh = this.height
        var list = _k_.list(vlines)
        for (var _82_15_ = 0; _82_15_ < list.length; _82_15_++)
        {
            vl = list[_82_15_]
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
        for (var _100_15_ = 0; _100_15_ < list1.length; _100_15_++)
        {
            hl = list1[_100_15_]
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