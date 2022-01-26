// monsterkodi/kode 0.237.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
        var info, moves, _41_33_, _42_33_, _43_33_, _44_33_, _45_33_, _46_33_

        this.boardsize = ((_41_33_=gi.size) != null ? _41_33_ : this.boardsize)
        this.handicap = ((_42_33_=gi.handicap) != null ? _42_33_ : this.handicap)
        this.white = ((_43_33_=gi.white) != null ? _43_33_ : this.white)
        this.black = ((_44_33_=gi.black) != null ? _44_33_ : this.black)
        moves = ((_45_33_=gi.moves) != null ? _45_33_ : [])
        info = ((_46_33_=gi.info) != null ? _46_33_ : {})
        this.redos = []
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
            return this.replay(moves)
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

    Referee["replay"] = function (moves)
    {
        var c, m, p, score, _101_27_, _98_22_, _99_22_

        var list = _k_.list(moves)
        for (var _92_14_ = 0; _92_14_ < list.length; _92_14_++)
        {
            m = list[_92_14_]
            var _93_19_ = m.split(' '); c = _93_19_[0]; p = _93_19_[1]

            if (!(p != null))
            {
                p = c
                c = ['black','white'][moves.indexOf(m) % 2]
            }
            this.game.play(c,p)
            (this.gnu.black != null ? this.gnu.black.send(`play ${c} ${p}`) : undefined)
            (this.gnu.white != null ? this.gnu.white.send(`play ${c} ${p}`) : undefined)
        }
        score = ((_101_27_=info.score) != null ? _101_27_ : window.stash.get('score'))
        if (score)
        {
            return this.game.finalScore(score)
        }
        else
        {
            return (this.gnu[this.game.nextColor()] != null ? this.gnu[this.game.nextColor()].genmove() : undefined)
        }
    }

    Referee.prototype["genMove"] = function ()
    {
        return this.game.genmove(this.game.nextColor())
    }

    Referee.prototype["humanMove"] = function (p)
    {
        return this.handleMove(p,'human')
    }

    Referee.prototype["gnuMove"] = function (p)
    {
        return this.handleMove(p,'gnu')
    }

    Referee.prototype["handleMove"] = function (p, player)
    {
        var lastColor, nextColor, _132_22_, _133_22_

        lastColor = this.game.lastColor()
        nextColor = this.game.nextColor()
        if (player === 'human' && _k_.in(this.game.players[nextColor],['gnu']))
        {
            return console.error(`wrong player: ${player}`)
        }
        if (player === 'gnu' && this.game.players[nextColor] !== 'gnu')
        {
            return console.error(`wrong player: ${player}`)
        }
        this.game.play(nextColor,p)
        ;(this.gnu[lastColor] != null ? this.gnu[lastColor].opponentMove(p) : undefined)
        if (_k_.in(p,['pass','resign']))
        {
            ;(this.gnu.black != null ? this.gnu.black.send('final_score') : undefined)
            ;(this.gnu.white != null ? this.gnu.white.send('final_score') : undefined)
        }
        if (p !== 'resign')
        {
            if (p !== 'pass' || !(_k_.in('pass',this.game.moves.slice(-2,-1)[0])))
            {
                return (this.gnu[lastColor] != null ? this.gnu[lastColor].genmove() : undefined)
            }
        }
    }

    Referee.prototype["undo"] = function ()
    {
        var _149_34_, _150_34_, _154_15_, _157_22_, _158_22_, _164_18_, _165_18_

        if (_k_.empty(this.game.moves))
        {
            return
        }
        if (!_k_.empty((this.gnu.black != null ? this.gnu.black.msg : undefined)))
        {
            return
        }
        if (!_k_.empty((this.gnu.white != null ? this.gnu.white.msg : undefined)))
        {
            return
        }
        this.redos = ((_154_15_=this.redos) != null ? _154_15_ : [])
        while (_k_.in(this.game.moves.slice(-1)[0].split(' ')[1],['pass','resign']))
        {
            this.redos.unshift(this.game.moves.pop())
            ;(this.gnu.black != null ? this.gnu.black.send('undo') : undefined)
            ;(this.gnu.white != null ? this.gnu.white.send('undo') : undefined)
        }
        this.redos.unshift(this.game.moves.pop())
        ;(this.gnu.black != null ? this.gnu.black.undo() : undefined)
        return (this.gnu.white != null ? this.gnu.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var color, move, p, _170_34_, _171_34_, _176_18_, _177_18_

        if (_k_.empty(this.redos))
        {
            return
        }
        if (!_k_.empty((this.gnu.black != null ? this.gnu.black.msg : undefined)))
        {
            return
        }
        if (!_k_.empty((this.gnu.white != null ? this.gnu.white.msg : undefined)))
        {
            return
        }
        move = this.redos.shift()
        var _174_19_ = move.split(' '); color = _174_19_[0]; p = _174_19_[1]

        this.game.play(color,p)
        ;(this.gnu.black != null ? this.gnu.black.send(`play ${color} ${p}`) : undefined)
        return (this.gnu.white != null ? this.gnu.white.send(`play ${color} ${p}`) : undefined)
    }

    Referee.prototype["firstMove"] = function ()
    {
        var _189_18_, _190_18_

        if (_k_.empty(this.game.moves))
        {
            return
        }
        this.redos = this.game.moves.concat(this.redos)
        ;(this.gnu.black != null ? this.gnu.black.send(`boardsize ${this.game.size}`) : undefined)
        ;(this.gnu.white != null ? this.gnu.white.send(`boardsize ${this.game.size}`) : undefined)
        return this.game.clear_board()
    }

    Referee.prototype["lastMove"] = function ()
    {
        var color, move, p, _200_22_, _201_22_

        if (_k_.empty(this.redos))
        {
            return
        }
        while (!_k_.empty(this.redos))
        {
            move = this.redos.shift()
            var _198_23_ = move.split(' '); color = _198_23_[0]; p = _198_23_[1]

            this.game.play(color,p)
            ;(this.gnu.black != null ? this.gnu.black.send(`play ${color} ${p}`) : undefined)
            ;(this.gnu.white != null ? this.gnu.white.send(`play ${color} ${p}`) : undefined)
        }
    }

    return Referee
})()

module.exports = Referee