export default {

  install(Vue,options){
    let domainName = '';
    if(window.location.host.includes('susongzhijia')){
      domainName = 'http://erp.susongzhijia.com/';
    }else{
      // domainName = window.location.protocol+"//"+window.location.host+"/";
      domainName = 'http://10.32.49.115:8081/';
    }
    Vue.prototype.global = {
      domainName:domainName
    };
  }

}
