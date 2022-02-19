// monsterkodi/kode 0.237.0

var _k_ = {min: function () { m = Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.min.apply(_k_.min,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n < m ? n : m}}}; return m }, max: function () { m = -Infinity; for (a of arguments) { if (a instanceof Array) {m = _k_.max.apply(_k_.max,[m].concat(a))} else {n = parseFloat(a); if(!isNaN(n)){m = n > m ? n : m}}}; return m }, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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

    static rank (user)
    {
        var r, rating_to_rank, ret

        rating_to_rank = function (rating)
        {
            return Math.log(_k_.min(6000,_k_.max(100,rating)) / 525) * 23.15
        }
        if (ret = user.ratings.overall)
        {
            r = Math.floor(rating_to_rank(ret.rating))
            if (r < -900)
            {
                return '?'
            }
            if (r < 30)
            {
                return Math.ceil(30 - r) + 'k'
            }
            return Math.floor(r - 29) + 'd'
        }
        return 0
    }

    static ogsMoves (ogs, size)
    {
        var moves, o

        moves = []
        var list = _k_.list(ogs)
        for (var _67_14_ = 0; _67_14_ < list.length; _67_14_++)
        {
            o = list[_67_14_]
            moves.push({pos:Util.alpha[o[0]] + (size - o[1]),color:['black','white'][moves.length % 2]})
        }
        moves.push({pos:'next',color:['black','white'][moves.length % 2]})
        return moves
    }

    static ogsMove (ogs, size)
    {
        return Util.alpha[ogs[0]] + (size - ogs[1])
    }

    static toOGS (pos, size)
    {
        return [Util.alpha.indexOf(pos[0]),size - parseInt(pos.slice(1))]
    }

    static iconUrl (icon, size)
    {
        return icon.replace(/-[0-9]+.png$/,`-${size}.png`).replace(/s=[0-9]+/,`s=${size}`)
    }
}

module.exports = Util