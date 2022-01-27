// monsterkodi/kode 0.237.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}}

var Compi, GNU

Compi = require('./compi')

GNU = (function ()
{
    _k_.extend(GNU, Compi)
    function GNU (game)
    {
        GNU.__super__.constructor.call(this,this.game,'gnu','/usr/local/bin/gnugo',['--mode','gtp','--level','18','--never-resign'])
    
        this.game = game
    }

    return GNU
})()

module.exports = GNU