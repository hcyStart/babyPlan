const routers = [
    {
        path: '/',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/login',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
        path: '/tables',
        meta: {
            title: 'table'
        },
        component: (resolve) => require(['./views/tables.vue'], resolve)
    },
    {
        path: '/table',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/table.vue'], resolve)
    },
    {
        path: '/manage',
        meta: {
            title: ''
        },
        component: (resolve) => require(['./views/manage.vue'], resolve)
    }

];
export default routers;
