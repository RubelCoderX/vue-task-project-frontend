import HomeVIew from '@/view/HomeVIew.vue'
import LoginView from '@/view/LoginView.vue'
import ProjectsView from '@/view/ProjectsView.vue'
import RegisterView from '@/view/RegisterView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeVIew,
    },
    {
      path: '/projects',
      name: 'Projects',
      component: ProjectsView,
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView,
    },
  ],
})

export default router
