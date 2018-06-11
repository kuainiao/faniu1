import Vue from 'vue'
import Router from 'vue-router'

import login from '@/pages/login'
import manage from '@/pages/manage'
import home from '@/pages/home'
import materialList from '@/pages/materialList'
import newMaterial from '@/pages/newMaterial'
import chooseArticle from '@/pages/chooseArticle'
import modle from '@/pages/modle'
import modleeditor from '@/pages/modleeditor'
import consult from'@/pages/consult'
import consultdetail from '@/pages/consultdetail'
import consultwechat from '@/pages/consultwechat'
import consultwechatdetail from '@/pages/consultwechatdetail'
import consultadmin from '@/pages/consultadmin'
import consultadmindetail from '@/pages/consultadmindetail'
import welink from '@/pages/welink'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '',
      redirect: { name: 'login' }
    },
    {
      path: '/',
      redirect: { name: 'login' }
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/home',
      name: 'home',
      component: home
    },
    {
      path: '/manage',
      name: 'manage',
      component: manage,
      redirect: {name: 'materialList'},
      children: [
        {
          path: '/materialList',
          name: 'materialList',
          component: materialList
        },
        {
          path: '/newMaterial',
          name: 'newMaterial',
          component: newMaterial
        },
        {
          path: '/chooseArticle',
          name: 'chooseArticle',
          component: chooseArticle
        },
        {
          path: '/modle',
          name: 'modle',
          component: modle
        },
        {
          path: '/modleeditor',
          name: 'modleeditor',
          component: modleeditor
        },
        {
          path: '/consult',
          name: 'consult',
          component: consult
        },
        {
          path: '/consultdetail',
          name: 'consultdetail',
          component: consultdetail
        },
        {
          path: '/consultwechat',
          name: 'consultwechat',
          component: consultwechat
        },
        {
          path: '/consultwechatdetail',
          name: 'consultwechatdetail',
          component: consultwechatdetail
        },
        {
          path: '/consultadmin',
          name: 'consultadmin',
          component: consultadmin
        },
        {
          path: '/consultadmindetail',
          name: 'consultadmindetail',
          component: consultadmindetail
        },
        {
          path: '/welink',
          name: 'welink',
          component: welink
        }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  next()
})
export default router
