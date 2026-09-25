import axios from "axios";

export function initialize(store, router){
    router.beforeEach((to, from, next) => {

        const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
        const currentUser = store.state.user
        
        //Proteger admin con role de administrador.
        const requiresSuperAdmin = to.matched.some(record => record.meta.isSuperAdmin) 
        // const roleFirm = to.matched.some(record => record.meta.isFirm) 

        if (requiresAuth && !currentUser) {
            next({ name: "Home" });
        } else if(to.path == '/' && currentUser){        
            next('/dashboard');
        } else if(requiresSuperAdmin){     
            if(to.path == '/configuracion' && (currentUser.role_id === 2 || currentUser.role_id === 6 || currentUser.role_id === 7)){
                next()
            }else if(currentUser.role_id !== 1 && currentUser.role_id !== 2 && currentUser.role_id !== 4){
                store.commit('logout')
                next({name: "Home"})
            }else{
                next()
            }
        }else{
            next();
        }

      });

    axios.interceptors.response.use(null, (error) => {
        if(error.response && error.response.status === 401){
            store.commit('logout');
            router.push('/');
        }

        return Promise.reject(error);
    });
}
