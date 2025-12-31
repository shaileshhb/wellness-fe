<script>
  import Router from 'svelte-spa-router';
  import Header from './lib/components/Header.svelte';
  import Exercises from './routes/Exercises.svelte';
  import ExerciseDetail from './routes/ExerciseDetail.svelte';

  // Define routes
  const routes = {
    '/': Exercises,
    '/exercises/:id': ExerciseDetail,
  };
</script>

<div id="app-wrapper">
  <Header />
  
  <main class="main-content">
    <Router {routes} />
  </main>
</div>

<style>
  #app-wrapper {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
</style>

