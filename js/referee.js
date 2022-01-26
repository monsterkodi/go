// monsterkodi/kode 0.237.0

var _k_ = {noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Board, elem, Game, GNU, kxk, opponent, post, Referee, SGF

kxk = require('kxk')
elem = kxk.elem
post = kxk.post

opponent = require('./util').opponent

Board = require('./board')
Game = require('./game')
GNU = require('./gnu')
SGF = require('./sgf')

Referee = (function ()
{
    function Referee (parent)
    {
        this.parent = parent
    
        this["gnuMove"] = this["gnuMove"].bind(this)
        this["humanMove"] = this["humanMove"].bind(this)
        this["newGame"] = this["newGame"].bind(this)
        this.boardsize = window.stash.get('boardsize',19)
        this.handicap = window.stash.get('handicap',0)
        this.white = window.stash.get('white','human')
        this.black = window.stash.get('black','human')
        post.on('newGame',this.newGame)
        post.on('humanMove',this.humanMove)
        post.on('gnuMove',this.gnuMove)
    }

    Referee.prototype["newGame"] = function (gi = {})
    {
        var c, info, m, moves, p, score, _41_33_, _42_33_, _43_33_, _44_33_, _45_33_, _46_33_, _82_26_, _83_26_, _85_31_

        console.log(_k_.noon(gi))
        this.boardsize = ((_41_33_=gi.size) != null ? _41_33_ : this.boardsize)
        this.handicap = ((_42_33_=gi.handicap) != null ? _42_33_ : this.handicap)
        this.white = ((_43_33_=gi.white) != null ? _43_33_ : this.white)
        this.black = ((_44_33_=gi.black) != null ? _44_33_ : this.black)
        moves = ((_45_33_=gi.moves) != null ? _45_33_ : [])
        info = ((_46_33_=gi.info) != null ? _46_33_ : {})
        console.log(this.boardsize,this.handicap,info)
        if (_k_.empty(moves))
        {
            window.stash.del('score')
        }
        window.stash.set('size',this.boardsize)
        window.stash.set('white',this.white)
        window.stash.set('black',this.black)
        window.stash.set('handicap',this.handicap)
        window.stash.set('moves',moves)
        this.parent.innerHTML = ''
        this.board = new Board(this.parent,this.boardsize)
        this.game = new Game(this.board,this.white,this.black)
        this.board.game = this.game
        this.game.info = info
        this.gnu = {}
        if (this.white === 'gnu')
        {
            this.gnu.white = new GNU(this.game)
            this.gnu.white.newGame(this.boardsize,'white',this.handicap)
        }
        if (this.black === 'gnu')
        {
            this.gnu.black = new GNU(this.game)
            this.gnu.black.newGame(this.boardsize,'black',this.handicap)
        }
        if (!_k_.empty(moves))
        {
            var list = _k_.list(moves)
            for (var _76_18_ = 0; _76_18_ < list.length; _76_18_++)
            {
                m = list[_76_18_]
                var _77_23_ = m.split(' '); c = _77_23_[0]; p = _77_23_[1]

                if (!(p != null))
                {
                    p = c
                    c = ['black','white'][moves.indexOf(m) % 2]
                }
                this.game.play(c,p)
                (this.gnu.black != null ? this.gnu.black.send(`play ${c} ${p}`) : undefined)
                (this.gnu.white != null ? this.gnu.white.send(`play ${c} ${p}`) : undefined)
            }
            score = ((_85_31_=info.score) != null ? _85_31_ : window.stash.get('score'))
            if (score)
            {
                return this.game.finalScore(score)
            }
            else
            {
                return (this.gnu[this.game.nextColor()] != null ? this.gnu[this.game.nextColor()].genmove() : undefined)
            }
        }
        else
        {
            if (this.gnu.black && this.handicap < 2)
            {
                this.gnu.black.genmove()
            }
            if (this.gnu.white && this.handicap > 1)
            {
                return this.gnu.white.genmove()
            }
        }
    }

    Referee.prototype["genMove"] = function ()
    {
        return this.game.genmove(this.game.nextColor())
    }

    Referee.prototype["humanMove"] = function (p)
    {
        var lastColor, nextColor

        lastColor = this.game.lastColor()
        nextColor = this.game.nextColor()
        if (!(_k_.in(this[nextColor],['gnu'])))
        {
            this.game.play(nextColor,p)
            return (this.gnu[lastColor] != null ? this.gnu[lastColor].opponentMove(p) : undefined)
        }
    }

    Referee.prototype["gnuMove"] = function (p)
    {
        var lastColor, nextColor

        lastColor = this.game.lastColor()
        nextColor = this.game.nextColor()
        if (_k_.in(this[nextColor],['gnu']))
        {
            ;(this.gnu[lastColor] != null ? this.gnu[lastColor].opponentMove(p) : undefined)
            return this.game.play(nextColor,p)
        }
    }

    Referee.prototype["undo"] = function ()
    {
        var _136_18_, _137_18_

        ;(this.gnu.black != null ? this.gnu.black.undo() : undefined)
        return (this.gnu.white != null ? this.gnu.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var _141_18_, _142_18_

        ;(this.gnu.black != null ? this.gnu.black.redo() : undefined)
        return (this.gnu.white != null ? this.gnu.white.redo() : undefined)
    }

    Referee.prototype["firstMove"] = function ()
    {}

    Referee.prototype["lastMove"] = function ()
    {}

    return Referee
})()

module.exports = Referee