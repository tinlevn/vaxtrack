import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView    from '@/views/HomeView.vue'
import ScheduleView from '@/views/ScheduleView.vue'
import InfoView    from '@/views/InfoView.vue'
import DetailView  from '@/views/DetailView.vue'

const routes = [
  { path: '/',            name: 'home',     component: HomeView },
  { path: '/schedule',   name: 'schedule', component: ScheduleView },
  { path: '/info',       name: 'info',     component: InfoView },
  { path: '/visit/:id',  name: 'detail',   component: DetailView,  props: true },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router

