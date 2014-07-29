/**
 * Name:    waterfall responsive
 * Time:    2014/7/28
 * Version: 1.0
 * Author: StionZhai
 * URL: http://chen.zhaishichen.cn
 */

// 定义瀑布流对象
var waterfall = {

  // 测试数据
  testData: {
    'data':[{'src':'1.jpg'},{'src':'2.jpg'},{'src':'3.jpg'},{'src':'4.jpg'},{'src':'5.jpg'}]
  },

  // 初始化函数
  init: function(parentId, className){
    waterfall.layout(parentId, className);

    // 窗口变化时,自动适应屏幕大小
    window.onresize = function() {
      waterfall.layout(parentId, className);
    };

    // 瀑布流滚动事件
    window.onscroll = function() {
      if (waterfall.isLoading(parentId, className)) {
        var oParent = document.getElementById(parentId);
        for (var i = 0; i < waterfall.testData.data.length; i++) {
          var oPin=document.createElement('li');
          oPin.className='pin';
          var oImg=document.createElement('img');
          oImg.src='img/' + waterfall.testData.data[i].src;
          oPin.appendChild(oImg);
          oParent.appendChild(oPin);
        }
        waterfall.layout(parentId, className);
      }
    };
  },

  // 给图片重新排版、布局函数
  layout: function(parentId, className) {
    var aLi = waterfall.getByClass(parentId, className);
    if(Math.floor(document.documentElement.clientWidth)>768){
      num = 4;
      aLi[2].style.top = aLi[0].offsetTop+'px';
      aLi[2].style.left = aLi[1].offsetLeft +aLi[1].offsetWidth +'px';
      aLi[3].style.top = aLi[0].offsetTop+'px';
      aLi[3].style.left = aLi[2].offsetLeft + aLi[2].offsetWidth +'px';
    }else {
      num =2;
    }

    var pinHArr=[];
    for(var i=0;i<aLi.length;i++){
      var pinH=aLi[i].offsetHeight;
      if(i<num){
        pinHArr[i]=pinH;
      }else{
        // 原生 Math.min() 方法不接受数组, 使用 apply 以数组来接受被调用函数的参数,很方便
        var minH = Math.min.apply(null,pinHArr);
        var minHIndex = waterfall.getIndex(pinHArr,minH);
        aLi[i].style.position = 'absolute';
        aLi[i].style.top = minH + 'px';
        aLi[i].style.left = aLi[minHIndex].offsetLeft + 'px';
        pinHArr[minHIndex] += aLi[i].offsetHeight;
      }
    }
  },

  // 通过 class 名获取对象, 返回对象数组
  getByClass: function(parentId, className) {
    var oParent = document.getElementById(parentId);
    var aLi = oParent.getElementsByTagName('*');
    var pinS = [];
    for (var i=0; i < aLi.length; i++) {// 获取指定 class 的元素
      if (aLi[i].className == className){
        pinS.push(aLi[i]);
      }
    };
    return pinS;
  },

  // 获取指定值得索引
  getIndex: function(arr, val) {
    for(var i in arr){
      if(arr[i] == val){
        return i;
      }
    }
    return null;
  },

  // 检查是否滚动到需要加载图片的位置
  isLoading: function(parentId, className) {
    var aLi = waterfall.getByClass(parentId, className);
    var lastPinH = aLi[aLi.length - 1].offsetTop + Math.floor(aLi[aLi.length - 1].offsetHeight / 2);
    // 兼容性小处理
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    var documentH = document.documentElement.clientHeight;
    return (lastPinH < scrollTop + documentH) ? true : false;
  }
};

window.onload = function(){
  waterfall.init('waterfall', 'pin');
};

// 面向对象总结：
//   1. 对象内的属性方法访问其他属性方法的时候不能直接调用，需要添加命名空间，比如：
//   waterfall.isLoading(XXXX), 尽量不要用 this ,容易报错(像:undefined is not a function)
//   2. 对象的声明在前, 使用对象的方法在后, 因为他不像函数一样声明随处, 调用随处. 其实他就像变量一样,
//   未给他声明完, 他是没有值的
// 反思:
//   1. 面向对象的原则是什么, 怎么理解面向对象编程的
//   2. 学习如何封装模块, 模块化编程如何实现
//   3. soild