var _k_

var ars, ded, Score, scr, sgfToAlphaNum

Score = require('../score')

scr = function (b)
{
    var r, s

    s = new Score(b)
    r = s.calcScore()
    return r
}

ars = function (b)
{
    var r, s

    s = new Score(b)
    r = s.calcScore()
    return s.areaString()
}

ded = function (b)
{
    var r, s

    s = new Score(b)
    r = s.calcScore()
    return s.deadString()
}
module.exports = {scr:scr,ded:ded,ars:ars}
sgfToAlphaNum = require('../util').sgfToAlphaNum

module.exports["util"] = function ()
{
    section("sgfToAlphaNum", function ()
    {
        compare(sgfToAlphaNum('pd'),'Q16')
        compare(sgfToAlphaNum('dp'),'D4')
        compare(sgfToAlphaNum('ss'),'T1')
    })
}
module.exports["util"]._section_ = true
module.exports._test_ = true
module.exports
