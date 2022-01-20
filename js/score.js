// monsterkodi/kode 0.237.0

var _k_ = {in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var Score, stoneColor

stoneColor = require('./util').stoneColor


Score = (function ()
{
    function Score ()
    {}

    Score.prototype["rayColor"] = function (c, d)
    {
        var n, s

        n = [c[0] + d[0],c[1] + d[1]]
        s = this.stoneAt(n)
        if (s === ' ')
        {
            return this.rayColor(n,d)
        }
        else
        {
            return s
        }
    }

    Score.prototype["rayColors"] = function (c)
    {
        var r, rc

        rc = []
        var list = [[1,0],[1,1],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1],[1,-1]]
        for (var _24_14_ = 0; _24_14_ < list.length; _24_14_++)
        {
            r = list[_24_14_]
            rc.push(this.rayColor(c,r))
        }
        return rc
    }

    Score.prototype["isEye"] = function (c)
    {
        var p, rc

        if (' ' === this.stoneAt(c))
        {
            rc = this.rayColors(c)
            p = rc.filter(function (r)
            {
                return (r != null)
            }).join('')
            if (!(_k_.in('○●',p)) && !(_k_.in('●○',p)) && p.length > 2)
            {
                return stoneColor(p[0])
            }
        }
    }

    Score.prototype["calcScore"] = function ()
    {
        var c, g, gs, s, x, y

        gs = {'○':{},'●':{}}
        for (var _38_17_ = y = 0, _38_21_ = this.size; (_38_17_ <= _38_21_ ? y < this.size : y > this.size); (_38_17_ <= _38_21_ ? ++y : --y))
        {
            for (var _39_21_ = x = 0, _39_25_ = this.size; (_39_21_ <= _39_25_ ? x < this.size : x > this.size); (_39_21_ <= _39_25_ ? ++x : --x))
            {
                c = [x,y]
                this.isEye(c)
                s = this.stoneAt(c)
                if (' ' !== s)
                {
                    g = this.group(c)
                    g.sort()
                    gs[s][g.join(' ')] = 1
                }
            }
        }
    }

    return Score
})()

module.exports = Score