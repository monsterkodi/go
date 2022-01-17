// monsterkodi/kode 0.237.0

var _k_

class Util
{
    static opponent (color)
    {
        var opp

        opp = {black:'white',B:'white',b:'white',white:'black',W:'black',w:'black'}
        return opp[color]
    }
}

module.exports = Util