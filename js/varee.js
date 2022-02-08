// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

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
        this.width = 100
        this.height = 100
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
        var color, column, columns, cursor, hlines, pos, vlines, x, y

        this.stn.innerHTML = ''
        columns = this.tree.toColumns().columns
        cursor = this.tree.toColumns().cursor

        hlines = []
        vlines = []
        for (x in columns)
        {
            column = columns[x]
            for (y in column)
            {
                pos = column[y]
                switch (pos)
                {
                    case undefined:
                    case '-':
                        hlines.push([x,y])
                        break
                    default:
                        color = ['black','white'][y % 2]
                        vlines.push([x,y])
                        if (x && y && _k_.in(column[y - 1],[undefined,'-']))
                    {
                        hlines.push([x,y])
                    }
                        elem({class:`varii ${color}`,text:pos,parent:this.stn,style:`left:${x * 50}px; top:${y * 50}px;`})
                }

            }
        }
        this.crs.classList.remove('black')
        this.crs.classList.remove('white')
        this.crs.classList.add(color = ['black','white'][cursor.y % 2])
        this.crs.style.left = `${cursor.x * 50 + 25}px`
        this.crs.style.top = `${cursor.y * 50 + 25}px`
        this.crs.scrollIntoViewIfNeeded()
        return this.drawLines(hlines,vlines)
    }

    Varee.prototype["drawLines"] = function (hlines, vlines)
    {
        var hl, mh, mw, vl

        console.log(hlines)
        this.canvas.width = this.width
        this.canvas.height = this.height
        mw = this.width
        mh = this.height
        this.ctx.strokeStyle = '#800'
        this.ctx.beginPath()
        var list = _k_.list(vlines)
        for (var _88_15_ = 0; _88_15_ < list.length; _88_15_++)
        {
            vl = list[_88_15_]
            this.ctx.moveTo(50 + vl[0] * 100 - 3,50 + vl[1] * 100)
            this.ctx.lineTo(50 + vl[0] * 100 - 3,50 + vl[1] * 100 + 50)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#ff8'
        this.ctx.beginPath()
        var list1 = _k_.list(vlines)
        for (var _95_15_ = 0; _95_15_ < list1.length; _95_15_++)
        {
            vl = list1[_95_15_]
            this.ctx.moveTo(50 + vl[0] * 100 + 3,50 + vl[1] * 100)
            this.ctx.lineTo(50 + vl[0] * 100 + 3,50 + vl[1] * 100 + 50)
            mh = _k_.max(mh,50 + vl[1] * 100 + 50)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#800'
        this.ctx.beginPath()
        var list2 = _k_.list(hlines)
        for (var _103_15_ = 0; _103_15_ < list2.length; _103_15_++)
        {
            hl = list2[_103_15_]
            this.ctx.moveTo(50 + hl[0] * 100,50 + hl[1] * 100 - 2)
            this.ctx.lineTo(50 + hl[0] * 100 + 50,50 + hl[1] * 100 - 2)
        }
        this.ctx.stroke()
        this.ctx.strokeStyle = '#ff8'
        this.ctx.beginPath()
        var list3 = _k_.list(hlines)
        for (var _110_15_ = 0; _110_15_ < list3.length; _110_15_++)
        {
            hl = list3[_110_15_]
            this.ctx.moveTo(50 + hl[0] * 100,50 + hl[1] * 100 + 2)
            this.ctx.lineTo(50 + hl[0] * 100 + 50,50 + hl[1] * 100 + 2)
            mw = _k_.max(mw,50 + hl[0] * 100 + 50)
        }
        this.ctx.stroke()
        if (mw > this.width || mh > this.height)
        {
            this.width = mw
            this.height = mh
            return this.drawLines(hlines,vlines)
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