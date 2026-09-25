<template>
    <b-modal ref="subcoordinadores" size="xl" hide-footer :title="title + ' Sub Coordinador'">
        <div class="row">
            <div class="col-md-4" v-if="!editar">
                <Persona @setPersona="setPersona" />
            </div>
            <div class="col-md-4">
                <label for="nombres">Nombres</label>
                <input type="text" id="nombres" class="form-control" v-model="subcoordinador.nombres">
            </div>
            <div class="col-md-4">
                <label for="apellidos">Apellidos</label>
                <input type="text" id="apellidos" class="form-control" v-model="subcoordinador.apellidos">
            </div>
            <div class="col-md-4 mb-2">
                <label for="fecha_nac">Fecha nacimiento</label>
                <input type="date" id="fecha_nac" class="form-control" v-model="subcoordinador.fecha_nac">
            </div>
            <div class="col-md-4 mb-2">
                <label for="direccion">Direccion</label>
                <input type="text" class="form-control" id="direccion" v-model="subcoordinador.direccion">
            </div>
            <div class="col-md-4 mb-2">
                <label for="barrio">Barrio</label>
                <input type="text" class="form-control" id="barrio" v-model="subcoordinador.barrio">
            </div>
            <div class="col-md-4 mb-2">
                <label for="telefono">Telefono</label>
                <input type="text" class="form-control" id="telefono" v-model="subcoordinador.telefono">
            </div>
            <div class="col-md-4 mb-2">
                <label for="correo">Correo electronico</label>
                <input type="email" class="form-control" id="correo" v-model="subcoordinador.correo">
            </div>
            <div class="col-md-4 mb-2">
                <label for="observaciones">Observacion</label>
                <input type="text" class="form-control" id="observaciones" v-model="subcoordinador.observaciones">
            </div>
            <div class="col-md-4 mb-2">
                <label for="empleado">Empleado</label>
                <select  id="empleado" class="form-control" v-model="subcoordinador.empleado">
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                </select>
            </div>
            <div class="col-md-12 mb-2">
                <label for="perfil">Perfil</label>
                <textarea id="perfil" v-model="subcoordinador.perfil" class="form-control"></textarea>
            </div>
            <div class="col-md-12" v-if="errors">
                <p class="alert alert-danger">{{ errores }}</p>
            </div>
            <div class="col-md-12 mt-3">
                <button class="btn btn-warning mr-2" v-if="editar" @click="update">Actualizar</button>
                <button class="btn btn-success mr-2" v-else @click="create">Guardar</button>
                <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
            </div>
        </div>
    </b-modal>
</template>
<script>
    import Persona from '../../Persona/Persona.vue'
    import axios from 'axios'
    export default{
        components: {
            Persona
        },
        data(){
            return{
                subcoordinador: {},
                editar: false,
                errores: '',
                errors: false,
                index: null,
                title: null
            }
        },
        methods:{
            cancelar(){
                this.$refs['subcoordinadores'].hide()
            },
            create(){
                this.errors = false
                this.subcoordinador.candidato_id = this.$store.state.user.candidato_id
                axios.post(`api/subcoordinadores`, this.subcoordinador,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        if(res.data.status === 'success'){
                            this.$refs['subcoordinadores'].hide()
                            this.$store.commit('setSubCoordinadores', res.data.subcoordinador)
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            editSubCoordinador(item, index){
                this.editar = true;
                this.subcoordinador = Object.assign({}, item);
                this.title = 'Editar';
                this.index = index;
                this.$refs['subcoordinadores'].show();
            },
            newSubCoordinador(){
                this.subcoordinador = {}
                this.editar = false;
                this.title = 'Nuevo';
                this.$refs['subcoordinadores'].show();
            },
            setPersona(){                
                const persona = this.getPersona     
                this.$set(this.subcoordinador, 'id', persona.cedula)
                this.$set(this.subcoordinador, 'nombres', persona.nom1 + ' ' + persona.nom2)
                this.$set(this.subcoordinador, 'apellidos', persona.ape1 + ' ' + persona.ape2)
                this.$set(this.subcoordinador, 'fecha_nac', persona.fecha_nac )                
            },
            update(){
                this.errors = false
                axios.put(`api/subcoordinadores/${this.subcoordinador.id}`, this.subcoordinador,  {
                    headers: {
                        "Authorization": `Bearer ${this.$store.state.user.token}`
                    }
                })
                    .then(res => {
                        // console.log(res.data)
                        if(res.data.status === 'success'){
                            this.$refs['subcoordinadores'].hide()
                            this.$store.commit('deleteSubCoordinador', this.index)
                            this.$store.commit('setSubCoordinadores', res.data.subcoordinador)
                        }else{
                            this.errores = res.data
                            this.errors = true
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }
        },
        computed:{
            getPersona(){                
                return this.$store.getters.getPersona
            }
        }
    }
</script>