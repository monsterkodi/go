// monsterkodi/kode 0.237.0

var _k_ = {isFunc: function (o) {return typeof o === 'function'}}

var commands, Game, gtp, GTP, readline

readline = require('readline')
Game = require('./game')
commands = ['name','version','protocol_version','clear_board','color','white','black','boardsize','showboard','list_commands','quit','play','move','genmove','next','all_legal','move_history']

GTP = (function ()
{
    function GTP ()
    {
        this["cmd"] = this["cmd"].bind(this)
        this.rl = readline.createInterface({input:process.stdin,output:process.stdout})
        this.game = new Game()
    }

    GTP.prototype["run"] = function ()
    {
        return this.rl.question('',this.cmd)
    }

    GTP.prototype["ok"] = function (a = '')
    {
        if (a[0] === '?')
        {
            console.log(a + '\n')
        }
        else
        {
            console.log(`=\n${a}\n`)
        }
    }

    GTP.prototype["cmd"] = function (cmd)
    {
        var args, c

        args = cmd.split(' ')
        switch (args[0])
        {
            case 'name':
                this.ok('go')
                break
            case 'version':
                this.ok('0.0.3')
                break
            case 'protocol_version':
                this.ok(1)
                break
            case 'quit':
                this.ok()
                process.exit(0)
                break
            case 'list_commands':
                this.ok(commands.join('\n'))
                break
            default:
                c = args[0]
                if (c.length === 1)
            {
                c = ((function ()
                {
                    switch (c)
                    {
                        case 'b':
                            return 'showboard'

                        case 'c':
                            return 'clear_board'

                        case 'l':
                            return 'countlib'

                        case 'f':
                            return 'free'

                        case 'p':
                            return 'play'

                        case 'q':
                            return 'quit'

                        default:
                            return c
                    }

                }).bind(this))()
            }
                if (_k_.isFunc(this.game[c]))
            {
                this.ok(this.game[c].apply(this.game,args.slice(1)))
            }
            else
            {
                this.ok()
            }
        }

        return this.run()
    }

    return GTP
})()

gtp = new GTP()
gtp.run()