// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Compi, Leelaz, post

post = require('kxk').post

Compi = require('./compi')

Leelaz = (function ()
{
    _k_.extend(Leelaz, Compi)
    function Leelaz (game)
    {
        Leelaz.__super__.constructor.call(this,this.game,'leelaz','/opt/homebrew/bin/leelaz',['--gtp','--noponder','--timemanage','fast','--logfile','/Users/kodi/Desktop/leelaz.log'])
    
        this.game = game
    }

    Leelaz.prototype["newGame"] = function (boardsize, color, handicap)
    {
        this.send("time_settings 0 15 1")
        return Leelaz.__super__.newGame.call(this,boardsize,color,handicap)
    }

    Leelaz.prototype["onStderr"] = function (str)
    {
        var key, kv, playout, value

        if (str.startsWith('Playouts:'))
        {
            str = _k_.trim(str,'\n')
            playout = {}
            var list = _k_.list(str.split(', '))
            for (var _37_19_ = 0; _37_19_ < list.length; _37_19_++)
            {
                kv = list[_37_19_]
                var _38_29_ = kv.split(': '); key = _38_29_[0]; value = _38_29_[1]

                switch (key)
                {
                    case 'PV':
                        playout.variation = value.split(' ')
                        break
                    default:
                        playout[key.toLowerCase()] = value
                }

            }
            return post.emit('variation',playout.variation)
        }
    }

    return Leelaz
})()

module.exports = Leelaz