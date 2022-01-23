// monsterkodi/kode 0.237.0

var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, isArr: function (o) {return Array.isArray(o)}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}}

var alpha, Grid, splice

splice = require('./util').splice
alpha = require('./util').alpha


Grid = (function ()
{
    function Grid (a = 0)
    {
        if (_k_.isStr(a))
        {
            this.size = a.split('\n').length
            this.fromString(a)
        }
        else
        {
            this.size = a
            this.clear()
        }
    }

    Grid.prototype["copy"] = function (g)
    {
        return this.grid = g.grid
    }

    Grid.prototype["clear"] = function (size)
    {
        var y

        if ((size != null))
        {
            this.size = size
        }
        this.grid = ''
        for (var _33_17_ = y = 0, _33_21_ = this.size; (_33_17_ <= _33_21_ ? y < this.size : y > this.size); (_33_17_ <= _33_21_ ? ++y : --y))
        {
            this.grid += _k_.rpad(this.size,'')
            if (y < this.size - 1)
            {
                this.grid += '\n'
            }
        }
        return this
    }

    Grid.prototype["idx"] = function (x, y)
    {
        if (!(y != null))
        {
            if (_k_.isArr(x))
            {
                y = x[1]
                x = x[0]
            }
            else if (_k_.isStr(x))
            {
                y = this.size - parseInt(x.slice(1))
                x = alpha.indexOf(x[0].toUpperCase())
            }
        }
        if (!(y != null))
        {
            if (x < this.size * this.size)
            {
                return x
            }
        }
        else
        {
            if ((0 <= x && x < this.size) && (0 <= y && y < this.size))
            {
                return x + (this.size + 1) * y
            }
        }
    }

    Grid.prototype["at"] = function (x, y)
    {
        var i

        i = this.idx(x,y)
        if ((i != null))
        {
            return this.grid[i]
        }
    }

    Grid.prototype["set"] = function (x, y, c)
    {
        if (!(c != null))
        {
            var _81_29_ = [y,undefined]; c = _81_29_[0]; y = _81_29_[1]

        }
        return this.grid = splice(this.grid,this.idx(x,y),1,c)
    }

    Grid.prototype["toString"] = function ()
    {
        return         (function (o) {
            var r_90_23_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return (v !== '\n' ? (v + ' ') : v)
            })(o[k])
                if (m != null)
                {
                    r_90_23_[k] = m
                }
            }
            return typeof o == 'string' ? r_90_23_.join('') : r_90_23_
        })(this.grid)
    }

    Grid.prototype["fromString"] = function (str)
    {
        var c, spl, x, y

        this.clear()
        spl = str.split('\n')
        for (var _97_17_ = y = 0, _97_21_ = this.size; (_97_17_ <= _97_21_ ? y < this.size : y > this.size); (_97_17_ <= _97_21_ ? ++y : --y))
        {
            if (y < spl.length)
            {
                for (var _99_25_ = x = 0, _99_29_ = this.size; (_99_25_ <= _99_29_ ? x < this.size : x > this.size); (_99_25_ <= _99_29_ ? ++x : --x))
                {
                    if (x * 2 < spl[y].length)
                    {
                        c = spl[y][x * 2]
                        if (c === '.')
                        {
                            c = ' '
                        }
                        this.set(x,y,c)
                    }
                }
            }
        }
    }

    return Grid
})()

module.exports = Grid