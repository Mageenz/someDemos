import vue from 'vue'
import VueRouter from 'vue-router'

vue.use(VueRouter)

const routes = [
  {
    path: '/canlendar',
    name: 'canlendar',
    meta: {
      name: '房态'
    }
  },
  {
    path: '/accommodation',
    name: 'accommodation',
    meta: {
      name: '房态完整'
    }
  },
  {
    path: '/video',
    name: 'video',
    meta: {
      name: '视频尺寸的变化'
    }
  },
  {
    path: '/atlas',
    name: 'atlas',
    meta: {
      name: '图谱'
    }
  }
]

const router = new VueRouter({
  routes: routes.map(route => {
    return {
     ...route,
      component: () => import(`./views/${route.name}/index.vue`)
    }
  }).concat([
    {
      path: '/',
      name: 'layout',
      meta: {
        name: '主页'
      },
      component: () => import('./components/layout/index.vue')
    },
  ])
})

export {router, routes}