// 存储坐标
let map = []
class Chess {
    constructor(name, x, y, position, id, pd, camp) {
        this.name = name
        this.x = x
        this.y = y
        // 通过id名找dom
        this.id = id
        // 判断第一次点击还是第二次(拿棋和放棋)
        this.pd = pd
        //判断阵营
        this.camp = camp
        this.position = position
        this.main = $('.' + position)
    }
    //初始化棋牌
    creatElement(id, szs) {
        let color = this.position === 'top' ? 'black' : 'red'
        let offset = this.position === 'top' ? 'bottom' : 'top'
        this.x = this.x * 50 - 40
        this.y = this.y * 50 - 40
        let chess = `<div id="${id}" class="chess" style="color:${color};left:${this.x}px;top:${this.y}px"><span>${this.name}</span></div>`
        this.main.append(chess)
        map.push(szs)
    }
    //吃棋
    delchess(who) {
        //棋子移动更新坐标
        map = map.filter(item => {
            if (item[2].id == who[2].id) {
                item[0].x = who[0].x
                item[1].y = who[1].y
                map.filter(item2 => {
                    if (item2[0].x == item[0].x && item2[1].y == item[1].y) {
                        if (item2[3].camp == item[3].camp) {

                        }
                        else {
                            $("#" + `${item2[2].id}`).remove()
                            map.filter((item3,index)=>{if(item3[2].id==item2[2].id){
                                item3[0].x=1000
                                item3[1].y=1000
                                //应该改成直接从数组中剔除元素！！！！！！！！！！！！
                            }})
                        }
                    }
                })
            }
            return item
        })
    }
    //判定前方是否有障碍 能否越过 得到跨越的棋子
    resist(who){
        let resistList=[]
        //纵向移动
        if(who[0].x==who[3].ox){
            
            resistList=map.filter(item=>{if(item[0].x==who[0].x&&item[1].y>Math.min(who[1].y,who[4].oy)&&item[1].y<Math.max(who[1].y,who[4].oy)){
                return item
            }})
        }
        //横向移动
        else{
            resistList=map.filter(item=>{if(item[1].y==who[1].y&&item[0].x>Math.min(who[0].x,who[3].ox)&&item[0].x<Math.max(who[0].x,who[3].ox)){
                return item
            }})
        }
        console.log(resistList)
        return resistList.length
    }
    //通过id查找有无棋子
    find(x,y){
        let ishere
        let pd
        ishere = map.filter(item=>{
            if(item[0].x==x&&item[1].y==y){
                return true
            }
            else{
                return false
            }
        })
        if(ishere.length>0)
        {
            pd=true
        }
        else{
            pd=false
        }
        return pd
    }
    //棋子移动

}
class army extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                //通过新老坐标判断落位是否正确
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                // 规定可落位坐标
                let one = [julixOld, juliyOld - 1]
                let two = [julixOld + 1, juliyOld]
                let three = [julixOld - 1, juliyOld]
                // console.log(two)
                if (juliyNew > 5) {
                    //没过河
                    if (julixNew == one[0] && juliyNew == one[1]) {
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                    }
                    else {
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }
                }
                else {
                    if ((juliyNew == one[1] && julixNew == one[0]) || (juliyNew == two[1] && julixNew == two[0]) || (juliyNew == three[1] && julixNew == three[0])) {
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                    }
                    else {
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }
                }                    
                
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }
}
class cannon extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                // 记录跨过几个棋子
                let chessNum=0
                //判断落点是否有棋子
                let ishere
                //通过新老坐标判断落位是否正确
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                // 规定可落位坐标
                ishere = that.find(julixNew,juliyNew)
                chessNum = that.resist([{ x: julixNew }, { y: juliyNew }, { id: who },{ox:julixOld},{oy:juliyOld}])
                // console.log(two)
                if(chessNum==0){
                    if(!ishere)
                    {
                        if (julixNew - julixOld == 0 || juliyNew - juliyOld == 0) {
                            that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])                            
                            that.x = julixNew * 50 - 40;
                            that.y = juliyNew * 50 - 40;
                            dx.style.left = trueX - 40 + "px";
                            dx.style.top = trueY - 40 + "px";
                        }
                        else {
                            dx.style.left = that.x + "px";
                            dx.style.top = that.y + "px";
                        }  
                    }
                    else {
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    } 
                }
                else if(chessNum==1)
                {
                    if(ishere)
                    {
                        if (julixNew - julixOld == 0 || juliyNew - juliyOld == 0) {
                            that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])                            
                            that.x = julixNew * 50 - 40;
                            that.y = juliyNew * 50 - 40;
                            dx.style.left = trueX - 40 + "px";
                            dx.style.top = trueY - 40 + "px";
                        }
                        else {
                            dx.style.left = that.x + "px";
                            dx.style.top = that.y + "px";
                        }  
                    }
                    else {
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }                    
                }
                else{
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }
}
class horse extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            //判断第一次点击还是第二次点击
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                // 记录马的方向
                let direction = ''
                //通过新老坐标判断落位是否正确
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                //判断方向判断堵子
                if (julixNew - julixOld == -2&&Math.abs(julixNew - julixOld) * Math.abs(juliyNew - juliyOld)==2) {
                    //判断是否存在
                    let here = false
                    direction = 'left'
                    // 堵棋子的位置
                    let duzi = [julixOld - 1, juliyOld]
                    map.filter(item => {
                        if (item[0].x == duzi[0] && item[1].y == duzi[1]) {
                            here = true
                        }
                    })
                    if (here == true) {
                        here = false
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }
                    else {
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";

                    }
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
                if (juliyNew - juliyOld == -2&&Math.abs(julixNew - julixOld) * Math.abs(juliyNew - juliyOld)==2) {
                    //判断是否存在
                    let here = false
                    direction = 'up'
                    let duzi = [julixOld, juliyOld - 1]
                    map.filter(item => {
                        if (item[0].x == duzi[0] && item[1].y == duzi[1]) {
                            here = true
                        }
                    })
                    if (here == true) {
                        here = false
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }
                    else {
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";

                    }
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
                if (juliyNew - juliyOld == 2&&Math.abs(julixNew - julixOld) * Math.abs(juliyNew - juliyOld)==2) {
                    //判断是否存在
                    let here = false
                    direction = 'down'
                    let duzi = [julixOld, juliyOld + 1]
                    map.filter(item => {
                        if (item[0].x == duzi[0] && item[1].y == duzi[1]) {
                            here = true
                        }
                    })
                    if (here == true) {
                        here = false
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }
                    else {
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";
                    }
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
                if (julixNew - julixOld == 2&&Math.abs(julixNew - julixOld) * Math.abs(juliyNew - juliyOld)==2) {
                    //判断是否存在
                    let here = false
                    direction = 'right'
                    let duzi = [julixOld + 1, juliyOld]
                    map.filter(item => {
                        if (item[0].x == duzi[0] && item[1].y == duzi[1]) {
                            here = true
                        }
                    })
                    if (here == true) {
                        here = false
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }
                    else {
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";

                    }
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
                // console.log(two)
                // if (Math.abs(julixNew - julixOld) * Math.abs(juliyNew - juliyOld)==2) {
                //     that.delchess([{x:julixNew},{y:juliyNew},{id:who},{camp:that.camp}])
                //     console.log(1)
                //     that.x = julixNew * 50 - 40;
                //     that.y = juliyNew * 50 - 40;
                //     dx.style.left = trueX - 40 + "px";
                //     dx.style.top = trueY - 40 + "px";
                //     console.log(that.y)
                // }
                // else {
                //     dx.style.left = that.x + "px";
                //     dx.style.top = that.y + "px";
                // }
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }
}
class car extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                //通过新老坐标判断落位是否正确
                //接受跨越棋子个数
                var chessNum=0
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                // 规定可落位坐标


                chessNum = that.resist([{ x: julixNew }, { y: juliyNew }, { id: who },{ox:julixOld},{oy:juliyOld}])
                // console.log(two)
                if(chessNum<1){
                    if (julixNew - julixOld == 0 || juliyNew - juliyOld == 0) {
                        that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                        that.x = julixNew * 50 - 40;
                        that.y = juliyNew * 50 - 40;
                        dx.style.left = trueX - 40 + "px";
                        dx.style.top = trueY - 40 + "px";
                    }
                    else {
                        dx.style.left = that.x + "px";
                        dx.style.top = that.y + "px";
                    }                    
                }
                else{
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";               
                }
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }
}
class xiang extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                //通过新老坐标判断落位是否正确
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                // 规定可落位坐标

                // console.log(two)
                if (((Math.abs(julixNew - julixOld)) * Math.abs((juliyNew - juliyOld))) == 4 && juliyNew >= 6) {
                    that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                    that.x = julixNew * 50 - 40;
                    that.y = juliyNew * 50 - 40;
                    dx.style.left = trueX - 40 + "px";
                    dx.style.top = trueY - 40 + "px";
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }

}
class scholar extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                //通过新老坐标判断落位是否正确
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                // 规定可落位坐标

                // console.log(two)
                if (((Math.abs(julixNew - julixOld)) * Math.abs((juliyNew - juliyOld))) == 1 && juliyNew >= 8 && julixNew >= 4 && julixNew <= 6) {
                    that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                    that.x = julixNew * 50 - 40;
                    that.y = juliyNew * 50 - 40;
                    dx.style.left = trueX - 40 + "px";
                    dx.style.top = trueY - 40 + "px";
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }
}
class prefect extends Chess {
    constructor(name, x, y, position, id, pd, camp) {
        super(name, x, y, position, id, pd, camp)
        super.creatElement(id, [{ x: x }, { y: y }, { id: id }, { camp: camp }])
    }
    move(who) {
        let x, y;//记录鼠标相对div左边上边的偏移和初始位置
        let isDrop = false // 按下才允许移动
        let dx = document.getElementById(who)
        let that = this
        let trueX, trueY //存储真实落位（位置修正）
        dx.onmousedown = function (event, cellback) {
            if (that.pd == true) {
                that.pd = false
                let e = event || window.event;
                x = e.clientX - dx.offsetLeft;
                y = e.clientY - dx.offsetTop;
                isDrop = true;//设为true表示可以移动           
            }
            else {
                isDrop = false
                that.pd = true
                //通过新老坐标判断落位是否正确
                let julixOld = (that.x + 40) / 50
                let juliyOld = (that.y + 40) / 50
                let julixNew = (trueX) / 50
                let juliyNew = (trueY) / 50
                // 规定可落位坐标

                // console.log(two)
                if (((Math.abs(julixNew - julixOld)) + Math.abs((juliyNew - juliyOld))) == 1 && juliyNew >= 8 && julixNew >= 4 && julixNew <= 6) {
                    that.delchess([{ x: julixNew }, { y: juliyNew }, { id: who }, { camp: that.camp }])
                    that.x = julixNew * 50 - 40;
                    that.y = juliyNew * 50 - 40;
                    dx.style.left = trueX - 40 + "px";
                    dx.style.top = trueY - 40 + "px";
                }
                else {
                    dx.style.left = that.x + "px";
                    dx.style.top = that.y + "px";
                }
            }
            document.onmousemove = function (event) {
                if (isDrop) {
                    let e = event || window.event;
                    let moveX = e.clientX - x;//得到距离左边移动距离
                    let moveY = e.clientY - y;//得到距离上边框的距离
                    //可移动最大距离
                    var maxX = 450 - dx.offsetWidth;
                    var maxY = 500 - dx.offsetHeight;
                    moveX = Math.min(maxX, Math.max(10, moveX));
                    moveY = Math.min(maxY, Math.max(10, moveY));
                    trueX = Math.round(((moveX + 40) / 50)) * 50
                    trueY = Math.round(((moveY + 40) / 50)) * 50
                    dx.style.left = moveX + "px";
                    dx.style.top = moveY + "px";
                } else {
                    return;
                }
            }
        }
    }
}
// 兵
let army1 = new army('卒', 1, 4, 'top', 'army1', true, 'black')
army1.move('army1')
let army2 = new army('卒', 3, 4, 'top', 'army2', true, 'black')
army2.move('army2')
let army3 = new army('卒', 5, 4, 'top', 'army3', true, 'black')
army3.move('army3')
let army4 = new army('卒', 7, 4, 'top', 'army4', true, 'black')
army4.move('army4')
let army5 = new army('卒', 9, 4, 'top', 'army5', true, 'black')
army5.move('army5')

