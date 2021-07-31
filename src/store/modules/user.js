import { login, logout, getInfo } from '@/api/user'
import { findMenuByRole } from '@/api/menu'
import { getToken, setToken, removeToken,getId,setId,removeId,getName,setName,removeName,getMobile,setMobile,removeMobile,setCity,removeCity,setCitySelected,removeCitySelected} from '@/utils/auth'
import router, { resetRouter } from '@/router'

import store from '@/store'
import axios from 'axios'

const state = {
  token: getToken(),
  name: '',
  avatar: '',
  introduction: '',
  roles: [],
  id:undefined,
  admin_mobile:'',
  city:[],
  citySelected:'',
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_ID: (state, id) => {
    state.id = id
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MOBILE: (state, admin_mobile) => {
    state.admin_mobile = admin_mobile
  },
  SET_CITY: (state, city) => {
    state.city = city
  },
  SET_CITYSELECTED: (state, citySelected) => {
    state.citySelected = citySelected
  },
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { mobile, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ mobile: mobile.trim(), password: password }).then(response => {
        const { data } = response;
        // token_type  access_token
        commit('SET_TOKEN', data.access_token);
        // commit('SET_ID', response.data.id);
        console.log(response.data.city_list);
        commit('SET_CITY', response.data.city_list);
        commit('SET_CITYSELECTED', response.data.city_list[0].id);

        setCity(response.data.city_list);
        setCitySelected(response.data.city_list[0].id);
        // setId(response.data.id);
        // setName(response.data.name);
        setToken(data.access_token);
        sessionStorage.setItem("Admin-Token", JSON.stringify(data.access_token));
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      let role = ['admin']
      commit('SET_ROLES', role);
      resolve(role);
      // getInfo().then(response => {
      //   if(response.resp_code == 0){
      //     // commit('SET_ID', response.data.id);
      //     commit('SET_NAME', response.data.nickname);
      //     commit('SET_MOBILE', response.data.mobile);
      //     // setId(response.data.id);
      //     setName(response.data.nickname);
      //     setMobile(response.data.mobile)
      //     let role = []
      //     if(response.data.username == 'admin'){
      //       role = ['admin']
      //     }else{
      //       if(response.data.permissions == null){
      //         role = ['index']
      //       }else{
      //         role = response.data.permissions
      //       }
      //     }
      //     commit('SET_ROLES', role);
      //     resolve( role);
      //   }else{
      //     commit('SET_ID', '');
      //     commit('SET_TOKEN', '');
      //     commit('SET_ROLES', []);
      //     commit('SET_NAME', '');
      //     commit('SET_MOBILE', '');
      //     removeToken();
      //     resetRouter();
      //     // removeId();
      //     removeName();
      //     removeMobile();
      //   }
      // }).catch(error => {
      //   commit('SET_ID', '');
      //   commit('SET_TOKEN', '');
      //   commit('SET_ROLES', []);
      //   commit('SET_NAME', '');
      //   commit('SET_MOBILE', '');
      //   removeToken();
      //   sessionStorage.setItem("Admin-Token", '');
      //   resetRouter();
      //   // removeId();
      //   removeName();
      //   removeMobile();
      //   reject(error)
      // })
    })
  },

  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      // logout(state.token).then(() => {
      logout({access_token: getToken()}).then(() => {
        commit('SET_ID', '');
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_NAME', '');
        commit('SET_MOBILE', '');
        commit('SET_CITY', []);
        commit('SET_CITYSELECTED', '');
        removeCitySelected();
        removeCity();
        removeToken();
        sessionStorage.setItem("Admin-Token", '');
        resetRouter();
        // removeId();
        removeName();
        removeMobile();
        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })
        resolve()
      }).catch(error => {
        commit('SET_ID', '');
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        commit('SET_NAME', '');
        commit('SET_MOBILE', '');
        commit('SET_CITY', []);
        removeToken();
        removeCitySelected();
        removeCity();
        sessionStorage.setItem("Admin-Token", '');
        resetRouter();
        // removeId();
        removeName();
        removeMobile();
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '');
      commit('SET_ROLES', []);
      // commit('SET_ID', '');
      commit('SET_NAME', '');
      commit('SET_CITY', []);
      removeToken();
      removeCity();
      removeCitySelected();
      sessionStorage.setItem("Admin-Token", '');
      // removeId();
      removeName();
      resolve()
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
