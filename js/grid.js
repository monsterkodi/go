// monsterkodi/kode 0.237.0

var _k_ = {rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, isArr: function (o) {return Array.isArray(o)}, isStr: function (o) {return typeof o === 'string' || o instanceof String}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}}

var alpha, Grid, splice

splice = require('./util').splice
alpha = require('./util').alpha


Grid = (function ()
{
    function Grid (size = 0)
    {
        this.size = size
    
        this.clear()
    }

    Grid.prototype["clear"] = function (size)
    {
        var y

        if ((size != null))
        {
            this.size = size
        }
        this.grid = ''
        for (var _25_17_ = y = 0, _25_21_ = this.size; (_25_17_ <= _25_21_ ? y < this.size : y > this.size); (_25_17_ <= _25_21_ ? ++y : --y))
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
            var _73_29_ = [y,undefined]; c = _73_29_[0]; y = _73_29_[1]

        }
        return this.grid = splice(this.grid,this.idx(x,y),1,c)
    }

    Grid.prototype["toString"] = function ()
    {
        return         (function (o) {
            var r_82_23_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = (function (v)
            {
                return ' ' + v
            })(o[k])
                if (m != null)
                {
                    r_82_23_[k] = m
                }
            }
            return typeof o == 'string' ? r_82_23_.join('') : r_82_23_
        })(this.grid)
    }

    Grid.prototype["toJSON"] = function ()
    {
        return this.grid
    }

    return Grid
})()

module.exports = Grid