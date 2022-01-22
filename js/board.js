// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var $, alpha, Board, elem, kpos, kxk, opponent, post, randIntRange, stone, stoneColor

kxk = require('kxk')
elem = kxk.elem
kpos = kxk.kpos
post = kxk.post
randIntRange = kxk.randIntRange
$ = kxk.$

stone = require('./util').stone
stoneColor = require('./util').stoneColor
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
        this["onResize"] = this["onResize"].bind(this)
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
        h = 90 / (this.size + 1)
        this.lines()
        this.legend()
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.lib = elem('div',{class:'liberties',parent:this.div})
        this.trr = elem('div',{class:'territory',parent:this.div})
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.hvr = elem('div',{class:`hover ${this.human}`,parent:this.hlt})
        this.hvr.style = `width:${h}%; height:${h}%; display:none;`
        this.lib.style.display = (window.stash.get('liberties') ? 'initial' : 'none')
        this.lst = elem('div',{class:"last",parent:this.hlt})
        this.lst.style = "display:none;"
        post.on('resize',this.onResize)
    }

    Board.prototype["onResize"] = function ()
    {
        return this.lastMove()
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
        for (var _78_17_ = i = 0, _78_21_ = this.size; (_78_17_ <= _78_21_ ? i < this.size : i > this.size); (_78_17_ <= _78_21_ ? ++i : --i))
        {
            this.ctx.beginPath()
            this.ctx.moveTo(o + i * d,o)
            this.ctx.lineTo(o + i * d,s - o)
            this.ctx.moveTo(o,o + i * d)
            this.ctx.lineTo(s - o,o + i * d)
            this.ctx.stroke()
        }
        if (this.size >= 9)
        {
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
    }

    Board.prototype["legend"] = function ()
    {
        var d, n, x

        d = 100 / (this.size + 1)
        for (var _106_17_ = x = 0, _106_21_ = this.size; (_106_17_ <= _106_21_ ? x < this.size : x > this.size); (_106_17_ <= _106_21_ ? ++x : --x))
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

    Board.prototype["toggleTerritory"] = function ()
    {
        window.stash.set('territory',!window.stash.get('territory'))
        return this.trr.style.display = (window.stash.get('territory') ? 'initial' : 'none')
    }

    Board.prototype["onMouseLeave"] = function (event)
    {
        return this.hvr.style.display = 'none'
    }

    Board.prototype["onMouseMove"] = function (event)
    {
        var c, p

        c = this.posAtEvent(event)
        this.hvr.style.display = 'none'
        if (c.x < 0 || c.y < 0 || c.x >= this.size || c.y >= this.size)
        {
            return
        }
        if (this.game)
        {
            if (this.game.moves.length && this.game.moves.slice(-1)[0].startsWith(this.human))
            {
                return
            }
            if (!this.game.legal(this.human,[c.x,c.y]))
            {
                return
            }
        }
        this.hvr.style.display = 'initial'
        p = this.posToPrcnt(c)
        this.hvr.style.left = `${p.x}%`
        this.hvr.style.top = `${p.y}%`
        return this.hvr.style.borderRadius = `${0.5 * this.div.getBoundingClientRect().height / (this.size + 1)}px`
    }

    Board.prototype["onMouseDown"] = function (event)
    {
        var c, p, _178_20_

        c = this.posAtEvent(event)
        if (this.game)
        {
            p = this.game.pos([c.x,c.y])
            if (this.game.moves.length && this.game.moves.slice(-1)[0].startsWith(this.human))
            {
                return
            }
            if (_k_.in(p,this.game.all_legal()))
            {
                this.hvr.style.display = 'none'
                return (this.gnu != null ? this.gnu.humanMove(p) : undefined)
            }
        }
    }

    Board.prototype["lastMove"] = function ()
    {
        var color, d, p, r, _188_29_

        if (_k_.empty((this.game != null ? this.game.moves : undefined)))
        {
            return
        }
        var _189_19_ = this.game.moves.slice(-1)[0].split(' '); color = _189_19_[0]; p = _189_19_[1]

        r = this.coordToPrcnt(this.game.coord(p))
        d = this.div.getBoundingClientRect().height / (this.size + 1)
        this.lst.style.display = 'initial'
        this.lst.style.left = `${r.x}%`
        this.lst.style.top = `${r.y}%`
        this.lst.style.width = `${0.5 * d}px`
        this.lst.style.height = `${0.5 * d}px`
        this.lst.style.borderRadius = `${0.5 * d}px`
        this.lst.style.borderWidth = `${0.1 * d}px`
        this.lst.classList.remove('black')
        this.lst.classList.remove('white')
        return this.lst.classList.add(opponent[color])
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

    Board.prototype["addStone"] = function (c, s = stone.black)
    {
        var cn, d, o, shd, src, stn, x, y

        d = 100 / (this.size + 1)
        cn = stoneColor[s]
        if (cn === 'white')
        {
            cn += randIntRange(1,15)
        }
        src = `../img/stone_${cn}.png`
        shd = elem('img',{class:`shadow pos${c[0]}_${c[1]}`,src:'../img/stone_shadow.png',width:"auto",height:`${1.15 * d}%`,parent:this.shd})
        stn = elem('img',{class:`stone pos${c[0]}_${c[1]}`,src:src,width:"auto",height:`${d}%`,parent:this.stn})
        x = (c[0] + 0.5) * 100 / (this.size + 1)
        y = (c[1] + 0.5) * 100 / (this.size + 1)
        stn.style = `left:${x}%; top:${y}%;`
        shd.style = `left:${x}%; top:${y}%; opacity:${o = (this.size === 19 ? 0.5 : (this.size === 13 ? 0.6 : 0.7))};`
        return this.annotate()
    }

    Board.prototype["clear"] = function ()
    {
        this.lst.style.display = 'none'
        this.shd.innerHTML = ''
        this.stn.innerHTML = ''
        return this.lib.innerHTML = ''
    }

    Board.prototype["annotate"] = function ()
    {
        this.liberties()
        return this.territory()
    }

    Board.prototype["liberties"] = function ()
    {
        var c, color, l, p, s

        this.lib.innerHTML = ''
        if (this.game)
        {
            var list = ['black','white']
            for (var _279_22_ = 0; _279_22_ < list.length; _279_22_++)
            {
                color = list[_279_22_]
                var list1 = _k_.list(this.game.allStones(color))
                for (var _280_22_ = 0; _280_22_ < list1.length; _280_22_++)
                {
                    s = list1[_280_22_]
                    c = this.game.coord(s)
                    l = elem('div',{class:`liberty ${color}`,parent:this.lib,text:this.game.liberties(c)})
                    p = this.coordToPrcnt(c)
                    l.style = `left:${p.x}%; top:${p.y}%;`
                }
            }
        }
    }

    Board.prototype["territory"] = function ()
    {
        var a, e, g, p, r, s

        this.trr.innerHTML = ''
        if (this.game)
        {
            if (this.game.moves.length > 1)
            {
                var list = _k_.list(this.game.areas)
                for (var _298_22_ = 0; _298_22_ < list.length; _298_22_++)
                {
                    a = list[_298_22_]
                    if (_k_.in(a.color,'wbWB'))
                    {
                        var list1 = _k_.list(a.area)
                        for (var _300_30_ = 0; _300_30_ < list1.length; _300_30_++)
                        {
                            p = list1[_300_30_]
                            e = elem('div',{class:`eye ${a.color}`,parent:this.trr})
                            r = this.coordToPrcnt(this.game.coord(p))
                            s = 15 / (this.size + 1)
                            s = s.toFixed(2)
                            e.style = `left:${r.x}%; top:${r.y}%; width:${s}%; height:${s}%;`
                        }
                    }
                }
                var list2 = _k_.list(this.game.grps)
                for (var _308_22_ = 0; _308_22_ < list2.length; _308_22_++)
                {
                    g = list2[_308_22_]
                    if (g.state === 'dead')
                    {
                        var list3 = _k_.list(g.group)
                        for (var _310_30_ = 0; _310_30_ < list3.length; _310_30_++)
                        {
                            p = list3[_310_30_]
                            e = elem('div',{class:`eye ${opponent[stoneColor[g.stone]][0]}`,parent:this.trr})
                            r = this.coordToPrcnt(this.game.coord(p))
                            s = 15 / (this.size + 1)
                            s = s.toFixed(2)
                            e.style = `left:${r.x}%; top:${r.y}%; width:${s}%; height:${s}%;`
                        }
                    }
                }
            }
        }
    }

    return Board
})()

module.exports = Board