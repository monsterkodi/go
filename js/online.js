// monsterkodi/kode 0.243.0

var _k_ = {noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, max: function () { m = -Infinity; for (a of arguments) { if (Array.isArray(a)) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isFunc: function (o) {return typeof o === 'function'}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}}

var Board, elem, Game, iconUrl, io, ogsMove, ogsMoves, Online, open, post, rank, rankToKyu, request, slash, toOGS

elem = require('kxk').elem
noon = require('kxk').noon
open = require('kxk').open
post = require('kxk').post
slash = require('kxk').slash

rank = require('./util/util').rank
rankToKyu = require('./util/util').rankToKyu
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
        this["showGames"] = this["showGames"].bind(this)
        this["loadGame"] = this["loadGame"].bind(this)
        this["onTalk"] = this["onTalk"].bind(this)
        this["submitMove"] = this["submitMove"].bind(this)
        this.boards = {}
        this.chats = {}
        this.postSecret()
        post.on('submitMove',this.submitMove)
        post.on('loadGame',this.loadGame)
        post.on('resize',this.onResize)
        post.on('talk',this.onTalk)
        this.games = elem('div',{class:'games',parent:this.parent})
        this.games.addEventListener('mousewheel',this.onMouseWheel,true)
        if (!window.stash.get('games',true))
        {
            this.toggleGames()
        }
    }

    Online.prototype["submitMove"] = function (gameId, pos)
    {
        var move

        if (!this.referee.tree.isAtNextMove())
        {
            console.log('skip submitting variation move!',gameId,pos)
            return
        }
        move = toOGS(pos,this.boards[gameId].game.size)
        return this.socket.emit('game/move',{auth:this.myAuth,player_id:this.myUserId,game_id:gameId,move:move})
    }

    Online.prototype["initSocket"] = function (config)
    {
        var authenticate, clockDrift, latency, notification, ping, pong

        clockDrift = 0
        latency = 0
        global.myUserId = this.myUserId = config.user.id
        global.myUserName = this.myUserName = config.user.username
        global.myAuth = this.myAuth = config.chat_auth
        global.notAuth = this.myNotAuth = config.notification_auth
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
            return clockDrift = now - latency / 2 - data.server
        }).bind(this)
        notification = (function ()
        {
            this.socket.emit('notification/connect',{player_id:this.myUserId,auth:this.myNotAuth})
            return this.socket.emit('chat/connect',{player_id:this.myUserId,auth:this.myAuth,username:this.myUserName,ranking:20,ui_class:''})
        }).bind(this)
        authenticate = (function ()
        {
            this.socket.emit('authenticate',{auth:config.chat_auth,player_id:config.user.id,username:config.user.username,jwt:config.user_jwt,client_version:config.version})
            return notification()
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
        this.socket.on('connect',notification)
        setInterval(ping,10000)
        return this.socket.onAny((function (msg, arg)
        {
            switch (msg.split('/')[0])
            {
                case 'nofification':
                case 'active_game':
                    if (arg.phase === 'finished')
                    {
                        return
                    }
                    return this.socket.emit('game/connect',{game_id:arg.id,player_id:this.myUserId,chat:1})

                case 'game':
                    return this.onGameData(msg,arg)

                case 'score-estimator-enabled-state':
                case 'active-bots':
                case 'net':
                case 'automatch':
                    return ''

                default:
                    console.log('any',msg,_k_.noon(arg))
            }

        }).bind(this))
    }

    Online.prototype["onGameData"] = function (msg, arg)
    {
        var b, gameid, line, msgtyp, pos, _161_31_

        gameid = arg.game_id
        msgtyp = msg.split('/').slice(-1)[0]
        switch (msgtyp)
        {
            case 'move':
                pos = ogsMove(arg.move,this.boards[gameid].game.size)
                console.log('move:',arg)
                b = this.boards[gameid]
                b.game.play(pos)
                this.updateMyMove(b)
                if (this.referee.game.info.id === gameid)
                {
                    return this.loadGame(gameid)
                }
                break
            case 'chat':
                gameid = parseInt(msg.split('/').slice(-2,-1)[0])
                line = arg.line
                line.color = (line.username === this.myUserName ? 'myself' : 'black')
                line.gameid = gameid
                this.chats[gameid] = ((_161_31_=this.chats[gameid]) != null ? _161_31_ : {})
                if (!this.chats[gameid][line.date])
                {
                    this.chats[gameid][line.date] = line
                    return post.emit('chat',line,1)
                }
                break
            case 'clock':
            case 'conditional_moves':
            case 'reset-chats':
                return ''

            case 'gamedata':
                if (!this.boards[gameid])
                {
                    return this.addBoard(arg)
                }
                break
            default:
                console.log('game:',msg,_k_.noon(arg))
        }

    }

    Online.prototype["onTalk"] = function (msg)
    {
        msg = _k_.trim(msg)
        if (_k_.empty(msg))
        {
            return
        }
        return this.socket.emit('game/chat',{body:msg,type:'main',game_id:this.referee.game.info.id,move_number:this.referee.game.moves.num()})
    }

    Online.prototype["updateMyMove"] = function (b)
    {
        var e, t

        if (b.game.players[b.game.nextColor()] === global.myUserName)
        {
            b.div.style.border = '2px solid black'
            b.div.style.borderRadius = '6px'
            e = b.parent
            t = e.previousElementSibling
            e.parentElement.insertBefore(e,e.parentElement.firstChild)
            t.parentElement.insertBefore(t,t.parentElement.firstChild)
            return t.scrollIntoViewIfNeeded()
        }
        else
        {
            return b.div.style.border = 'none'
        }
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

    Online.prototype["addBoard"] = function (game)
    {
        var b, br, color, e, features, g, ib, nb, p, rb, tb, w

        g = elem('div',{class:'game',parent:this.games})
        var list = ['black','white']
        for (var _237_18_ = 0; _237_18_ < list.length; _237_18_++)
        {
            color = list[_237_18_]
            p = game.players[color]
            if (p.username !== 'monsterkodi')
            {
                ib = elem('img',{parent:g,class:`gameIcon ${color}`})
                rb = elem('span',{parent:g,class:`gameRank ${color}`,text:rankToKyu(p.rank)})
                nb = elem('span',{parent:g,class:`gameName ${color}`,text:p.username})
                ib.addEventListener('click',(function (id)
                {
                    return function ()
                    {
                        return open('https://online-go.com/game/' + id)
                    }
                })(game.game_id))
                this.get({path:`/api/v1/players/${p.id}`,cb:((function (ib)
                {
                    return (function (p)
                    {
                        return ib.src = iconUrl(p.icon,128)
                    }).bind(this)
                }).bind(this))(ib)})
            }
        }
        e = elem('div',{class:'gameboard',parent:this.games})
        features = {coordinates:false,liberties:false,territory:false,numbers:false,hover:false,dots:false}
        b = new Board(e,game.height,features)
        b.game = new Game(b,game.players.black.username,game.players.white.username,game.handicap)
        b.game.paused = true
        b.game.info.id = game.game_id
        b.game.info.komi = game.komi
        b.game.replay(ogsMoves(game.moves,game.height),true)
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
        }).bind(this))(game.game_id))
        this.boards[game.game_id] = b
        b.onResize()
        return this.updateMyMove(b)
    }

    Online.prototype["loadGame"] = function (id)
    {
        var b, clearPending, e, g, k, moves, t

        if (b = this.boards[id])
        {
            g = b.game
            this.referee.newGame({black:g.players.black,white:g.players.white,size:g.size,handicap:g.handicap})
            moves = g.moves.m
            this.referee.game.paused = true
            this.referee.game.info.id = id
            this.referee.game.info.komi = g.info.komi
            this.referee.game.replay(moves,true)
            this.referee.tree.replay(moves,id)
            this.referee.game.estimate()
            this.referee.board.annotate()
            for (k in this.boards)
            {
                b = this.boards[k]
                t = b.parent.previousElementSibling
                t.style.backgroundColor = 'transparent'
                t.style.boxShadow = 'unset'
            }
            if (e = (this.boards[id] != null ? this.boards[id].parent : undefined))
            {
                t = e.previousElementSibling
                t.style.backgroundColor = 'rgba(80,30,0,0.03)'
                t.style.boxShadow = 'inset 1px 1px 6px rgba(80,30,0,0.6)'
                t.scrollIntoViewIfNeeded()
                e.scrollIntoViewIfNeeded()
            }
        }
        clearPending = (function ()
        {
            return delete this.pendingGameId
        }).bind(this)
        delete this.pendingGameId
        if (_k_.isNum(id))
        {
            this.pendingGameId = parseInt(id)
        }
        return this.get({path:`/api/v1/games/${id}`,cb:(function (g)
        {
            var date, line

            if (g.id !== this.pendingGameId && this.pendingGameId)
            {
                setTimeout(clearPending,4000)
                console.log('ignoring non-pending game data',this.pendingGameId,g.id)
                return
            }
            delete this.pendingGameId
            this.referee.newGame({black:g.gamedata.players.black.username,white:g.gamedata.players.white.username,size:g.gamedata.width,handicap:g.gamedata.handicap})
            moves = ogsMoves(g.gamedata.moves,g.gamedata.height)
            this.referee.game.paused = true
            this.referee.game.info.id = g.id
            this.referee.game.info.komi = g.gamedata.komi
            this.referee.game.replay(moves,true)
            this.referee.tree.replay(moves,g.id)
            this.referee.game.estimate()
            this.referee.board.annotate()
            ;(this.boards[id] != null ? this.boards[id].div.scrollIntoViewIfNeeded() : undefined)
            for (date in this.chats[id])
            {
                line = this.chats[id][date]
                post.emit('chat',line)
            }
            return this.referee.varee.fixChat()
        }).bind(this)})
    }

    Online.prototype["nextGame"] = function ()
    {
        var i, id, ids

        ids = Object.keys(this.boards)
        if (this.referee.game.info.id)
        {
            for (var _350_21_ = i = 0, _350_25_ = ids.length; (_350_21_ <= _350_25_ ? i < ids.length : i > ids.length); (_350_21_ <= _350_25_ ? ++i : --i))
            {
                if (parseInt(ids[i]) === this.referee.game.info.id)
                {
                    id = parseInt(ids[_k_.clamp(0,ids.length - 1,i + 1)])
                    break
                }
            }
        }
        id = (id != null ? id : parseInt(ids[0]))
        return this.loadGame(id)
    }

    Online.prototype["prevGame"] = function ()
    {
        var i, id, ids

        ids = Object.keys(this.boards)
        if (this.referee.game.info.id)
        {
            for (var _363_21_ = i = 0, _363_25_ = ids.length; (_363_21_ <= _363_25_ ? i < ids.length : i > ids.length); (_363_21_ <= _363_25_ ? ++i : --i))
            {
                if (parseInt(ids[i]) === this.referee.game.info.id)
                {
                    id = parseInt(ids[_k_.clamp(0,ids.length - 1,i - 1)])
                    break
                }
            }
        }
        id = (id != null ? id : parseInt(ids[0]))
        return this.loadGame(id)
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
                console.log('not ok:',response.statusCode,'(429=throttled)')
                return
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
        if (this.games.style.display !== 'none')
        {
            this.games.style.display = 'none'
            return window.stash.set('games',false)
        }
        else
        {
            window.stash.set('games',true)
            return this.showGames()
        }
    }

    Online.prototype["showGames"] = function ()
    {
        this.games.style.display = 'initial'
        return this.onResize()
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