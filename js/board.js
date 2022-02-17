// monsterkodi/kode 0.237.0

var _k_ = {max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }}

var $, abs, alpha, Board, elem, kpos, kxk, opponent, post, preload, randIntRange, stone, stoneColor, stopEvent

kxk = require('kxk')
abs = Math.abs
max = Math.max
min = Math.min

elem = kxk.elem
kpos = kxk.kpos
post = kxk.post
randIntRange = kxk.randIntRange
stopEvent = kxk.stopEvent
$ = kxk.$

stone = require('./util/util').stone
stoneColor = require('./util/util').stoneColor
alpha = require('./util/util').alpha
opponent = require('./util/util').opponent

preload = true

Board = (function ()
{
    function Board (parent, size = 19, features)
    {
        var d, h, key, s, _20_18_, _21_30_, _22_30_, _23_30_, _24_30_, _25_30_, _26_30_

        this.parent = parent
        this.size = size
        this.features = features
    
        this["onVariation"] = this["onVariation"].bind(this)
        this["onTree"] = this["onTree"].bind(this)
        this["onMouseWheel"] = this["onMouseWheel"].bind(this)
        this["clearWheelAccum"] = this["clearWheelAccum"].bind(this)
        this["onMouseDown"] = this["onMouseDown"].bind(this)
        this["onMouseMove"] = this["onMouseMove"].bind(this)
        this["onMouseLeave"] = this["onMouseLeave"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this.features = ((_20_18_=this.features) != null ? _20_18_ : {})
        this.features.coordinates = ((_21_30_=this.features.coordinates) != null ? _21_30_ : true)
        this.features.variations = ((_22_30_=this.features.variations) != null ? _22_30_ : true)
        this.features.territory = ((_23_30_=this.features.territory) != null ? _23_30_ : true)
        this.features.liberties = ((_24_30_=this.features.liberties) != null ? _24_30_ : true)
        this.features.numbers = ((_25_30_=this.features.numbers) != null ? _25_30_ : true)
        this.features.hover = ((_26_30_=this.features.hover) != null ? _26_30_ : true)
        this.div = elem('div',{class:'board',parent:this.parent})
        this.img = elem('img',{class:'wood',src:'../img/spacer.png',parent:this.div})
        this.shd = elem('div',{class:'shadows',parent:this.div})
        if (this.features.coordinates)
        {
            this.coo = elem('div',{class:'coordinates',parent:this.div})
        }
        if (this.features.hover)
        {
            this.wheelAccum = {x:0,y:0}
            this.div.addEventListener('mousemove',this.onMouseMove)
            this.div.addEventListener('mousedown',this.onMouseDown)
            this.div.addEventListener('mouseleave',this.onMouseLeave)
            this.parent.addEventListener('mousewheel',this.onMouseWheel)
        }
        this.height = 1000
        this.width = this.height
        s = this.height
        d = s / (this.size + 1)
        h = 97 / (this.size + 1)
        this.lines()
        this.coordinates()
        this.stn = elem('div',{class:'stones',parent:this.div})
        if (this.features.liberties)
        {
            this.lib = elem('div',{class:'liberties',parent:this.div})
        }
        if (this.features.numbers)
        {
            this.num = elem('div',{class:'numbers',parent:this.div})
        }
        if (this.features.variations)
        {
            this.var = elem('div',{class:'variations',parent:this.div})
        }
        if (this.features.territory)
        {
            this.ter = elem('div',{class:'territory',parent:this.div})
        }
        this.hlt = elem('div',{class:'highlts',parent:this.div})
        if (this.features.hover)
        {
            this.hvw = elem('div',{class:"hover white",parent:this.hlt})
            this.hvb = elem('div',{class:"hover black",parent:this.hlt})
            this.hvw.style = `width:${h}%; height:${h}%; display:none;`
            this.hvb.style = `width:${h}%; height:${h}%; display:none;`
            this.hvr = {white:this.hvw,black:this.hvb}
        }
        this.show = {}
        var list = ['numbers','liberties','territory','coordinates','variations']
        for (var _67_16_ = 0; _67_16_ < list.length; _67_16_++)
        {
            key = list[_67_16_]
            if (this.features[key])
            {
                this.show[key] = window.stash.get(key)
            }
            if ((this[key.slice(0, 3)] != null)) { this[key.slice(0, 3)].style.display = (this.show[key] ? 'initial' : 'none') }
        }
        this.lst = elem('div',{class:'last',parent:this.hlt})
        this.lst.style = "display:none;"
        post.on('variation',this.onVariation)
        post.on('resize',this.onResize)
        post.on('tree',this.onTree)
    }

    Board.prototype["remove"] = function ()
    {
        if (!this.div)
        {
            return
        }
        post.off('variation',this.onVariation)
        post.off('resize',this.onResize)
        post.off('tree',this.onTree)
        if (this.features.hover)
        {
            this.div.removeEventListener('mousemove',this.onMouseMove)
            this.div.removeEventListener('mousedown',this.onMouseDown)
            this.div.removeEventListener('mouseleave',this.onMouseLeave)
            this.parent.removeEventListener('mousewheel',this.onMouseWheel)
        }
        this.parent.removeChild(this.div)
        return delete this.div
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

        if (!this.features.coordinates)
        {
            return
        }
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
        for (var _131_17_ = i = 0, _131_21_ = this.size; (_131_17_ <= _131_21_ ? i < this.size : i > this.size); (_131_17_ <= _131_21_ ? ++i : --i))
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

        if (!this.features.coordinates)
        {
            return
        }
        d = 100 / (this.size + 1)
        for (var _161_17_ = x = 0, _161_21_ = this.size; (_161_17_ <= _161_21_ ? x < this.size : x > this.size); (_161_17_ <= _161_21_ ? ++x : --x))
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

    Board.prototype["toggleVariations"] = function ()
    {
        return this.toggleShow('variations')
    }

    Board.prototype["toggleShow"] = function (key)
    {
        this.show[key] = !this.show[key]
        window.stash.set(key,this.show[key])
        return this[key.slice(0, 3)].style.display = (this.show[key] ? 'initial' : 'none')
    }

    Board.prototype["hideHover"] = function ()
    {
        if (!this.features.hover)
        {
            return
        }
        this.hvr.black.style.display = 'none'
        return this.hvr.white.style.display = 'none'
    }

    Board.prototype["onMouseLeave"] = function (event)
    {
        return this.hideHover()
    }

    Board.prototype["onMouseMove"] = function (event)
    {
        var c, hvr, meta, nextColor, p

        meta = event.getModifierState('Meta')
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
        if (meta)
        {
            nextColor = this.game.lastColor()
        }
        else
        {
            if (!this.game.legal(nextColor,[c.x,c.y]))
            {
                return
            }
        }
        if (_k_.in(nextColor,['black','white']))
        {
            hvr = this.hvr[nextColor]
            hvr.style.display = 'initial'
            p = this.posToPrcnt(c)
            hvr.style.left = `${p.x}%`
            hvr.style.top = `${p.y}%`
            return hvr.style.borderRadius = `${0.5 * this.div.getBoundingClientRect().height / (this.size + 1)}px`
        }
    }

    Board.prototype["onMouseDown"] = function (event)
    {
        var c, meta, nextColor, p

        nextColor = this.game.nextColor()
        if (!this.game.paused && this.game.players[nextColor] !== 'human')
        {
            return
        }
        meta = event.getModifierState('Meta')
        c = this.posAtEvent(event)
        p = this.game.pos([c.x,c.y])
        if (_k_.in(p,this.game.all_legal()))
        {
            this.hvr[nextColor].style.display = 'none'
            if (meta)
            {
                return post.emit('altMove',p)
            }
            else
            {
                return post.emit('playerMove',p,'human')
            }
        }
    }

    Board.prototype["clearWheelAccum"] = function ()
    {
        return this.wheelAccum = {x:0,y:0}
    }

    Board.prototype["onMouseWheel"] = function (event)
    {
        var md, ox, oy

        clearTimeout(this.wheelTimeout)
        this.wheelTimeout = setTimeout(this.clearWheelAccum,200)
        ox = this.wheelAccum.x
        oy = this.wheelAccum.y
        this.wheelAccum.x += event.deltaX
        this.wheelAccum.y += event.deltaY
        md = 200
        if (abs(this.wheelAccum.x) > abs(this.wheelAccum.y))
        {
            if (ox === 0)
            {
                post.emit('navigate',(this.wheelAccum.x > 0 ? 'right' : 'left'))
            }
            if (this.wheelAccum.x > md)
            {
                this.wheelAccum = {x:0,y:0}
                return post.emit('navigate','right')
            }
            else if (this.wheelAccum.x < -md)
            {
                this.wheelAccum = {x:0,y:0}
                return post.emit('navigate','left')
            }
        }
        else
        {
            if (oy === 0)
            {
                post.emit('navigate',(this.wheelAccum.y > 0 ? 'down' : 'up'))
            }
            if (this.wheelAccum.y > md)
            {
                this.wheelAccum = {x:0,y:0}
                return post.emit('navigate','down')
            }
            else if (this.wheelAccum.y < -md)
            {
                this.wheelAccum = {x:0,y:0}
                return post.emit('navigate','up')
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
        d = this.divSize / (this.size + 1)
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
        var _366_12_, _367_12_, _368_12_, _369_12_

        this.lst.style.display = 'none'
        this.stn.innerHTML = ''
        this.shd.innerHTML = ''
        if ((this.ter != null)) { this.ter.innerHTML = '' }
        if ((this.num != null)) { this.num.innerHTML = '' }
        if ((this.lib != null)) { this.lib.innerHTML = '' }
        if ((this.var != null)) { this.var.innerHTML = '' }
        return this
    }

    Board.prototype["annotate"] = function ()
    {
        this.divRect = this.div.getBoundingClientRect()
        this.divSize = _k_.max(this.divRect.width,this.divRect.height)
        this.showLastMove()
        this.numbers()
        this.variations()
        this.liberties()
        this.territory()
        return this.game.updateTitle()
    }

    Board.prototype["numbers"] = function ()
    {
        var c, l, m, n, p, s

        if (!this.features.numbers)
        {
            return
        }
        this.num.innerHTML = ''
        if (!this.game)
        {
            return
        }
        s = this.divSize / (this.size + 1)
        s = _k_.max(16,parseInt(s / 3))
        var list = _k_.list(this.game.moves.m)
        for (var _407_14_ = 0; _407_14_ < list.length; _407_14_++)
        {
            m = list[_407_14_]
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

    Board.prototype["variations"] = function ()
    {
        var c, l, mv, p, s

        if (!this.features.variations)
        {
            return
        }
        this.var.innerHTML = ''
        if (!this.game)
        {
            return
        }
        if (!this.tree)
        {
            return
        }
        s = this.divSize / (this.size + 1)
        s = _k_.max(16,parseInt(s / 3))
        var list = _k_.list(this.tree.cursorVariations())
        for (var _447_15_ = 0; _447_15_ < list.length; _447_15_++)
        {
            mv = list[_447_15_]
            c = this.game.coord(mv.pos)
            p = this.coordToPrcnt(c)
            l = elem('div',{class:`variation ${mv.color}`,parent:this.var,text:mv.pos,style:`left:${p.x}%;top:${p.y}%; font-size:${parseInt(1 * s / 2)}px; border-radius:${s}px; width:${s}px; height:${s}px;`})
        }
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
            console.log('no rect?')
            this.divRect = this.div.getBoundingClientRect()
            this.divSize = _k_.max(this.divRect.width,this.divRect.height)
        }
        s = this.divSize / (this.size + 1)
        s = _k_.max(16,s / 3)
        color = this.game.nextColor()
        var list = _k_.list(variation)
        for (var _465_14_ = 0; _465_14_ < list.length; _465_14_++)
        {
            m = list[_465_14_]
            n = variation.indexOf(m)
            c = this.game.coord(m)
            l = elem('div',{class:`number ${color}`,parent:this.num,text:1 + n})
            p = this.coordToPrcnt(c)
            l.style = `left:${p.x}%; top:${p.y}%;`
            l.style.fontSize = `${1 * s / 2}px`
            l.style.width = `${s}px`
            l.style.height = `${s}px`
            l.style.borderRadius = `${s}px`
            l.style.backgroundColor = color
            color = opponent[color]
        }
    }

    Board.prototype["liberties"] = function ()
    {
        var c, color, l, libs, p, s, st

        if (!this.features.liberties)
        {
            return
        }
        this.lib.innerHTML = ''
        if (!this.game || !this.show.liberties)
        {
            return
        }
        s = this.divSize / (this.size + 1)
        s = _k_.min(15,s / 6)
        var list = ['black','white']
        for (var _495_18_ = 0; _495_18_ < list.length; _495_18_++)
        {
            color = list[_495_18_]
            var list1 = _k_.list(this.game.allStones(color))
            for (var _496_19_ = 0; _496_19_ < list1.length; _496_19_++)
            {
                st = list1[_496_19_]
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

        if (!this.features.territory)
        {
            return
        }
        this.ter.innerHTML = ''
        if (this.game)
        {
            if (this.game.moves.num() > 1)
            {
                s = this.divSize / (this.size + 1)
                s /= 4
                s = s.toFixed(2)
                var list = _k_.list(this.game.areas)
                for (var _523_22_ = 0; _523_22_ < list.length; _523_22_++)
                {
                    a = list[_523_22_]
                    if (_k_.in(a.color,'wbWB'))
                    {
                        var list1 = _k_.list(a.posl)
                        for (var _525_30_ = 0; _525_30_ < list1.length; _525_30_++)
                        {
                            p = list1[_525_30_]
                            e = elem('div',{class:`eye ${a.color}`,parent:this.ter})
                            r = this.coordToPrcnt(this.game.coord(p))
                            e.style = `left:${r.x}%; top:${r.y}%; width:${s}px; height:${s}px; border-radius:${s}px;`
                        }
                    }
                }
                var list2 = _k_.list(this.game.grps)
                for (var _530_22_ = 0; _530_22_ < list2.length; _530_22_++)
                {
                    g = list2[_530_22_]
                    if (g.state === 'dead')
                    {
                        var list3 = _k_.list(g.posl)
                        for (var _532_30_ = 0; _532_30_ < list3.length; _532_30_++)
                        {
                            p = list3[_532_30_]
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