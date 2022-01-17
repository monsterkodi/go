// monsterkodi/kode 0.237.0

var _k_

var Board, elem, randIntRange

elem = require('kxk').elem
randIntRange = require('kxk').randIntRange


Board = (function ()
{
    function Board (parent, size = 19)
    {
        var d, i, o, s, x, y

        this.size = size
    
        this.div = elem('div',{class:'board',parent:parent})
        this.img = elem('img',{class:'wood',src:'../img/wood.png',parent:this.div})
        this.shd = elem('div',{class:'shadows',parent:this.div})
        this.height = 1000
        this.width = this.height
        s = this.height
        this.canvas = elem('canvas',{class:'lines',height:s,width:s,parent:this.div})
        this.ctx = this.canvas.getContext('2d')
        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = (this.size === 19 ? 2 : (this.size === 13 ? 2.5 : 3))
        this.ctx.lineCap = "round"
        this.ctx.fillStyle = '#f6c67111'
        this.ctx.rect(0,0,s,s)
        this.ctx.fill()
        this.ctx.fillStyle = 'black'
        d = s / (this.size + 1)
        o = d
        for (var _39_17_ = i = 0, _39_21_ = this.size; (_39_17_ <= _39_21_ ? i < this.size : i > this.size); (_39_17_ <= _39_21_ ? ++i : --i))
        {
            this.ctx.beginPath()
            this.ctx.moveTo(o + i * d,o)
            this.ctx.lineTo(o + i * d,s - o)
            this.ctx.moveTo(o,o + i * d)
            this.ctx.lineTo(s - o,o + i * d)
            this.ctx.stroke()
        }
        for (x = -1; x <= 1; x++)
        {
            for (y = -1; y <= 1; y++)
            {
                this.ctx.beginPath()
                if (this.size >= 13)
                {
                    this.ctx.arc(s / 2 + x * d * (parseInt(-this.size / 2) + 3),s / 2 + y * d * (parseInt(-this.size / 2) + 3),s / 180,0,2 * Math.PI,false)
                }
                else if (x && y)
                {
                    this.ctx.arc(s / 2 + x * d * (parseInt(-this.size / 2) + 2),s / 2 + y * d * (parseInt(-this.size / 2) + 2),s / 180,0,2 * Math.PI,false)
                }
                this.ctx.fill()
            }
        }
    }

    Board.prototype["addStone"] = function (pos, black)
    {
        var d, shadow, src, stone, x, y

        d = 100 / (this.size + 1)
        src = `../img/stone_${(black ? 'black' : 'white' + randIntRange(1,15))}.png`
        shadow = elem('img',{class:'shadow',src:'../img/stone_shadow.png',width:"auto",height:`${d + 1}%`,parent:this.shd})
        stone = elem('img',{class:'stone',src:src,width:"auto",height:`${d}%`,parent:this.div})
        x = (pos[0] + 0.5) * 100 / (this.size + 1)
        y = (pos[1] + 0.5) * 100 / (this.size + 1)
        stone.style = `left:${x}%; top:${y}%;`
        return shadow.style = `left:${x}%; top:${y}%;`
    }

    return Board
})()

module.exports = Board