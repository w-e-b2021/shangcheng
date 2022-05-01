import BScroll from '@better-scroll/core'

export default function () {
  let bs = new BScroll('.wrapper', {
    click: true,
    probeType: 2,
    disableTouch: false
  })
  return bs
}
