// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var $, args, Board, elem, kerror, keyinfo, klog, kxk, MainWin, post, Referee, stash, win

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

Board = require('./board')
Referee = require('./referee')

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
    }

    MainWin.prototype["onLoad"] = function ()
    {
        this.restore()
        return this.referee.newGame({black:window.stash.get('black','human'),white:window.stash.get('white','gnu'),size:window.stash.get('size',9),handicap:window.stash.get('handicap',0),moves:window.stash.get('moves',[])})
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
                this.referee.game.save()
                return this.saveStash()

            case 'open':
                return SGF.openDialog()

            case 'save as ...':
                return SGF.saveAsDialog()

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

            case 'genmove':
                return this.referee.genMove()

            case 'calcscore':
                return this.referee.gnu.calcscore()

            case 'move number':
                return this.referee.board.toggleNumbers()

            case 'legend':
                return this.referee.board.toggleLegend()

            case 'liberties':
                return this.referee.board.toggleLiberties()

            case 'territory':
                return this.referee.board.toggleTerritory()

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

            case 'hara katago':
                return this.referee.newGame({black:'hara',white:'katago'})

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
                klog(`menuAction '${action}'`)
                return MainWin.__super__.onMenuAction.call(this,action,args)
        }

    }

    return MainWin
})()

new MainWin