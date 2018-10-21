const api = "api/"

Vue.component('show-job', {
  data() {
    return {
      job: []
    }
  },
  methods: {
    getJob() {
      this.job = []
      axios.get(api + this.$route.params.id).then(response => {
        console.log(response.data);
        if (response.data != null) {
          this.job = response.data
        }
      })
      .catch((error) => {
        console.log(error);
      });
    }
  },
  watch: {
    '$route.params.id'() {
      this.getJob()
    }
  },
  mounted() {
    this.getJob()
  },
  template: `<div>
    <br>
    <div v-if="job.length">
    <h1 class="display-3">{{ job[0].title }}</h1>
    <p><strong>{{ job[0].employer }}</strong></p>
    <div v-html="job[0].body"></div>
    </div>
    <p class="lead" v-else>Вакансии с таким id нет :(</p>
    </div>`
})