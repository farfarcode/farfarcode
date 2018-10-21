export const router = new VueRouter({
  routes: [
    {
      path: '/',
      name: 'home',
      component: 'paginated-data'
    },
    {
      path: '/job/:id',
      name: 'job',
      component: 'show-job'
    },
    {
      path: '/postjob',
      name: 'postjob',
      component: 'post-job'
    },
    {
      path: '*',
      name: 'NotFound',
      component: 'NotFound'
    }
  ]
})
