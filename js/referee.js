// monsterkodi/kode 0.237.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Board, elem, Game, GNU, Hara, Katago, kxk, Leelaz, opponent, post, Referee, SGF, Tree, Varee

kxk = require('kxk')
elem = kxk.elem
post = kxk.post

opponent = require('./util/util').opponent

SGF = require('./util/sgf')
Leelaz = require('./bot/leelaz')
Katago = require('./bot/katago')
Hara = require('./bot/hara')
GNU = require('./bot/gnu')
Board = require('./board')
Varee = require('./varee')
Tree = require('./tree')
Game = require('./game')

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
        var info, moves, _44_14_, _47_33_, _48_33_, _49_33_, _50_33_, _51_33_, _52_33_, _84_20_, _85_20_

        ;(this.varee != null ? this.varee.remove() : undefined)
        this.parent.innerHTML = ''
        this.white = ((_47_33_=gi.white) != null ? _47_33_ : this.white)
        this.black = ((_48_33_=gi.black) != null ? _48_33_ : this.black)
        this.handicap = ((_49_33_=gi.handicap) != null ? _49_33_ : this.handicap)
        this.boardsize = ((_50_33_=gi.size) != null ? _50_33_ : this.boardsize)
        moves = ((_51_33_=gi.moves) != null ? _51_33_ : [])
        info = ((_52_33_=gi.info) != null ? _52_33_ : {})
        this.redos = []
        this.tree = new Tree
        if (window.stash.get('varee'))
        {
            this.varee = new Varee(this.parent,this.tree,this.boardsize)
        }
        if (this.white === 'leelaz' || this.black === 'leelaz')
        {
            this.boardsize = 19
        }
        window.stash.set('size',this.boardsize)
        window.stash.set('white',this.white)
        window.stash.set('black',this.black)
        window.stash.set('handicap',this.handicap)
        window.stash.set('moves',moves)
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
        var b, m, p, score, spl, w

        var list = _k_.list(moves)
        for (var _106_14_ = 0; _106_14_ < list.length; _106_14_++)
        {
            m = list[_106_14_]
            spl = m.split(' ')
            var _108_22_ = spl.slice(0, 3); p = _108_22_[0]; b = _108_22_[1]; w = _108_22_[2]

            this.game.play(p)
        }
        if (score = this.game.info.score)
        {
            return this.game.finalScore(score)
        }
        else if (!this.game.paused)
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
        var color, next, _135_38_, _135_58_, _150_27_, _151_28_, _153_27_, _154_28_

        if (this.game.paused)
        {
            console.log('paused playerMove',player,p)
            if (player === 'human')
            {
                this.tree.addMove(p)
                this.game.play(p)
            }
            return
        }
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
        this.game.play(p)
        this.tree.addMove(p)
        next = opponent[color]
        ;(this.compi[next] != null ? this.compi[next].opponentMove(p) : undefined)
        if (this.game.end())
        {
            if ((this.compi.black != null))
            {
                ;(this.compi.black != null ? this.compi.black.send('final_score') : undefined)
            }
            if ((this.compi.white != null))
            {
                return (this.compi.white != null ? this.compi.white.send('final_score') : undefined)
            }
        }
        else
        {
            return (this.compi[next] != null ? this.compi[next].genmove() : undefined)
        }
    }

    Referee.prototype["undo"] = function ()
    {
        var m, _173_15_, _182_20_, _183_20_

        if (this.game.start())
        {
            return
        }
        if (this.game.handicap > 1 && this.game.moves.num() === 1)
        {
            return
        }
        console.log('undo')
        this.game.paused = true
        this.redos = ((_173_15_=this.redos) != null ? _173_15_ : [])
        m = this.game.moves.pop()
        this.redos.unshift(m)
        this.game.undoMove(m)
        ;(this.compi.black != null ? this.compi.black.undo() : undefined)
        return (this.compi.white != null ? this.compi.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var move, _192_20_, _193_20_

        if (_k_.empty(this.redos))
        {
            return
        }
        move = this.redos.shift()
        console.log('redo',move)
        this.game.play(move.pos)
        ;(this.compi.black != null ? this.compi.black.send(`play ${move.color} ${move.pos}`) : undefined)
        return (this.compi.white != null ? this.compi.white.send(`play ${move.color} ${move.pos}`) : undefined)
    }

    Referee.prototype["navigate"] = function (action)
    {
        var moves

        this.game.paused = true
        console.log('navigate',action)
        switch (action)
        {
            case 'left':
            case 'right':
            case 'up':
            case 'down':
            case 'back':
                this.tree.navigate(action)
                this.game = new Game(this.board,this.white,this.black,this.handicap)
                this.game.paused = true
                this.board.game = this.game
                moves = this.tree.history()
                console.log('moves',moves)
                return this.replay(moves)

        }

    }

    Referee.prototype["jumpToStart"] = function ()
    {
        var _231_20_, _232_20_

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
        while (!_k_.empty(this.redos))
        {
            this.redo()
        }
    }

    Referee.prototype["toggleTree"] = function ()
    {
        console.log('toggleTree')
        if (this.varee)
        {
            this.varee.remove()
            delete this.varee
            return window.stash.set('varee',false)
        }
        else
        {
            window.stash.set('varee',true)
            this.varee = new Varee(this.parent,this.tree)
            return post.emit('tree')
        }
    }

    return Referee
})()

module.exports = Referee