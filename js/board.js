// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var $, alpha, Board, elem, kpos, kxk, opponent, randIntRange

kxk = require('kxk')
elem = kxk.elem
kpos = kxk.kpos
randIntRange = kxk.randIntRange
$ = kxk.$

alpha = require('./util').alpha
opponent = require('./util').opponent


Board = (function ()
{
    function Board (parent, size = 19, human)
    {
        var d, h, s

        this.size = size
        this.human = human
    
        this["onMouseDown"] = this["onMouseDown"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this.div = elem('div',{class:'board',parent:parent})
        this.img = elem('img',{class:'wood',src:'../img/wood.png',parent:this.div})
        this.shd = elem('div',{class:'shadows',parent:this.div})
        this.lgd = elem('div',{class:'legends',parent:this.div})
        this.div.addEventListener('mousemove',this.onMouseMove)
        this.div.addEventListener('mousedown',this.onMouseDown)
        this.div.addEventListener('mouseleave',this.onMouseLeave)
        this.height = 1000
        this.width = this.height
        s = this.height
        d = s / (this.size + 1)
        h = 100 / (this.size + 2)
        this.lines()
        this.legend()
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.lib = elem('div',{class:'liberties',parent:this.div})
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.hover = elem('div',{class:`hover ${this.human}`,parent:this.hlt})
        this.hover.style = `width:${h}%; height:${h}%; display:none; border-radius:${d / 2}px;`
        this.lib.style.display = (window.stash.get('liberties') ? 'initial' : 'none')
        this.last = elem('div',{class:"last",parent:this.hlt})
        this.last.style = "width:10px; height:10px; display:none; border-radius:10px;"
    }

    Board.prototype["lines"] = function ()
    {
        var d, i, o, s, x, y

        s = this.height
        d = s / (this.size + 1)
        o = d
        this.canvas = elem('canvas',{class:'lines',height:s,width:s,parent:this.div})
        this.ctx = this.canvas.getContext('2d')
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = (this.size === 19 ? 2 : (this.size === 13 ? 2.5 : 3))
        this.ctx.lineCap = "round"
        this.ctx.fillStyle = '#f6c67111'
        this.ctx.rect(0,0,s,s)
        this.ctx.fill()
        this.ctx.fillStyle = 'black'
        for (var _70_17_ = i = 0, _70_21_ = this.size; (_70_17_ <= _70_21_ ? i < this.size : i > this.size); (_70_17_ <= _70_21_ ? ++i : --i))
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

    Board.prototype["legend"] = function ()
    {
        var d, n, x

        d = 100 / (this.size + 1)
        for (var _97_17_ = x = 0, _97_21_ = this.size; (_97_17_ <= _97_21_ ? x < this.size : x > this.size); (_97_17_ <= _97_21_ ? ++x : --x))
        {
            n = elem('div',{class:'legend',text:alpha[x],parent:this.lgd})
            n.style.left = `${d * (x + 1)}%`
            n.style.top = `${d / 4}%`
            n = elem('div',{class:'legend',text:alpha[x],parent:this.lgd})
            n.style.left = `${d * (x + 1)}%`
            n.style.top = `${100 - d / 4}%`
            n = elem('div',{class:'legend',text:this.size - x,parent:this.lgd})
            n.style.left = `${d / 4}%`
            n.style.top = `${d * (x + 1)}%`
            n = elem('div',{class:'legend',text:this.size - x,parent:this.lgd})
            n.style.left = `${100 - d / 4}%`
            n.style.top = `${d * (x + 1)}%`
            this.lgd.style.display = (window.stash.get('legend') ? 'initial' : 'none')
        }
    }

    Board.prototype["toggleLegend"] = function ()
    {
        window.stash.set('legend',!window.stash.get('legend'))
        return this.lgd.style.display = (window.stash.get('legend') ? 'initial' : 'none')
    }

    Board.prototype["toggleLiberties"] = function ()
    {
        window.stash.set('liberties',!window.stash.get('liberties'))
        return this.lib.style.display = (window.stash.get('liberties') ? 'initial' : 'none')
    }

    Board.prototype["onMouseLeave"] = function (event)
    {
        return this.hover.style.display = 'none'
    }

    Board.prototype["onMouseMove"] = function (event)
    {
        var c, legal, p

        c = this.posAtEvent(event)
        if (c.x < 0 || c.y < 0 || c.x >= this.size || c.y >= this.size)
        {
            this.hover.style.display = 'none'
            return
        }
        if (this.game)
        {
            legal = this.game.legal(this.human,[c.x,c.y])
            if (!legal)
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
        var c, p, _165_20_

        c = this.posAtEvent(event)
        if (this.game)
        {
            p = this.game.pos([c.x,c.y])
            if (_k_.in(p,this.game.all_legal()))
            {
                this.hover.style.display = 'none'
                return (this.gnu != null ? this.gnu.humanMove(p) : undefined)
            }
        }
    }

    Board.prototype["lastMove"] = function (color, c)
    {
        var p

        p = this.coordToPrcnt(c)
        this.last.style.display = 'initial'
        this.last.style.left = `${p.x}%`
        this.last.style.top = `${p.y}%`
        this.last.classList.remove('black')
        this.last.classList.remove('white')
        this.last.classList.add(opponent(color))
        return this.liberties()
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
        var d, o, shadow, src, stn, stone, x, y

        d = 100 / (this.size + 1)
        stn = color
        if (color === 'white')
        {
            stn += randIntRange(1,15)
        }
        src = `../img/stone_${stn}.png`
        shadow = elem('img',{class:`shadow pos${c[0]}_${c[1]}`,src:'../img/stone_shadow.png',width:"auto",height:`${d}%`,parent:this.shd})
        stone = elem('img',{class:`stone pos${c[0]}_${c[1]}`,src:src,width:"auto",height:`${d}%`,parent:this.stn})
        x = (c[0] + 0.5) * 100 / (this.size + 1)
        y = (c[1] + 0.5) * 100 / (this.size + 1)
        stone.style = `left:${x}%; top:${y}%;`
        o = (this.size === 19 ? 0.5 : (this.size === 13 ? 0.8 : 1.0))
        shadow.style = `left:${x + 10.0 / this.size}%; top:${y + 10.0 / this.size}%; opacity:${o};`
        return this.liberties()
    }

    Board.prototype["clear"] = function ()
    {
        this.last.style.display = 'none'
        this.shd.innerHTML = ''
        this.stn.innerHTML = ''
        return this.lib.innerHTML = ''
    }

    Board.prototype["liberties"] = function ()
    {
        var c, color, e, l, p, s, x, y

        this.lib.innerHTML = ''
        if (this.game)
        {
            var list = ['black','white']
            for (var _248_22_ = 0; _248_22_ < list.length; _248_22_++)
            {
                color = list[_248_22_]
                var list1 = _k_.list(this.game.allStones(color))
                for (var _249_22_ = 0; _249_22_ < list1.length; _249_22_++)
                {
                    s = list1[_249_22_]
                    c = this.game.coord(s)
                    l = elem('div',{class:`liberty ${color}`,parent:this.lib,text:this.game.liberties(c)})
                    p = this.coordToPrcnt(c)
                    l.style = `left:${p.x}%; top:${p.y}%;`
                }
            }
            for (var _255_21_ = y = 0, _255_25_ = this.size; (_255_21_ <= _255_25_ ? y < this.size : y > this.size); (_255_21_ <= _255_25_ ? ++y : --y))
            {
                for (var _256_25_ = x = 0, _256_29_ = this.size; (_256_25_ <= _256_29_ ? x < this.size : x > this.size); (_256_25_ <= _256_29_ ? ++x : --x))
                {
                    if (color = this.game.isEye([x,y]))
                    {
                        e = elem('div',{class:`eye ${color}`,parent:this.lib})
                        p = this.coordToPrcnt([x,y])
                        e.style = `left:${p.x}%; top:${p.y}%;`
                    }
                }
            }
        }
    }

    return Board
})()

module.exports = Board