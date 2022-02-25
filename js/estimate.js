// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}}

var Estimate, Score, stone

stone = require('./util/util').stone

min = Math.min

Score = require('./score')

Estimate = (function ()
{
    _k_.extend(Estimate, Score)
    function Estimate ()
    {
        return Estimate.__super__.constructor.apply(this, arguments)
    }

    Estimate.prototype["estimate"] = function (verbose)
    {
        this.verbose = verbose
    
        _k_.profile('estimate')
        _k_.profilend('estimate')
        return this.calcScore()
    }

    return Estimate
})()

module.exports = Estimate