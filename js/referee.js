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
        var info, moves, _43_33_, _44_33_, _45_33_, _46_33_, _47_33_, _48_33_, _82_20_, _83_20_

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
            this.game.updateTitle()
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
        var c, m, p, score, _111_28_, _112_28_

        var list = _k_.list(moves)
        for (var _104_14_ = 0; _104_14_ < list.length; _104_14_++)
        {
            m = list[_104_14_]
            var _105_19_ = m.split(' '); c = _105_19_[0]; p = _105_19_[1]

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
        if (score = this.game.info.score)
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
        var color, next, _131_38_, _131_58_, _145_24_, _146_24_

        if (this.game.end())
        {
            return
        }
        if (!_k_.empty(this.redos))
        {
            if (_k_.in(player,[(this.compi.black != null ? this.compi.black.name : undefined),(this.compi.white != null ? this.compi.white.name : undefined)]))
            {
                return
            }
            this.redos = []
        }
        color = this.game.nextColor()
        if (this.game.players[color] !== player)
        {
            return console.error(`wrong player: ${player}`,color,this.game.players)
        }
        this.game.play(color,p)
        next = opponent[color]
        ;(this.compi[next] != null ? this.compi[next].opponentMove(p) : undefined)
        if (this.game.end())
        {
            ;(this.compi.black != null ? this.compi.black.send('final_score') : undefined)
            return (this.compi.white != null ? this.compi.white.send('final_score') : undefined)
        }
        else
        {
            return (this.compi[next] != null ? this.compi[next].genmove() : undefined)
        }
    }

    Referee.prototype["undo"] = function ()
    {
        var m, _169_15_, _172_24_, _173_24_, _182_20_, _183_20_

        console.log('undo')
        if (this.game.start())
        {
            return
        }
        if (this.game.handicap > 1 && this.game.moves.num() === 1)
        {
            return
        }
        this.paused = true
        this.redos = ((_169_15_=this.redos) != null ? _169_15_ : [])
        while (_k_.in(this.game.lastPos(),['pass','resign']))
        {
            this.redos.unshift(this.game.moves.pop())
            ;(this.compi.black != null ? this.compi.black.undo() : undefined)
            ;(this.compi.white != null ? this.compi.white.undo() : undefined)
        }
        m = this.game.moves.pop()
        this.redos.unshift(m)
        this.game.undoMove(m)
        ;(this.compi.black != null ? this.compi.black.undo() : undefined)
        return (this.compi.white != null ? this.compi.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var move, _191_20_, _192_20_

        if (_k_.empty(this.redos))
        {
            return
        }
        move = this.redos.shift()
        console.log('redo',move)
        this.game.play(move.color,move.pos)
        ;(this.compi.black != null ? this.compi.black.send(`play ${move.color} ${move.pos}`) : undefined)
        return (this.compi.white != null ? this.compi.white.send(`play ${move.color} ${move.pos}`) : undefined)
    }

    Referee.prototype["jumpToStart"] = function ()
    {
        var _205_20_, _206_20_

        console.log('start')
        if (this.game.start())
        {
            return
        }
        this.redos = this.game.moves.m.concat(this.redos)
        ;(this.compi.black != null ? this.compi.black.send("clear_board") : undefined)
        ;(this.compi.white != null ? this.compi.white.send("clear_board") : undefined)
        return this.game.clear_board()
    }

    Referee.prototype["jumpToEnd"] = function ()
    {
        console.log('end')
        while (!_k_.empty(this.redos))
        {
            this.redo()
        }
    }

    return Referee
})()

module.exports = Referee