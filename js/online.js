// monsterkodi/kode 0.243.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, max: function () { m = -Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isFunc: function (o) {return typeof o === 'function'}}

var Board, elem, Game, iconUrl, io, ogsMove, ogsMoves, Online, open, post, rank, request, slash, toOGS

elem = require('kxk').elem
noon = require('kxk').noon
open = require('kxk').open
post = require('kxk').post
slash = require('kxk').slash

rank = require('./util/util').rank
ogsMoves = require('./util/util').ogsMoves
ogsMove = require('./util/util').ogsMove
toOGS = require('./util/util').toOGS
iconUrl = require('./util/util').iconUrl

request = require('https').request

io = require('socket.io-client').io

Board = require('./board')
Game = require('./game')

Online = (function ()
{
    function Online (parent, referee)
    {
        this.parent = parent
        this.referee = referee
    
        this["onMouseWheel"] = this["onMouseWheel"].bind(this)
        this["onResize"] = this["onResize"].bind(this)
        this["loadGame"] = this["loadGame"].bind(this)
        this["getGames"] = this["getGames"].bind(this)
        this["showGames"] = this["showGames"].bind(this)
        this["connectGames"] = this["connectGames"].bind(this)
        this["submitMove"] = this["submitMove"].bind(this)
        this.boards = {}
        this.activeGames = []
        this.postSecret()
        post.on('submitMove',this.submitMove)
        post.on('loadGame',this.loadGame)
        post.on('resize',this.onResize)
    }

    Online.prototype["submitMove"] = function (gameId, pos)
    {
        var move

        move = toOGS(pos,this.boards[gameId].game.size)
        return this.socket.emit('game/move',{auth:this.myAuth,player_id:this.myUserId,game_id:gameId,move:move})
    }

    Online.prototype["initSocket"] = function (config)
    {
        var authenticate, clockDrift, latency, ping, pong

        clockDrift = 0
        latency = 0
        global.myUserId = this.myUserId = config.user.id
        global.myUserName = config.user.username
        this.myAuth = config.chat_auth
        ping = (function ()
        {
            if (this.socket.connected)
            {
                return this.socket.emit('net/ping',{client:Date.now(),drift:clockDrift,latency:latency})
            }
        }).bind(this)
        pong = (function (data)
        {
            var now

            now = Date.now()
            latency = now - data.client
            clockDrift = now - latency / 2 - data.server
            return setTimeout(ping,2000)
        }).bind(this)
        authenticate = (function ()
        {
            return this.socket.emit('authenticate',{auth:config.chat_auth,player_id:config.user.id,username:config.user.username,jwt:config.user_jwt,client_version:config.version})
        }).bind(this)
        this.socket = io('https://online-go.com',{reconnection:true,reconnectionDelay:750,reconnectionDelayMax:10000,transports:["websocket"],upgrade:false})
        this.socket.on('net/pong',pong)
        this.socket.on('connect_error',(function ()
        {
            console.log('on connect_error')
        }).bind(this))
        this.socket.on('disconnect',(function (reason)
        {
            console.log('on disconnect',reason)
        }).bind(this))
        this.socket.on('connect',ping)
        this.socket.on('connect',authenticate)
        this.socket.on('connect',(function ()
        {
            return this.connectGames()
        }).bind(this))
        return this.socket.onAny((function (msg, arg)
        {
            if (msg.startsWith('game'))
            {
                return this.onGameData(msg,arg)
            }
            else if (!(_k_.in(msg,['active-bots','net/pong','score-estimator-enabled-state'])))
            {
                console.log('on any',msg,_k_.noon(arg))
            }
        }).bind(this))
    }

    Online.prototype["onGameData"] = function (msg, arg)
    {
        var b, e, pos, t

        if (msg.endsWith('/move'))
        {
            pos = ogsMove(arg.move,this.boards[arg.game_id].game.size)
            b = this.boards[arg.game_id]
            b.game.play(pos)
            if (b.game.players[b.game.nextColor()] === global.myUserName)
            {
                b.div.style.border = '2px solid black'
                b.div.style.borderRadius = '6px'
                e = b.parent
                t = e.previousElementSibling
                e.parentElement.insertBefore(e,e.parentElement.firstChild)
                t.parentElement.insertBefore(t,t.parentElement.firstChild)
                t.scrollIntoViewIfNeeded()
            }
            else
            {
                b.div.style.border = 'none'
            }
            console.log('load game?',this.referee.game.info.id,arg.game_id,this.referee.game.info.id === arg.game_id)
            if (this.referee.game.info.id === arg.game_id)
            {
                return this.loadGame(arg.game_id)
            }
        }
    }

    Online.prototype["connectGames"] = function ()
    {
        var game

        if (_k_.empty(this.activeGames))
        {
            setTimeout(this.connectGames,5000)
            return
        }
        var list = _k_.list(this.activeGames)
        for (var _136_17_ = 0; _136_17_ < list.length; _136_17_++)
        {
            game = list[_136_17_]
            this.socket.emit('game/connect',{game_id:game.id,player_id:this.myUserId,chat:0})
        }
    }

    Online.prototype["showGames"] = function ()
    {
        this.games = elem('div',{class:'games',parent:this.parent})
        this.games.addEventListener('mousewheel',this.onMouseWheel,true)
        this.getGames()
        return this.onResize()
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
                if (window.stash.get('games',true))
                {
                    this.showGames()
                }
                return this.get({path:'/api/v1/ui/config',cb:(function (d)
                {
                    return this.initSocket(d)
                }).bind(this)})
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

        this.boards = {}
        var list = _k_.list(this.activeGames)
        for (var _196_17_ = 0; _196_17_ < list.length; _196_17_++)
        {
            game = list[_196_17_]
            if (!(game != null))
            {
                console.log('no game?',this.activeGames)
                continue
            }
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
            var b, br, features, rb, t, tb, w

            features = {coordinates:false,liberties:false,numbers:false,hover:false}
            b = new Board(e,g.height,features)
            b.game = new Game(b,g.players.black.username,g.players.white.username,g.handicap)
            b.game.paused = true
            b.game.info.id = g.id
            b.game.replay(ogsMoves(g.gamedata.moves,g.height),true)
            br = this.parent.getBoundingClientRect()
            tb = br.height / (this.referee.boardsize + 1) - 2
            rb = tb
            w = _k_.max(128,(br.width - br.height) / 2 - tb)
            b.div.style.height = `${w - 30}px`
            b.div.style.width = `${w - 30}px`
            b.div.addEventListener('click',((function (id)
            {
                return (function ()
                {
                    return this.loadGame(id)
                }).bind(this)
            }).bind(this))(g.id))
            this.boards[g.id] = b
            b.onResize()
            if (g.gamedata.clock.current_player === 1110858)
            {
                b.div.style.border = '2px solid black'
                b.div.style.borderRadius = '6px'
                t = e.previousElementSibling
                e.parentElement.insertBefore(e,e.parentElement.firstChild)
                return t.parentElement.insertBefore(t,t.parentElement.firstChild)
            }
        }).bind(this)})
    }

    Online.prototype["loadGame"] = function (id)
    {
        return this.get({path:`/api/v1/games/${id}`,cb:(function (g)
        {
            var moves

            this.referee.newGame({black:g.gamedata.players.black.username,white:g.gamedata.players.white.username,size:g.gamedata.width,handicap:g.gamedata.handicap})
            moves = ogsMoves(g.gamedata.moves,g.gamedata.height)
            this.referee.game.paused = true
            this.referee.game.info.id = g.id
            this.referee.game.replay(moves,true)
            this.referee.tree.replay(moves,g.id)
            this.referee.game.calcScore()
            return this.referee.board.annotate()
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
        var b, br, i, lb, tb, w

        if (!this.games)
        {
            return
        }
        br = this.parent.getBoundingClientRect()
        tb = br.height / (this.referee.boardsize + 1) - 2
        w = _k_.max(128,(br.width - br.height) / 2 - tb)
        lb = (br.width - br.height) / 2 - w
        if ((br.width - br.height) / 2 < 128)
        {
            this.games.style.display = 'none'
        }
        else
        {
            this.games.style.display = 'initial'
        }
        this.games.style.width = `${w}px`
        this.games.style.top = `${tb}px`
        this.games.style.bottom = `${tb}px`
        this.games.style.left = `${lb}px`
        for (i in this.boards)
        {
            b = this.boards[i]
            b.div.style.width = `${w - 30}px`
            b.div.style.height = `${w - 30}px`
        }
    }

    Online.prototype["onMouseWheel"] = function (event)
    {
        return event.stopPropagation()
    }

    return Online
})()

module.exports = Online