// monsterkodi/kode 0.243.0

var _k_ = {extend: function (c,p) {for (var k in p) { if (Object.hasOwn(p, k)) c[k] = p[k] } function ctor() { this.constructor = c; } ctor.prototype = p.prototype; c.prototype = new ctor(); c.__super__ = p.prototype; return c;}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, clamp: function (l,h,v) { var ll = Math.min(l,h), hh = Math.max(l,h); if (!_k_.isNum(v)) { v = ll }; if (v < ll) { v = ll }; if (v > hh) { v = hh }; if (!_k_.isNum(v)) { v = ll }; return v }, isNum: function (o) {return !isNaN(o) && !isNaN(parseFloat(o)) && (isFinite(o) || o === Infinity || o === -Infinity)}}

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
        var area, score, _23_14_, _24_44_

        this.verbose = verbose
    
        score = this.score()
        if (this.chains.length > 1)
        {
            var list = _k_.list(this.areas)
            for (var _19_21_ = 0; _19_21_ < list.length; _19_21_++)
            {
                area = list[_19_21_]
                if (area.color === '?')
                {
                    score += this.estimateArea(area)
                }
            }
        }
        this.info = ((_23_14_=this.info) != null ? _23_14_ : {})
        return this.info.estimate = score + ((_24_44_=this.info.komi) != null ? _24_44_ : 0)
    }

    Estimate.prototype["estimateArea"] = function (area)
    {
        var c, circle, d, i, infl, p, sign

        infl = Array(area.posl.length).fill(0)
        var list = _k_.list(area.neighbors)
        for (var _29_14_ = 0; _29_14_ < list.length; _29_14_++)
        {
            p = list[_29_14_]
            c = this.coord(p)
            if (this.groupAt(p).state === 'dead')
            {
                continue
            }
            circle = [[1,0,0.5,[8,12,16,17]],[0,1,0.5,[9,13,20,21]],[-1,0,0.5,[10,14,18,19]],[0,-1,0.5,[11,15,22,23]],[1,1,0.4,[16,20,24]],[1,-1,0.4,[17,22,25]],[-1,1,0.4,[18,21,26]],[-1,-1,0.4,[19,23,27]],[2,0,0.3,[12]],[0,2,0.3,[13]],[-2,0,0.3,[14]],[0,-2,0.3,[15]],[3,0,0.2,[]],[0,3,0.2,[]],[-3,0,0.2,[]],[0,-3,0.2,[]],[2,1,0.2,[]],[2,-1,0.2,[]],[-2,1,0.2,[]],[-2,-1,0.2,[]],[1,2,0.2,[]],[-1,2,0.2,[]],[1,-2,0.2,[]],[-1,-2,0.2,[]],[2,2,0.1,[]],[2,-2,0.1,[]],[-2,2,0.1,[]],[-2,-2,0.1,[]]]
            sign = (this.stoneAt(c) === stone.black ? -1 : 1)
            var list1 = _k_.list(circle)
            for (var _65_18_ = 0; _65_18_ < list1.length; _65_18_++)
            {
                d = list1[_65_18_]
                if (p = this.pos([c[0] + d[0],c[1] + d[1]]))
                {
                    if (_k_.in(p,area.posl))
                    {
                        infl[area.posl.indexOf(p)] += sign * d[2]
                    }
                    else if (_k_.in(p,area.neighbors))
                    {
                        var list2 = _k_.list(d[3])
                        for (var _70_30_ = 0; _70_30_ < list2.length; _70_30_++)
                        {
                            i = list2[_70_30_]
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
        return area.infl.reduce(function (a, v)
        {
            return a + v
        })
    }

    return Estimate
})()

module.exports = Estimate