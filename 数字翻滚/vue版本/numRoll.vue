<template>
  <div :class="['number-animate', setting.className]" :style="{height: `${pHeight}px`}">
    <template v-for="(item, index) in numArr">
      <div class="number-animate-dom" v-if="!isNaN(Number(item))" :key="index" :data-num="item">
        <img
          class="number-animate-numImg"
          :src="require(`@/images/${setting.imgName}`)"
          :style="{width: setting.mWidth}"
        />
      </div>
      <div
        v-else
        class="number-animate-dot"
        :key="index"
        :style="{height: `${pHeight}px`}"
      ><span class="dot">{{setting.symbol}}</span></div>
    </template>
  </div>
</template>

<script>
export default {
  name: "numRoll",
  data() {
    return {
      setting: {
        num: "", // 必须 翻滚数字
        className: "", // 必须， 唯一性
        imgName: "", // 必须 图片名字
        len: null, //设置默认最小位数
        speed: 1000, // 动画速度
        symbol: "", // 分隔符
        dot: 0, //保留几位小数
        mWidth: "auto", // 默认值 图片大小
        zero: false // 当数字为零时是否有动画
      },
      numArr: [],
      pHeight: 0,
      parentDom: null
    };
  },
  props: {
    options: {
      type: Object
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.extend(this.setting, this.options);
      this.numToArr(this.setting.num);
      this.$nextTick(() => {
        this.parentDom = document.querySelector(`.${this.setting.className}`);
        this.animate();
      });
    },
    // 数字转数组并且不足位数补零
    numToArr(num) {
      num = parseFloat(num).toFixed(this.setting.dot);
      let arrStr =
          typeof num === "number" ? num.toString().split("") : num.split(""),
        next = [];
      let arrLen = arrStr.length;
      if (arrLen <= this.setting.len) {
        for (let _len = 0; _len < this.setting.len - arrLen; _len++) {
          arrStr.unshift(0);
        }
      }
      if (this.setting.symbol) {
        arrStr.reverse();
        for (let i = 0; i < arrStr.length; i++) {
          if (i !== 0 && i % 3 === 0) {
            next.push(this.setting.symbol, arrStr[i]);
          } else {
            next.push(arrStr[i]);
          }
        }
        next.reverse();
      }
      this.numArr = next.length?next : arrStr.reverse();
    },
    // 设置动画
    animate() {
      let $dom = this.parentDom.querySelectorAll(".number-animate-dom");
      if ($dom && $dom.length) {
        this.$nextTick(() => {
          this.pHeight = $dom[0].offsetHeight / 10;
          for (let o of $dom) {
            let num = o.getAttribute("data-num");
            if (this.setting.zero) {
              num = num == 0 ? 10 : num;
            }
            // 每一个number-animate-span高度 offsetHeight = height + padding + border
            o.style["transform"] = o.style["-webkit-transform"] =
              "translateY(" +
              (num === "." ? -11 * this.pHeight : -num * this.pHeight) +
              "px)";
            o.style["transition"] = o.style["-webkit-transition"] =
              (num === "." ? 0 : this.setting.speed / 1000) + "s";
          }
        });
      }
    },
    // 更新
    update(num) {
      this.numToArr(num);
      this.$nextTick(() => {
        this.animate();
      });
    },
    // 浅拷贝
    extend(x, y) {
      for (let i in y) {
        x[i] = y[i];
      }
    }
  }
};
</script>

<style lang="stylus">
.number-animate
  overflow: hidden
  display: inline-block
  position: relative
  .number-animate-dom
    text-align: center
    float: left
    position: relative
    .number-animate-numImg
      display: block
  .number-animate-dot
    width: 16px
    float: left
    position relative
    text-align: center
    .dot
      position absolute
      bottom 0
</style>