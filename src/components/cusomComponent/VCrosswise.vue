<template>
  <div>
    <div v-if="propValue.length != 0">
      <div v-for="(item, index) in propValue" :key="index" class="productBox">
        <div class="leftBox">
          <el-image :src="item.skuImageUrl" fit="contain"></el-image>
        </div>
        <ul class="rightBox">
          <li class="name" v-if="item.name">{{ item.name }}</li>
          <li class="specificationValue" v-if="item.specificationValue">
            中包装：1{{ item.specificationValue }}
          </li>
          <li class="manufacture" v-if="item.manufacture.name">
            {{ item.manufacture.name }}
          </li>
          <li>
            <span class="retailPrice attachMoney" v-if="item.retailPrice">{{
              item.retailPrice
            }}</span>
            <span class="marketPrice attachMoney" v-if="item.marketPrice">{{
              item.marketPrice
            }}</span>
          </li>
          <li class="fullGift" v-if="item.name">
            <i class="el-icon-circle-plus plus"></i>
          </li>
          <li class="createSupplierName">
            {{ item.supplier.name }}
            <!-- <i class="el-icon-arrow-right"></i> -->
          </li>
        </ul>
      </div>
    </div>
    <img src="@/assets/app/row.jpg" alt="" v-else class="carouselImg" />
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
.productBox {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #e7e6e6;
  margin: 0 4px;
  .leftBox {
    width: 36%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
  }
  .rightBox {
    width: 64%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 4px 0;
    .name,
    .retailPrice {
      font-size: 16px;
      font-weight: bold;
    }
    .marketPrice {
      font-size: 12px;
      text-decoration: line-through;
      color: #999999;
    }
    .createSupplierName,
    .manufacture,
    .specificationValue {
      color: #999999;
      font-size: 14px;
    }
  }
}

.attachMoney::before {
  content: "￥";
  vertical-align: baseline;
  font-size: 10px;
  padding-right: 1px;
}
.manufacture::before {
  content: "厂";
  vertical-align: top;
  font-size: 12px;
  border: 1px solid;
  border-radius: 8px;
  padding: 0 4px;
}

.fullGift::before {
  content: "满赠";
  vertical-align: baseline;
  font-size: 10px;
  border: 1px solid red;
  border-radius: 12px;
  color: #e1082d;
  padding: 0 2px;
}
.plus {
  float: right;
  font-size: 20px;
  color: #e1082d;
}
</style>