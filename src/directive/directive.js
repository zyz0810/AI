
import {
 MessageBox
} from 'element-ui'

// 点击显示图片
const  showImage={
 bind:()=>{},
 inserted:(el,binding)=>{
  el.onclick=()=>{
   const{value}=binding
   MessageBox({
      title: "查看图片",
      dangerouslyUseHTMLString: true,
      message: `<img src=${value} style="max-height:80vh"><img/>`,
      confirmButtonText: "确定",
      beforeClose: (action, instance, done) => {
       done()
      },
    });
  }
 },
 updated:()=>{},
}

// 点击展示不通过原因
const showText={
 bind:()=>{},
 inserted:(el,binding)=>{
  el.onclick=()=>{
   const{value}=binding
   MessageBox({
      title: "不通过原因",
      message: value,
      type:'warning',
      confirmButtonText: "确定",
      beforeClose: (action, instance, done) => {
       done()
      },
    });
  }
 },
 updated:()=>{},
}

// input输入框自动精确到小数点两位
const toFixed={
 bind:()=>{},
 inserted:(el,binding)=>{
  const {value}=binding
  el.onchange=(element)=>{
   element.target.value= Number(element.target.value).toFixed(2)
  }
 },
 updated:(el,binding)=>{
 },
}

// 自定义指令
const directives = {
 showImage,
 toFixed,
 showText
}


export default {
 install(Vue) {
   Object.keys(directives).forEach((key) => {
     Vue.directive(key, directives[key])
   })
 },
}
