<template>
    <div class="col-12" v-if="loader">
        <Loading />
    </div>
    <div class="col-12 table-responsive tabla" v-else>
        <table>
            <thead>
                <tr>
                    <th>Comando</th>
                    <th>Proyectados</th>
                    <th>No. de asistentes</th>
                    <th>Contacto</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item, index) in comandos" :key="index">
                    <td>{{item.nombre}}</td>
                    <td>{{item.proyectados}}</td>
                    <td><a target="_blank" :href="'http://127.0.0.1:8000/reporte-comandos/' + item.id +'/' + item.nombre + '/' + $store.state.user.role_id ">{{item.confirmados}}</a></td>
                    <td>{{item.contacto}}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
<script>
    import Loading from '../Loader/Loading.vue'
    import axios from 'axios';
    export default{
        components: {
            Loading
        },
        data(){
            return{
                comandos: [],
                loader: true
            }
        },
        mounted(){
            this.getAsistentesComandos()
            this.ejecutaAutomatico()
        },
        methods:{
            ejecutaAutomatico(){
                setInterval(this.getAsistentesComandos, 300000);
            },
            getAsistentesComandos(){

                this.comandos = [];
                const roleId = Number(this.$store.state.user.role_id);
                const esRolGlobal = [0, 1, 2].includes(roleId);
                const endpoint = esRolGlobal
                    ? 'api/asistentes-comandos'
                    : `api/asistentes-comandos/${this.$store.state.user.comando[0].id}`;

                axios.get(endpoint, {
					headers: {
						"Authorization": `Bearer ${this.$store.state.user.token}`
					}
				})
                .then(res => {
                    console.log(res.data)
                    this.comandos = res.data.asistencia_comandos
                    this.loader = false;
                    // console.log(res.data.asistencia_comandos)
                })
                .catch(err => {
                    console.log(err)
                    this.loader = false;
                })
            }
        }
    }
</script>
<style scoped>
    .tabla{
        display: block;
        overflow-x: auto;
        padding: 10px;
        white-space: nowrap;
        height: 500px;
    }
    table {
        border: 1px solid #000;
        width: 100%;
    }
    th, td {
        /* width: 25%; */
        text-align: left;
        vertical-align: top;
        border: 1px solid #000;
        border-collapse: collapse;
        /* padding: 0.3em; */
        caption-side: bottom;
    }
    caption {
        /* padding: 0.3em; */
        color: #fff;
        background: #000;
    }
    th {
        background: #eee;
    }
</style>
