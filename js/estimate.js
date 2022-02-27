// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, profile: function (id) {_k_.hrtime ??= {}; _k_.hrtime[id] = process.hrtime.bigint()}, profilend: function (id) { var b = process.hrtime.bigint()-_k_.hrtime[id]; let f=1000n; for (let u of ['ns','μs','ms','s']) { if (u=='s' || b<f) { return console.log(id+' '+(1000n*b/f)+' '+u); } f*=1000n; }}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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
    
        _k_.profile('estimate')
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
            if (!_k_.empty(qmark) && global.test)
            {
                this.fancySchmanzy()
                this.deadOrAlive()
            }
            var list1 = _k_.list(qmark)
            for (var _38_21_ = 0; _38_21_ < list1.length; _38_21_++)
            {
                area = list1[_38_21_]
                this.estimateArea(area)
            }
        }
        _k_.profilend('estimate')
        return score
    }

    Estimate.prototype["estimateArea"] = function (area)
    {
        var p

        area.infl = []
        var list = _k_.list(area.posl)
        for (var _48_14_ = 0; _48_14_ < list.length; _48_14_++)
        {
            p = list[_48_14_]
            area.infl.push(this.influence(this.coord(p)))
        }
    }

    Estimate.prototype["influence"] = function (c)
    {
        var d, dd, g, iv, n, s, sd

        sd = [[1,0],[0,1],[-1,0],[0,-1]]
        dd = [[1,1],[-1,1],[-1,1],[-1,-1]]
        iv = 0
        var list = _k_.list(sd)
        for (var _58_14_ = 0; _58_14_ < list.length; _58_14_++)
        {
            d = list[_58_14_]
            n = [c[0] + d[0],c[1] + d[1]]
            s = this.stoneAt(n)
            if (_k_.in(s,[stone.black,stone.white]))
            {
                g = this.groupAt(this.pos(n))
                if (g.state !== 'dead')
                {
                    switch (s)
                    {
                        case stone.black:
                            iv -= 1
                            break
                        case stone.white:
                            iv += 1
                            break
                    }

                }
            }
        }
        var list1 = _k_.list(dd)
        for (var _68_14_ = 0; _68_14_ < list1.length; _68_14_++)
        {
            d = list1[_68_14_]
            n = [c[0] + d[0],c[1] + d[1]]
            s = this.stoneAt(n)
            if (_k_.in(s,[stone.black,stone.white]))
            {
                g = this.groupAt(this.pos(n))
                if (g.state !== 'dead')
                {
                    switch (s)
                    {
                        case stone.black:
                            iv -= 0.5
                            break
                        case stone.white:
                            iv += 0.5
                            break
                    }

                }
            }
        }
        return iv
    }

    return Estimate
})()

module.exports = Estimate