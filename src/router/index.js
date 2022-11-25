import Vue from 'vue'
import VueRouter from 'vue-router'
// import { component } from 'vue/types/umd'
// import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
		path: '/home',
		component: () => import(/* webpackChunkName: "about" */ '../views/HomeView.vue')
	},
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
		path: '/register',
		component: () => import(/* webpackChunkName: "about" */ '../views/Register.vue')
	},
  {
    path: '/profile',
    name: 'profile',
    component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
  },
  {
		path: '/detail/:key',
    name:'detail',
		component: () => import(/* webpackChunkName: "about" */ '../views/Detail.vue')
	},
  {
		path: '/setting',
    name:'setting',
		component: () => import(/* webpackChunkName: "about" */ '../views/Setting.vue')
	},
  {
		path: '/chat',
    name:'chat',
		component: () => import(/* webpackChunkName: "about" */ '../views/Chat.vue')
	},
  {
		path: '/chat/:id',
    name:'chatDetail',
		component: () => import(/* webpackChunkName: "about" */ '../views/ChatBox.vue')
	},
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
