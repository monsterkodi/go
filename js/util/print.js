// monsterkodi/kode 0.237.0

var _k_ = {list: function (l) {return l != null ? typeof l.length === 'number' ? l : [] : []}, k: { f:(r,g,b)=>'\x1b[38;5;'+(16+36*r+6*g+b)+'m', F:(r,g,b)=>'\x1b[48;5;'+(16+36*r+6*g+b)+'m', r:(i)=>(i<6)&&_k_.k.f(i,0,0)||_k_.k.f(5,i-5,i-5), R:(i)=>(i<6)&&_k_.k.F(i,0,0)||_k_.k.F(5,i-5,i-5), g:(i)=>(i<6)&&_k_.k.f(0,i,0)||_k_.k.f(i-5,5,i-5), G:(i)=>(i<6)&&_k_.k.F(0,i,0)||_k_.k.F(i-5,5,i-5), b:(i)=>(i<6)&&_k_.k.f(0,0,i)||_k_.k.f(i-5,i-5,5), B:(i)=>(i<6)&&_k_.k.F(0,0,i)||_k_.k.F(i-5,i-5,5), y:(i)=>(i<6)&&_k_.k.f(i,i,0)||_k_.k.f(5,5,i-5), Y:(i)=>(i<6)&&_k_.k.F(i,i,0)||_k_.k.F(5,5,i-5), m:(i)=>(i<6)&&_k_.k.f(i,0,i)||_k_.k.f(5,i-5,5), M:(i)=>(i<6)&&_k_.k.F(i,0,i)||_k_.k.F(5,i-5,5), c:(i)=>(i<6)&&_k_.k.f(0,i,i)||_k_.k.f(i-5,5,5), C:(i)=>(i<6)&&_k_.k.F(0,i,i)||_k_.k.F(i-5,5,5), w:(i)=>'\x1b[38;5;'+(232+(i-1)*3)+'m', W:(i)=>'\x1b[48;5;'+(232+(i-1)*3+2)+'m', wrap:(open,close,reg)=>(s)=>open+(~(s+='').indexOf(close,4)&&s.replace(reg,open)||s)+close, F256:(open)=>_k_.k.wrap(open,'\x1b[39m',new RegExp('\\x1b\\[39m','g')), B256:(open)=>_k_.k.wrap(open,'\x1b[49m',new RegExp('\\x1b\\[49m','g'))}, rpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s+=c} return s}, lpad: function (l,s='',c=' ') {s=String(s); while(s.length<l){s=c+s} return s}};_k_.r6=_k_.k.F256(_k_.k.r(6));_k_.b6=_k_.k.F256(_k_.k.b(6));_k_.w2=_k_.k.F256(_k_.k.w(2));_k_.w3=_k_.k.F256(_k_.k.w(3));_k_.w4=_k_.k.F256(_k_.k.w(4));_k_.w6=_k_.k.F256(_k_.k.w(6));_k_.w8=_k_.k.F256(_k_.k.w(8))

var Grid, Print, short, stone

Grid = require('./grid')
short = require('./util').short
stone = require('./util').stone


