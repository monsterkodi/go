// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

var Estimate, Score, stone

stone = require('./util/util').stone

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
            for (var _29_21_ = 0; _29_21_ < list.length; _29_21_++)
            {
                area = list[_29_21_]
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
            for (var _37_21_ = 0; _37_21_ < list1.length; _37_21_++)
            {
                area = list1[_37_21_]
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
            console.log(ip)
        }
        return ip
    }

    Estimate.prototype["estimateArea"] = function (area)
    {
        var c, circle, d, g, i, infl, ip, n, p, sign

        infl = Array(area.posl.length).fill(0)
        var list = _k_.list(area.neighbors)
        for (var _52_14_ = 0; _52_14_ < list.length; _52_14_++)
        {
            p = list[_52_14_]
            c = this.coord(p)
            g = this.groupAt(p)
            if (g.state === 'dead')
            {
                continue
            }
            circle = [[0,1,0,0.5,[8,12,16,17]],[1,0,1,0.5,[9,13,20,21]],[2,-1,0,0.5,[10,14,18,19]],[3,0,-1,0.5,[11,15,22,23]],[4,1,1,0.4,[16,20,24]],[5,1,-1,0.4,[17,22,25]],[6,-1,1,0.4,[18,21,26]],[7,-1,-1,0.4,[19,23,27]],[8,2,0,0.3,[12]],[9,0,2,0.3,[13]],[10,-2,0,0.3,[14]],[11,0,-2,0.3,[15]],[12,3,0,0.2,[]],[13,0,3,0.2,[]],[14,-3,0,0.2,[]],[15,0,-3,0.2,[]],[16,2,1,0.2,[]],[17,2,-1,0.2,[]],[18,-2,1,0.2,[]],[19,-2,-1,0.2,[]],[20,1,2,0.2,[]],[21,-1,2,0.2,[]],[22,1,-2,0.2,[]],[23,-1,-2,0.2,[]],[24,2,2,0.1,[]],[25,2,-2,0.1,[]],[26,-2,2,0.1,[]],[27,-2,-2,0.1,[]]]
            sign = (this.stoneAt(c) === stone.black ? -1 : 1)
            var list1 = _k_.list(circle)
            for (var _88_18_ = 0; _88_18_ < list1.length; _88_18_++)
            {
                d = list1[_88_18_]
                n = [c[0] + d[1],c[1] + d[2]]
                if (p = this.pos(n))
                {
                    if (_k_.in(p,area.posl))
                    {
                        infl[area.posl.indexOf(p)] += sign * d[3]
                    }
                    else if (_k_.in(p,area.neighbors))
                    {
                        var list2 = _k_.list(d[4])
                        for (var _94_30_ = 0; _94_30_ < list2.length; _94_30_++)
                        {
                            i = list2[_94_30_]
                            circle[i][3] = 0
                        }
                    }
                }
            }
        }
        area.infl = infl.map(function (v)
        {
            return _k_.clamp(-1,1,v)
        })
        ip = area.infl.reduce(function (a, v)
        {
            return a + v
        })
        return ip
    }

    return Estimate
})()

module.exports = Estimate