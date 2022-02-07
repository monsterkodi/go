// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var elem, post, varee

elem = require('kxk').elem
post = require('kxk').post

max = Math.max


varee = (function ()
{
    function varee (parent, tree)
    {
        this.parent = parent
        this.tree = tree
    
        this["onResize"] = this["onResize"].bind(this)
        this["onTree"] = this["onTree"].bind(this)
        console.log('varee')
        this.div = elem('div',{class:'varee',parent:this.parent})
        this.canvas = elem('canvas',{class:'treelines',parent:this.div})
        this.ctx = this.canvas.getContext('2d')
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.crs = elem('div',{class:'cursor',parent:this.hlt})
        post.on('resize',this.onResize)
        post.on('tree',this.onTree)
        this.onResize()
    }

    varee.prototype["onTree"] = function ()
    {
        var ali, ctr, mv, mvi, _39_33_

        this.stn.innerHTML = ''
        var list = _k_.list(this.tree.moves)
        for (var _33_15_ = 0; _33_15_ < list.length; _33_15_++)
        {
            mv = list[_33_15_]
            elem({class:`varii ${mv.color}`,text:mv.pos,parent:this.stn})
        }
        this.crs.classList.remove('black')
        this.crs.classList.remove('white')
        ctr = ((_39_33_=this.tree.cursorTree()) != null ? _39_33_ : this.tree)
        this.crs.classList.add(ctr.moves[ctr.cursor.mvi].color)
        mvi = this.tree.cursor.mvi
        ali = this.tree.cursor.ali
        this.crs.style.left = `${ali * 50 + 25}px`
        this.crs.style.top = `${mvi * 50 + 25}px`
        return this.drawLines()
    }

    varee.prototype["drawLines"] = function ()
    {
        this.canvas.width = 200
        this.canvas.height = this.tree.moves.length * 100
        if (this.tree.moves.length > 1)
        {
            this.ctx.strokeStyle = '#800'
            this.ctx.beginPath()
            this.ctx.moveTo(48,50)
            this.ctx.lineTo(48,50 + 100 * (this.tree.moves.length - 1))
            this.ctx.stroke()
            this.ctx.strokeStyle = '#ff8'
            this.ctx.beginPath()
            this.ctx.moveTo(53,50)
            this.ctx.lineTo(53,50 + 100 * (this.tree.moves.length - 1))
            return this.ctx.stroke()
        }
    }

    varee.prototype["onResize"] = function ()
    {
        var br, w

        br = this.parent.getBoundingClientRect()
        w = _k_.max(0,(br.width - br.height) / 2)
        return this.div.style.width = `${w}px`
    }

    varee.prototype["remove"] = function ()
    {
        if (this.div)
        {
            console.log('remove')
            post.off('resize',this.onResize)
            post.off('tree',this.onTree)
            this.parent.removeChild(this.div)
            return delete this.div
        }
    }

    return varee
})()

module.exports = varee