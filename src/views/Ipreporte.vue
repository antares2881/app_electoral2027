<template>
    <a-card :bordered="false" class="header-solid h-full" :bodyStyle="{padding: 0,}" >
        <b-modal ref="password" hide-footer no-close-on-backdrop title="Verificacion de contraseña">
            <div class="row">
                <div class="col-12">
                    <label for="password">Digite clave de acceso</label>
                    <input type="text" class="form-control" id="password" v-model="claveIngresada">
                </div>
                <div class="col-12 my-3">
                    <button class="btn btn-danger" @click="entriePassword">Verificar</button>
                </div>
                <b-alert show variant="danger" v-if="noVerify">La clave no es correcta</b-alert>
            </div>
        </b-modal>
        <template #title>
            <h5>Reporte de Ip</h5>
            <div class="table-responsive tabla" v-if="reporteIps.length > 0">
                <table class="table table-hover">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Reporte</th>
                            <th>Ip cliente</th>
                            <th>Usario</th>
                            <th>Fecha</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item, index in reporteIps" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td>{{ item.desc_reporte }}</td>
                            <td>{{ item.ip_server }}</td>
                            <td>{{ item.name }} - {{ item.username }}</td>
                            <td>{{ item.created_at }}</td>
                        </tr>
                    </tbody>
                </table>                
            </div>
            <div v-else>
                <b-alert show variant="info">No hay informacion para mostrar</b-alert>
            </div>
        </template>
    </a-card>
</template>
<script>
    import axios from 'axios';
    export default {
        data(){
            return{
                clave: 'Xf*0203Pj=',
                noVerify: false,
                reporteIps: [],
                claveIngresada: null,
            }
        },
        mounted(){
            this.showPassword();                    
        },
        methods: {
            entriePassword(){

                if(this.clave === this.claveIngresada){
                    this.getIps();
                    this.$refs['password'].hide();
                }else{
                    this.noVerify = true;
                } 
            },
            getIps(){
                this.reporteIps = [];
                axios.get('api/ipreportes', {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        if(res.data.ips.length > 0){
                            this.reporteIps = res.data.ips;
                        }
                    })
                    .catch(err => console.log(err))
            },
            showPassword(){
                this.$refs['password'].show();                
            },
        }
    }
</script>