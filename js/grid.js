// monsterkodi/kode 0.237.0

var _k_ = {isStr: function (o) {return typeof o === 'string' || o instanceof String}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, isArr: function (o) {return Array.isArray(o)}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, each_r: function (o) {return o instanceof Array ? [] : typeof o == 'string' ? o.split('') : {}}, trim: function (s,c=' ') {return _k_.ltrim(_k_.rtrim(s,c),c)}, ltrim: function (s,c=' ') { while (_k_.in(s[0],c)) { s = s.slice(1) } return s}, rtrim: function (s,c=' ') {while (_k_.in(s.slice(-1)[0],c)) { s = s.slice(0, s.length - 1) } return s}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}}

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

    Grid.prototype["toString"] = function (legend)
    {
        var ri, row, rows, s

        s = '┌─' + _k_.lpad(this.size * 2,'','─') + '┐'
        rows = this.grid.split('\n')
        var list = _k_.list(rows)
        for (ri = 0; ri < list.length; ri++)
        {
            row = list[ri]
            s += '\n│ '
            s += (function (o) {
                var r_114_21_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return v + ' '
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_114_21_[k] = m
                    }
                }
                return typeof o == 'string' ? r_114_21_.join('') : r_114_21_
            })(row)
            s += '│'
            if (legend)
            {
                s += ' ' + (this.size - ri)
            }
        }
        s += '\n'
        s += '└─' + _k_.lpad(this.size * 2,'','─') + '┘'
        if (legend)
        {
            s += '\n ' + (function (o) {
                var r_120_42_ = _k_.each_r(o)
                for (var k in o)
                {   
                    var m = ((function (v)
                {
                    return ' ' + v
                }).bind(this))(o[k])
                    if (m != null)
                    {
                        r_120_42_[k] = m
                    }
                }
                return typeof o == 'string' ? r_120_42_.join('') : r_120_42_
            })(alpha.slice(0, typeof this.size === 'number' ? this.size : -1))
        }
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
        else if (spl[0][0] === '┌')
        {
            spl.shift()
            spl.pop()
            spl = spl.map(function (s)
            {
                return s.slice(2)
            })
            spl = spl.map(function (s)
            {
                return s.slice(0, spl.length * 2)
            })
        }
        this.size = spl.length
        this.clear()
        for (var _152_17_ = y = 0, _152_21_ = this.size; (_152_17_ <= _152_21_ ? y < this.size : y > this.size); (_152_17_ <= _152_21_ ? ++y : --y))
        {
            if (y < spl.length)
            {
                for (var _154_25_ = x = 0, _154_29_ = this.size; (_154_25_ <= _154_29_ ? x < this.size : x > this.size); (_154_25_ <= _154_29_ ? ++x : --x))
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