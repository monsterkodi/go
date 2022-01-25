// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

var $, args, Board, elem, Game, GNU, kerror, keyinfo, klog, kxk, MainWin, opponent, post, SGF, stash, win

kxk = require('kxk')
args = kxk.args
kerror = kxk.kerror
keyinfo = kxk.keyinfo
klog = kxk.klog
post = kxk.post
stash = kxk.stash
win = kxk.win
elem = kxk.elem
$ = kxk.$

opponent = require('./util').opponent

Board = require('./board')
Game = require('./game')
GNU = require('./gnu')
SGF = require('./sgf')

MainWin = (function ()
{
    _k_.extend(MainWin, win)
    function MainWin ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["saveStash"] = this["saveStash"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["newGame"] = this["newGame"].bind(this)
        this["onLoad"] = this["onLoad"].bind(this)
        MainWin.__super__.constructor.call(this,{dir:__dirname,pkg:require('../package.json'),menu:'../kode/menu.noon',icon:'../img/mini.png',prefsSeperator:'▸',onLoad:this.onLoad})
        post.on('alert',function (msg)
        {
            window.alert(msg)
            return kerror(msg)
        })
        post.on('saveStash',this.saveStash)
        post.on('newGame',this.newGame)
        window.stash = new stash(`win/${this.id}`,{separator:'▸'})
        post.setMaxListeners(20)
        window.onresize = this.onResize
        window.onload = this.onLoad
    }

    MainWin.prototype["onLoad"] = function ()
    {
        var r1, r2

        this.restore()
        this.main = $('#main')
        if (0)
        {
            r1 = elem('div',{class:'row',parent:this.main})
            r2 = elem('div',{class:'row',parent:this.main})
            r1.style = 'height:50%'
            r2.style = 'height:50%'
            this.board1 = new Board(r1,9)
            this.board2 = new Board(r1,13)
            this.board3 = new Board(r1,19)
            this.board4 = new Board(r2,19)
            this.board5 = new Board(r2,13)
            return this.board6 = new Board(r2,9)
        }
        else
        {
            return this.newGame(window.stash.get('boardsize',9),window.stash.get('gnucolor','white'),window.stash.get('handicap',0),window.stash.get('moves',[]))
        }
    }

    MainWin.prototype["newGame"] = function (boardsize = 9, gnucolor = 'black', handicap = 0, moves = [], info = {})
    {
        var c, m, p, r1, score, _104_31_

        this.boardsize = boardsize
        this.gnucolor = gnucolor
        this.handicap = handicap
    
        if (_k_.empty(moves))
        {
            window.stash.del('score')
        }
        window.stash.set('boardsize',this.boardsize)
        window.stash.set('gnucolor',this.gnucolor)
        window.stash.set('handicap',this.handicap)
        window.stash.set('moves',moves)
        this.main.innerHTML = ''
        r1 = elem('div',{class:'row',parent:this.main})
        r1.style = 'height:100%'
        this.board = new Board(r1,this.boardsize,opponent[this.gnucolor])
        this.game = new Game(this.board)
        this.gnu = new GNU(this.game)
        this.board.gnu = this.gnu
        this.board.game = this.game
        this.gnu.newGame(this.boardsize,this.gnucolor,this.handicap,_k_.empty(moves))
        this.game.info = info
        var list = _k_.list(moves)
        for (var _93_14_ = 0; _93_14_ < list.length; _93_14_++)
        {
            m = list[_93_14_]
            var _94_19_ = m.split(' '); c = _94_19_[0]; p = _94_19_[1]

            if (!(p != null))
            {
                p = c
                c = ['black','white'][moves.indexOf(m) % 2]
            }
            this.game.play(c,p)
            this.gnu.send(`play ${c} ${p}`)
        }
        if (!_k_.empty(moves))
        {
            score = ((_104_31_=info.score) != null ? _104_31_ : window.stash.get('score'))
            if (score)
            {
                return this.game.finalScore(score)
            }
            else
            {
                if (this.game.moves.slice(-1)[0].split(' ')[0] !== this.gnucolor)
                {
                    return this.gnu.send(`genmove ${this.gnucolor}`)
                }
            }
        }
    }

    MainWin.prototype["onResize"] = function ()
    {
        window.stash.set('bounds',this.getBounds())
        return post.emit('resize')
    }

    MainWin.prototype["restore"] = function ()
    {
        var bounds

        if (bounds = window.stash.get('bounds'))
        {
            this.setBounds(bounds)
        }
        return post.emit('restore')
    }

    MainWin.prototype["saveStash"] = function ()
    {
        window.stash.set('bounds',this.getBounds())
        post.emit('stash')
        window.stash.save()
        return post.toMain('stashSaved')
    }

    MainWin.prototype["onMenuAction"] = function (action, args)
    {
        switch (action.toLowerCase())
        {
            case 'save':
                this.game.save()
                return this.saveStash()

            case 'open':
                return SGF.openDialog()

            case 'save as ...':
                return SGF.saveAsDialog()

            case 'revert':
                return this.restore()

            case 'undo':
                return this.gnu.undo()

            case 'redo':
                return this.gnu.redo()

            case 'pass':
                return this.gnu.humanMove('pass')

            case 'genmove':
                return this.gnu.humanMove(this.game.genmove(opponent[this.gnucolor]))

            case 'calcscore':
                return this.gnu.calcscore()

            case 'move number':
                return this.board.toggleNumbers()

            case 'legend':
                return this.board.toggleLegend()

            case 'liberties':
                return this.board.toggleLiberties()

            case 'territory':
                return this.board.toggleTerritory()

            case 'new game':
                return this.newGame(this.boardsize,this.gnucolor,this.handicap)

            case 'black':
            case 'white':
                return this.newGame(this.boardsize,action,this.handicap)

            case '7x7':
            case '9x9':
            case '13x13':
            case '19x19':
                return this.newGame(parseInt(action),this.gnucolor,this.handicap)

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                return this.newGame(this.boardsize,this.gnucolor,parseInt(action))

            default:
                klog(`menuAction '${action}'`)
                return MainWin.__super__.onMenuAction.call(this,action,args)
        }

    }

    return MainWin
})()

new MainWin