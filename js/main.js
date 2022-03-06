// monsterkodi/kode 0.243.0

var _k_

var abs, app, BrowserWindow, Menu, post, wins

app = require('kxk').app
post = require('kxk').post

BrowserWindow = require('electron').BrowserWindow
Menu = require('electron').Menu

abs = Math.abs


wins = function ()
{
    return BrowserWindow.getAllWindows().sort(function (a, b)
    {
        return a.id - b.id
    })
}
class Main extends app
{
    constructor ()
    {
        super({dir:__dirname,pkg:require('../package.json'),dirs:['../pug','../styl','bot','util'],index:'index.html',icon:'../img/app.ico',about:'../img/about.png',prefsSeperator:'▸',width:1024,height:768,minWidth:800,minHeight:600})
    
        var template

        this.onWinReady = this.onWinReady.bind(this)
        this.onWinResize = this.onWinResize.bind(this)
        this.quit = this.quit.bind(this)
        this.opt.onQuit = this.quit
        this.opt.onShow = this.onShow
        this.app.on('window-all-closed',(function (event)
        {
            return this.exitApp()
        }).bind(this))
        template = [{label:'go',submenu:[{type:'separator'},{label:'Quit',accelerator:'Command+Q',click:(function ()
        {
            return this.app.quit()
        }).bind(this)},{label:'Copy',accelerator:'CmdOrCtrl+C',selector:'copy:'},{label:'Paste',accelerator:'CmdOrCtrl+V',selector:'paste:'}]}]
        Menu.setApplicationMenu(Menu.buildFromTemplate(template))
        post.on('menuAction',this.onMenuAction)
    }

    hideDock ()
    {}

    quit ()
    {
        var toSave

        toSave = wins().length
        if (toSave)
        {
            post.toWins('saveStash')
            post.on('stashSaved',(function ()
            {
                toSave -= 1
                if (toSave === 0)
                {
                    return this.exitApp()
                }
            }).bind(this))
            return 'delay'
        }
    }

    onWinResize (win)
    {}

    onWinReady (win)
    {}
}

new Main