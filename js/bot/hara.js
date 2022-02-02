// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Compi, Hara

Compi = require('./compi')

Hara = (function ()
{
    _k_.extend(Hara, Compi)
    function Hara (game)
    {
        Hara.__super__.constructor.call(this,this.game,'hara','/usr/local/bin/hara',[])
    
        this.game = game
    }

    return Hara
})()

module.exports = Hara