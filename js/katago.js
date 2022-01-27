// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Compi, Katago

Compi = require('./compi')

Katago = (function ()
{
    _k_.extend(Katago, Compi)
    function Katago (game)
    {
        Katago.__super__.constructor.call(this,this.game,'katago','/opt/homebrew/bin/katago',['gtp'])
    
        this.game = game
    }

    return Katago
})()

module.exports = Katago