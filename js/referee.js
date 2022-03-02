// monsterkodi/kode 0.243.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Board, elem, Game, GNU, Hara, Katago, kxk, Leelaz, opponent, post, Referee, SGF, stoneColor, Tree, Varee

kxk = require('kxk')
elem = kxk.elem
post = kxk.post

opponent = require('./util/util').opponent
stoneColor = require('./util/util').stoneColor

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
    
        this["onChat"] = this["onChat"].bind(this)
        this["navigate"] = this["navigate"].bind(this)
        this["altMove"] = this["altMove"].bind(this)
        this["playerMove"] = this["playerMove"].bind(this)
        this["newGame"] = this["newGame"].bind(this)
        post.on('newGame',this.newGame)
        post.on('playerMove',this.playerMove)
        post.on('altMove',this.altMove)
        post.on('navigate',this.navigate)
        post.on('chat',this.onChat)
    }

    Referee.prototype["newGame"] = function (gi = {})
    {
        var info, moves, _41_14_, _42_14_, _44_33_, _45_33_, _46_33_, _47_33_, _48_33_, _49_33_, _76_20_, _77_20_

        ;(this.varee != null ? this.varee.remove() : undefined)
        ;(this.board != null ? this.board.remove() : undefined)
        this.white = ((_44_33_=gi.white) != null ? _44_33_ : this.white)
        this.black = ((_45_33_=gi.black) != null ? _45_33_ : this.black)
        this.handicap = ((_46_33_=gi.handicap) != null ? _46_33_ : this.handicap)
        this.boardsize = ((_47_33_=gi.size) != null ? _47_33_ : this.boardsize)
        moves = ((_48_33_=gi.moves) != null ? _48_33_ : [])
        info = ((_49_33_=gi.info) != null ? _49_33_ : {})
        this.redos = []
        this.tree = new Tree
        if (window.stash.get('varee',true))
        {
            this.varee = new Varee(this.parent,this.tree,this.boardsize)
        }
        if (this.white === 'leelaz' || this.black === 'leelaz')
        {
            this.boardsize = 19
        }
        this.board = new Board(this.parent,this.boardsize)
        this.game = new Game(this.board,this.black,this.white,this.handicap)
        this.board.game = this.game
        this.board.tree = this.tree
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
            this.replay(moves)
            if (gi.tree)
            {
                this.tree.load(gi.tree)
            }
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
                this.compi.white.genmove()
            }
        }
        return post.emit('resize')
    }

    Referee.prototype["save"] = function ()
    {
        this.game.save()
        return this.tree.save()
    }

    Referee.prototype["replay"] = function (moves)
    {
        var b, m, p, score, spl, w

        var list = _k_.list(moves)
        for (var _112_14_ = 0; _112_14_ < list.length; _112_14_++)
        {
            m = list[_112_14_]
            spl = m.split(' ')
            var _114_22_ = spl.slice(0, 3); p = _114_22_[0]; b = _114_22_[1]; w = _114_22_[2]

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
        var color, next, _138_42_, _138_62_, _147_38_, _147_58_, _162_27_, _163_28_, _164_27_, _165_28_

        if (this.game.info.id && this.game.players[stoneColor[this.game.stoneAt(p)]] === player)
        {
            console.log('playerMove ▸ loadGame',player,p)
            post.emit('loadGame',this.game.info.id)
            return
        }
        if (this.game.paused)
        {
            if (!(_k_.in(player,[(this.compi.black != null ? this.compi.black.name : undefined),(this.compi.white != null ? this.compi.white.name : undefined)])))
            {
                this.game.play(p)
                this.tree.addMove(p,this.game.lastCaptures)
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
        this.tree.addMove(p,this.game.lastCaptures)
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

    Referee.prototype["altMove"] = function (p)
    {
        this.navigate('back')
        return this.playerMove(p,this.game.players[this.game.nextColor()])
    }

    Referee.prototype["undo"] = function ()
    {
        var m, _187_15_, _195_20_, _196_20_

        if (this.game.start())
        {
            return
        }
        if (this.game.handicap > 1 && this.game.moves.num() === 1)
        {
            return
        }
        if (!this.tree.canUndo())
        {
            return
        }
        this.game.paused = true
        this.redos = ((_187_15_=this.redos) != null ? _187_15_ : [])
        m = this.game.moves.pop()
        this.redos.unshift(m)
        this.game.undoMove(m)
        this.tree.undoMove(m)
        ;(this.compi.black != null ? this.compi.black.undo() : undefined)
        return (this.compi.white != null ? this.compi.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var move, _207_20_, _208_20_

        if (_k_.empty(this.redos))
        {
            return
        }
        while (!this.tree.canUndo())
        {
            this.navigate('down')
        }
        move = this.redos.shift()
        this.game.play(move.pos)
        this.tree.addMove(move.pos,this.game.lastCaptures)
        ;(this.compi.black != null ? this.compi.black.send(`play ${move.color} ${move.pos}`) : undefined)
        return (this.compi.white != null ? this.compi.white.send(`play ${move.color} ${move.pos}`) : undefined)
    }

    Referee.prototype["delete"] = function ()
    {
        this.tree.deleteCursorMove()
        return this.navigate('select')
    }

    Referee.prototype["navigate"] = function (action)
    {
        var estimate, hist, info

        this.game.paused = true
        if (this.game.start())
        {
            return
        }
        if (action !== 'select')
        {
            this.tree.navigate(action)
        }
        else
        {
            post.emit('tree')
        }
        info = this.game.info
        this.game = new Game(this.board,this.black,this.white,this.handicap)
        this.game.info = info
        this.game.paused = true
        this.board.game = this.game
        this.board.tree = this.tree
        hist = this.tree.moveHistory()
        this.game.replay(hist)
        estimate = this.game.estimate()
        return this.board.annotate()
    }

    Referee.prototype["jumpToStart"] = function ()
    {
        var _256_20_, _257_20_

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
        if (this.varee)
        {
            this.varee.remove()
            delete this.varee
            return window.stash.set('varee',false)
        }
        else
        {
            window.stash.set('varee',true)
            this.varee = new Varee(this.parent,this.tree,this.boardsize)
            return post.emit('tree')
        }
    }

    Referee.prototype["onChat"] = function (chat)
    {
        var _285_14_

        if (chat.gameid !== this.game.info.id)
        {
            return
        }
        return (this.varee != null ? this.varee.addChat(chat) : undefined)
    }

    return Referee
})()

module.exports = Referee