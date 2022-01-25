// monsterkodi/kode 0.237.0

var _k_ = {empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}}

var kxk, post, sgf, SGF, sgfToAlphaNum, slash

sgf = require('@sabaki/sgf')
kxk = require('kxk')
slash = kxk.slash
post = kxk.post

sgfToAlphaNum = require('./util').sgfToAlphaNum


SGF = (function ()
{
    function SGF ()
    {}

    SGF["load"] = function (file)
    {
        var info, moves, n, node, nodes, size, _33_33_, _34_110_, _34_62_, _35_33_, _35_38_

        nodes = sgf.parseFile(file)
        moves = []
        n = node = nodes[0]
        size = (node.data.SZ ? parseInt(node.data.SZ[0]) : 19)
        while (!_k_.empty(n.children))
        {
            if (n.data.B)
            {
                moves.push(sgfToAlphaNum(n.data.B[0],size))
            }
            else if (n.data.W)
            {
                moves.push(sgfToAlphaNum(n.data.W[0],size))
            }
            n = n.children[0]
        }
        info = {score:(node.data.RE != null ? node.data.RE[0] : undefined),players:[node.data.PB[0] + ' ' + (((_34_62_=node.data.BR[0]) != null ? _34_62_ : '')),node.data.PW[0] + ' ' + (((_34_110_=node.data.WR[0]) != null ? _34_110_ : ''))],komi:((_35_38_=(node.data.KM != null ? node.data.KM[0] : undefined)) != null ? _35_38_ : 0)}
        post.emit('newGame',size,'white',0,moves,info)
        return nodes
    }

    SGF["save"] = function (file)
    {
        var nodes

        nodes = []
        return slash.writeText(file,sgf.stringify(nodes))
    }

    SGF["openDialog"] = function ()
    {
        var cb, _53_18_

        cb = function (files)
        {
            var file

            if (!_k_.empty(files))
            {
                file = files[0]
                window.stash.set('openFilePath',slash.dir(file))
                return SGF.load(file)
            }
        }
        return (window.win != null ? window.win.openFileDialog({title:'Open File',defaultPath:window.stash.get('openFilePath','.'),properties:['openFile','multiSelections'],cb:cb}) : undefined)
    }

    SGF["saveAsDialog"] = function ()
    {
        var cb, _65_18_

        cb = (function (file)
        {
            return this.save(file)
        }).bind(this)
        return (window.win != null ? window.win.saveFileDialog({title:'Save As SGF',defaultPath:window.stash.get('openFilePath','.'),cb:cb}) : undefined)
    }

    return SGF
})()

module.exports = SGF