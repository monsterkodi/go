// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var $, args, Board, elem, kerror, keyinfo, klog, kxk, MainWin, Online, post, Referee, SGF, stash, stone, win

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

stone = require('./util/util').stone

SGF = require('./util/sgf')
Board = require('./board')
Referee = require('./referee')
Online = require('./online')

MainWin = (function ()
{
    _k_.extend(MainWin, win)
    function MainWin ()
    {
        var main, row

        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["saveStash"] = this["saveStash"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onLoad"] = this["onLoad"].bind(this)
        MainWin.__super__.constructor.call(this,{dir:__dirname,pkg:require('../package.json'),menu:'../kode/menu.noon',icon:'../img/mini.png',prefsSeperator:'▸',onLoad:this.onLoad})
        post.on('alert',function (msg)
        {
            window.alert(msg)
            return kerror(msg)
        })
        post.on('saveStash',this.saveStash)
        window.stash = new stash(`win/${this.id}`,{separator:'▸'})
        post.setMaxListeners(20)
        window.onresize = this.onResize
        window.onload = this.onLoad
        main = $("#main")
        row = elem('div',{class:'row',parent:main,style:'height:100%'})
        this.referee = new Referee(row)
        this.online = new Online(row,this.referee)
    }

    MainWin.prototype["onLoad"] = function ()
    {
        this.restore()
        this.referee.newGame({black:window.stash.get('black','human'),white:window.stash.get('white','gnu'),size:window.stash.get('size',9),handicap:window.stash.get('handicap',0),moves:window.stash.get('moves',[]),tree:window.stash.get('tree')})
        return this.referee.board.preloadStones()
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

    MainWin.prototype["updateTitle"] = function ()
    {
        var cps, game, mov, sb, sw, t, td, tl, tm, tr

        game = this.referee.game
        if (!game)
        {
            return
        }
        t = $('.titlebar-title')
        t.innerHTML = ''
        td = elem('div',{class:'gameInfo',parent:t})
        tl = elem('div',{class:'gameInfoLeft black',parent:td})
        tm = elem('div',{class:'gameInfoCenter',parent:td})
        tr = elem('div',{class:'gameInfoRight white',parent:td})
        mov = {black:'',white:''}
        if (game.moves.singlePass())
        {
            mov[game.lastColor()] = 'pass'
        }
        if (game.moves.resigned())
        {
            mov[game.lastColor()] = 'resign'
        }
        if (game.lastColor() === 'white')
        {
            sb = stone.white
            sw = stone.black
        }
        else
        {
            sb = stone.black
            sw = stone.white
        }
        cps = {black:(game.moves.p[0] !== 0 ? game.moves.p[0] + ' ' + sb : ''),white:(game.moves.p[1] !== 0 ? game.moves.p[1] + ' ' + sw : '')}
        elem('span',{class:'move',parent:tl,text:mov.black})
        elem('span',{class:'player',parent:tl,text:game.players.black})
        elem('span',{class:'capture',parent:tl,text:sb + ' ' + cps.black})
        if (game.info.score)
        {
            elem('span',{class:`score ${game.info.score[0]}`,parent:tm,text:game.info.score})
        }
        if (!_k_.empty(this.referee.redos))
        {
            elem('span',{class:"redos",parent:tm,text:`${this.referee.game.moves.num()} ${stone.white} ${this.referee.game.moves.num() + this.referee.redos.length}`})
        }
        elem('span',{class:'capture',parent:tr,text:sw + ' ' + cps.white})
        elem('span',{class:'player',parent:tr,text:game.players.white})
        return elem('span',{class:'move',parent:tr,text:mov.white})
    }

    MainWin.prototype["onMenuAction"] = function (action, args)
    {
        switch (action.toLowerCase())
        {
            case 'open':
                return SGF.openDialog()

            case 'save as ...':
                return SGF.saveAsDialog()

            case 'save':
                this.referee.save()
                return this.saveStash()

            case 'up':
            case 'down':
            case 'left':
            case 'right':
            case 'rightdown':
            case 'leftup':
            case 'back':
            case 'forward':
                return this.referee.navigate(action)

            case 'delete':
                return this.referee.delete()

            case 'undo':
                return this.referee.undo()

            case 'redo':
                return this.referee.redo()

            case 'start':
                return this.referee.jumpToStart()

            case 'end':
                return this.referee.jumpToEnd()

            case 'pass':
                return this.referee.playerMove('pass','human')

            case 'resign':
                return this.referee.playerMove('resign','human')

            case 'genmove':
                return this.referee.genMove()

            case 'calcscore':
                this.referee.game.calcScore()
                return this.referee.board.annotate()

            case 'games':
                return this.online.toggleGames()

            case 'tree':
                return this.referee.toggleTree()

            case 'numbers':
                return this.referee.board.toggleNumbers()

            case 'coordinates':
                return this.referee.board.toggleCoordinates()

            case 'liberties':
                return this.referee.board.toggleLiberties()

            case 'territory':
                return this.referee.board.toggleTerritory()

            case 'variations':
                return this.referee.board.toggleVariations()

            case 'new game':
                return this.referee.newGame()

            case 'gnu human':
                return this.referee.newGame({black:'gnu',white:'human'})

            case 'human gnu':
                return this.referee.newGame({black:'human',white:'gnu'})

            case 'human human':
                return this.referee.newGame({black:'human',white:'human'})

            case 'gnu gnu':
                return this.referee.newGame({black:'gnu',white:'gnu'})

            case 'leelaz human':
                return this.referee.newGame({black:'leelaz',white:'human'})

            case 'human leelaz':
                return this.referee.newGame({black:'human',white:'leelaz'})

            case 'leelaz leelaz':
                return this.referee.newGame({black:'leelaz',white:'leelaz'})

            case 'gnu leelaz':
                return this.referee.newGame({black:'gnu',white:'leelaz'})

            case 'gnu hara':
                return this.referee.newGame({black:'gnu',white:'hara'})

            case 'hara hara':
                return this.referee.newGame({black:'hara',white:'hara'})

            case 'katago katago':
                return this.referee.newGame({black:'katago',white:'katago'})

            case 'katago leelaz':
                return this.referee.newGame({black:'katago',white:'leelaz'})

            case 'gnu katago':
                return this.referee.newGame({black:'gnu',white:'katago'})

            case '7x7':
            case '9x9':
            case '13x13':
            case '19x19':
                return this.referee.newGame({size:parseInt(action)})

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
                return this.referee.newGame({handicap:parseInt(action)})

            default:
                return MainWin.__super__.onMenuAction.call(this,action,args)
        }

    }

    return MainWin
})()

new MainWin