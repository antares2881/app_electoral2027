<template>
    <div class="row reportes-view">
        <div class="col-12" v-if="loader">
            <Loading />
        </div>

        <div class="col-12" v-else>
            <div class="card mb-3">
                <div class="card-body p-3 p-lg-4">
                    <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
                        <h6 class="mb-0">Filtros de reporte</h6>
                        <div class="d-flex flex-wrap gap-2">
                            <span class="badge badge-info-contrast px-2 py-1">Registros API: {{ totalRegistros }}</span>
                            <span class="badge badge-info-contrast px-2 py-1">Mostrados: {{ totalMostrados }}</span>
                        </div>
                    </div>

                    <div class="row g-3 align-items-end">
                        <div class="col-12 col-md-6 col-xl-4">
                            <label class="mb-1 filtro-label">Tipo de observación</label>
                            <select class="form-control form-control-sm" v-model="codigoObservacion" @change="onObservacionChange">
                                <option v-for="(item, index) in observacionesOpciones" :key="`obs-${index}`" :value="item.value">{{ item.text }}</option>
                            </select>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                            <label class="mb-1 filtro-label">Departamento</label>
                            <select class="form-control form-control-sm" v-model="filtros.departamento">
                                <option value="">Todos</option>
                                <option v-for="(item, index) in departamentosDisponibles" :key="`dep-${index}`" :value="item">{{ item }}</option>
                            </select>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                            <label class="mb-1 filtro-label">Municipio</label>
                            <select class="form-control form-control-sm" v-model="filtros.municipio" :disabled="municipiosDisponibles.length === 0">
                                <option value="">Todos</option>
                                <option v-for="(item, index) in municipiosDisponibles" :key="`mun-${index}`" :value="item">{{ item }}</option>
                            </select>
                        </div>

                        <div class="col-12 col-md-6 col-lg-4 col-xl-2">
                            <label class="mb-1 filtro-label">Comuna</label>
                            <select class="form-control form-control-sm" v-model="filtros.comuna" :disabled="comunasDisponibles.length === 0">
                                <option value="">Todas</option>
                                <option v-for="(item, index) in comunasDisponibles" :key="`com-${index}`" :value="item">{{ item }}</option>
                            </select>
                        </div>

                        <div class="col-12 col-md-6 col-lg-6 col-xl-2">
                            <label class="mb-1 filtro-label">Puesto</label>
                            <select class="form-control form-control-sm" v-model="filtros.puesto" :disabled="puestosDisponibles.length === 0">
                                <option value="">Todos</option>
                                <option v-for="(item, index) in puestosDisponibles" :key="`pue-${index}`" :value="item">{{ item }}</option>
                            </select>
                        </div>

                        <div class="col-12 col-lg-6 col-xl-8 mt-1">
                            <label class="mb-1 filtro-label">Buscar</label>
                            <input
                                type="text"
                                class="form-control form-control-sm"
                                v-model="busqueda"
                                placeholder="Buscar por Departamento, Municipio, Comuna o Puesto"
                            >
                        </div>

                        <div class="col-12 col-lg-3 col-xl-2 d-flex align-items-end mt-1">
                            <a
                                class="btn btn-sm btn-success w-100 py-2 mr-2"
                                href="#"
                                @click.prevent="descargarExcel"
                            >
                                <b-icon icon="file-earmark-excel"></b-icon>
                                Descargar excel
                            </a>
                        </div>

                        <div class="col-12 col-lg-3 col-xl-2 d-flex align-items-end mt-1">
                            <button class="btn btn-sm btn-secondary w-100 py-2" @click="getReportes">
                                <b-icon icon="arrow-clockwise"></b-icon>
                                Refrescar
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="alert alert-warning" v-if="errorMensaje">
                {{ errorMensaje }}
            </div>

            <div class="table-responsive table-wrap">
                <table class="table table-sm table-hover table-striped my-0 mb-0">
                    <thead>
                        <tr>
                            <th class="sortable" @click="ordenarPor('departamento')">
                                Departamento <span class="ml-1">{{ getIndicadorOrden('departamento') }}</span>
                            </th>
                            <th class="sortable" @click="ordenarPor('municipio')">
                                Municipio <span class="ml-1">{{ getIndicadorOrden('municipio') }}</span>
                            </th>
                            <th class="sortable" @click="ordenarPor('comuna')">
                                Comuna <span class="ml-1">{{ getIndicadorOrden('comuna') }}</span>
                            </th>
                            <th class="sortable" @click="ordenarPor('puesto')">
                                Puesto <span class="ml-1">{{ getIndicadorOrden('puesto') }}</span>
                            </th>
                            <th class="sortable" @click="ordenarPor('mesa')">
                                Mesa <span class="ml-1">{{ getIndicadorOrden('mesa') }}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in filasFiltradasYOrdenadas" :key="`row-${index}`">
                            <td>{{ item.departamento }}</td>
                            <td>{{ item.municipio }}</td>
                            <td>{{ item.comuna }}</td>
                            <td>{{ item.puesto }}</td>
                            <td>{{ item.mesa }}</td>
                        </tr>
                        <tr v-if="filasFiltradasYOrdenadas.length === 0">
                            <td colspan="5" class="text-center py-4 text-muted">No hay datos para los filtros seleccionados.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from '../Loader/Loading.vue';

