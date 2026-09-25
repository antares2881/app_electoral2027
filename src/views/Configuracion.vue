<template>
    <div class="row">
        <div class="col-md-12">
            <span v-if="$store.state.user.candidato[0].corporacione_id !== 5">
                <button class="btn btn-success mr-2" @click="option=5" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor"/>
                    </svg>
                    Candidatos
                </button>
            </span>
            <button class="btn btn-dark mr-2" @click="option=4" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" fill="currentColor"/>
                </svg>
                Coordinadores
            </button>
            <button class="btn btn-success mr-2" @click="option=2" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 ">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                    <path d="M10 2L13 8L20 8L15 12L17 19L10 15L3 19L5 12L0 8L7 8L10 2Z" fill="currentColor"/>
                </svg>
                Lideres
            </button>
            <span v-if="$store.state.user.candidato[0].corporacione_id !== 5">
                <button class="btn btn-dark mr-2" @click="option=1" v-if="$store.state.user.role_id === 1 || $store.state.user.role_id === 2 || $store.state.user.role_id === 6 ">
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" class="me-2">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM12 7C12 8.10457 11.1046 9 10 9C8.89543 9 8 8.10457 8 7C8 5.89543 8.89543 5 10 5C11.1046 5 12 5.89543 12 7ZM9.99993 11C7.98239 11 6.24394 12.195 5.45374 13.9157C6.55403 15.192 8.18265 16 9.99998 16C11.8173 16 13.4459 15.1921 14.5462 13.9158C13.756 12.195 12.0175 11 9.99993 11Z" fill="currentColor"/>
                    </svg>
                    Usuarios
                </button>
            </span>
        </div>
        <div class="col-12 mt-3">
            <CardAdminUser v-if="option === 1"></CardAdminUser>
            <CardAdminLideres v-if="option === 2"></CardAdminLideres>
            <CardAdminRecolectores v-if="option === 3"></CardAdminRecolectores>
            <CardAdminCoordinadores v-if="option === 4"></CardAdminCoordinadores>
            <CardAdminCandidatos v-if="option === 5"></CardAdminCandidatos>
            <CardAdminSubCoordinadores v-if="option === 6"></CardAdminSubCoordinadores>
        </div>
    </div>
</template>
<script>

    import CardAdminUser from '../components/Config/CardAdminUser'
    import CardAdminLideres from '../components/Config/CardAdminLideres'
    import CardAdminRecolectores from '../components/Config/CardAdminRecolectores'
    import CardAdminCoordinadores from '../components/Config/CardAdminCoordinadores'
    import CardAdminCandidatos from '../components/Config/CardAdminCandidatos'
    import CardAdminSubCoordinadores from '../components/Config/CardAdminSubCoordinadores'

    export default {
        components:{
            CardAdminUser,
            CardAdminLideres,
            CardAdminRecolectores,
            CardAdminCoordinadores,
            CardAdminCandidatos,
            CardAdminSubCoordinadores
        },
        data() {
            return {
                option: 0
            }
        },
        methods: {
            
        },
    }
</script>
<style lang="scss">
</style>