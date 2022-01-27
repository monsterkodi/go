// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Compi, Leelaz

Compi = require('./compi')

Leelaz = (function ()
{
    _k_.extend(Leelaz, Compi)
    function Leelaz (game)
    {
        Leelaz.__super__.constructor.call(this,this.game,'leelaz','/opt/homebrew/bin/leelaz',['--gtp','--noponder','--timemanage','fast','--logfile','/Users/kodi/Desktop/leelaz.log'])
    
        this.game = game
    }

    return Leelaz
})()

module.exports = Leelaz