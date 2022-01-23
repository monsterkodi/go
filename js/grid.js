// monsterkodi/kode 0.237.0

var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, isArr: function (o) {return Array.isArray(o)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

var alpha, Grid, splice

splice = require('./util').splice
alpha = require('./util').alpha


Grid = (function ()
{
    function Grid (a = 0)
    {
        if (_k_.isStr(a))
        {
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
        for (var _32_17_ = y = 0, _32_21_ = this.size; (_32_17_ <= _32_21_ ? y < this.size : y > this.size); (_32_17_ <= _32_21_ ? ++y : --y))
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
            var _80_29_ = [y,undefined]; c = _80_29_[0]; y = _80_29_[1]

        }
        return this.grid = splice(this.grid,this.idx(x,y),1,c)
    }

    Grid.prototype["toString"] = function ()
    {
        var b, p, ri, row, rows, s

        b = (this.size > 9 ? 2 : 1)
        p = _k_.lpad(b,'')
        s = p + ' ' + (function (o) {
            var r_93_39_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = ((function (v)
            {
                return v + ' '
            }).bind(this))(o[k])
                if (m != null)
                {
                    r_93_39_[k] = m
                }
            }
            return typeof o == 'string' ? r_93_39_.join('') : r_93_39_
        })(alpha.slice(0, typeof this.size === 'number' ? this.size : -1))
        s += p
        rows = this.grid.split('\n')
        var list = _k_.list(rows)
        for (ri = 0; ri < list.length; ri++)
        {
            row = list[ri]
            s += '\n'
            s += _k_.lpad(b,this.size - ri) + ' ' + (            (function (o) {
                var r_98_47_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return v + ' '
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_98_47_[k] = m
                    }
                }
                return typeof o == 'string' ? r_98_47_.join('') : r_98_47_
            })(row)) + _k_.rpad(b,this.size - ri)
        }
        s += '\n'
        s += p + ' ' + (function (o) {
            var r_100_40_ = _k_.each_r(o)
            for (var k in o)
            {   
                var m = ((function (v)
            {
                return v + ' '
            }).bind(this))(o[k])
                if (m != null)
                {
                    r_100_40_[k] = m
                }
            }
            return typeof o == 'string' ? r_100_40_.join('') : r_100_40_
        })(alpha.slice(0, typeof this.size === 'number' ? this.size : -1))
        s += p
        return s
    }

    Grid.prototype["fromString"] = function (str)
    {
        var c, spl, t, x, y

        spl = str.split('\n')
        while (_k_.trim(spl.slice(-1)[0]).length === 0)
        {
            spl.pop()
        }
        if (_k_.ltrim(spl[0])[0] === 'A')
        {
            spl.shift()
            spl.pop()
            t = (spl.slice(-1)[0][0] !== ' ' ? 2 : 3)
            spl = spl.map(function (s)
            {
                return s.slice(t)
            })
            spl = spl.map(function (s)
            {
                return s.slice(0, spl.length * 2)
            })
        }
        this.size = spl.length
        this.clear()
        for (var _120_17_ = y = 0, _120_21_ = this.size; (_120_17_ <= _120_21_ ? y < this.size : y > this.size); (_120_17_ <= _120_21_ ? ++y : --y))
        {
            if (y < spl.length)
            {
                for (var _122_25_ = x = 0, _122_29_ = this.size; (_122_25_ <= _122_29_ ? x < this.size : x > this.size); (_122_25_ <= _122_29_ ? ++x : --x))
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