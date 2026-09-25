<template>
    <b-modal ref="modal-jurado" hide-footer :title="title + ' jurado' " size="xl">
        <div class="row">
            <div class="col-12 col-sm-6">
                <label for="cedula">Cedula</label>
                <input type="number" class="form-control" id="cedula" v-model.number="jurado.id">
            </div>
        </div>
        <div class="row">
            <div class="col-12 col-sm-3">
                <label for="nom1">Primer nombre</label>
                <input type="text" id="nom1" class="form-control" v-model="jurado.nom1">
            </div>
            <div class="col-12 col-sm-3">
                <label for="nom2">Segundo nombre</label>
                <input type="text" id="nom2" class="form-control" v-model="jurado.nom2">
            </div>
            <div class="col-12 col-sm-3">
                <label for="ape1">Primer apellido</label>
                <input type="text" id="ape1" class="form-control" v-model="jurado.ape1">
            </div>
            <div class="col-12 col-sm-3">
                <label for="ape2">Segundo apellido</label>
                <input type="text" id="ape2" class="form-control" v-model="jurado.ape2">
            </div>
            <div class="col-12 col-sm-3">
                <label for="direccion">Direccion</label>
                <input type="text" id="direccion" class="form-control" v-model="jurado.direccion">
            </div>
            <div class="col-12 col-sm-3">
                <label for="telefono">Telefono</label>
                <input type="text" id="telefono" class="form-control" v-model="jurado.telefono">
            </div>
            <div class="col-12 col-sm-3">
                <label for="celular">Celular</label>
                <input type="text" id="celular" class="form-control" v-model="jurado.celular">
            </div>
            <div class="col-12 col-sm-3">
                <label for="correo">Correo electronico</label>
                <input type="email" id="correo" class="form-control" v-model="jurado.correo">
            </div>
            <div class="col-12 col-sm-6">
                <label for="neducativo_id">Nivel educativo</label>
                <b-select :options="nEducativos" class="form-control" id="neducativo_id" v-model="jurado.neducativo_id"></b-select>
            </div>
           <!--  <div class="col-12 col-sm-6">
                <label for="filiacionPolitica">Filiacion politica</label>
                <input type="text" id="filiacionPolitica" class="form-control" v-model="jurado.filiacionpolitica_id">
            </div> -->
           
            <div class="col-12 col-sm-6">
                <label for="tipoempleado_id">Tipo de empleado</label>
                <b-select :options="tiposEmpleados" class="form-control" id="tipoempleado_id" v-model="jurado.tipoempleado_id"></b-select>
            </div>
            <div class="col-6 col-sm-6">
                <label for="departamento">Departamento votación</label>
                <select id="departamento" class="form-control" v-model="jurado.departamento_id" @change="getMunicipio">
                    <option v-for="(item, index) in departamentos" :key="index" :value="item.id">{{ item.departamento }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-4 mb-3">
                <label for="municipio">Municipio votación</label>
                <select id="municipio" class="form-control" v-model="jurado.municipio_id" @change="getZonas">
                    <option v-for="(item, index) in municipios" :key="index" :value="item.id">{{ item.municipio }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-4 mb-3" v-if="$store.state.user.candidato[0].municipio_id === 1">
                <label for="comuna">Comuna</label>
                <b-select id="comuna" class="form-control" v-model="jurado.comuna" :options="comunas">
                </b-select>
            </div>
            <div class="col-12 col-sm-2 mb-3">
                <label for="zona">Zona</label>
                <select id="zona" v-model="jurado.zona" @change="getPuestos" class="form-control">
                    <option v-for="(zona, index) in zonas" :key="index" :value="zona.zona">{{ zona.zona }}</option>
                </select>
            </div>
            <div class="col-12 col-sm-2 mb-3">
                <label for="puesto">Puesto</label>
                <input type="text" id="puesto" class="form-control" v-model="jurado.puesto" disabled>
            </div>
            <div class="col-12 col-sm-6 mb-3">
                <label for="nombre_puesto">Puesto votación</label>
                <select id="nombre_puesto" v-model="jurado.nombre_puesto" class="form-control" @change="setPuesto">
                    <option v-for="(puesto, index) in puestos" :key="index" :value="puesto.nombre_puesto">{{ puesto.nombre_puesto }}</option>
                </select>
            </div>
            <div class="col-6 col-sm-6">
                <label for="nombre_puesto">Corregimiento</label>
                <input type="text" id="nombre_puesto" class="form-control" v-model="jurado.nombre_puesto">
            </div>
            <div class="col-12" v-if="msnError">
                <p class="alert alert-danger">{{errores}}</p>
            </div>
            <div class="col-12 my-3">
                <button class="btn btn-warning mr-2" v-if="editar" @click="update">Actualizar</button>
                <button class="btn btn-primary mr-2" v-else @click="create">Guardar</button>
                <button class="btn btn-secondary" @click="cancelar">Cancelar</button>
            </div>
        </div>
    </b-modal>
</template>
<script>

import axios from "axios";

export default {
    data() {
        return{
            departamentos: [],
            editar: false,
            errores: '',
            index: null,
            jurado: {},
            msnError: false,
            municipios: [],
            puestos: [],
            nEducativos: [],
            tiposEmpleados: [],
            title: null,
            zonas: [],
        }
    },
    mounted(){
        this.nivelesEducativos()
        this.tipoEmpleados()
        this.getDepartamentos();
    },
    methods: {
        cancelar(){
            this.$refs['modal-jurado'].hide()
        },
        create(){
            this.msnError = false
            let validator = this.validar()
            if(validator){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Todos los campos son requeridos, por favor verifica'
                })
                return
            }
            axios.post('api/jurados', this.jurado, {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
                .then(res => {
                    if(res.data.status === 'success'){
                        this.$refs['modal-jurado'].hide()
                        Swal.fire({
                            icon: 'success',
                            title: 'Agregado',
                            text: 'Jurado agregado con exito'
                        })
                        this.$store.state.jurados[this.index].jurado = res.data.jurado
                    }else{
                        this.msnError = true
                        this.errores = res.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        editarJurado(jurado){
            this.title = 'Editar'
            this.editar = true
            this.jurado = Object.assign({}, jurado)
            this.$refs['modal-jurado'].show()
        },
        getDepartamentos(){
            axios.get('/api/departamentos', {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
            .then(res => {
                // console.log(res.data)
                this.departamentos = res.data.departamentos
            })
            .catch(err => {
                console.log(err)
            })
        },
        getMunicipio(){
            const dpto = this.jurado.departamento_id
            axios.get(`/api/municipios/${dpto}`, {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
            .then(res => {
                // console.log(res.data)
                this.municipios = res.data.municipios			
                this.getZonas()	
            })
            .catch(err => {
                console.log(err)
            })
        },
        getPuestos(){
            axios.get(`/api/puestos/${this.jurado.departamento_id}/${this.jurado.municipio_id}/${this.jurado.zona}`, {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
            .then(res => {
                // console.log(res.data)
                this.puestos = res.data.puestos
                
            })
            .catch(err => {
                console.log(err)
            })
        },
        getZonas(){
            axios.get(`/api/zonas/${this.jurado.departamento_id}/${this.jurado.municipio_id}`, {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
            .then(res => {
                // console.log(res.data)
                this.zonas = res.data.zonas
                this.getPuestos()
            })
            .catch(err => {
                console.log(err)
            })
        },
        nivelesEducativos(){
            axios.get('api/neducativos', {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
                .then(res => {
                    for (let i = 0; i < res.data.niveles.length; i++) {
                        this.nEducativos.push({
                            text: res.data.niveles[i].descripcion,
                            value: res.data.niveles[i].id
                        })                        
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        nuevoJurado(item, index){
            this.index = index
            this.title = 'Nuevo'
            this.jurado = Object.assign({}, item)
            this.jurado.id = item.cedula
            this.$refs['modal-jurado'].show()
        },
        tipoEmpleados(){
            axios.get('api/tipoempleados', {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
                .then(res => {
                    for (let i = 0; i < res.data.tipos.length; i++) {
                        this.tiposEmpleados.push({
                            text: res.data.tipos[i].tipo_empleado,
                            value: res.data.tipos[i].id
                        })                        
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        
        update(){
            this.msnError = false
            let validator = this.validar()
            if(validator){
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Todos los campos son requeridos, por favor verifica'
                })
                return
            }
            axios.put(`api/jurados/${this.jurado.id}`, this.jurado, {
                headers: {
                    "Authorization": `Bearer ${this.$store.state.user.token}`
                }
            })
                .then(res => {
                    if(res.data.status === 'success'){
                        this.$refs['modal-jurado'].hide()
                        Swal.fire({
                            icon: 'success',
                            title: 'Actualizado',
                            text: 'Jurado editado con exito'
                        })
                    }else{
                        this.msnError = true
                        this.errores = res.data
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        },
        validar(){
            if(this.jurado.cedula === '' || this.jurado.cedula === null || this.jurado.nom1 === '' || this.jurado.nom1 === null || this.jurado.ape1 === '' || this.jurado.ape1 === null || this.jurado.direccion === '' || this.jurado.direccion === null || this.jurado.telefono === '' || this.jurado.telefono === null || this.jurado.celular === '' || this.jurado.celular === null || this.jurado.correo === '' || this.jurado.correo === null || this.jurado.neducativo_id === '' || this.jurado.neducativo_id === null || this.jurado.filiacionpolitica_id === '' || this.jurado.filiacionpolitica_id === null || this.jurado.tipoempleado_id === '' || this.jurado.tipoempleado_id === null || this.jurado.nombre_puesto === '' || this.jurado.nombre_puesto === null ){				
					return true
				}
				return false
        }
    }
}
</script>
<style scoped>
</style>