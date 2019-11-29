class numberRoll {
  constructor(ele, options) {
    this.setting = {
      len: null, //设置默认最小位数
      speed: 1000, // 动画速度
      num: "", // 翻滚数字
      symbol: '', // 分隔符
      dot: 0, //保留几位小数
      zero: true // 当数字为零时是否有动画
    }
    this.$parent = document.querySelector(ele)
    this.htmlStr = `<div class="number-animate-dom" data-num="{{num}}">
        <span class="number-animate-span">0</span>
        <span class="number-animate-span">1</span>
        <span class="number-animate-span">2</span>
        <span class="number-animate-span">3</span>
        <span class="number-animate-span">4</span>
        <span class="number-animate-span">5</span>
        <span class="number-animate-span">6</span>
        <span class="number-animate-span">7</span>
        <span class="number-animate-span">8</span>
        <span class="number-animate-span">9</span>
        <span class="number-animate-span">0</span>
        <span class="number-animate-span">.</span>
      </div>`
    this.extend(this.setting, options)
    this.init()
  }
  // 初始化
  init() {
    this.$parent.innerHTML = this.setNumDom(this.numToArr(this.setting.num))
    this.animate(this.$parent)
  }
  // 设置动画
  animate() {
    let $dom = this.$parent.querySelectorAll('.number-animate-dom')
    for (let o of $dom) {
      let num = o.getAttribute('data-num')
      if (this.setting.zero) {
        num = num == 0 ? 10 : num
      }
      // 每一个number-animate-span高度 offsetHeight = height + padding + border
      this._height = o.offsetHeight / 12
      o.style['transform'] = o.style['-webkit-transform'] = 'translateY(' + (num === '.' ? -11 * this._height : -num * this._height) + 'px)'
      o.style['transition'] = o.style['-webkit-transition'] = (num === '.' ? 0 : this.setting.speed / 1000) + 's'
    }
  }
  // 更新
  update(num) {
    let newArr = this.numToArr(num), $dom = this.$parent.querySelectorAll('.number-animate-dom')
    if ($dom.length != newArr.length) {
      this.$parent.innerHTML = this.setNumDom(newArr)
    } else {
      for (let i in $dom) {
        if (!isNaN(Number(i))) {
          $dom[i].setAttribute('data-num', newArr[i])
        }
      }
    }
    this.animate(this.$parent);
  }
  // 添加翻滚dom元素
  setNumDom(arrStr) {
    let shtml = '<div class="number-animate">'
    arrStr.forEach((o, i) => {
      if (i != 0 && (arrStr.length - i) % 3 == 0 && this.setting.symbol != "" && o != ".") {
        // 添加分隔符
        shtml += '<div class="number-animate-dot"><span>' + this.setting.symbol + '</span></div>' + this.htmlStr.replace("{{num}}", o)
      } else {
        shtml += this.htmlStr.replace("{{num}}", o)
      }
    })
    shtml += '</div>'
    return shtml
  }
  // 数字转数组并且不足位数补零
  numToArr(num) {
    num = parseFloat(num).toFixed(this.setting.dot)
    let arrStr = typeof (num) === 'number' ? num.toString().split("") : num.split("")
    let arrLen = arrStr.length
    if (arrLen <= this.setting.len) {
      for (let _len = 0; _len < (this.setting.len - arrLen); _len++) {
        arrStr.unshift(0)
      }
    }
    return arrStr
  }
  // 浅拷贝
  extend(x, y) {
    for (let i in y) {
      x[i] = y[i]
    }
  }
}

// export default numberRoll

