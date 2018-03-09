/* 全部思路：
 * 创建一个包含所有卡片的数组
 * 显示页面上的卡片
 *   - 使用下面提供的 "shuffle" 方法对数组中的卡片进行洗牌
 *   - 循环遍历每张卡片，创建其 HTML
 *   - 将每张卡的 HTML 添加到页面
 * 设置一张卡片的事件监听器。 如果该卡片被点击：
 *  - 显示卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 将卡片添加到状态为 “open” 的 *数组* 中（将这个功能放在你从这个函数中调用的另一个函数中）
 *  - 如果数组中已有另一张卡，请检查两张卡片是否匹配
 *    + 如果卡片匹配，将卡片锁定为 "open" 状态（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果卡片不匹配，请将卡片从数组中移除并隐藏卡片的符号（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 增加移动计数器并将其显示在页面上（将这个功能放在你从这个函数中调用的另一个函数中）
 *    + 如果所有卡都匹配，则显示带有最终分数的消息（将这个功能放在你从这个函数中调用的另一个函数中）
 */
 
 //创建卡片数组
var cards = [];
for (var i = 0; i < $(".card").length; i++) {
	cards.push($(".card")[i]);
}
//重洗后改变dom
cards = shuffle(cards);
$(".card").remove();
for(var i = 0; i < cards.length; i++){
    $(".deck").append(cards[i]);
}
// 刷新按钮
$(".restart").mouseup(function(){
    //重新加载页面,括号里面为：true（从服务器重新加载），默认为false（从缓存加载）
    location.reload(true);
});
// 洗牌函数来自于 http://stackoverflow.com/a/2450976(还不明白)
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
//创建状态为open的数组
var openCard = [];
//匹配函数
function matchCard(){
	if((openCard.length == 2) && (openCard[0] == openCard[1])){
		$(".card.open").addClass("match");
        //移除状态为open的卡片
        openCard.splice(0, 2);
	}else if((openCard.length == 2) && (openCard[0] != openCard[1])){
        //设置延迟函数，使用户可看到打开的第二张卡片
        setTimeout(function(){
            $(".card, open, show").removeClass("open show");
            //移除状态为open的卡片
            openCard.splice(0, 2);
        }, 1000);
	}
}
//所有卡片都匹配,且显示游戏成功
function allCardMatched(){
    if($(".deck li.match").length == 16){
        //停止计时
        stopTime();
        //此处也可写一个modal
        $(".container").hide();
        var result = '<div class="main"></div>'
        var iconRight = '<p><i class="icon-ok"></i></p>'
        var textWin = '<p class="win-text">Congratulations! You Won!</p>'
        var textScore = '<p class="score-text">With <span class="final-step"></span> Moves and <span class="final-star"></span> Stars</p>';
        var textTime = '<p class="time-text">You have been using it for <span class="final-time"></span> seconds</p>';
        var textWoo = '<p class="win-woo">Woooooooo!</p>';
        var btn = '<button type="button">Play again</button>'
        //添加html
        $("body").append(result);
        $(".main").append(iconRight, textWin, textScore, textTime, textWoo, btn);
        //添加步数
        $(".final-step").text(step);
        //添加星星
        $(".final-star").text(starNum);
        //添加时间
        $(".final-time").text(t);
        //调用再次重新开始游戏函数
        playAgain();
    }
}
//再次重新开始游戏
function playAgain() {
    $("button").click(function () {
        console.log("重新开始游戏");
        $(".main").hide();
        $(".container").show();
        $(".card").removeClass("open show match");
        //移除后，重新加载页面
        location.reload(true);
    })
}
//设置一张卡片的事件监听器
//使用事件委托：利用父级去触发子集的事件，即利用事件委托的话，只需要给父级绑定一个事件监听，即可让每个li都绑定上相应的事件。
$(".deck").on("click", "li", function(ev){
    //找到父级deck
	//console.log($(ev.delegateTarget));
    //this指向委托的对象li
	//console.log($(this));
    //每次点击事件仅对未打开且未匹配的卡牌起作用
    if(($(this).hasClass("open show match ") == false) && (openCard.length < 2)){
        //如果使用append添加类，会造成再点击此卡片时，两张卡片匹配；使用toggleClass()切换类，如果该元素有此类则删除，没有则添加
        $(this).toggleClass("open show");
        //提取i的class到数组
        //console.log($(this).children().attr("class"));
        openCard.push($(this).children().attr("class"));
        //console.log(openCard);
        if(firstClick){
            self.setInterval("beginTime()", 1000);
            firstClick = false;
        }
        console.log(firstClick);
        moveStep();
        $(".moves").text(step);
        //检查两张卡片是否匹配
        matchCard();
        starCount();
        allCardMatched();
    }
});
//增加的移动计数器
//创建移动步数
var step = 0;
function moveStep(){
    if(openCard.length == 2){
        step+=1;
        return step;
    }
}
//星级评分
var starNum = 0;
function starCount(){
    //通过在html文件中给li元素添加类来控制
    //之前使用$(".star").find("li")[0].remove()来控制造成大于10步每增加一次就减少一个li 元素，不合理
    //还有什么其他方法不通过添加类来控制星星数量？
    if(step >=10 && step <=20){
        $(".first-star").remove();
        starNum = 2;
    }else if(step > 20){
        $(".second-star").remove();
        starNum = 1;
    }
    return starNum;
}

/*
 *计时器思路(来自udacity论坛)
 *1. 设置一个计时器，每隔一秒执行一次
 *2. 该计时器的触发是唯一的，也就是只能触发一次，后面的点击将不会触发该事件。
 *3. 设置一个计时器停止函数，该函数将停止上面定义的计时器，条件是在完成所有卡牌匹配之后。
 */


var t = 0;
var firstClick = true;
//开始计时函数
function beginTime(){
    t+=1;
    $(".times").text(t);
}
//停止计时函数
function stopTime(){
    clearInterval(self.setInterval("beginTime()", 1000));
}
