// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var $, Board, elem, kpos, kxk, randIntRange

kxk = require('kxk')
elem = kxk.elem
kpos = kxk.kpos
randIntRange = kxk.randIntRange
$ = kxk.$


Board = (function ()
{
    function Board (parent, size = 19)
    {
        var d, h, i, o, s, x, y

        this.size = size
    
        this["onMouseDown"] = this["onMouseDown"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this.div = elem('div',{class:'board',parent:parent})
        this.img = elem('img',{class:'wood',src:'../img/wood.png',parent:this.div})
        this.shd = elem('div',{class:'shadows',parent:this.div})
        this.div.addEventListener('mousemove',this.onMouseMove)
        this.div.addEventListener('mousedown',this.onMouseDown)
        this.div.addEventListener('mouseleave',this.onMouseLeave)
        this.height = 1000
        this.width = this.height
        s = this.height
        d = s / (this.size + 1)
        h = 100 / (this.size + 1)
        o = d
        this.canvas = elem('canvas',{class:'lines',height:s,width:s,parent:this.div})
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.hover = elem('div',{class:'hover',parent:this.hlt})
        this.hover.style = `width:${h}%; height:${h}%; display:none;; border-radius:${d / 2}px;`
        this.last = elem('div',{class:'last',parent:this.hlt})
        this.last.style = "width:10px; height:10px; display:initial; border-radius:10px;"
        this.ctx = this.canvas.getContext('2d')
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = (this.size === 19 ? 2 : (this.size === 13 ? 2.5 : 3))
        this.ctx.lineCap = "round"
        this.ctx.fillStyle = '#f6c67111'
        this.ctx.rect(0,0,s,s)
        this.ctx.fill()
        this.ctx.fillStyle = 'black'
        for (var _51_17_ = i = 0, _51_21_ = this.size; (_51_17_ <= _51_21_ ? i < this.size : i > this.size); (_51_17_ <= _51_21_ ? ++i : --i))
        {
            this.ctx.beginPath()
            this.ctx.moveTo(o + i * d,o)
            this.ctx.lineTo(o + i * d,s - o)
            this.ctx.moveTo(o,o + i * d)
            this.ctx.lineTo(s - o,o + i * d)
            this.ctx.stroke()
        }
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                this.ctx.beginPath()
                if (this.size >= 13)
                {
                    this.ctx.arc(s / 2 + x * d * (parseInt(-this.size / 2) + 3),s / 2 + y * d * (parseInt(-this.size / 2) + 3),s / 180,0,2 * Math.PI,false)
                }
                else if (x && y)
                {
                    this.ctx.arc(s / 2 + x * d * (parseInt(-this.size / 2) + 2),s / 2 + y * d * (parseInt(-this.size / 2) + 2),s / 180,0,2 * Math.PI,false)
                }
                this.ctx.fill()
            }
        }
    }

    Board.prototype["onMouseLeave"] = function (event)
    {
        return this.hover.style.display = 'none'
    }

    Board.prototype["onMouseMove"] = function (event)
    {
        var c, p

        c = this.posAtEvent(event)
        if (c.x < 0 || c.y < 0 || c.x >= this.size || c.y >= this.size)
        {
            this.hover.style.display = 'none'
            return
        }
        if (this.gnu)
        {
            p = this.gnu.game.pos([c.x,c.y])
            if (!(_k_.in(p,this.gnu.game.all_legal())))
            {
                this.hover.style.display = 'none'
                return
            }
        }
        this.hover.style.display = 'initial'
        p = this.posToPrcnt(c)
        this.hover.style.left = `${p.x}%`
        return this.hover.style.top = `${p.y}%`
    }

    Board.prototype["onMouseDown"] = function (event)
    {
        var c, p

        c = this.posAtEvent(event)
        if (this.gnu)
        {
            p = this.gnu.game.pos([c.x,c.y])
            if (_k_.in(p,this.gnu.game.all_legal()))
            {
                this.hover.style.display = 'none'
                return this.gnu.humanMove(c)
            }
        }
    }

    Board.prototype["lastMove"] = function (color, c)
    {
        var p

        p = this.coordToPrcnt(c)
        this.last.style.display = 'initial'
        this.last.style.left = `${p.x}%`
        return this.last.style.top = `${p.y}%`
    }

    Board.prototype["posAtEvent"] = function (event)
    {
        var b, p, s

        p = kpos(event)
        b = this.div.getBoundingClientRect()
        p.sub(b)
        s = b.width / (this.size + 1)
        p.div(kpos(s,s))
        p.add(kpos(-1,-1))
        return kpos(parseInt(Math.round(p.x)),parseInt(Math.round(p.y)))
    }

    Board.prototype["coordToPrcnt"] = function (c)
    {
        return this.posToPrcnt(kpos(c[0],c[1]))
    }

    Board.prototype["posToPrcnt"] = function (c)
    {
        return kpos(100 * (c.x + 1) / (this.size + 1),100 * (c.y + 1) / (this.size + 1))
    }

    Board.prototype["delStone"] = function (c)
    {
        var s

        while (s = $(`.pos${c[0]}_${c[1]}`))
        {
            s.remove()
        }
    }

    Board.prototype["addStone"] = function (c, color = 'black')
    {
        var d, shadow, src, stn, stone, x, y

        d = 100 / (this.size + 1)
        stn = color
        if (color === 'white')
        {
            stn += randIntRange(1,15)
        }
        src = `../img/stone_${stn}.png`
        shadow = elem('img',{class:`shadow pos${c[0]}_${c[1]}`,src:'../img/stone_shadow.png',width:"auto",height:`${d + 1}%`,parent:this.shd})
        stone = elem('img',{class:`stone pos${c[0]}_${c[1]}`,src:src,width:"auto",height:`${d}%`,parent:this.stn})
        x = (c[0] + 0.5) * 100 / (this.size + 1)
        y = (c[1] + 0.5) * 100 / (this.size + 1)
        stone.style = `left:${x}%; top:${y}%;`
        return shadow.style = `left:${x}%; top:${y}%;`
    }

    return Board
})()

module.exports = Board