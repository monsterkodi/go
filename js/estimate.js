// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

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
        var area, qmark, score

        this.verbose = verbose
    
        score = this.score()
        if (this.chains.length > 1 && this.areas.length > 1)
        {
            qmark = []
            var list = _k_.list(this.areas)
            for (var _30_21_ = 0; _30_21_ < list.length; _30_21_++)
            {
                area = list[_30_21_]
                if (area.color === '?')
                {
                    qmark.push(area)
                }
            }
            if (!_k_.empty(qmark))
            {
                this.fancySchmanzy()
                this.deadOrAlive()
                console.log(qmark)
            }
        }
        return score
    }

    return Estimate
})()

module.exports = Estimate