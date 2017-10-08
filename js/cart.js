var vm = new Vue({
  el: '#app',
  data: {
    totalMoney: 0,
    productList: [],
    checkAllFlag: false,
    delFlag:false,
    currentProduct:{}
  },
  
  filters: {
    formatMoney: function (value) {
      return "￥" + value.toFixed(2);
    }
  },
  mounted: function() {
    this.$nextTick(function() {
      this.cartView();//vm.cartView();
    })
  },
  methods: {
    cartView: function() {
      var _this = this;
      this.$http.get("data/cartData.json").then(function(res) {
        _this.productList = res.body.result.list;
      })
    },
    checkAll: function (flag) {
        this.checkAllFlag = flag;
        var _this = this;
        this.productList.forEach(function(item,index) {
          if(typeof(item.checked) == "undefined") {
            Vue.set(item,'checked',_this.checkAllFlag);
         }else {
           item.checked = _this.checkAllFlag;
       } 
      });
      this.calculatorTotalMoney();
        
      },
    selectProduct: function (item) {
      if(typeof(item.checked) == "undefined") {
        Vue.set(item,'checked',true);
      }else {
        item.checked = !item.checked;
      }
      this.calculatorTotalMoney();

    },
    changeMoney: function (product,way) {
      if(way > 0) {
        product.productQuantity++;
      }else {
        product.productQuantity--;
        if(product.productQuantity < 2) {
          product.productQuantity = 1;
        }
      }
      this.calculatorTotalMoney();
    },
    calculatorTotalMoney: function() {
      var _this = this;
      _this.totalMoney = 0;
      this.productList.forEach(function(item,index) {
        if(item.checked) {
          _this.totalMoney += item.productQuantity*item.productPrice;
        }
      })
    },
    delConfirm: function(item) {
      this.delFlag = true;
      this.currentProduct = item;
    },
    delProduct: function() {
      var index = this.productList.indexOf(this.currentProduct);
      this.productList.splice(index,1);
      this.delFlag = false;
    }
  }
});
// 全局过滤器
Vue.filter('money',function (value,type) {
  return "￥" + value.toFixed(2) + type;
});