// monsterkodi/kode 0.243.0

var _k_

var Bord


Bord = (function ()
{
    function Bord (size = 19)
    {
        this.size = size
    }

    Bord.prototype["delStone"] = function (c)
    {}

    Bord.prototype["addStone"] = function (c, s = stone.black)
    {}

    Bord.prototype["annotate"] = function ()
    {}

    Bord.prototype["clear"] = function ()
    {}

    return Bord
})()

module.exports = Bord