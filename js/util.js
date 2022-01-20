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

    static colorName (color)
    {
        var opp

        opp = {black:'black',B:'black',b:'black','○':'black','●':'white',white:'white',W:'white',w:'white'}
        return opp[color]
    }

    static alpha = 'ABCDEFGHJKLMNOPQRST'

    static stone = {black:'○',white:'●',empty:' ',B:'○',W:'●',b:'○',w:'●'}

    static stoneColor (s)
    {
        switch (s)
        {
            case '○':
                return 'black'

            case '●':
                return 'white'

        }

    }

    static splice (s, i, n, r = '')
    {
        return s.slice(0,i) + r + s.slice(i + n)
    }
}

module.exports = Util