export default {
    components: {
        Loading
    },
    data() {
        return {
            loader: true,
            errorMensaje: '',
            filas: [],
            busqueda: '',
            codigoObservacion: null,
            observacionesOpciones: [
                { text: 'Todos', value: null },
                { text: 'Numero de sufragantes excede el numero de votantes en formulario E-11', value: 6 },
                { text: 'Numero de votante es 0', value: 7 },
                { text: 'Numero de firmas de jurados es menor a 3', value: 8 },
                { text: 'Acta con tachaduras', value: 9 },
                { text: 'Reconteo de votos', value: 10 },
                { text: 'Votos incinerados en la mesa', value: 11 }
            ],
            filtros: {
                departamento: '',
                municipio: '',
                comuna: '',
                puesto: ''
            },
            ordenActual: {
                campo: 'departamento',
                direccion: 'asc'
            }
        };
    },
    computed: {
        totalRegistros() {
            return this.filas.length;
        },
        totalMostrados() {
            return this.filasFiltradasYOrdenadas.length;
        },
        departamentosDisponibles() {
            return this.getValoresUnicos(this.filas, 'departamento');
        },
        municipiosDisponibles() {
            const base = this.filtros.departamento
                ? this.filas.filter(item => item.departamento === this.filtros.departamento)
                : this.filas;
            return this.getValoresUnicos(base, 'municipio');
        },
        comunasDisponibles() {
            let base = this.filas;
            if (this.filtros.departamento) {
                base = base.filter(item => item.departamento === this.filtros.departamento);
            }
            if (this.filtros.municipio) {
                base = base.filter(item => item.municipio === this.filtros.municipio);
            }
            return this.getValoresUnicos(base, 'comuna');
        },
        puestosDisponibles() {
            let base = this.filas;
            if (this.filtros.departamento) {
                base = base.filter(item => item.departamento === this.filtros.departamento);
            }
            if (this.filtros.municipio) {
                base = base.filter(item => item.municipio === this.filtros.municipio);
            }
            if (this.filtros.comuna) {
                base = base.filter(item => item.comuna === this.filtros.comuna);
            }
            return this.getValoresUnicos(base, 'puesto');
        },
        filasFiltradasYOrdenadas() {
            const textoBusqueda = (this.busqueda || '').toString().toLowerCase().trim();

            let resultado = this.filas.filter(item => {
                const cumpleDepartamento = !this.filtros.departamento || item.departamento === this.filtros.departamento;
                const cumpleMunicipio = !this.filtros.municipio || item.municipio === this.filtros.municipio;
                const cumpleComuna = !this.filtros.comuna || item.comuna === this.filtros.comuna;
                const cumplePuesto = !this.filtros.puesto || item.puesto === this.filtros.puesto;

                if (!textoBusqueda) {
                    return cumpleDepartamento && cumpleMunicipio && cumpleComuna && cumplePuesto;
                }

                const coincideBusqueda = [item.departamento, item.municipio, item.comuna, item.puesto, item.mesa]
                    .map(valor => (valor || '').toString().toLowerCase())
                    .some(valor => valor.includes(textoBusqueda));

                return cumpleDepartamento && cumpleMunicipio && cumpleComuna && cumplePuesto && coincideBusqueda;
            });

            resultado.sort((a, b) => {
                const valorA = (a[this.ordenActual.campo] || '').toString();
                const valorB = (b[this.ordenActual.campo] || '').toString();

                if (this.ordenActual.direccion === 'asc') {
                    return valorA.localeCompare(valorB);
                }
                return valorB.localeCompare(valorA);
            });

            return resultado;
        },
        urlDescargaExcel() {
            const params = new URLSearchParams();

            if (this.codigoObservacion !== null && this.codigoObservacion !== undefined && this.codigoObservacion !== '') {
                params.set('codigo_observacion', this.codigoObservacion);
            }

            if (this.filtros.departamento) {
                params.set('departamento', this.filtros.departamento);
            }
            if (this.filtros.municipio) {
                params.set('municipio', this.filtros.municipio);
            }
            if (this.filtros.comuna) {
                params.set('comuna', this.filtros.comuna);
            }
            if (this.filtros.puesto) {
                params.set('puesto', this.filtros.puesto);
            }
            if ((this.busqueda || '').toString().trim()) {
                params.set('busqueda', this.busqueda.toString().trim());
            }

            const endpoint = this.codigoObservacion !== null && this.codigoObservacion !== undefined && this.codigoObservacion !== ''
                ? `api/preconteo-observaciones/${this.codigoObservacion}/excel`
                : 'api/preconteo-observaciones/excel';

            const query = params.toString();
            return query ? `${endpoint}?${query}` : endpoint;
        }
    },
    watch: {
        'filtros.departamento'() {
            this.filtros.municipio = '';
            this.filtros.comuna = '';
            this.filtros.puesto = '';
        },
        'filtros.municipio'() {
            this.filtros.comuna = '';
            this.filtros.puesto = '';
        },
        'filtros.comuna'() {
            this.filtros.puesto = '';
        }
    },
    mounted() {
        this.getReportes();
    },
    methods: {
        getField(item, keys = []) {
            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (item[key] !== undefined && item[key] !== null && item[key] !== '') {
                    return item[key];
                }
            }
            return '';
        },
        normalizarFila(item) {
            return {
                departamento: this.getField(item, ['departamento', 'dpto', 'desc_dpto', 'nombre_departamento']),
                municipio: this.getField(item, ['municipio', 'mcpio', 'desc_mcpio', 'nombre_municipio']),
                comuna: this.getField(item, ['comuna', 'nombre_comuna']),
                puesto: this.getField(item, ['puesto', 'nombre_puesto', 'lugar']),
                mesa: this.getField(item, ['mesa', 'numero_mesa', 'num_mesa'])
            };
        },
        extractArray(data) {
            if (Array.isArray(data)) {
                return data;
            }

            const llavesPosibles = ['data', 'observaciones', 'resultado', 'resultados', 'items', 'rows', 'registros'];
            for (let i = 0; i < llavesPosibles.length; i++) {
                const llave = llavesPosibles[i];
                if (Array.isArray(data[llave])) {
                    return data[llave];
                }
            }

            const primerArray = Object.values(data || {}).find(valor => Array.isArray(valor));
            return primerArray || [];
        },
        getValoresUnicos(items, key) {
            const unicos = new Set(
                (items || [])
                    .map(item => (item[key] || '').toString().trim())
                    .filter(valor => !!valor)
            );

            return [...unicos].sort((a, b) => a.localeCompare(b));
        },
        getReportes() {
            this.loader = true;
            this.errorMensaje = '';

            const endpoint = this.codigoObservacion !== null && this.codigoObservacion !== undefined && this.codigoObservacion !== ''
                ? `api/preconteo-observaciones/${this.codigoObservacion}`
                : 'api/preconteo-observaciones';

            axios.get(endpoint, {
                headers: {
                    Authorization: `Bearer ${this.$store.state.user.token}`
                }
            })
                .then(res => {
                    console.log('Respuesta API:', res.data);
                    const base = this.extractArray(res.data);

                    this.filas = (base || [])
                        .filter(item => typeof item === 'object' && item !== null)
                        .map(item => this.normalizarFila(item))
                        .filter(item => item.departamento || item.municipio || item.comuna || item.puesto || item.mesa);
                })
                .catch(() => {
                    this.filas = [];
                    this.errorMensaje = `No fue posible cargar los reportes desde ${endpoint}`;
                })
                .finally(() => {
                    this.loader = false;
                });
        },
        async descargarExcel() {
            this.errorMensaje = '';

            try {
                const respuesta = await axios.get(this.urlDescargaExcel, {
                    responseType: 'blob',
                    headers: {
                        Authorization: `Bearer ${this.$store.state.user.token}`
                    }
                });

                const tipo = (respuesta.headers && respuesta.headers['content-type'])
                    ? respuesta.headers['content-type']
                    : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

                const blob = new Blob([respuesta.data], { type: tipo });
                const url = window.URL.createObjectURL(blob);
                const enlace = document.createElement('a');
                enlace.href = url;
                enlace.download = `preconteo_observaciones.xlsx`;
                document.body.appendChild(enlace);
                enlace.click();
                document.body.removeChild(enlace);
                window.URL.revokeObjectURL(url);
            } catch (error) {
                this.errorMensaje = 'No fue posible descargar el Excel con los filtros seleccionados.';
            }
        },
        onObservacionChange() {
            this.filtros.departamento = '';
            this.filtros.municipio = '';
            this.filtros.comuna = '';
            this.filtros.puesto = '';
            this.busqueda = '';
            this.getReportes();
        },
        ordenarPor(campo) {
            if (this.ordenActual.campo === campo) {
                this.ordenActual.direccion = this.ordenActual.direccion === 'asc' ? 'desc' : 'asc';
            } else {
                this.ordenActual.campo = campo;
                this.ordenActual.direccion = 'asc';
            }
        },
        getIndicadorOrden(campo) {
            if (this.ordenActual.campo !== campo) {
                return '↕';
            }
            return this.ordenActual.direccion === 'asc' ? '↑' : '↓';
        }
    }
};
</script>

<style scoped>
.reportes-view {
    font-size: 0.95rem;
}

.filtro-label {
    font-size: 0.84rem;
    font-weight: 600;
}

.badge-info-contrast {
    background-color: #e9ecef;
    color: #1f2937;
    border: 1px solid #cfd4da;
    font-weight: 600;
}

.table-wrap {
    max-height: 62vh;
}

.table-wrap thead th {
    position: sticky;
    top: 0;
    background: var(--bs-body-bg);
    z-index: 2;
}

.sortable {
    cursor: pointer;
    user-select: none;
}
</style>