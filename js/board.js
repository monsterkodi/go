// monsterkodi/kode 0.237.0

var _k_ = {max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var $, alpha, Board, elem, kpos, kxk, opponent, post, preload, randIntRange, stone, stoneColor

kxk = require('kxk')
max = Math.max
min = Math.min

elem = kxk.elem
kpos = kxk.kpos
post = kxk.post
randIntRange = kxk.randIntRange
$ = kxk.$

stone = require('./util/util').stone
stoneColor = require('./util/util').stoneColor
alpha = require('./util/util').alpha
opponent = require('./util/util').opponent

preload = true

Board = (function ()
{
    function Board (parent, size = 19)
    {
        var d, h, key, s

        this.parent = parent
        this.size = size
    
        this["onVariation"] = this["onVariation"].bind(this)
        this["onTree"] = this["onTree"].bind(this)
        this["onMouseDown"] = this["onMouseDown"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this.div = elem('div',{class:'board',parent:this.parent})
        this.img = elem('img',{class:'wood',src:'../img/spacer.png',parent:this.div})
        this.shd = elem('div',{class:'shadows',parent:this.div})
        this.coo = elem('div',{class:'coordinates',parent:this.div})
        this.div.addEventListener('mousemove',this.onMouseMove)
        this.div.addEventListener('mousedown',this.onMouseDown)
        this.div.addEventListener('mouseleave',this.onMouseLeave)
        this.height = 1000
        this.width = this.height
        s = this.height
        d = s / (this.size + 1)
        h = 97 / (this.size + 1)
        this.lines()
        this.coordinates()
        this.stn = elem('div',{class:'stones',parent:this.div})
        this.lib = elem('div',{class:'liberties',parent:this.div})
        this.num = elem('div',{class:'numbers',parent:this.div})
        this.ter = elem('div',{class:'territory',parent:this.div})
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        this.hvw = elem('div',{class:"hover white",parent:this.hlt})
        this.hvb = elem('div',{class:"hover black",parent:this.hlt})
        this.hvw.style = `width:${h}%; height:${h}%; display:none;`
        this.hvb.style = `width:${h}%; height:${h}%; display:none;`
        this.hvr = {white:this.hvw,black:this.hvb}
        this.show = {}
        var list = ['numbers','liberties','territory','coordinates']
        for (var _51_16_ = 0; _51_16_ < list.length; _51_16_++)
        {
            key = list[_51_16_]
            this.show[key] = window.stash.get(key)
            this[key.slice(0, 3)].style.display = (this.show[key] ? 'initial' : 'none')
        }
        this.lst = elem('div',{class:'last',parent:this.hlt})
        this.lst.style = "display:none;"
        post.on('variation',this.onVariation)
        post.on('resize',this.onResize)
        post.on('tree',this.onTree)
        this.scaleFonts()
    }

    Board.prototype["preloadStones"] = function ()
    {
        var ci, prl

        if (preload)
        {
            preload = false
            prl = elem('div',{parent:this.div})
            for (ci = 1; ci <= 15; ci++)
            {
                elem('img',{class:'stone',src:`../img/stone_white${ci}.png`,width:'auto',height:'1px',style:'left:0px; top:0px;',parent:prl})
            }
            return elem('img',{class:'stone',src:"../img/stone_black.png",width:'auto',height:'1px',style:'left:0px; top:0px;',parent:prl})
        }
    }

    Board.prototype["onResize"] = function ()
    {
        return this.scaleFonts()
    }

    Board.prototype["scaleFonts"] = function ()
    {
        var s

        s = this.div.getBoundingClientRect().height / (this.size + 1)
        s = _k_.max(10,s / 6)
        return this.coo.style.fontSize = `${s}px`
    }

    Board.prototype["lines"] = function ()
    {
        var d, i, o, s, x, y

        s = this.height * 2
        d = s / (this.size + 1)
        o = d
        this.canvas = elem('canvas',{class:'lines',height:s,width:s,parent:this.div})
        this.ctx = this.canvas.getContext('2d')
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 1.5
        this.ctx.fillStyle = 'black'
        for (var _98_17_ = i = 0, _98_21_ = this.size; (_98_17_ <= _98_21_ ? i < this.size : i > this.size); (_98_17_ <= _98_21_ ? ++i : --i))
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
                        this.ctx.arc(s / 2 + x * d * (parseInt(-this.size / 2) + 3),s / 2 + y * d * (parseInt(-this.size / 2) + 3),s / 280,0,2 * Math.PI,false)
                    }
                    else if (x && y)
                    {
                        this.ctx.arc(s / 2 + x * d * (parseInt(-this.size / 2) + 2),s / 2 + y * d * (parseInt(-this.size / 2) + 2),s / 280,0,2 * Math.PI,false)
                    }
                    this.ctx.fill()
                }
            }
        }
    }

    Board.prototype["coordinates"] = function ()
    {
        var d, n, x

        d = 100 / (this.size + 1)
        for (var _126_17_ = x = 0, _126_21_ = this.size; (_126_17_ <= _126_21_ ? x < this.size : x > this.size); (_126_17_ <= _126_21_ ? ++x : --x))
        {
            n = elem('div',{class:'coordinate',text:alpha[x],parent:this.coo})
            n.style.left = `${d * (x + 1)}%`
            n.style.top = `${d / 4}%`
            n = elem('div',{class:'coordinate',text:alpha[x],parent:this.coo})
            n.style.left = `${d * (x + 1)}%`
            n.style.top = `${100 - d / 4}%`
            n = elem('div',{class:'coordinate',text:this.size - x,parent:this.coo})
            n.style.left = `${d / 4}%`
            n.style.top = `${d * (x + 1)}%`
            n = elem('div',{class:'coordinate',text:this.size - x,parent:this.coo})
            n.style.left = `${100 - d / 4}%`
            n.style.top = `${d * (x + 1)}%`
            this.coo.style.display = (window.stash.get('coordinates') ? 'initial' : 'none')
        }
    }

    Board.prototype["toggleNumbers"] = function ()
    {
        return this.toggleShow('numbers')
    }

    Board.prototype["toggleLiberties"] = function ()
    {
        return this.toggleShow('liberties')
    }

    Board.prototype["toggleTerritory"] = function ()
    {
        return this.toggleShow('territory')
    }

    Board.prototype["toggleCoordinates"] = function ()
    {
        return this.toggleShow('coordinates')
    }

    Board.prototype["toggleShow"] = function (key)
    {
        this.show[key] = !this.show[key]
        window.stash.set(key,this.show[key])
        return this[key.slice(0, 3)].style.display = (this.show[key] ? 'initial' : 'none')
    }

    Board.prototype["hideHover"] = function ()
    {
        this.hvr.black.style.display = 'none'
        return this.hvr.white.style.display = 'none'
    }

    Board.prototype["onMouseLeave"] = function (event)
    {
        return this.hideHover()
    }

    Board.prototype["onMouseMove"] = function (event)
    {
        var c, hvr, nextColor, p

        this.hideHover()
        c = this.posAtEvent(event)
        nextColor = this.game.nextColor()
        if (!this.game.paused && this.game.players[nextColor] !== 'human')
        {
            return
        }
        if (c.x < 0 || c.y < 0 || c.x >= this.size || c.y >= this.size)
        {
            return
        }
        if (!this.game.legal(nextColor,[c.x,c.y]))
        {
            return
        }
        hvr = this.hvr[nextColor]
        hvr.style.display = 'initial'
        p = this.posToPrcnt(c)
        hvr.style.left = `${p.x}%`
        hvr.style.top = `${p.y}%`
        return hvr.style.borderRadius = `${0.5 * this.div.getBoundingClientRect().height / (this.size + 1)}px`
    }

    Board.prototype["onMouseDown"] = function (event)
    {
        var c, nextColor, p

        nextColor = this.game.nextColor()
        if (!this.game.paused && this.game.players[nextColor] !== 'human')
        {
            return
        }
        c = this.posAtEvent(event)
        if (this.game)
        {
            p = this.game.pos([c.x,c.y])
            if (_k_.in(p,this.game.all_legal()))
            {
                this.hvr[nextColor].style.display = 'none'
                return post.emit('playerMove',p,'human')
            }
        }
    }

    Board.prototype["showLastMove"] = function ()
    {
        var d, r

        if (this.game.start() || this.game.moves.lastIsPass())
        {
            this.lst.style.display = 'none'
            return
        }
        r = this.coordToPrcnt(this.game.lastCoord())
        d = this.divRect.height / (this.size + 1)
        this.lst.style.left = `${r.x}%`
        this.lst.style.top = `${r.y}%`
        this.lst.style.width = `${0.5 * d}px`
        this.lst.style.height = `${0.5 * d}px`
        this.lst.style.borderRadius = `${0.5 * d}px`
        this.lst.style.borderWidth = `${0.1 * d}px`
        this.lst.style.display = 'initial'
        this.lst.classList.remove('black')
        this.lst.classList.remove('white')
        return this.lst.classList.add(this.game.nextColor())
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
        var cn, d, shd, stn, x, y

        d = 100 / (this.size + 1)
        cn = stoneColor[s]
        if (cn === 'white')
        {
            cn += 1 + (c[0] + c[1]) % 15
        }
        x = (c[0] + 0.5) * 100 / (this.size + 1)
        y = (c[1] + 0.5) * 100 / (this.size + 1)
        shd = elem('img',{class:`shadow pos${c[0]}_${c[1]}`,src:'../img/shadow.png',width:'auto',height:`${1.15 * d}%`,style:`left:${x}%; top:${y}%;`,parent:this.shd})
        return stn = elem('img',{class:`stone pos${c[0]}_${c[1]}`,src:`../img/stone_${cn}.png`,width:'auto',height:`${d}%`,style:`left:${x}%; top:${y}%;`,parent:this.stn})
    }

    Board.prototype["clear"] = function ()
    {
        this.lst.style.display = 'none'
        this.ter.innerHTML = ''
        this.num.innerHTML = ''
        this.lib.innerHTML = ''
        this.stn.innerHTML = ''
        return this.shd.innerHTML = ''
    }

    Board.prototype["annotate"] = function ()
    {
        this.divRect = this.div.getBoundingClientRect()
        this.showLastMove()
        this.numbers()
        this.liberties()
        this.territory()
        return this.game.updateTitle()
    }

    Board.prototype["numbers"] = function ()
    {
        var c, l, m, n, p, s

        this.num.innerHTML = ''
        if (!this.game)
        {
            return
        }
        s = this.divRect.height / (this.size + 1)
        s = _k_.max(16,parseInt(s / 3))
        var list = _k_.list(this.game.moves.m)
        for (var _314_14_ = 0; _314_14_ < list.length; _314_14_++)
        {
            m = list[_314_14_]
            if (_k_.in(m.pos,['pass','resign']))
            {
                continue
            }
            n = this.game.moves.m.indexOf(m)
            c = this.game.coord(m.pos)
            l = elem('div',{class:`number ${m.color}`,parent:this.num,text:1 + n})
            p = this.coordToPrcnt(c)
            l.style = `left:${p.x}%; top:${p.y}%;`
            l.style.fontSize = `${parseInt(2 * s / 3)}px`
            l.style.width = `${s}px`
            l.style.height = `${s}px`
            l.style.borderRadius = `${s}px`
            if (stone.empty === this.game.stoneAt(m.pos))
            {
                l.style.backgroundColor = (m.color === 'white' ? '#faeeea' : 'black')
                l.classList.add('empty')
            }
        }
    }

    Board.prototype["onTree"] = function ()
    {
        return this.hideHover()
    }

    Board.prototype["onVariation"] = function (variation)
    {
        var c, color, l, m, n, p, s

        if (!this.game)
        {
            return
        }
        if (!this.divRect)
        {
            this.divRect = this.div.getBoundingClientRect()
        }
        s = this.divRect.height / (this.size + 1)
        s = _k_.max(16,s / 3)
        color = this.game.nextColor()
        var list = _k_.list(variation)
        for (var _356_14_ = 0; _356_14_ < list.length; _356_14_++)
        {
            m = list[_356_14_]
            n = variation.indexOf(m)
            c = this.game.coord(m)
            l = elem('div',{class:`number ${color}`,parent:this.num,text:1 + n})
            p = this.coordToPrcnt(c)
            l.style = `left:${p.x}%; top:${p.y}%;`
            l.style.fontSize = `${2 * s / 3}px`
            l.style.width = `${s}px`
            l.style.height = `${s}px`
            l.style.borderRadius = `${s}px`
            if (stone.empty === this.game.stoneAt(m))
            {
                l.style.backgroundColor = color
            }
            color = opponent[color]
        }
    }

    Board.prototype["liberties"] = function ()
    {
        var c, color, l, libs, p, s, st

        this.lib.innerHTML = ''
        if (!this.game || !this.show.liberties)
        {
            return
        }
        s = this.divRect.height / (this.size + 1)
        s = _k_.min(15,s / 6)
        var list = ['black','white']
        for (var _384_18_ = 0; _384_18_ < list.length; _384_18_++)
        {
            color = list[_384_18_]
            var list1 = _k_.list(this.game.allStones(color))
            for (var _385_19_ = 0; _385_19_ < list1.length; _385_19_++)
            {
                st = list1[_385_19_]
                c = this.game.coord(st)
                libs = this.game.liberties(c)
                if (libs === 1 && this.show.territory)
                {
                    continue
                }
                c[0] += 0.13
                c[1] += 0.1
                p = this.coordToPrcnt(c)
                l = elem('div',{class:`liberty ${color}`,parent:this.lib,text:libs,style:`left:${p.x}%; top:${p.y}%; font-size: ${s}px;`})
            }
        }
    }

    Board.prototype["territory"] = function ()
    {
        var a, e, g, p, r, s

        this.ter.innerHTML = ''
        if (this.game)
        {
            if (this.game.moves.num() > 1)
            {
                s = this.divRect.height / (this.size + 1)
                s /= 4
                s = s.toFixed(2)
                var list = _k_.list(this.game.areas)
                for (var _410_22_ = 0; _410_22_ < list.length; _410_22_++)
                {
                    a = list[_410_22_]
                    if (_k_.in(a.color,'wbWB'))
                    {
                        var list1 = _k_.list(a.posl)
                        for (var _412_30_ = 0; _412_30_ < list1.length; _412_30_++)
                        {
                            p = list1[_412_30_]
                            e = elem('div',{class:`eye ${a.color}`,parent:this.ter})
                            r = this.coordToPrcnt(this.game.coord(p))
                            e.style = `left:${r.x}%; top:${r.y}%; width:${s}px; height:${s}px; border-radius:${s}px;`
                        }
                    }
                }
                var list2 = _k_.list(this.game.grps)
                for (var _417_22_ = 0; _417_22_ < list2.length; _417_22_++)
                {
                    g = list2[_417_22_]
                    if (g.state === 'dead')
                    {
                        var list3 = _k_.list(g.posl)
                        for (var _419_30_ = 0; _419_30_ < list3.length; _419_30_++)
                        {
                            p = list3[_419_30_]
                            e = elem('div',{class:`eye ${opponent[stoneColor[g.stone]][0]}`,parent:this.ter})
                            r = this.coordToPrcnt(this.game.coord(p))
                            e.style = `left:${r.x}%; top:${r.y}%; width:${s}px; height:${s}px; border-radius:${s}px;`
                        }
                    }
                }
            }
        }
    }

    return Board
})()

module.exports = Board