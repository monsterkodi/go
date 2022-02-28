// monsterkodi/kode 0.243.0

var _k_ = {max: function () { m = -Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, min: function () { m = Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        var h, key, _20_18_, _21_30_, _22_30_, _23_30_, _24_30_, _25_30_, _26_30_, _27_30_

        this.parent = parent
        this.size = size
        this.features = features
    
        this["onVariation"] = this["onVariation"].bind(this)
        this["onTree"] = this["onTree"].bind(this)
        this["onMouseWheel"] = this["onMouseWheel"].bind(this)
        this["clearWheelAccum"] = this["clearWheelAccum"].bind(this)
        this["onDoubleClick"] = this["onDoubleClick"].bind(this)
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
        this.features.dots = ((_27_30_=this.features.dots) != null ? _27_30_ : true)
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
            this.div.addEventListener('dblclick',this.onDoubleClick)
            this.div.addEventListener('mousemove',this.onMouseMove)
            this.div.addEventListener('mousedown',this.onMouseDown)
            this.div.addEventListener('mouseleave',this.onMouseLeave)
            this.parent.addEventListener('mousewheel',this.onMouseWheel)
        }
        this.canvas = elem('canvas',{class:'lines',parent:this.div})
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
            h = 97 / (this.size + 1)
            this.hvw = elem('div',{class:"hover white",parent:this.hlt})
            this.hvb = elem('div',{class:"hover black",parent:this.hlt})
            this.hvw.style = `width:${h}%; height:${h}%; display:none;`
            this.hvb.style = `width:${h}%; height:${h}%; display:none;`
            this.hvr = {white:this.hvw,black:this.hvb}
        }
        this.show = {}
        var list = ['numbers','liberties','territory','coordinates','variations']
        for (var _66_16_ = 0; _66_16_ < list.length; _66_16_++)
        {
            key = list[_66_16_]
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
            this.div.removeEventListener('dblclick',this.onDoubleClick)
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
        this.divRect = this.div.getBoundingClientRect()
        this.divSize = _k_.max(this.divRect.width,this.divRect.height)
        this.lines()
        this.scaleFonts()
        return this.showLastMove()
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
        var d, h, i, o, s, x, y

        h = this.div.getBoundingClientRect().height
        s = h * 2
        d = s / (this.size + 1)
        o = d
        this.canvas.width = this.canvas.height = s
        this.ctx = this.canvas.getContext('2d')
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 1
        this.ctx.fillStyle = 'black'
        for (var _140_17_ = i = 0, _140_21_ = this.size; (_140_17_ <= _140_21_ ? i < this.size : i > this.size); (_140_17_ <= _140_21_ ? ++i : --i))
        {
            this.ctx.beginPath()
            this.ctx.moveTo(o + i * d,o)
            this.ctx.lineTo(o + i * d,s - o)
            this.ctx.moveTo(o,o + i * d)
            this.ctx.lineTo(s - o,o + i * d)
            this.ctx.stroke()
        }
        if (this.size >= 9 && this.features.dots && !this.features.territory || !window.stash.get('territory'))
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
        for (var _170_17_ = x = 0, _170_21_ = this.size; (_170_17_ <= _170_21_ ? x < this.size : x > this.size); (_170_17_ <= _170_21_ ? ++x : --x))
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
        this.toggleShow('territory')
        return this.lines()
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
        if (!this.game.paused && _k_.in(this.game.players[nextColor],['gnu','leelaz','katago','hara']))
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

        if (event.button !== 0)
        {
            return
        }
        nextColor = this.game.nextColor()
        if (!this.game.paused && _k_.in(this.game.players[nextColor],['gnu','leelaz','katago','hara']))
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

    Board.prototype["onDoubleClick"] = function (event)
    {
        var c, lastColor, p

        lastColor = this.game.lastColor()
        if (this.game.info.id && this.game.players[lastColor] === global.myUserName)
        {
            c = this.posAtEvent(event)
            p = this.game.pos([c.x,c.y])
            if (stoneColor[this.game.stoneAt(p)] === lastColor)
            {
                return post.emit('submitMove',this.game.info.id,p)
            }
            else
            {
                console.log('not your stone at pos',p,c,this.game.stoneAt(p))
            }
        }
        else
        {
            console.log('no id or wrong player',this.game.info.id,lastColor,this.game.players[lastColor])
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

        while (s = $(`.pos${c[0]}_${c[1]}`,this.div))
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
        var _391_12_, _392_12_, _393_12_, _394_12_

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
        for (var _432_14_ = 0; _432_14_ < list.length; _432_14_++)
        {
            m = list[_432_14_]
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
        var c, d, l, mv, p, s, x, y

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
        d = 60 / (this.size + 1)
        var list = _k_.list(this.tree.cursorVariations())
        for (var _472_15_ = 0; _472_15_ < list.length; _472_15_++)
        {
            mv = list[_472_15_]
            if (mv.pos === '?')
            {
                continue
            }
            c = this.game.coord(mv.pos)
            p = this.coordToPrcnt(c)
            x = (c[0] + 0.73) * 100 / (this.size + 1)
            y = (c[1] + 0.73) * 100 / (this.size + 1)
            s = elem('img',{class:`stone pos${c[0]}_${c[1]}`,src:`../img/varii_${mv.color}.png`,width:'auto',height:`${d}%`,style:`left:${x}%; top:${y}%;`,parent:this.var})
            l = elem('div',{class:`varpos ${mv.color}`,parent:this.var,text:mv.pos,style:`left:${p.x}%;top:${p.y}%; font-size:${s / 8}px; width:${s}px; height:${s}px;`})
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
        for (var _494_14_ = 0; _494_14_ < list.length; _494_14_++)
        {
            m = list[_494_14_]
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
        for (var _523_18_ = 0; _523_18_ < list.length; _523_18_++)
        {
            color = list[_523_18_]
            var list1 = _k_.list(this.game.allStones(color))
            for (var _524_19_ = 0; _524_19_ < list1.length; _524_19_++)
            {
                st = list1[_524_19_]
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
        var a, color, d, e, g, i, p, r, s

        if (!this.features.territory)
        {
            return
        }
        this.ter.innerHTML = ''
        if (!this.game)
        {
            return
        }
        if (this.game.moves.num() < 1)
        {
            return
        }
        d = 25 / (this.size + 1)
        var list = _k_.list(this.game.areas)
        for (var _550_14_ = 0; _550_14_ < list.length; _550_14_++)
        {
            a = list[_550_14_]
            if (_k_.in(a.color,'wbWB'))
            {
                var list1 = _k_.list(a.posl)
                for (var _552_22_ = 0; _552_22_ < list1.length; _552_22_++)
                {
                    p = list1[_552_22_]
                    e = elem('div',{class:`eye ${a.color}`,parent:this.ter})
                    r = this.coordToPrcnt(this.game.coord(p))
                    e.style = `left:${r.x}%; top:${r.y}%; width:${d}%; height:${d}%;`
                }
            }
            if (a.color === '?' && !_k_.empty(a.infl))
            {
                var list2 = _k_.list(a.posl)
                for (i = 0; i < list2.length; i++)
                {
                    p = list2[i]
                    if (abs(a.infl[i]) !== 0)
                    {
                        color = (a.infl[i] > 0 ? 'white' : 'black')
                        s = (d * _k_.max(0.2,abs(a.infl[i]))).toFixed(2)
                        e = elem('div',{class:`eye ${color[0]}`,parent:this.ter})
                        r = this.coordToPrcnt(this.game.coord(p))
                        e.style = `left:${r.x}%; top:${r.y}%; width:${s}%; height:${s}%;`
                    }
                }
            }
        }
        var list3 = _k_.list(this.game.grps)
        for (var _565_14_ = 0; _565_14_ < list3.length; _565_14_++)
        {
            g = list3[_565_14_]
            if (g.state === 'dead')
            {
                var list4 = _k_.list(g.posl)
                for (var _567_22_ = 0; _567_22_ < list4.length; _567_22_++)
                {
                    p = list4[_567_22_]
                    e = elem('div',{class:`eye ${opponent[stoneColor[g.stone]][0]}`,parent:this.ter})
                    r = this.coordToPrcnt(this.game.coord(p))
                    e.style = `left:${r.x}%; top:${r.y}%; width:${d}%; height:${d}%;`
                }
            }
        }
    }

    return Board
})()

module.exports = Board