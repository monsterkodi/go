// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, copy: function (o) { return Array.isArray(o) ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Estimate, Score, stone

stone = require('./util/util').stone

max = Math.max
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
        var area, ip, qmark, score

        this.verbose = verbose
    
        score = this.score()
        ip = 0
        if (this.chains.length > 1)
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
                ip += this.estimateArea(area)
            }
            if (score !== 'B+0')
            {
                if (score[0] === 'W')
                {
                    ip += parseInt(score.slice(2))
                }
                else
                {
                    ip -= parseInt(score.slice(2))
                }
            }
            ip = ip.toFixed(1)
        }
        return ip
    }

    Estimate.prototype["estimateArea"] = function (area)
    {
        var ip, p

        area.infl = []
        var list = _k_.list(area.posl)
        for (var _52_14_ = 0; _52_14_ < list.length; _52_14_++)
        {
            p = list[_52_14_]
            area.infl.push(this.influence(this.coord(p)))
        }
        this.inflinfl(area)
        this.inflinfl(area)
        this.inflinfl(area)
        ip = area.infl.reduce(function (a, v)
        {
            return a + v
        })
        return ip
    }

    Estimate.prototype["influence"] = function (c)
    {
        var d, dd, g, iv, n, s, sd

        sd = [[1,0],[0,1],[-1,0],[0,-1]]
        dd = [[1,1],[-1,1],[1,-1],[-1,-1]]
        iv = 0
        var list = _k_.list(sd)
        for (var _68_14_ = 0; _68_14_ < list.length; _68_14_++)
        {
            d = list[_68_14_]
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
        for (var _78_14_ = 0; _78_14_ < list1.length; _78_14_++)
        {
            d = list1[_78_14_]
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
        return _k_.clamp(-1,1,iv / 2)
    }

    Estimate.prototype["inflinfl"] = function (area)
    {
        var c, d, i, infl, iv, n, nc, nd, np, p, pi

        infl = _k_.copy(area.infl)
        var list = _k_.list(area.posl)
        for (i = 0; i < list.length; i++)
        {
            p = list[i]
            if (area.infl[i] === 0)
            {
                c = this.coord(p)
                nd = [[1,0],[0,1],[-1,0],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]
                iv = 0
                nc = 0
                var list1 = _k_.list(nd)
                for (var _98_22_ = 0; _98_22_ < list1.length; _98_22_++)
                {
                    d = list1[_98_22_]
                    n = [c[0] + d[0],c[1] + d[1]]
                    np = this.pos(n)
                    if (_k_.in(np,area.posl))
                    {
                        if (pi = infl[area.posl.indexOf(np)])
                        {
                            nc++
                            iv += pi
                        }
                    }
                }
                if (nc)
                {
                    area.infl[i] = iv / nc
                }
            }
        }
    }

    return Estimate
})()

module.exports = Estimate