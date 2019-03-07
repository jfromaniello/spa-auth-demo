Vue.component('App', {
  template: `
    <v-app>
      <v-content>
        <v-container>
          <Home />
        </v-container>
      </v-content>
    </v-app>
  `
});

Vue.component('Home', {
  template: `
    <div>
      <h1>SPA OIDC Demo Application</h1>
      <p>This is an application designed to demonstrate how to authenticate a SPA when
        you also have a backend server.</p>

      <v-btn color="info" href="/login">Log in</v-btn>
    </div>
  `
});

var app = new Vue({
  el: '#app',
  template: '<App/>'
});