let soldier1 = new army('兵', 1, 7, 'bottom', 'soldier1', true, 'red')
soldier1.move("soldier1")
let soldier2 = new army('兵', 3, 7, 'bottom', 'soldier2', true, 'red')
soldier2.move("soldier2")
let soldier3 = new army('兵', 5, 7, 'bottom', 'soldier3', true, 'red')
soldier3.move("soldier3")
let soldier4 = new army('兵', 7, 7, 'bottom', 'soldier4', true, 'red')
soldier4.move("soldier4")
let soldier5 = new army('兵', 9, 7, 'bottom', 'soldier5', true, 'red')
soldier5.move("soldier5")

// 炮

let cannon1 = new cannon('炮', 2, 3, 'top', 'cannon1', true, 'black')
cannon1.move('cannon1')
let cannon2 = new cannon('炮', 8, 3, 'top', 'cannon2', true, 'black')
cannon2.move('cannon2')

let cannon3 = new cannon('炮', 2, 8, 'bottom', 'cannon3', true, 'red')
cannon3.move("cannon3")
let cannon4 = new cannon('炮', 8, 8, 'bottom', 'cannon4', true, 'red')
cannon4.move("cannon4")

// 马
let horse1 = new horse('馬', 2, 1, 'top', 'horse1', true, 'black')
horse1.move("horse1")
let horse2 = new horse('馬', 8, 1, 'top', 'horse2', true, 'black')
horse2.move("horse2")

