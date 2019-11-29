<template>
  <div class="mt40">
    <numRoll ref="num1" :options="options"></numRoll>
    <br />
    <numRoll :options="options1"></numRoll>
    <br />
    <numRoll :options="options2"></numRoll>
    <el-button @click="test">更新</el-button>
  </div>
</template>

<script>
import numRoll from "./common/numRoll";
export default {
  components: {
    numRoll
  },
  data() {
    return {
      options: {
        num: 4654433,
        len: 14,
        symbol: ',',
        mWidth: '30px',
        className: "num1",
        imgName: 'numberBig.png'
      },
      options1: {
        num: 9032,
        imgName: 'number1.png',
        className: "num2"
      },
      options2: {
        num: 4356,
        imgName: 'number2.png',
        className: "num3"
      }
    };
  },
  methods: {
    test() {
      var min = 0;
      var max = 1000000;
      var rand = Math.floor(Math.random() * (max - min + 1)) + min;
      this.$refs.num1.update(rand);
    }
  }
};
</script>

<style>
</style>