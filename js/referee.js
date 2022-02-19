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
    
        this["navigate"] = this["navigate"].bind(this)
        this["altMove"] = this["altMove"].bind(this)
        this["playerMove"] = this["playerMove"].bind(this)
        this["newGame"] = this["newGame"].bind(this)
        this.boardsize = window.stash.get('boardsize',19)
        this.handicap = window.stash.get('handicap',0)
        this.white = window.stash.get('white','human')
        this.black = window.stash.get('black','human')
        post.on('newGame',this.newGame)
        post.on('playerMove',this.playerMove)
        post.on('altMove',this.altMove)
        post.on('navigate',this.navigate)
    }

    Referee.prototype["newGame"] = function (gi = {})
    {
        var info, moves, _45_14_, _46_14_, _48_33_, _49_33_, _50_33_, _51_33_, _52_33_, _53_33_, _86_20_, _87_20_

        ;(this.varee != null ? this.varee.remove() : undefined)
        ;(this.board != null ? this.board.remove() : undefined)
        this.white = ((_48_33_=gi.white) != null ? _48_33_ : this.white)
        this.black = ((_49_33_=gi.black) != null ? _49_33_ : this.black)
        this.handicap = ((_50_33_=gi.handicap) != null ? _50_33_ : this.handicap)
        this.boardsize = ((_51_33_=gi.size) != null ? _51_33_ : this.boardsize)
        moves = ((_52_33_=gi.moves) != null ? _52_33_ : [])
        info = ((_53_33_=gi.info) != null ? _53_33_ : {})
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
        window.stash.set('size',this.boardsize)
        window.stash.set('white',this.white)
        window.stash.set('black',this.black)
        window.stash.set('handicap',this.handicap)
        window.stash.set('moves',moves)
        this.board = new Board(this.parent,this.boardsize)
        this.game = new Game(this.board,this.white,this.black,this.handicap)
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
        for (var _122_14_ = 0; _122_14_ < list.length; _122_14_++)
        {
            m = list[_122_14_]
            spl = m.split(' ')
            var _124_22_ = spl.slice(0, 3); p = _124_22_[0]; b = _124_22_[1]; w = _124_22_[2]

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
        var color, next, _143_42_, _143_62_, _150_38_, _150_58_, _165_27_, _166_28_, _167_27_, _168_28_

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
        console.log('altMove',p,this.game.nextColor())
        console.log(this.game.grid.toString())
        console.log(this.tree.toString())
        this.playerMove(p,this.game.players[this.game.nextColor()])
        console.log(this.game.grid.toString())
        console.log(this.tree.toString())
    }

    Referee.prototype["undo"] = function ()
    {
        var m, _197_15_, _207_20_, _208_20_

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
        console.log('undo')
        this.game.paused = true
        this.redos = ((_197_15_=this.redos) != null ? _197_15_ : [])
        m = this.game.moves.pop()
        this.redos.unshift(m)
        this.game.undoMove(m)
        this.tree.undoMove(m)
        ;(this.compi.black != null ? this.compi.black.undo() : undefined)
        return (this.compi.white != null ? this.compi.white.undo() : undefined)
    }

    Referee.prototype["redo"] = function ()
    {
        var move, _220_20_, _221_20_

        if (_k_.empty(this.redos))
        {
            return
        }
        while (!this.tree.canUndo())
        {
            this.navigate('down')
        }
        move = this.redos.shift()
        console.log('redo',move)
        this.game.play(move.pos)
        this.tree.addMove(move.pos,this.game.lastCaptures)
        ;(this.compi.black != null ? this.compi.black.send(`play ${move.color} ${move.pos}`) : undefined)
        return (this.compi.white != null ? this.compi.white.send(`play ${move.color} ${move.pos}`) : undefined)
    }

    Referee.prototype["delete"] = function ()
    {
        return this.tree.deleteCursorMove()
    }

    Referee.prototype["navigate"] = function (action)
    {
        var mh

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
        this.game = new Game(this.board,this.white,this.black,this.handicap)
        this.game.paused = true
        this.board.game = this.game
        this.board.tree = this.tree
        mh = this.tree.moveHistory()
        return this.game.replay(mh)
    }

    Referee.prototype["jumpToStart"] = function ()
    {
        var _261_20_, _262_20_

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

    return Referee
})()

module.exports = Referee