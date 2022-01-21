// monsterkodi/kode 0.237.0

var _k_

class Util
{
    static stone = {empty:' ',black:'○',white:'●',B:'○',b:'○',W:'●',w:'●'}

    static opponent = {black:'white',B:'white',b:'white',white:'black',W:'black',w:'black'}

    static stoneColor = {black:'black',B:'black',b:'black','○':'black','●':'white',white:'white',W:'white',w:'white'}

    static alpha = 'ABCDEFGHJKLMNOPQRST'

    static splice (s, i, n, r = '')
    {
        return s.slice(0,i) + r + s.slice(i + n)
    }
}

module.exports = Util