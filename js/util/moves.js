// monsterkodi/kode 0.237.0

var _k_ = {copy: function (o) { return o instanceof Array ? o.slice() : typeof o == 'object' && o.constructor.name == 'Object' ? Object.assign({}, o) : typeof o == 'string' ? ''+o : o }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var Move, Moves, stoneColor

stoneColor = require('./util').stoneColor


Move = (function ()
{
    function Move (pos, color, p, captures = [])
    {
        this.pos = pos
        this.color = color
        this.p = p
        this.captures = captures
    }

    return Move
})()


Moves = (function ()
{
    function Moves ()
    {
        this.m = []
        this.p = [0,0]
    }

    Moves.prototype["num"] = function ()
    {
        return this.m.length
    }

    Moves.prototype["pop"] = function ()
    {
        var m

        m = this.m.pop()
        this.p = (this.num() ? _k_.copy((this.last().p)) : [0,0])
        return m
    }

    Moves.prototype["clear"] = function ()
    {
        this.m = []
        this.p = [0,0]
        return delete this.ended
    }

    Moves.prototype["add"] = function (pos, color, captures)
    {
        var c

        c = this.color(color)
        if (!_k_.empty(captures))
        {
            this.p[((c === 'black') ? 0 : 1)] += captures.length
        }
        this.m.push(new Move(pos,c,_k_.copy((this.p)),captures))
        switch (pos)
        {
            case 'pass':
                return this.ended = this.doublePass()

            case 'resign':
                return this.ended = true

            default:
                return this.ended = false
        }

    }

    Moves.prototype["history"] = function ()
    {
        return this.m.map(function (m)
        {
            return m.pos + ' ' + m.p[0] + ' ' + m.p[1] + ((m.captures.length ? (' ' + m.captures.join(' ')) : ''))
        })
    }

    Moves.prototype["start"] = function ()
    {
        return this.m.length === 0
    }

    Moves.prototype["color"] = function (c)
    {
        return (c ? stoneColor[c] : this.nextColor())
    }

    Moves.prototype["lastColor"] = function ()
    {
        return (this.m.length ? ['white','black'][this.m.length % 2] : 'start')
    }

    Moves.prototype["nextColor"] = function ()
    {
        return ['black','white'][this.m.length % 2]
    }

    Moves.prototype["lastIsPass"] = function ()
    {
        var _50_26_

        return (this.last() != null ? this.last().pos : undefined) === 'pass'
    }

    Moves.prototype["singlePass"] = function ()
    {
        var _51_26_

        return (this.last() != null ? this.last().pos : undefined) === 'pass' && (this.m.slice(-2,-1)[0] != null ? this.m.slice(-2,-1)[0].pos : undefined) !== 'pass'
    }

    Moves.prototype["doublePass"] = function ()
    {
        var _52_26_

        return ((this.last() != null ? this.last().pos : undefined) === 'pass' && 'pass' === (this.m.slice(-2,-1)[0] != null ? this.m.slice(-2,-1)[0].pos : undefined))
    }

    Moves.prototype["resigned"] = function ()
    {
        var _53_26_

        return (this.last() != null ? this.last().pos : undefined) === 'resign'
    }

    Moves.prototype["last"] = function ()
    {
        return this.m[this.m.length - 1]
    }

    Moves.prototype["end"] = function ()
    {
        var _55_26_

        return ((_55_26_=this.ended) != null ? _55_26_ : false)
    }

    return Moves
})()

module.exports = Moves