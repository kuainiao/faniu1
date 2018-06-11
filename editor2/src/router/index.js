import Vue from 'vue'
import Router from 'vue-router'
import login from '@/pages/login'
import manage from '@/pages/manage'
// import home from '@/pages/home'
import articleManage from '@/pages/articleManage'
import newArticleMaterial from '@/pages/newArticleMaterial'
import classManage from '@/pages/classManage'
import addClass from '@/pages/addClass'
import imgManage from '@/pages/imgManage'

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
    // {
    //   path: '/home',
    //   name: 'home',
    //   component: home
    // },
    {
      path: '/manage',
      name: 'manage',
      component: manage,
      redirect: {name: 'articleManage'},
      children: [
        {
          path: '/articleManage',
          name: 'articleManage',
          component: articleManage
        },
        {
          path: '/newArticleMaterial',
          name: 'newArticleMaterial',
          component: newArticleMaterial
        },
        {
          path: '/classManage',
          name: 'classManage',
          component: classManage
        },
        {
          path: '/addClass',
          name: 'addClass',
          component: addClass
        },
        {
          path: '/imgManage',
          name: 'imgManage',
          component: imgManage
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
