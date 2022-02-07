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
        this.div = elem('div',{class:'varee',parent:this.parent})
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.crs = elem('div',{class:'cursor',parent:this.hlt})
        this.crs.style.width = `${40}px`
        this.crs.style.height = `${40}px`
        post.on('resize',this.onResize)
        post.on('tree',this.onTree)
        this.onResize()
    }

    varee.prototype["onTree"] = function ()
    {
        var ali, ctr, mv, mvi, _36_33_

        this.stn.innerHTML = ''
        var list = _k_.list(this.tree.moves)
        for (var _30_15_ = 0; _30_15_ < list.length; _30_15_++)
        {
            mv = list[_30_15_]
            elem({class:`varii ${mv.color}`,text:mv.pos,parent:this.stn})
        }
        this.crs.classList.remove('black')
        this.crs.classList.remove('white')
        ctr = ((_36_33_=this.tree.cursorTree()) != null ? _36_33_ : this.tree)
        this.crs.classList.add(ctr.moves[ctr.cursor.mvi].color)
        mvi = this.tree.cursor.mvi
        ali = this.tree.cursor.ali
        this.crs.style.left = `${ali * 50 + 30}px`
        this.crs.style.top = `${mvi * 50 + 30}px`
        return this.crs.style.borderRadius = `${40}px`
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
            post.off('resize',this.onResize)
            post.off('tree',this.onTree)
            this.parent.removeChild(this.div)
            return delete this.div
        }
    }

    return varee
})()

module.exports = varee