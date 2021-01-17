const app = getApp()
Page({
  data: {
    swiperBoxWidth: 360, // 一个swiper-item是90rpx. 假设展示3个,则4*90; 展示4个,则5*90 ...
    showNumberItem: 4, // 展示的个数, 4/5/6/6+四种情况, 为了效果默认会加上一个; 注意这个数不能大于数组长度
    interval: 5000, // 多久滑动一次
    swiperIndex: 0, // 当前swiper所在的索引
    photosTotal: 0,
    photosData: [],
  },
  onLoad: function() {
    setTimeout(() => {
      let result = [{}, {}, {}, {}];
      // 因为有一个被遮挡, 所以要复制一个元素
      if(result.length > 3 && result.length <= 7) {
        result.push(JSON.parse(JSON.stringify(result[0])))
      }
      this.setData({
        photosData: result,
        showNumberItem: this.getShowItemNumber(result.length),
        swiperBoxWidth: this.pxToRpx(this.rpxToPx(90) * this.getShowItemNumber(result.length)), // swiper需求要一个宽度
      })
    }, 800)
  },
  bindchange(e) {
    let current = e.detail.current;
    let swiperIndex = this.data.swiperIndex;
    let swiperData = this.data.photosData;

    // 1.整体初始化
    swiperData.forEach(item => {
      item.outAni = false;
      item.inAni = false;
      item.scale = false; // 进入时要放大, 所以要先将其缩放为0
    });

    // 2.给需要动画的元素打标识
    if(swiperIndex >= swiperData.length - 1) {
      swiperData[0].outAni = true;
    }else {
      swiperData[swiperIndex+1].outAni = true;
    }
    swiperData[this.getNewIndex(swiperIndex, this.data.showNumberItem, swiperData.length)].scale = true;
    // 3. 最后赋值
    this.setData({
      swiperIndex: current,
      photosData: swiperData,
    })
  },
  bindanimationfinish(e) {
    let swiperIndex = this.data.swiperIndex;
    let swiperData = this.data.photosData;
    let targetIndex = this.getNewIndex(swiperIndex - 1, this.data.showNumberItem, swiperData.length);
    // 放大进入
    swiperData[targetIndex].inAni = true;

    this.setData({
      photosData: swiperData,
    })
  },
  // 由一个索引值添加一定增量后获取另一个索引值
  getNewIndex(I, R, L) {
    /**
     * @param {*} I: 取的索引值
     * @param {*} R: 增量
     * @param {*} L: 添加增量后的索引值
     */
    return (I + R) >= L ? (I + R - L) : (I + R)
  },
  // 获取swiper应该同时展示多少个
  getShowItemNumber(num) {
    switch(num) {
      case 5: return 4; break;
      case 6: return 5; break;
      case 7: return 6; break;
      default: return 7;
    }
  },
  // rpx转px
  rpxToPx(rpx) {
    return rpx / 750 * wx.getSystemInfoSync().windowWidth;
  },
  // px转rpx
  pxToRpx(px) {
    return  px * 750 / wx.getSystemInfoSync().windowWidth;
  },
})
