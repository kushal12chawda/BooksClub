import login from './components/login.js'
import register from './components/register.js'
import userdashboard from './components/userdashboard.js'
import adminboard from './components/adminboard.js'
import cat from './components/categories.js'
import book from './components/book.js'
import search from './components/search.js'
import searchbox from './components/searchbox.js'
import my_acc from './components/my_account.js'
import stats from './components/stats.js'
import admin_cat from './components/admin_category.js'
import adminsearchbox from './components/adminsearchbox.js'
import adminsearch from './components/adminsearch.js'
import admin_book from './components/admin_book.js'
import inbox from './components/inbox.js'
import admin_stats from './components/admin_stats.js'



const routes = [
    {
        path: '/', 
        components: {
            Login: login
        }
    },
    {
        path: '/register', 
        components: {
            Register: register
        }    
    },
    {
        path: '/userdashboard', 
        components: {
            Userdashboard: userdashboard
        }    
    },
    {
        path: '/adminboard', 
        components: {
            adminboard: adminboard
        }    
    },
    {
        path: '/cat', 
        component: cat
    },
    {
        path: '/book/:id', 
        component: book
    },
    {
        path: '/search/:name', 
        component: search
    },
    {
        path: '/adminsearch/:name', 
        component: adminsearch
    },
    {
        path: '/searchbox', 
        component: searchbox
    },
    {
        path: '/adminsearchbox', 
        component: adminsearchbox
    },
    {
        path: '/my_acc', 
        component: my_acc
    },
    {
        path: '/stats', 
        component: stats
    },
    {
        path: '/admin_cat', 
        component: admin_cat
    },
    {
        path: '/category/:id', 
        component: admin_book
    },
    {
        path: '/inbox', 
        component: inbox
    },
    {
        path: '/admin_stats', 
        component: admin_stats
    },
]

export default new VueRouter({
    routes,
})