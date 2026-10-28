import { createRouter, createWebHistory } from 'vue-router'
import LayerPanelLayout from '@/core/views/LayerPanelLayout.vue'
// import HomeView from '../views/HomeView.vue'

const routes = [
  // {
  //   path: '/',
  //   name: 'home',
  //   component: HomeView
  // },
  {
    path: '/layers',
    name: 'layers',
    component: LayerPanelLayout
  }
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import('../views/About.vue')
  // }
]

const router = createRouter({
  //   history: createWebHistory(process.env.BASE_URL),
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes
})

export default router
