<template>
  <div class="container">
    <!-- 这个地方randomCode()必须加括号 -->
    <canvas ref="canvas" width="240" height="80" @click="randomCode()"></canvas>
  </div>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
export default {
  emits: ['confirmCode'],
  setup(props, context) {
    const canvas = ref()
    let ctx
    let _data = reactive({})
    onMounted(() => {
      let html = document.documentElement
      canvas.value.width = parseFloat(html.style.fontSize) * (240 / 75)
      canvas.value.height = parseFloat(html.style.fontSize) * (80 / 75)
      ctx = canvas.value.getContext('2d')
      randomCode()
    })
    //随机颜色
    function randomColor(min = 0, max = 255) {
      let r = randomNum(min, max)
      let g = randomNum(min, max)
      let b = randomNum(min, max)
      return `rgb(${r},${g},${b})`
    }
    //随机数，包含最小值和最大值
    function randomNum(min, max) {
      return Math.ceil(Math.random() * (max - min) + min)
    }
    //随机背景色
    function randomBackGround() {
      ctx.save()
      ctx.fillStyle = randomColor(180, 230)
      ctx.beginPath()
      ctx.fillRect(0, 0, canvas.value.width, canvas.value.height)
      ctx.restore()
    }
    //
    function randomCode(num = 4) {
      let allcode = ''
      randomBackGround()
      let pool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890'
      //每个字占的长宽是画布高的70%，这相当于是写字本上的格子,这样字体大小随着画布大小变化
      let font_box = Math.ceil(canvas.value.height * 0.7)
      //4个验证码,
      for (let i = 0; i < num; i++) {
        let code = pool[randomNum(0, 35)]
        allcode += code
        //随机判定验证码旋转-deg或+deg
        let deg = Math.round(Math.random()) ? '-' : '+'
        //随机字体大小
        let fontSize = randomNum(font_box - 10, font_box)

        ctx.save()
        ctx.textBaseline = 'middle'
        ctx.font = `${fontSize}px sans-serif`
        ctx.fillStyle = randomColor(60, 130)
        //canvas.value.height / 2,使验证码垂直居中。
        //(canvas.value.width - num * font_box) / 2，使验证码水平居中.
        let x = font_box * i + (canvas.value.width - num * font_box) / 2 + font_box / 2
        ctx.translate(x, canvas.value.height / 2)
        ctx.rotate(deg + (Math.random() * Math.PI) / 3) //这里不调用randomNum，randomNum会取整
        ctx.beginPath()
        ctx.fillText(code, -fontSize / 2, 0) //调整基线为middle,x为字体大小一半的负值，就能保证字体中心在原点
        ctx.restore()
      }
      //5条干扰线
      for (let i = 0; i < 5; i++) {
        ctx.save()
        ctx.strokeStyle = randomColor(180, 230)
        ctx.beginPath()
        ctx.moveTo(randomNum(0, canvas.value.width), randomNum(0, canvas.value.height))
        ctx.lineTo(randomNum(0, canvas.value.width), randomNum(0, canvas.value.height))
        ctx.lineTo(randomNum(0, canvas.value.width), randomNum(0, canvas.value.height))
        ctx.stroke()
      }
      //50个小点
      for (let i = 0; i < 50; i++) {
        ctx.save()
        ctx.strokeStyle = randomColor()
        ctx.beginPath()
        ctx.arc(randomNum(0, canvas.value.width), randomNum(0, canvas.value.height), 1, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()
      }
      context.emit('confirmCode', allcode)
    }
    return {
      canvas,
      randomCode
    }
  }
}
</script>

<style lang="less" scoped>
.container {
  canvas {
    vertical-align: middle;
    background-color: pink;
  }
}
</style>
