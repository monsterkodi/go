// monsterkodi/kode 0.237.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Board, elem, Game, GNU, Hara, Katago, kxk, Leelaz, opponent, post, Referee, SGF

kxk = require('kxk')
elem = kxk.elem
post = kxk.post

opponent = require('./util').opponent

Leelaz = require('./leelaz')
Katago = require('./katago')
Hara = require('./hara')
Board = require('./board')
Game = require('./game')
GNU = require('./gnu')
SGF = require('./sgf')

Referee = (function ()
{
    function Referee (parent)
    {
        this.parent = parent
    
        this["playerMove"] = this["playerMove"].bind(this)
        this["newGame"] = this["newGame"].bind(this)
        this.boardsize = window.stash.get('boardsize',19)
        this.handicap = window.stash.get('handicap',0)
        this.white = window.stash.get('white','human')
        this.black = window.stash.get('black','human')
        post.on('newGame',this.newGame)
        post.on('playerMove',this.playerMove)
    }

    Referee.prototype["newGame"] = function (gi = {})
    {
        var info, moves, _43_33_, _44_33_, _45_33_, _46_33_, _47_33_, _48_33_, _83_20_, _84_20_

        this.white = ((_43_33_=gi.white) != null ? _43_33_ : this.white)
        this.black = ((_44_33_=gi.black) != null ? _44_33_ : this.black)
        this.handicap = ((_45_33_=gi.handicap) != null ? _45_33_ : this.handicap)
        this.boardsize = ((_46_33_=gi.size) != null ? _46_33_ : this.boardsize)
        moves = ((_47_33_=gi.moves) != null ? _47_33_ : [])
        info = ((_48_33_=gi.info) != null ? _48_33_ : {})
        this.redos = []
        if (this.white === 'leelaz' || this.black === 'leelaz')
        {
            this.boardsize = 19
        }
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
        this.game = new Game(this.board,this.white,this.black,this.handicap)
        this.board.game = this.game
        this.game.info = info
        this.compi = {}
        switch (this.black)
        {
            case 'gnu':
                this.compi.black = new GNU(this.game)
                break
            case 'leelaz':
                this.compi.black = new Leelaz(this.game)
                break
            case 'hara':
                this.compi.black = new Hara(this.game)
                break
            case 'katago':
                this.compi.black = new Katago(this.game)
                break
        }

        switch (this.white)
        {
            case 'gnu':
                this.compi.white = new GNU(this.game)
                break
            case 'leelaz':
                this.compi.white = new Leelaz(this.game)
                break
            case 'hara':
                this.compi.white = new Hara(this.game)
                break
            case 'katago':
                this.compi.white = new Katago(this.game)
                break
        }

        ;(this.compi.black != null ? this.compi.black.newGame(this.boardsize,'black',this.handicap) : undefined)
        ;(this.compi.white != null ? this.compi.white.newGame(this.boardsize,'white',this.handicap) : undefined)
        if (!_k_.empty(moves))
        {
            return this.replay(moves)
        }
        else
        {
            if (this.compi.black && this.handicap < 2)
            {
                this.compi.black.genmove()
            }
            if (this.compi.white && this.handicap > 1)
            {
                return this.compi.white.genmove()
            }
        }
    }

    Referee.prototype["replay"] = function (moves)
    {
        var c, m, p, score, _110_28_, _111_28_, _113_33_

        var list = _k_.list(moves)
        for (var _103_14_ = 0; _103_14_ < list.length; _103_14_++)
        {
            m = list[_103_14_]
            var _104_19_ = m.split(' '); c = _104_19_[0]; p = _104_19_[1]

            if (!(p != null))
            {
                p = c
                c = ['black','white'][moves.indexOf(m) % 2]
            }
            this.game.play(c,p)
            if (1)
            {
                ;(this.compi.black != null ? this.compi.black.send(`play ${c} ${p}`) : undefined)
                ;(this.compi.white != null ? this.compi.white.send(`play ${c} ${p}`) : undefined)
            }
        }
        score = ((_113_33_=this.game.info.score) != null ? _113_33_ : window.stash.get('score'))
        if (score)
        {
            return this.game.finalScore(score)
        }
        else
        {
            return (this.compi[this.game.nextColor()] != null ? this.compi[this.game.nextColor()].genmove() : undefined)
        }
    }

    Referee.prototype["genMove"] = function ()
    {
        return this.game.genmove(this.game.nextColor())
    }

    Referee.prototype["playerMove"] = function (p, player)
    {
        var lastColor, nextColor, _139_24_, _140_24_

        lastColor = this.game.lastColor()
        nextColor = this.game.nextColor()
        if (this.game.players[nextColor] !== player)
        {
            return console.error(`wrong player: ${player}`,nextColor,this.game.players)
        }
        this.game.play(nextColor,p)
        ;(this.compi[lastColor] != null ? this.compi[lastColor].opponentMove(p) : undefined)
        if (_k_.in(p,['pass','resign']))
        {
            ;(this.compi.black != null ? this.compi.black.send('final_score') : undefined)
            ;(this.compi.white != null ? this.compi.white.send('final_score') : undefined)
        }
        if (p !== 'resign')
        {
            if (p !== 'pass' || !(_k_.in('pass',this.game.moves.slice(-2,-1)[0])))
            {
                return (this.compi[lastColor] != null ? this.compi[lastColor].genmove() : undefined)
            }
        }
    }

    Referee.prototype["undo"] = function ()
    {
        var _158_36_, _159_36_, _163_15_, _166_24_, _167_24_, _173_20_, _174_20_

        if (_k_.empty(this.game.moves))
        {
            return
        }
        if (this.game.handicap > 1 && this.game.moves.length === 1)
        {
            return
        }
        if (!_k_.empty((this.compi.black != null ? this.compi.black.msg : undefined)))
        {
            return
        }
        if (!_k_.empty((this.compi.white != null ? this.compi.white.msg : undefined)))
        {
            return
        }
        this.redos = ((_163_15_=this.redos) != null ? _163_15_ : [])
        while (_k_.in(this.game.moves.slice(-1)[0].split(' ')[1],['pass','resign']))
        {
            this.redos.unshift(this.game.moves.pop())
            ;(this.compi.black != null ? this.compi.black.send('undo') : undefined)
            ;(this.compi.white != null ? this.compi.white.send('undo') : undefined)
        }
        this.redos.unshift(this.game.moves.pop())
        ;(this.compi.black != null ? this.compi.black.undo() : undefined)
        return (this.compi.white != null ? this.compi.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var color, move, p, _179_36_, _180_36_, _185_20_, _186_20_

        if (_k_.empty(this.redos))
        {
            return
        }
        if (!_k_.empty((this.compi.black != null ? this.compi.black.msg : undefined)))
        {
            return
        }
        if (!_k_.empty((this.compi.white != null ? this.compi.white.msg : undefined)))
        {
            return
        }
        move = this.redos.shift()
        var _183_19_ = move.split(' '); color = _183_19_[0]; p = _183_19_[1]

        this.game.play(color,p)
        ;(this.compi.black != null ? this.compi.black.send(`play ${color} ${p}`) : undefined)
        return (this.compi.white != null ? this.compi.white.send(`play ${color} ${p}`) : undefined)
    }

    Referee.prototype["firstMove"] = function ()
    {
        var _198_20_, _199_20_

        if (_k_.empty(this.game.moves))
        {
            return
        }
        this.redos = this.game.moves.concat(this.redos)
        ;(this.compi.black != null ? this.compi.black.send(`boardsize ${this.game.size}`) : undefined)
        ;(this.compi.white != null ? this.compi.white.send(`boardsize ${this.game.size}`) : undefined)
        return this.game.clear_board()
    }

    Referee.prototype["lastMove"] = function ()
    {
        var color, move, p, _209_24_, _210_24_

        if (_k_.empty(this.redos))
        {
            return
        }
        while (!_k_.empty(this.redos))
        {
            move = this.redos.shift()
            var _207_23_ = move.split(' '); color = _207_23_[0]; p = _207_23_[1]

            this.game.play(color,p)
            ;(this.compi.black != null ? this.compi.black.send(`play ${color} ${p}`) : undefined)
            ;(this.compi.white != null ? this.compi.white.send(`play ${color} ${p}`) : undefined)
        }
    }

    return Referee
})()

module.exports = Referee