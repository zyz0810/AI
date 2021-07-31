<template>
  <div class="mealBox">
    <div class="topMeal">
      <div class="mealBackColor">
        <div class="mealFont">精品套餐</div>
      </div>
    </div>
    <div class="centerMeal">
      <span class="mealPriceFont">套餐价：</span>
      <span class="retailMealPrice">100.00</span>
      <span class="originalMealPrice">199.00</span>
    </div>
    <div class="incrementMealPrice">
      <div class="leftMealDecrement">-</div>
      <input type="number" name="" id="" class="centerMealInput" />
      <div class="rightMealIncrement">+</div>
    </div>
    <div class="contentMeal">
      <div class="productMealBox" v-for="(item, index) in 2" :key="index">
        <!-- <img
          class="productMealPic"
          src="https://dss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=282156732,749984537&fm=26&gp=0.jpg"
          alt=""
        /> -->
        <div class="productMealPic">
          <span class="el-icon-picture"></span>
        </div>
        <div class="productMealName">商品名称</div>
        <div class="productPriceBox">
          <div class="retailMealPrice">100.00</div>
          <div class="productMealSpecification">x10件</div>
        </div>
        <div class="productMealPack">中包装：</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propValue: {
      type: [Object, Array],
      require: true,
      default: () => {
        return [
          {
            skuImageUrl: "",
            name: "",
            retailPrice: "",
            marketPrice: "",
            specificationValue: "",
            manufacture: {
              name: "",
            },
            createSupplierName: "",
          },
        ];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.mealBox {
  padding: 10px;
  width: 100%;
}
.centerMeal,
.incrementMealPrice {
  padding: 20px;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
.leftMealDecrement,
.rightMealIncrement {
  font-size: 18px;
  width: 40px;
  height: 30px;
  line-height: 30px;
  border: 1px solid #666666;
  text-align: center;
}
.centerMealInput {
  width: 70px;
  border: 1px solid #666666;
  padding: 0 2px;
  font-size: 18px;
  border-left: none;
  border-right: none;
  outline: none;
}
.centerMealInput:focus {
  border: 1px solid #666666;
  border-left: none;
  border-right: none;
  outline: none;
}
.centerMealInput:active {
  border: 1px solid #666666;
  border-left: none;
  border-right: none;
  outline: none;
}
.incrementMealPrice {
  padding-top: 0px;
}
.mealPriceFont,
.retailMealPrice {
  font-size: 14px;
  color: #000000;
  font-weight: bold;
}
.retailMealPrice {
  color: #e1082d;
  margin-right: 10px;
}
.originalMealPrice {
  text-decoration: line-through;
  color: #999;
}
.originalMealPrice::before {
  content: "原价：";
  text-decoration: line-through;
}
.topMeal {
  text-align: center;
}
.mealBackColor {
  background-color: #ffd97f;
  display: inline-block;
  border-radius: 2px;
}
.mealFont {
  font-size: 14px;
  box-sizing: border-box;
  color: #fff;
  height: 32px;
  line-height: 32px;
  background-color: #fd6f2d;
  border-radius: 2px;
  border-top-left-radius: 20px;
  border-bottom-right-radius: 20px;
  letter-spacing: 4px;
  padding: 0 14px;
  display: inline-block;
  text-align: center;
}
.contentMeal {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.productMealBox {
  width: calc(50% - 5px);
  height: 240px;
}
.productMealPic {
  width: 100%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 18px 0px rgba(98, 95, 96, 0.17);
  border-radius: 10px;
  span {
    font-size: 100px;
    height: 100px;
    color: #b9b9b9;
  }
}
.productPriceBox {
  display: flex;
  justify-content: space-between;
  line-height: 24px;
}
.productMealName {
  font-size: 14px;
  font-weight: bold;
  line-height: 14px;
  margin-top: 20px;
}
.productMealSpecification,
.productMealPack {
  color: #999;
  padding-right: 10px;
}
</style>