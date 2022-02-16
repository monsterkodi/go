// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, isFunc: function (o) {return typeof o === 'function'}, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }}

var Board, elem, Game, iconUrl, ogsMoves, Online, open, post, rank, request, slash, WebSocket

elem = require('kxk').elem
noon = require('kxk').noon
open = require('kxk').open
post = require('kxk').post
slash = require('kxk').slash

request = require('https').request

rank = require('./util/util').rank
ogsMoves = require('./util/util').ogsMoves
iconUrl = require('./util/util').iconUrl

WebSocket = require('ws')
Board = require('./board')
Game = require('./game')

Online = (function ()
{
    function Online (parent, referee)
    {
        this.parent = parent
        this.referee = referee
    
        this["onResize"] = this["onResize"].bind(this)
        this["getGames"] = this["getGames"].bind(this)
        this["onMouseWheel"] = this["onMouseWheel"].bind(this)
        this["showGames"] = this["showGames"].bind(this)
        this.activeGames = []
        this.postSecret()
        post.on('resize',this.onResize)
    }

    Online.prototype["showGames"] = function ()
    {
        this.games = elem('div',{class:'games',parent:this.parent})
        this.games.addEventListener('mousewheel',this.onMouseWheel,true)
        this.getGames()
        return this.onResize()
    }

    Online.prototype["onMouseWheel"] = function (event)
    {
        return event.stopPropagation()
    }

    Online.prototype["postSecret"] = function ()
    {
        var body, secret

        secret = noon.load(slash.resolve(`${__dirname}/../bin/.secret`))
        body = `client_id=${secret.client_id}&client_secret=${secret.client_secret}&username=${secret.username}&password=${secret.password}&grant_type=password`
        return this.post({path:'/oauth2/token/',body:body,cb:(function (d)
        {
            if (d.access_token)
            {
                this.token = d.access_token
                console.log('token!')
                if (window.stash.get('games',true))
                {
                    return this.showGames()
                }
            }
            else
            {
                console.log('no token!')
            }
        }).bind(this)})
    }

    Online.prototype["getGames"] = function (page = 1)
    {
        this.activeGames = []
        return this.get({path:`/api/v1/megames/?page=${page}&ended__isnull=true&page_size=100`,cb:(function (d)
        {
            this.activeGames = this.activeGames.concat(d.results)
            if (d.next)
            {
                return this.getGames(page + 1)
            }
            else
            {
                return this.renderGames()
            }
        }).bind(this)})
    }

    Online.prototype["renderGames"] = function ()
    {
        var b, g, game, ib, iw, nb, nw, rb, rw

        var list = _k_.list(this.activeGames)
        for (var _92_17_ = 0; _92_17_ < list.length; _92_17_++)
        {
            game = list[_92_17_]
            g = elem('div',{class:'game',parent:this.games})
            if (game.players.black.username !== 'monsterkodi')
            {
                ib = elem('img',{parent:g,class:'gameIcon black',src:iconUrl(game.players.black.icon,128)})
                rb = elem('span',{parent:g,class:'gameRank black',text:rank(game.players.black)})
                nb = elem('span',{parent:g,class:'gameName black',text:game.players.black.username})
                ib.addEventListener('click',(function (id)
                {
                    return function ()
                    {
                        return open('https://online-go.com/game/' + id)
                    }
                })(game.id))
                ib.title = game.name
            }
            if (game.players.white.username !== 'monsterkodi')
            {
                iw = elem('img',{parent:g,class:'gameIcon white',parent:g,src:iconUrl(game.players.white.icon,128)})
                rw = elem('span',{parent:g,class:'gameRank white',text:rank(game.players.white)})
                nw = elem('span',{parent:g,class:'gameName white',text:game.players.white.username})
                iw.addEventListener('click',(function (id)
                {
                    return function ()
                    {
                        return open('https://online-go.com/game/' + id)
                    }
                })(game.id))
                iw.title = game.name
            }
            b = elem('div',{class:'gameboard',parent:this.games})
            this.renderGame(game,b)
        }
    }

    Online.prototype["renderGame"] = function (game, e)
    {
        return this.get({path:`/api/v1/games/${game.id}`,cb:(function (g)
        {
            var b

            b = new Board(e,g.height)
            b.game = new Game(b,g.players.black.name,g.players.white.name,g.handicap)
            b.game.replay(ogsMoves(g.gamedata.moves,g.height))
            return b.div.style.height = '400px'
        }).bind(this)})
    }

    Online.prototype["post"] = function (o)
    {
        var req

        req = request({host:'online-go.com',path:o.path,method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'}},(function (response)
        {
            if (response.statusCode !== 200)
            {
                console.log('status:',response.statusCode)
            }
            response.setEncoding('utf8')
            return response.on('data',(function (s)
            {
                var d

                d = JSON.parse(s)
                if (_k_.isFunc(o.cb))
                {
                    return o.cb(d)
                }
            }).bind(this))
        }).bind(this))
        req.on('error',function (e)
        {
            console.log('post error',e)
        })
        if (o.body)
        {
            req.write(o.body)
        }
        return req.end()
    }

    Online.prototype["get"] = function (o)
    {
        var req

        req = request({host:'online-go.com',path:o.path,method:'GET',headers:{'Authorization':`Bearer ${this.token}`,'Content-Type':'application/x-www-form-urlencoded'}},(function (response)
        {
            var data

            if (response.statusCode !== 200)
            {
                console.log('status:',response.statusCode)
            }
            response.setEncoding('utf8')
            data = ""
            response.on('data',(function (chunk)
            {
                return data += chunk
            }).bind(this))
            return response.on('end',(function ()
            {
                var d

                d = JSON.parse(data)
                if (_k_.isFunc(o.cb))
                {
                    return o.cb(d)
                }
            }).bind(this))
        }).bind(this))
        req.on('error',function (e)
        {
            console.log('get error',e)
        })
        return req.end()
    }

    Online.prototype["toggleGames"] = function ()
    {
        console.log('toggleGames')
        if (this.games)
        {
            this.games.remove()
            delete this.games
            return window.stash.set('games',false)
        }
        else
        {
            window.stash.set('games',true)
            return this.showGames()
        }
    }

    Online.prototype["onResize"] = function ()
    {
        var br, rb, tb, w

        if (!this.games)
        {
            return
        }
        br = this.parent.getBoundingClientRect()
        tb = br.height / (this.referee.boardsize + 1) - 2
        rb = tb
        w = _k_.max(0,(br.width - br.height) / 2 - tb)
        this.games.style.width = `${w}px`
        this.games.style.top = `${tb}px`
        this.games.style.bottom = `${tb}px`
        return this.games.style.left = `${rb}px`
    }

    return Online
})()

module.exports = Online