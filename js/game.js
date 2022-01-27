// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var $, alpha, elem, Game, Grid, kxk, Moves, opponent, randInt, Score, stone

kxk = require('kxk')
randInt = kxk.randInt
elem = kxk.elem
$ = kxk.$

opponent = require('./util').opponent
alpha = require('./util').alpha
stone = require('./util').stone

Score = require('./score')
Moves = require('./moves')
Grid = require('./grid')

Game = (function ()
{
    _k_.extend(Game, Score)
    function Game (board, white, black, handicap)
    {
        this.handicap = handicap
    
        this.players = {black:black,white:white}
        Game.__super__.constructor.call(this,board.size)
        this.board = board
        this.moves = new Moves
        this.boardsize(this.board.size)
    }

    Game.prototype["boardsize"] = function (size)
    {
        this.size = size
    
        return this.clear_board()
    }

    Game.prototype["save"] = function ()
    {
        window.stash.set('moves',this.moves)
        return window.stash.set('grid',this.grid.toString())
    }

    Game.prototype["move_history"] = function ()
    {
        return this.moves.history()
    }

    Game.prototype["start"] = function ()
    {
        return this.moves.start()
    }

    Game.prototype["lastColor"] = function ()
    {
        return this.moves.lastColor()
    }

    Game.prototype["nextColor"] = function ()
    {
        return this.moves.nextColor()
    }

    Game.prototype["lastMove"] = function ()
    {
        return this.moves.last().pos
    }

    Game.prototype["lastCoord"] = function ()
    {
        return this.coord(this.lastMove())
    }

    Game.prototype["genmove"] = function (color)
    {
        var l, p

        color = (color != null ? color : this.nextColor())
        l = this.all_legal(color)
        if (this.moves.lastIsPass())
        {
            return 'pass'
        }
        if (!_k_.empty(l))
        {
            p = l[randInt(l.length)]
            this.play(color,p)
            return p
        }
        else
        {
            return 'pass'
        }
    }

    Game.prototype["play"] = function (color, p)
    {
        var c

        if (p.toLowerCase() === 'pass')
        {
            this.moves.add(p.toLowerCase(),color)
            this.updateTitle()
            return ''
        }
        if (!p)
        {
            p = color
            color = this.nextColor()
        }
        c = this.coord(p)
        if (this.valid(c))
        {
            this.setStone(c,stone[color])
            this.moves.add(p,color,this.capture(color))
            this.calcScore()
            this.board.annotate()
            return ''
        }
        else
        {
            return '? invalid color or coordinate'
        }
    }

    Game.prototype["capture"] = function (color)
    {
        var dead, deadPos, s

        s = stone[opponent[color]]
        this.calcGroups()
        var list = _k_.list(this.grps.filter(function (g)
        {
            return g.libs === 0 && g.stone === s
        }))
        for (var _103_17_ = 0; _103_17_ < list.length; _103_17_++)
        {
            dead = list[_103_17_]
            console.log(this.captures)
            this.captures[color] += dead.group.length
            console.log(_k_.noon(dead))
            console.log(this.captures)
            var list1 = _k_.list(dead.group)
            for (var _108_24_ = 0; _108_24_ < list1.length; _108_24_++)
            {
                deadPos = list1[_108_24_]
                this.removePos(deadPos)
            }
        }
    }

    Game.prototype["setStone"] = function (c, s)
    {
        this.grid.set(c,s)
        if (s === stone.empty)
        {
            return this.board.delStone(c)
        }
        else
        {
            return this.board.addStone(c,s)
        }
    }

    Game.prototype["removePos"] = function (p)
    {
        return this.setStone(this.coord(p),stone.empty)
    }

    Game.prototype["show"] = function (data)
    {
        var captured, r, rs, x, y

        this.grid.clear()
        this.board.clear()
        rs = data.split('\n').slice(2)
        rs = rs.map((function (r)
        {
            return r.slice(3).split(' ').join('')
        }).bind(this))
        for (var _152_17_ = y = 0, _152_21_ = this.size; (_152_17_ <= _152_21_ ? y < this.size : y > this.size); (_152_17_ <= _152_21_ ? ++y : --y))
        {
            r = rs[y]
            for (var _154_21_ = x = 0, _154_25_ = this.size; (_154_21_ <= _154_25_ ? x < this.size : x > this.size); (_154_21_ <= _154_25_ ? ++x : --x))
            {
                switch (r[x])
                {
                    case 'X':
                        this.setStone([x,y],stone.black)
                        break
                    case 'O':
                        this.setStone([x,y],stone.white)
                        break
                }

            }
            if (_k_.in('hascaptured',r))
            {
                captured = parseInt(r.split('hascaptured')[1])
                console.log('captured',r,captured)
                if (_k_.in('WHITE',r))
                {
                    this.captures.white = captured
                }
                else
                {
                    this.captures.black = captured
                }
            }
        }
        this.calcScore()
        return this.board.annotate()
    }

    Game.prototype["next"] = function (num = 1)
    {
        var i

        for (var _172_17_ = i = 0, _172_21_ = num; (_172_17_ <= _172_21_ ? i < num : i > num); (_172_17_ <= _172_21_ ? ++i : --i))
        {
            this.genmove()
        }
        return this.showboard()
    }

    Game.prototype["black"] = function (p)
    {
        return this.play('B',p)
    }

    Game.prototype["white"] = function (p)
    {
        return this.play('W',p)
    }

    Game.prototype["color"] = function (p)
    {
        switch (this.stoneAt(this.coord(p)))
        {
            case '○':
                return 'black'

            case '●':
                return 'white'

            default:
                return 'empty'
        }

    }

    Game.prototype["clear_board"] = function ()
    {
        delete this.redos
        this.moves.clear()
        this.clear()
        this.grid.clear()
        this.board.clear()
        this.updateTitle()
        return ''
    }

    Game.prototype["showboard"] = function ()
    {
        var b, i, s, x, y

        s = ' '
        b = '  '
        b += (function (o) {
            var r_211_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_211_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_211_34_.join('') : r_211_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        y = 0
        for (var _214_17_ = i = this.size, _214_24_ = 1; (_214_17_ <= _214_24_ ? i <= 1 : i >= 1); (_214_17_ <= _214_24_ ? ++i : --i))
        {
            b += _k_.lpad(2,i)
            b += s
            for (var _217_21_ = x = 0, _217_25_ = this.size; (_217_21_ <= _217_25_ ? x < this.size : x > this.size); (_217_21_ <= _217_25_ ? ++x : --x))
            {
                b += this.stoneAt(x,y) + s
            }
            b += i
            b += '\n'
            y++
        }
        b += '  '
        b += (function (o) {
            var r_224_34_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return s + v
            })(o[k])
                if (m != null)
                {
                    r_224_34_[k] = m
                }
            }
            return typeof o == 'string' ? r_224_34_.join('') : r_224_34_
        })(alpha.slice(0,this.size))
        b += '\n'
        return b
    }

    Game.prototype["dump"] = function ()
    {
        console.log(this.showboard())
        console.log('white',this.allStones('w').length,this.allStones('w'))
        console.log('black',this.allStones('b').length,this.allStones('b'))
        console.log(this.grid.toString())
    }

    Game.prototype["setScore"] = function (score)
    {
        this.score = score
    
        return this.calcScore()
    }

    Game.prototype["updateTitle"] = function ()
    {
        var bs, t, td, ws, _253_19_, _254_19_

        t = $('.titlebar-title')
        t.innerHTML = ''
        td = elem('div',{class:'captures',parent:t})
        bs = ((this.score != null ? this.score[0] : undefined) === 'B' ? this.score.slice(2) : '  ')
        ws = ((this.score != null ? this.score[0] : undefined) === 'W' ? this.score.slice(2) : '  ')
        elem('span',{class:'player black',text:this.players.black + ' ',parent:td})
        elem('span',{class:'capture black',text:bs + ' ' + this.captures.black + stone.black,parent:td})
        elem('span',{class:'capture white',text:stone.white + this.captures.white + ' ' + ws,parent:td})
        return elem('span',{class:'player white',text:' ' + this.players.white,parent:td})
    }

    Game.prototype["finalScore"] = function (score)
    {
        var t, td

        window.stash.set('score',_k_.trim(score))
        t = $('.titlebar-title')
        t.innerHTML = ''
        td = elem('div',{class:'captures',parent:t})
        if (!_k_.empty(this.info.players))
        {
            elem('span',{class:'player black',text:this.info.players[0] + ' ',parent:td})
        }
        elem('span',{class:`score  ${(score[0] === 'B' ? 'black' : 'white')}`,text:score,parent:td})
        if (!_k_.empty(this.info.players))
        {
            return elem('span',{class:'player white',text:' ' + this.info.players[1],parent:td})
        }
    }

    return Game
})()

module.exports = Game