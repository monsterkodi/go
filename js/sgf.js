// monsterkodi/kode 0.237.0

var _k_ = {noon: function (obj) { var pad = function (s, l) { while (s.length < l) { s += ' ' }; return s }; var esc = function (k, arry) { var es, sp; if (0 <= k.indexOf('\n')) { sp = k.split('\n'); es = sp.map(function (s) { return esc(s,arry) }); es.unshift('...'); es.push('...'); return es.join('\n') } if (k === '' || k === '...' || _k_.in(k[0],[' ','#','|']) || _k_.in(k[k.length - 1],[' ','#','|'])) { k = '|' + k + '|' } else if (arry && /  /.test(k)) { k = '|' + k + '|' }; return k }; var pretty = function (o, ind, seen) { var k, kl, l, v, mk = 4; if (Object.keys(o).length > 1) { for (k in o) { if (Object.hasOwn(o,k)) { kl = parseInt(Math.ceil((k.length + 2) / 4) * 4); mk = Math.max(mk,kl); if (mk > 32) { mk = 32; break } } } }; l = []; var keyValue = function (k, v) { var i, ks, s, vs; s = ind; k = esc(k,true); if (k.indexOf('  ') > 0 && k[0] !== '|') { k = `|${k}|` } else if (k[0] !== '|' && k[k.length - 1] === '|') { k = '|' + k } else if (k[0] === '|' && k[k.length - 1] !== '|') { k += '|' }; ks = pad(k,Math.max(mk,k.length + 2)); i = pad(ind + '    ',mk); s += ks; vs = toStr(v,i,false,seen); if (vs[0] === '\n') { while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) } }; s += vs; while (s[s.length - 1] === ' ') { s = s.substr(0,s.length - 1) }; return s }; for (k in o) { if (Object.hasOwn(o,k)) { l.push(keyValue(k,o[k])) } }; return l.join('\n') }; var toStr = function (o, ind = '', arry = false, seen = []) { var s, t, v; if (!(o != null)) { if (o === null) { return 'null' }; if (o === undefined) { return 'undefined' }; return '<?>' }; switch (t = typeof(o)) { case 'string': {return esc(o,arry)}; case 'object': { if (_k_.in(o,seen)) { return '<v>' }; seen.push(o); if ((o.constructor != null ? o.constructor.name : undefined) === 'Array') { s = ind !== '' && arry && '.' || ''; if (o.length && ind !== '') { s += '\n' }; s += (function () { var result = []; var list = _k_.list(o); for (var li = 0; li < list.length; li++)  { v = list[li];result.push(ind + toStr(v,ind + '    ',true,seen))  } return result }).bind(this)().join('\n') } else if ((o.constructor != null ? o.constructor.name : undefined) === 'RegExp') { return o.source } else { s = (arry && '.\n') || ((ind !== '') && '\n' || ''); s += pretty(o,ind,seen) }; return s } default: return String(o) }; return '<???>' }; return toStr(obj) }, empty: function (l) {return l==='' || l===null || l===undefined || l!==l || typeof(l) === 'object' && Object.keys(l).length === 0}, in: function (a,l) {return (typeof l === 'string' && typeof a === 'string' && a.length ? '' : []).indexOf.call(l,a) >= 0}, list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}}

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
        console.log(_k_.noon(nodes))
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