const api = "api/"

Vue.component('paginated-data', {
  data() {
    return {
      jobs: [],
      pageSize: 10,
      pageNumber: 0,
      startFrom: 0,
      distance: 5
    }
  },
  methods: {
    goJob(id) {
      this.$router.push({ path: `/job/${id}` })
    },
    selectPage(n) {
      this.pageNumber = n
    },
    paginatedData() {
      const start = this.pageNumber * this.pageSize,
            end   = start + this.pageSize
      return this.jobs.slice(start, end)
    }
  },
  computed: {
    pageCount() {
      return Math.ceil(this.jobs.length / this.pageSize)
    },
    listPageNumbers() {
      list = Array.apply(null, {length: this.pageCount}).map(Function.call, Number)
      //if (this.pageCount - this.pageNumber+1 > 5) {
      return list.slice(this.startFrom, this.startFrom + this.distance)
    }
  },
  template: `<div>   
             <br>  
             <div class="jumbotron">
             <h1 class="display-4">Привет, Мир!</h1>

             <p class="lead">Мы открылись<i class="em em-confetti_ball"></i> и рады помочь Вам<i class="em em-hearts"></i> найти работу мечты<i class="em em-dizzy"></i> или привлечь новых сотрудников!<i class="em em-blond-haired-man"></i><i class="em em-blond-haired-woman"></i></p>
             <hr class="my-4">
             <p class="lead align-text-bottom" style="display:inline-block;">Следуйте за нами в социальных сетях:</p>
             <div class="icons8-vk"></div>
             <div class="icons8-medium"></div>
             <div class="icons8-github"></div>
             </div>

             <table class="table table-hover">
             <thead>
             <tr>
             <th style="border-top: hidden;" scope="row">Доступно {{ jobs.length }} отличных предложений:</th>
             </tr>
             </thead>
             <tbody>
             <tr v-for="p in paginatedData()" v-on:click="goJob(p.id)">
             <td><p class="lead">{{ p.title }} <span class="badge badge-pill badge-light">Удаленно</span></p>{{ p.employer }}</td>
             </tr>
             </tbody>
             </table>
             <div class="btn-group d-flex justify-content-center" role="group" aria-label="Basic example">
             <button v-if="startFrom >= 5" v-on:click="startFrom-=distance" type="button" class="btn btn-secondary">...</button>
             <button v-for="n in listPageNumbers" v-on:click="selectPage(n)" type="button" class="btn btn-secondary">{{ n + 1 }}</button>
             <button v-if="pageCount > 5" v-on:click="startFrom+=distance" type="button" class="btn btn-secondary">...</button>
             </div>
             </div>`,
  mounted() {
    axios.get(api).then(response => {
      this.jobs = response.data
    })
    .catch((error) => {
      console.log(error);
    });
  }
})