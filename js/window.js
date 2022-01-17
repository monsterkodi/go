// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var $, args, Board, elem, kerror, keyinfo, klog, kxk, MainWin, post, stash, win

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

MainWin = (function ()
{
    _k_.extend(MainWin, win)
    function MainWin ()
    {
        this["onMenuAction"] = this["onMenuAction"].bind(this)
        this["saveStash"] = this["saveStash"].bind(this)
        this["restore"] = this["restore"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["onMove"] = this["onMove"].bind(this)
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
        window.onload = this.onLoad
    }

    MainWin.prototype["onLoad"] = function ()
    {
        var r1, r2

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
            this.board6 = new Board(r2,9)
        }
        else
        {
            r1 = elem('div',{class:'row',parent:this.main})
            r1.style = 'height:100%'
            this.board1 = new Board(r1,9)
        }
        post.emit('resize')
        window.onresize = this.onResize
        return this.restore()
    }

    MainWin.prototype["onMove"] = function ()
    {
        return window.stash.set('bounds',this.getBounds())
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
                return this.saveStash()

            case 'revert':
                return this.restore()

        }

        klog(`menuAction '${action}'`)
        return MainWin.__super__.onMenuAction.call(this,action,args)
    }

    return MainWin
})()

new MainWin