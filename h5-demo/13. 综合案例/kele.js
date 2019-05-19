window.onload = function () {
    /* 获取 DOM元素 */
    var arrowEl = document.querySelector("#head>.headMain>.arrow");
    var liNodes = document.querySelectorAll("#head>.headMain>.nav>.list>li");
    var upNodes = document.querySelectorAll("#head>.headMain>.nav>.list>li .up");
    var firstLiNode = liNodes[0];
    var firstUpNode = firstLiNode.querySelector(".up");

    var head = document.querySelector("#head");
    var content = document.querySelector("#content");
    var cotLiNodes = document.querySelectorAll("#content .list>li");
    var cotList = document.querySelector("#content .list");

    var home2LiNodes = document.querySelectorAll("#content>.list>.home .home2>li");
    var home1LiNodes = document.querySelectorAll("#content>.list>.home .home1>li");
    var home1Node = document.querySelector("#content>.list>.home .home1");

    var abouts3UlNodes = document.querySelectorAll("#content>.list>.abouts .abouts3>.item>ul");

    var smallPoints = document.querySelectorAll("#content>.smallPoint>li");

    var team3LiNodes = document.querySelectorAll("#content>.list>.team .team3>li");
    var team3Node = document.querySelector("#content>.list>.team .team3");
    var sectionNode = document.querySelector("#content>.list>.team section");

    /* 开机动画 标签 */
    var lineNode = document.querySelector("#wrap>.mask .line");
    var upMove = document.querySelector("#wrap>.mask .up");
    var downMove = document.querySelector("#wrap>.mask .down");
    var mask = document.querySelector("#wrap>.mask");

    /* 音乐 */
    var music = document.querySelector("#head>.headMain .music .smallMusic");
    var audio = document.querySelector("#head>.headMain .music .smallMusic audio");

    music.onclick = function () {
        if (audio.paused) {
            audio.play();
            music.style.background = "url(img/musicon.gif)";
        } else {
            audio.pause();
            music.style.background = "url(img/musicoff.gif)";
        }
    }


    /* 头部动画交互 */
    headBind();
    function headBind() {
        // 箭头动画
        ///* 箭头的位置 = li标签的左边距 + li标签自身宽度一半 - 箭头的自身宽度一半 */
        /* 注意加单位 */
        firstUpNode.style.width = "100%";
        arrowEl.style.left = firstLiNode.offsetLeft + firstLiNode.offsetWidth / 2 - arrowEl.offsetWidth / 2 + "px";
        // 头部导航栏切换动画
        for (var i = 0; i < liNodes.length; i++) {
            // 转绑：代码异步执行，抽象定义li标签索引值upNodes的索引
            liNodes[i].index = i;
            liNodes[i].onclick = function () {
                // 同步上一屏状态
                // preIndex = now;
                move(this.index);
                /* 将this.index同步到全局变量中 */
                now = this.index;
            }
        }
        // 小圆点导航切换动画
        for (var i = 0; i < smallPoints.length; i++) {
            // 转绑：代码异步执行，抽象定义li标签索引值upNodes的索引
            smallPoints[i].index = i;
            smallPoints[i].onclick = function () {
                // 同步上一屏状态
                // preIndex = now;
                move(this.index);
                /* 将this.index同步到全局变量中 */
                now = this.index;
            }

        }

    }

    // 动画核心函数
    // 函数调用时必须传参数！！！
    // move();
    function move(index) {
        // upNodes[i].style.width = "100%"; 代码异步执行，不能这样操作
        for (var j = 0; j < upNodes.length; j++) {
            // 循环中重置样式设置为空；
            upNodes[j].style.width = "";
        }
        upNodes[index].style.width = "100%";
        arrowEl.style.left = liNodes[index].offsetLeft + liNodes[index].offsetWidth / 2 - arrowEl.offsetWidth / 2 + "px";
        // 点击事件设置内容区ul的高度 = -对应的索引值 * （元素视口高度 - 顶部的高度）
        cotList.style.top = -index * (document.documentElement.clientHeight - head.offsetHeight) + "px";


        // 小圆点导航切换样式
        for (var j = 0; j < smallPoints.length; j++) {
            // 循环中重置样式设置为空；
            smallPoints[j].classList.remove("active");
        }
        smallPoints[index].classList.add("active");

        // 每次调用move函数时清除所有入场状态，保持在在出场状态
        for (var i = 0; i < animationArr.length; i++) {
            // for 循环遍历数组对象
            animationArr[i]["outAnimation"]();
        }

        // 当前索引进入入场状态
        if (animationArr[index] && typeof animationArr[index]["inAnimation"] === "function") {
            animationArr[index]["inAnimation"]();
        }
        // 当前屏入场 上一屏和下一屏出场

    }

    /* 内容区动画交互 */
    var now = 0;
    var timer = 0;
    window.onresize = function () {
        /* 当视口重置时，与高度相关的属性需要重新计算 */
        /* now同步获取index的值 */
        /* 调整分辨率注意点
            1.视口只能出现一屏，重新计算视口的高度
            2.点击后，设置全局变量同步获取index索引值，每一屏的偏移量需要重新调整
        */
        contentBind();
        cotList.style.top = -now * (document.documentElement.clientHeight - head.offsetHeight) + "px";
        // 小箭头位置重置
        // arrowEl.style.left = liNodes[index].offsetLeft + liNodes[index].offsetWidth / 2 - arrowEl.offsetWidth / 2 + "px";
    }
    /* 滚轮事件，绑定给content节点 */
    if (content.addEventListener) {
        content.addEventListener("DOMMouseScroll", function (ev) {
            ev = ev || event;
            clearTimeout(timer);
            /* 设置定时器延长fn回调事件，保证快速滑屏时不会持续触发fn回调 */
            timer = setTimeout(function () {
                fn(ev);
            }, 200)

        })
    }
    content.onmousewheel = function (ev) {
        ev = ev || event;
        clearTimeout(timer);
        /* 设置定时器延长fn回调事件，保证快速滑屏时不会持续触发fn回调 */
        timer = setTimeout(function () {
            fn(ev);
        }, 200)
    };
    function fn(ev) {
        /* 
            this.index 同步到 now
            now 不同步 this.index
        */
        ev = ev || event;
        var dir = "";
        if (ev.wheelDelta) {
            dir = ev.wheelDelta > 0 ? "up" : "down";
        } else if (ev.detail) {
            dir = ev.detail < 0 ? "up" : "down";
        }

        // 同步上一屏状态
        preIndex = now;

        switch (dir) {
            case "up":
                if (now > 0) {
                    now--;
                    move(now);
                }
                break;
            case "down":
                if (now < cotLiNodes.length - 1) {
                    now++;
                    move(now);
                }
                break;
        }
    }

    contentBind();
    function contentBind() {
        // 设置内容区的高度，其中超出隐藏
        content.style.height = document.documentElement.clientHeight - head.offsetHeight + "px";
        for (var i = 0; i < cotLiNodes.length; i++) {
            cotLiNodes[i].style.height = document.documentElement.clientHeight - head.offsetHeight + "px";
        }
    }

    /* 第一屏3D动画 */
    var oldIndex = 0;
    var auto3D = 0;
    var autoIndex = 0;

    // home1Animation();
    function home1Animation() {
        for (var i = 0; i < home2LiNodes.length; i++) {
            home2LiNodes[i].index = i;
            home2LiNodes[i].onclick = function () {
                // 点击时清除定时器
                clearInterval(auto3D);
                // 小圆点同步
                for (var j = 0; j < home2LiNodes.length; j++) {
                    home2LiNodes[j].classList.remove("active");
                }
                this.classList.add("active");

                // 从左往右点击 当前索引大于上一次索引 rightShow
                if (this.index > oldIndex) {
                    /* 在css中设置4种点击状态动画，通过JS控制 */
                    home1LiNodes[this.index].classList.remove("leftHide");
                    home1LiNodes[this.index].classList.remove("leftShow");
                    home1LiNodes[this.index].classList.remove("rightHide");
                    home1LiNodes[this.index].classList.add("rightShow");

                    home1LiNodes[oldIndex].classList.remove("rightShow");
                    home1LiNodes[oldIndex].classList.remove("leftShow");
                    home1LiNodes[oldIndex].classList.remove("rightHide");
                    home1LiNodes[oldIndex].classList.add("leftHide");
                }
                // 从右往左点击 当前索引小于上一次索引
                if (this.index < oldIndex) {
                    /* 在css中设置4种点击状态动画，通过JS控制 */
                    home1LiNodes[this.index].classList.remove("rightHide");
                    home1LiNodes[this.index].classList.remove("leftHide");
                    home1LiNodes[this.index].classList.remove("rightShow");
                    home1LiNodes[this.index].classList.add("leftShow");

                    home1LiNodes[oldIndex].classList.remove("leftShow");
                    home1LiNodes[oldIndex].classList.remove("leftHide");
                    home1LiNodes[oldIndex].classList.remove("rightShow");
                    home1LiNodes[oldIndex].classList.add("rightHide");
                }
                // 点击同步
                oldIndex = this.index;
                // 手动轮播同步自动轮播
                autoIndex = oldIndex;

                // 重新开启自动轮播
                autoMove();

            }

        }

        // 自动轮播
        autoMove();
        function autoMove() {
            // 避免循环定时器多次调用
            clearInterval(auto3D);
            auto3D = setInterval(function () {
                autoIndex++;
                // 无缝设置
                if (autoIndex == home1LiNodes.length) {
                    autoIndex = 0;
                }
                // 无缝小圆点同步
                for (var j = 0; j < home2LiNodes.length; j++) {
                    home2LiNodes[j].classList.remove("active");
                }
                home2LiNodes[autoIndex].classList.add("active");

                home1LiNodes[autoIndex].classList.remove("leftHide");
                home1LiNodes[autoIndex].classList.remove("leftShow");
                home1LiNodes[autoIndex].classList.remove("rightHide");
                home1LiNodes[autoIndex].classList.add("rightShow");

                home1LiNodes[oldIndex].classList.remove("rightShow");
                home1LiNodes[oldIndex].classList.remove("leftShow");
                home1LiNodes[oldIndex].classList.remove("rightHide");
                home1LiNodes[oldIndex].classList.add("leftHide");

                // 自动轮播去同步手动轮播
                oldIndex = autoIndex;
            }, 2000)
        }

        // 鼠标进入事件，清除定时器自动轮播
        home1Node.onmouseenter = function () {
            clearInterval(auto3D);
        }
        // 鼠标离开事件，开启自动轮播
        home1Node.onmouseleave = function () {
            autoMove();
        }
    }

    /* 第四屏动画 */
    pictureBoom();
    function pictureBoom() {
        for (var i = 0; i < abouts3UlNodes.length; i++) {
            changeBoom(abouts3UlNodes[i]);
            /* 在事件函数内部获取当前 node 节点中的img */
        }
        // 制作图片炸裂效果
        function changeBoom(node) {

            var src = node.dataset.src;
            var w = node.offsetWidth / 2;
            var h = node.offsetHeight / 2;

            for (var i = 0; i < 4; i++) {
                var liNode = document.createElement("li");
                liNode.style.width = w + "px";
                liNode.style.height = h + "px";

                var imgNode = document.createElement("img");
                /* img 的参数设置
                    1. left：0；    top：0；
                    2. left：-w；    top：0；
                    3. left：0；    top：-h；
                    4. left：-w；    top：-h；
                 */
                /* i%2=0?0:-w;i<2?0:-h; */
                var x = i % 2 == 0 ? 0 : -w;
                var y = i < 2 ? 0 : -h;
                imgNode.style.left = x + "px";
                imgNode.style.top = y + "px";
                imgNode.src = src;

                liNode.appendChild(imgNode);
                node.appendChild(liNode);


            }

            // 鼠标进入事件
            node.onmouseenter = function () {
                /* img 的参数设置
                    1. left：0；    top：h；
                    2. left：-2w；    top：0；
                    3. left：w；    top：-h；
                    4. left：-w；    top：-2h；
                 */
                var arrLeft = [0, -2, 1, -1];
                var arrTop = [1, 0, -1, -2];
                /* 获取当前 node 节点中的img */
                var imgNodes = this.querySelectorAll("li>img")

                for (var j = 0; j < imgNodes.length; j++) {
                    imgNodes[j].style.left = arrLeft[j] * w + "px";
                    imgNodes[j].style.top = arrTop[j] * h + "px";
                }
            }
            // 鼠标离开事件
            node.onmouseleave = function () {
                /* img 的参数设置
                    1. left：0；    top：0；
                    2. left：-w；    top：0；
                    3. left：0；    top：-h；
                    4. left：-w；    top：-h；
                 */
                var arrLeft = [0, -1, 0, -1];
                var arrTop = [0, 0, -1, -1];
                /* 获取当前 node 节点中的img */
                var imgNodes = this.querySelectorAll("li>img")

                for (var j = 0; j < imgNodes.length; j++) {
                    imgNodes[j].style.left = arrLeft[j] * w + "px";
                    imgNodes[j].style.top = arrTop[j] * h + "px";
                }

            }


        }
    }

    /* 第五屏动画 */
    bubbleMove();
    function bubbleMove() {
        var canvasNode = null;
        // 清除定时器
        var time1 = 0;
        var time2 = 0;
        // 设置背景动画和鼠标点击事件
        for (var i = 0; i < team3LiNodes.length; i++) {
            // 设置透明效果：鼠标进入事件
            team3LiNodes[i].onmouseenter = function () {
                for (var j = 0; j < team3LiNodes.length; j++) {
                    team3LiNodes[j].style.opacity = "0.5";
                }
                this.style.opacity = "1";
                addBubble();
                canvasNode.style.left = this.offsetLeft + team3Node.offsetLeft + "px";
                canvasNode.style.top = this.offsetTop + team3Node.offsetTop + "px";
            }
        }

        function addBubble() {
            if (!canvasNode) {
                canvasNode = document.createElement("canvas");
                canvasNode.width = team3LiNodes[0].offsetWidth;
                canvasNode.height = team3LiNodes[0].offsetHeight;

                // 设置透明效果：鼠标离开事件
                canvasNode.onmouseleave = function () {
                    for (var j = 0; j < team3LiNodes.length; j++) {
                        team3LiNodes[j].style.opacity = "1";
                    }
                    removeCanvas();
                }
                sectionNode.appendChild(canvasNode);
                Bubble();
            }
        }

        // 创建气泡
        function Bubble() {
            if (canvasNode.getContext) {
                var ctx = canvasNode.getContext("2d");
                var arr = [];

                time1 = setInterval(function () {
                    // 清除画布
                    ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);
                    // 设置动画
                    for (var i = 0; i < arr.length; i++) {
                        arr[i].deg += 5;
                        arr[i].y = arr[i].startY - (arr[i].deg * Math.PI / 180) * arr[i].step;
                        arr[i].x = arr[i].startX + Math.sin(arr[i].deg * Math.PI / 180) * arr[i].step * 2;

                        if (arr[i].y <= 30) {
                            arr.splice(i, 1);
                        }
                    }

                    // 遍历循环数组来绘制圆
                    for (var i = 0; i < arr.length; i++) {
                        ctx.save();
                        ctx.fillStyle = "rgba(" + arr[i].red + ", " + arr[i].green + ", " + arr[i].blue +
                            ", " +
                            arr[i].alp + ")";
                        ctx.beginPath();
                        ctx.arc(arr[i].x, arr[i].y, arr[i].r, 0, 360 * Math.PI / 180);
                        ctx.fill();
                        ctx.restore();
                    }
                }, 1000 / 60)

                // 设置定时器注入数组信息：坐标x，y，半径r
                time2 = setInterval(function () {
                    var r = Math.random() * 8 + 4;
                    var x = Math.random() * canvasNode.width;
                    var y = canvasNode.height - r;

                    var red = Math.round(Math.random() * 255);
                    var green = Math.round(Math.random() * 255);
                    var blue = Math.round(Math.random() * 255);
                    alp = 1;

                    var deg = 0;
                    var startX = x;
                    var startY = y;
                    // 设置曲线的运动轨迹
                    var step = Math.random() * 20 + 15;

                    arr.push({
                        x: x,
                        y: y,
                        r: r,
                        red: red,
                        green: green,
                        blue: blue,
                        alp: alp,
                        deg: deg,
                        startX: startX,
                        startY: startY,
                        step: step
                    })
                }, 50)

            }

        }

        // 设置鼠标离开时移除Canvas
        function removeCanvas() {
            canvasNode.remove();
            canvasNode = null;
            clearInterval(time1);
            clearInterval(time2);

        }

    }

    /* 出入场动画 */
    var animationArr = [
        // 保存每屏动画状态
        {
            // 第一屏出入场动画
            inAnimation: function () {
                var home1Node = document.querySelector("#content>.list>.home .home1");
                var home2Node = document.querySelector("#content>.list>.home .home2");

                home1Node.style.transform = "translateY(0px)";
                home2Node.style.transform = "translateY(0px)";
                home1Node.style.opacity = 1;
                home2Node.style.opacity = 1;
            },
            outAnimation: function () {
                var home1Node = document.querySelector("#content>.list>.home .home1");
                var home2Node = document.querySelector("#content>.list>.home .home2");

                home1Node.style.transform = "translateY(-400px)";
                home2Node.style.transform = "translateY(100px)";
                home1Node.style.opacity = 0;
                home2Node.style.opacity = 0;

            }
        },
        {
            // 第二屏出入场动画
            inAnimation: function () {
                var plane1 = document.querySelector("#content>.list>.course .plane1");
                var plane2 = document.querySelector("#content>.list>.course .plane2");
                var plane3 = document.querySelector("#content>.list>.course .plane3");

                plane1.style.transform = "translate(0px,0px)";
                plane2.style.transform = "translate(0px,0px)";
                plane3.style.transform = "translate(0px,0px)";

            },
            outAnimation: function () {
                var plane1 = document.querySelector("#content>.list>.course .plane1");
                var plane2 = document.querySelector("#content>.list>.course .plane2");
                var plane3 = document.querySelector("#content>.list>.course .plane3");

                plane1.style.transform = "translate(-300px,-300px)";
                plane2.style.transform = "translate(-300px,300px)";
                plane3.style.transform = "translate(300px,-300px)";
            }
        },
        {
            // 第三屏出入场动画
            inAnimation: function () {
                var pencil1 = document.querySelector("#content>.list>.works .pencil1");
                var pencil2 = document.querySelector("#content>.list>.works .pencil2");
                var pencil3 = document.querySelector("#content>.list>.works .pencil3");

                pencil1.style.transform = "translateY(0px)";
                pencil2.style.transform = "translateY(0px)";
                pencil3.style.transform = "translateY(0px)";
            },
            outAnimation: function () {
                var pencil1 = document.querySelector("#content>.list>.works .pencil1");
                var pencil2 = document.querySelector("#content>.list>.works .pencil2");
                var pencil3 = document.querySelector("#content>.list>.works .pencil3");

                pencil1.style.transform = "translateY(-250px)";
                pencil2.style.transform = "translateY(250px)";
                pencil3.style.transform = "translateY(250px,)";
            }
        },
        {
            // 第四屏出入场动画 
            inAnimation: function () {
                // 相框
                var pictureFrame1 = document.querySelector("#content>.list>.abouts .abouts3>.item:nth-child(1)");
                var pictureFrame2 = document.querySelector("#content>.list>.abouts .abouts3>.item:nth-child(2)");
                pictureFrame1.style.transform = "rotate(0deg)";
                pictureFrame2.style.transform = "rotate(0deg)";

            },
            outAnimation: function () {
                var pictureFrame1 = document.querySelector("#content>.list>.abouts .abouts3>.item:nth-child(1)");
                var pictureFrame2 = document.querySelector("#content>.list>.abouts .abouts3>.item:nth-child(2)");
                pictureFrame1.style.transform = "rotate(60deg)";
                pictureFrame2.style.transform = "rotate(-60deg)";
            }
        },
        {
            // 第五屏出入场动画
            inAnimation: function () {
                var team1Node = document.querySelector("#content>.list>.team .team1");
                var team2Node = document.querySelector("#content>.list>.team .team2");

                team1Node.style.transform = "translateX(0px)";
                team2Node.style.transform = "translateX(0px)";

            },
            outAnimation: function () {
                var team1Node = document.querySelector("#content>.list>.team .team1");
                var team2Node = document.querySelector("#content>.list>.team .team2");

                team1Node.style.transform = "translateX(-400px)";
                team2Node.style.transform = "translateX(400px)";
            }
        }
    ]

    // 默认情况下都是在出场状态
    for (var i = 0; i < animationArr.length; i++) {
        // for 循环遍历数组对象
        animationArr[i]["outAnimation"]();
    }

    // 开启第一屏入场动画
    // setTimeout(function () {
    //     animationArr[0].inAnimation();
    // }, 2000)

    /* 开机动画 */
    loadingAnimation();
    function loadingAnimation() {
        var arr = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg', 'bg5.jpg', 'about1.jpg', 'about2.jpg', 'about3.jpg',
            'about4.jpg', 'worksimg1.jpg', 'worksimg2.jpg', 'worksimg3.jpg', 'worksimg4.jpg', 'team.png',
            'greenLine.png'
        ];
        var flag = 0;
        for (var i = 0; i < arr.length; i++) {
            var img = new Image();
            img.src = "img/" + arr[i];
            img.onload = function () {
                flag++;
                lineNode.style.width = flag / arr.length * 100 + "%";
            }
        }
        // 图片加载完成后
        lineNode.addEventListener("transitionend", function () {
            if (flag == arr.length) {
                var h = upMove.offsetHeight;
                upMove.style.transform = "translateY(" + (-h) + "px)"
                downMove.style.transform = "translateY(" + h + "px)"

                this.style.display = "none";
            }
        })
        // 开机动画加载完成后
        downMove.addEventListener("transitionend", function () {
            mask.remove();
            setTimeout(function () {
                animationArr[0].inAnimation();
                home1Animation();
                audio.play()
            }, 200)
        })

    }






















}

