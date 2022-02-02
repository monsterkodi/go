// monsterkodi/kode 0.237.0

var _k_

var Move, Moves, stoneColor

stoneColor = require('./util').stoneColor


Move = (function ()
{
    function Move (pos, color, captures)
    {
        this.pos = pos
        this.color = color
        this.captures = captures
    }

    return Move
})()


Moves = (function ()
{
    function Moves ()
    {
        this.m = []
    }

    Moves.prototype["num"] = function ()
    {
        return this.m.length
    }

    Moves.prototype["pop"] = function ()
    {
        return this.m.pop()
    }

    Moves.prototype["clear"] = function ()
    {
        this.m = []
        return delete this.ended
    }

    Moves.prototype["end"] = function ()
    {
        var _23_26_

        return ((_23_26_=this.ended) != null ? _23_26_ : false)
    }

    Moves.prototype["last"] = function ()
    {
        return this.m[this.m.length - 1]
    }

    Moves.prototype["start"] = function ()
    {
        return this.m.length === 0
    }

    Moves.prototype["history"] = function ()
    {
        return this.m.map(function (m)
        {
            return m.pos
        })
    }

    Moves.prototype["resigned"] = function ()
    {
        return (this.m.slice(-1)[0] != null ? this.m.slice(-1)[0].pos : undefined) === 'resign'
    }

    Moves.prototype["lastIsPass"] = function ()
    {
        return (this.m.slice(-1)[0] != null ? this.m.slice(-1)[0].pos : undefined) === 'pass'
    }

    Moves.prototype["singlePass"] = function ()
    {
        return (this.m.slice(-1)[0] != null ? this.m.slice(-1)[0].pos : undefined) === 'pass' && (this.m.slice(-2,-1)[0] != null ? this.m.slice(-2,-1)[0].pos : undefined) !== 'pass'
    }

    Moves.prototype["doublePass"] = function ()
    {
        return ((this.m.slice(-1)[0] != null ? this.m.slice(-1)[0].pos : undefined) === 'pass' && 'pass' === (this.m.slice(-2,-1)[0] != null ? this.m.slice(-2,-1)[0].pos : undefined))
    }

    Moves.prototype["lastColor"] = function ()
    {
        return (this.m.length ? ['white','black'][this.m.length % 2] : 'start')
    }

    Moves.prototype["nextColor"] = function ()
    {
        return ['black','white'][this.m.length % 2]
    }

    Moves.prototype["color"] = function (c)
    {
        return (c ? stoneColor[c] : this.nextColor())
    }

    Moves.prototype["add"] = function (pos, color, captures)
    {
        this.m.push(new Move(pos,this.color(color),captures))
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

    return Moves
})()

module.exports = Moves