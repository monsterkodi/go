// monsterkodi/kode 0.237.0

var _k_

class Util
{
    static stone = {empty:' ',black:'○',white:'●',B:'○',b:'○',W:'●',w:'●'}

    static opponent = {black:'white',B:'white',b:'white','○':'white','●':'black',white:'black',W:'black',w:'black'}

    static stoneColor = {black:'black',B:'black',b:'black','○':'black','●':'white',white:'white',W:'white',w:'white'}

    static alpha = 'ABCDEFGHJKLMNOPQRST'

    static ilpha = 'abcdefghijklmnopqrstuvwxyz'

    static short = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&$@#%*<>^=+-!0123456789abcdefghijklmnopqrstuvwxyz"

    static splice (s, i, n, r = '')
    {
        return s.slice(0,i) + r + s.slice(i + n)
    }

    static sgfToAlphaNum (sgf, size = 19)
    {
        if (sgf.length === 2)
        {
            return Util.alpha[Util.ilpha.indexOf(sgf[0])] + (size - Util.ilpha.indexOf(sgf[1]))
        }
        else
        {
            console.log(`sgf? '${sgf}' ${sgf.length} ${Array.isArray(sgf)}`)
            return sgf
        }
    }
}

module.exports = Util