let horse3 = new horse('马', 2, 10, 'bottom', 'horse3', true, 'red')
horse3.move("horse3")
let horse4 = new horse('马', 8, 10, 'bottom', 'horse4', true, 'red')
horse4.move("horse4")

// 车
let car1 = new car('車', 1, 1, 'top', 'car1', true, 'black')
car1.move("car1")
let car2 = new car('車', 9, 1, 'top', 'car2', true, 'black')
car2.move("car2")

let car3 = new car('车', 1, 10, 'bottom', 'car3', true, 'red')
car3.move("car3")
let car4 = new car('车', 9, 10, 'bottom', 'car4', true, 'red')
car4.move("car4")

// 象

let xiang1 = new xiang('象', 3, 1, 'top', 'xiang1', true, 'black')
xiang1.move("xiang1")
let xiang2 = new xiang('象', 7, 1, 'top', 'xiang2', true, 'black')
xiang2.move("xiang2")

let xiang3 = new xiang('相', 3, 10, 'bottom', 'xiang3', true, 'red')
xiang3.move("xiang3")
let xiang4 = new xiang('相', 7, 10, 'bottom', 'xiang4', true, 'red')
xiang4.move("xiang4")

// 士
let scholar1 = new scholar('仕', 4, 1, 'top', 'scholar1', true, 'black')
scholar1.move("scholar1")
let scholar2 = new scholar('仕', 6, 1, 'top', 'scholar2', true, 'black')
scholar2.move("scholar2")

let person1 = new scholar('士', 4, 10, 'bottom', 'person1', true, 'red')
person1.move("person1")
let person2 = new scholar('士', 6, 10, 'bottom', 'person2', true, 'red')
person2.move("person2")

// 帅
let general = new prefect('将', 5, 1, 'top', 'general', true, 'black')
general.move("general")
let smart = new prefect('帅', 5, 10, 'bottom', 'smart', true, 'red')
smart.move("smart")