Print = (function ()
{
    function Print ()
    {}

    Print.prototype["areaString"] = function (legend)
    {
        var a, aa, g

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.areas)
        for (var _23_14_ = 0; _23_14_ < list.length; _23_14_++)
        {
            a = list[_23_14_]
            var list1 = _k_.list(a.posl)
            for (var _24_19_ = 0; _24_19_ < list1.length; _24_19_++)
            {
                aa = list1[_24_19_]
                g.set(aa,a.color)
            }
        }
        return g.toString(legend)
    }

    Print.prototype["areaColors"] = function (legend)
    {
        var a, aa, g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.areas)
        for (var _31_14_ = 0; _31_14_ < list.length; _31_14_++)
        {
            a = list[_31_14_]
            var list1 = _k_.list(a.posl)
            for (var _32_19_ = 0; _32_19_ < list1.length; _32_19_++)
            {
                aa = list1[_32_19_]
                switch (a.color)
                {
                    case '?':
                        g.set(aa,_k_.b6('?'))
                        break
                    case 'w':
                        g.set(aa,_k_.w8('.'))
                        break
                    case 'b':
                        g.set(aa,_k_.w3('.'))
                        break
                }

            }
        }
        var list2 = _k_.list(this.grps)
        for (var _37_15_ = 0; _37_15_ < list2.length; _37_15_++)
        {
            gr = list2[_37_15_]
            var list3 = _k_.list(gr.posl)
            for (var _38_19_ = 0; _38_19_ < list3.length; _38_19_++)
            {
                gg = list3[_38_19_]
                switch (g.at(gg))
                {
                    case '○':
                        g.set(gg,_k_.w4('○'))
                        break
                    case '●':
                        g.set(gg,_k_.w6('●'))
                        break
                }

            }
        }
        return g.toAnsi(legend)
    }

    Print.prototype["deadString"] = function (legend)
    {
        var g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _53_15_ = 0; _53_15_ < list.length; _53_15_++)
        {
            gr = list[_53_15_]
            var list1 = _k_.list(gr.posl)
            for (var _54_19_ = 0; _54_19_ < list1.length; _54_19_++)
            {
                gg = list1[_54_19_]
                if (gr.state === 'dead')
                {
                    g.set(gg,'X')
                }
            }
        }
        return g.toString(legend)
    }

    Print.prototype["deadColors"] = function (legend)
    {
        var g, gg, gr

        g = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _61_15_ = 0; _61_15_ < list.length; _61_15_++)
        {
            gr = list[_61_15_]
            var list1 = _k_.list(gr.posl)
            for (var _62_19_ = 0; _62_19_ < list1.length; _62_19_++)
            {
                gg = list1[_62_19_]
                if (gr.state === 'dead')
                {
                    g.set(gg,(gr.stone === stone.white ? _k_.r6('X') : _k_.b6('X')))
                }
                else
                {
                    g.set(gg,_k_.w4(g.at(gg)))
                }
            }
        }
        return g.toAnsi(legend)
    }

    Print.prototype["groupString"] = function ()
    {
        var aa, ar, c, gg, gr, grid, idx

        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _79_15_ = 0; _79_15_ < list.length; _79_15_++)
        {
            gr = list[_79_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _81_23_ = 0; _81_23_ < list1.length; _81_23_++)
                {
                    gg = list1[_81_23_]
                    c = (arguments[idx].stone === '○' ? '◻' : '◼')
                    grid.set(gg,this.rainbow(idx,c))
                }
            }
            else
            {
                var list2 = _k_.list(gr.posl)
                for (var _85_23_ = 0; _85_23_ < list2.length; _85_23_++)
                {
                    gg = list2[_85_23_]
                    grid.set(gg,_k_.w2(grid.at(gg)))
                }
            }
        }
        var list3 = _k_.list(this.areas)
        for (var _87_15_ = 0; _87_15_ < list3.length; _87_15_++)
        {
            ar = list3[_87_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ar)))
            {
                var list4 = _k_.list(ar.posl)
                for (var _89_23_ = 0; _89_23_ < list4.length; _89_23_++)
                {
                    aa = list4[_89_23_]
                    c = this.areas.indexOf(ar)
                    grid.set(aa,this.rainbow(idx,short[c]))
                }
            }
        }
        return grid.toAnsi(1)
    }

    Print.prototype["grpsString"] = function ()
    {
        var c, gg, gr, grid, idx

        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.grps)
        for (var _97_15_ = 0; _97_15_ < list.length; _97_15_++)
        {
            gr = list[_97_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(gr)))
            {
                var list1 = _k_.list(gr.posl)
                for (var _99_23_ = 0; _99_23_ < list1.length; _99_23_++)
                {
                    gg = list1[_99_23_]
                    c = this.grps.indexOf(gr)
                    grid.set(gg,this.rainbow(idx,short[c]))
                }
            }
        }
        return grid.toAnsi(1)
    }

    Print.prototype["chainString"] = function ()
    {
        var c, ch, cp, grid, idx

        grid = new Grid(this.grid.toString())
        var list = _k_.list(this.chains)
        for (var _113_15_ = 0; _113_15_ < list.length; _113_15_++)
        {
            ch = list[_113_15_]
            if (0 <= (idx = [].slice.call(arguments,0).indexOf(ch)))
            {
                var list1 = _k_.list(ch.posl)
                for (var _115_23_ = 0; _115_23_ < list1.length; _115_23_++)
                {
                    cp = list1[_115_23_]
                    c = this.chains.indexOf(ch)
                    grid.set(cp,this.rainbow(idx,short[c]))
                }
            }
        }
        return grid.toAnsi(1)
    }

    Print.prototype["fancySchmanzy"] = function ()
    {
        var as, bd, cs, fs, gs, i, ml, pl, spc

        bd = this.grid.toString(1).split('\n')
        ml = bd[1].length
        as = this.groupString.apply(this,this.areas).split('\n')
        gs = this.grpsString.apply(this,this.grps).split('\n')
        cs = this.chainString.apply(this,this.chains).split('\n')
        pl = this.size * 2 + 6
        fs = [_k_.w2(_k_.rpad(pl,' areas') + _k_.rpad(pl,' groups') + _k_.rpad(pl,' chains'))]
        for (var _137_17_ = i = 0, _137_21_ = as.length; (_137_17_ <= _137_21_ ? i < as.length : i > as.length); (_137_17_ <= _137_21_ ? ++i : --i))
        {
            spc = _k_.lpad(ml - bd[i].length,'')
            fs.push(as[i] + spc + gs[i] + spc + cs[i])
        }
        console.log(fs.join('\n'))
        console.log('')
    }

    Print.prototype["deadOrAlive"] = function ()
    {
        var as, bd, cs, fs, gs, i, ml, pl, spc

        bd = this.grid.toString(1).split('\n')
        ml = bd[1].length
        as = this.areaColors.apply(this,this.areas).split('\n')
        gs = this.deadColors(1).split('\n')
        cs = this.groupString.apply(this,this.grps.filter(function (g)
        {
            return g.state === 'alive'
        })).split('\n')
        pl = this.size * 2 + 6
        fs = [_k_.w2(_k_.rpad(pl,' color') + _k_.rpad(pl,' dead') + _k_.rpad(pl,' alive'))]
        for (var _159_17_ = i = 0, _159_21_ = as.length; (_159_17_ <= _159_21_ ? i < as.length : i > as.length); (_159_17_ <= _159_21_ ? ++i : --i))
        {
            spc = _k_.lpad(ml - bd[i].length,'')
            fs.push(as[i] + spc + gs[i] + spc + cs[i])
        }
        console.log(fs.join('\n'))
        console.log('')
    }

    Print.prototype["rainbow"] = function (idx, c)
    {
        return [y5,r5,g2,b8,m3,b4,w4,w8][idx % 8](c)
    }

    return Print
})()

module.exports = Print