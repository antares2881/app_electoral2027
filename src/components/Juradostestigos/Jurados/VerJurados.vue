<template>
    <div>
        <div v-if="loader">
            <Loading />
        </div>
        <div v-else>
            <h4>Jurados: {{total}}</h4>
            <div class="row scroll" v-if="jurados.length > 0">
                <div class="col-12 col-sm-4 my-2" v-for="(item, index) in jurados" :key="index">
                    <b-card
                        border-variant="secondary"
                        :header="item.municipio"
                        header-border-variant="secondary"
                        align="center"
                    >
                        <b-card-text>
                            <h6>{{item.nombre_puesto}}</h6>
                            <h3><strong>{{item.total}}</strong></h3>
                        </b-card-text>
                    </b-card>
                </div>
            </div>
            <div class="row" v-else>
                <div class="col-12">
                    <p class="alert alert-info">No hay jurados agregados.</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import axios from 'axios'
    import Loading from '../../Loader/Loading.vue'
    export default {
        components: {
            Loading
        },
        data(){
            return{

                jurados: [],
                loader: true,
                total: 0
            }
        },
        mounted(){
            this.getJurados()
        },
        methods: {
            getJurados(){
                axios.get('api/jurados-agrupados', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        if(res.data.status === 'success'){
                            this.jurados = res.data.jurados
                            for (let i = 0; i < this.jurados.length; i++) {
                                this.total += this.jurados[i].total                    
                            }
                        }
                        this.loader = false
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        }

    }
</script>
<style scoped>
    .scroll{
        /* display: block; */
        overflow-x: auto;
        white-space: nowrap;
        height: 500px;
    }
</style>
