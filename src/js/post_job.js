const api = "api/"

Vue.component('post-job', {
  data() {
    return {
      form: {
        title: '',
        body: '',
        ref: '',
        employer: '',
        website: '',
        contacts: ''
      },
      errors: [],
      input: "# hello"
    }
  },
  computed: {
    compiledMarkdown: function() {
      return marked(this.input, { sanitize: true })
    }
  },
  methods: {
    clearForm() {
      this.form.title = this.form.body = this.form.ref = this.form.employer = this.form.website = this.form.contacts = ''
      this.errors = []
    },
    checkForm: function(e) {
      if (this.form.title && this.form.body && this.form.employer && this.form.website && this.form.contacts) {
        this.submitData()
        e.preventDefault()
        return true
      }

      this.errors = []

      if (!this.form.title) {
        this.errors.push("Требуется указать название вакансии.")
      }
      if (!this.form.body) {
        this.errors.push("Требуется указать описание вакансии.")
      }
      if (!this.form.employer) {
        this.errors.push("Требуется указать название компании.")
      }
      if (!this.form.contacts) {
        this.errors.push("Требуется указать контакты.")
      }
      console.log(this.errors)
      e.preventDefault()
    },
    submitData() {
      axios.post(api, JSON.stringify(this.form))
        .then((response) => {
          console.log(response);
          $('#successModal').modal()
          this.clearForm()
        })
        .catch((error) => {
          console.log(error);
        });
    },
    update: _.debounce(function (e) {
      this.input = e.target.value
      this.form.body = marked(this.input, { sanitize: true })
    }, 300)
  },
  template: `<div>
  <h1 class="display-3">Новая вакансия*</h1>
  <p><small class="text-muted">*Обратите внимание, мы специализируемся только на вакансиях, с возможностью удаленной занятости.</small></p>
  <form v-on:submit="checkForm" method="POST">
  <div class="form-group row">
    <label for="titleForm" class="col-sm-2 col-form-label">Название</label>
    <div class="col-md-6">
      <input v-model="form.title" type="text" class="form-control" id="titleForm" name="title" placeholder="Введите название">   
    </div>
  </div>
  <div class="form-group row">
    <label for="bodyForm" class="col-sm-2 col-form-label">Описание</label>
    <div class="col-md-6">
      <!-- <textarea v-model="form.body" class="form-control" id="bodyForm" name="body" rows="8" placeholder="Опишите вакансию (условия работы, требования к соискателям и т.д.)"></textarea> -->
      <small class="text-muted">Markdown-разметка:</small>
      <div id="editor">
        <textarea v-on:input="update"></textarea>
        <div v-html="compiledMarkdown"></div>
      </div>
    </div>
  </div>
  <div class="form-group row">
    <label for="refForm" class="col-sm-2 col-form-label">Ссылка на вакансию</label>
    <div class="col-md-6">
      <input v-model="form.ref" type="text" class="form-control" id="refForm" name="ref" placeholder="URL">
    </div>
  </div>
  <h1 class="display-4">О компании</h1>
  <div class="form-group row">
    <label for="employerForm" class="col-sm-2 col-form-label">Название компании</label>
    <div class="col-md-6">
      <input v-model="form.employer" type="text" class="form-control" id="employerForm" name="employer" placeholder="Введите название">
    </div>
  </div>
  <div class="form-group row">
    <label for="websiteForm" class="col-sm-2 col-form-label">Вебсайт компании</label>
    <div class="col-md-6">
      <input v-model="form.website" type="text" class="form-control" id="websiteForm" name="website" placeholder="URL">
    </div>
  </div>
  <div class="form-group row">
    <label for="contactsForm" class="col-sm-2 col-form-label">Контакты</label>
    <div class="col-md-6">
      <textarea v-model="form.contacts" class="form-control" id="contactsForm" name="contacts" rows="3" placeholder="Опишите как соискателям связаться с Вами"></textarea>
    </div>
  </div>
  <p v-if="errors.length">  
    <b>Пожалуйста исправьте следующие ошибки:</b>
    <ul>
      <li v-for="err in errors">{{ err }}</li>
    </ul>
  </p>
  <button type="submit" class="btn btn-primary">Отправить</button>
  </form>

  <div id="successModal" class="modal fade">
  <div class="modal-dialog">
  <div class="modal-content">
  <div class="modal-header">
  <h5 class="modal-title">Отличная работа!</h5>
  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </button>
  </div>
  <div class="modal-body">Ваша вакансия будет доступна через 15 минут! Спасибо за использование сервиса :)</div>
  <div class="modal-footer"><button class="btn btn-default" type="button" data-dismiss="modal">Закрыть</button></div>
  </div>
  </div>
  </div>
  
  </div>`
})