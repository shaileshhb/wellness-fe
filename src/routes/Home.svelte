<script>
  import { Container, Row, Col, Button } from '@sveltestrap/sveltestrap';
  import Card from '../lib/components/Card.svelte';
  import { push } from 'svelte-spa-router';

  function goToAbout() {
    push('/about');
  }
</script>

<Container>
  <Row class="mb-5">
    <Col>
      <div class="text-center py-5">
        <h1 class="display-4 fw-bold mb-3">Welcome to FE Wellness</h1>
        <p class="lead text-muted mb-4">
          A modern demo application built with Svelte and Bootstrap
        </p>
        <Button color="primary" size="lg" on:click={goToAbout}>
          Learn More
        </Button>
      </div>
    </Col>
  </Row>

  <Row class="g-4">
    <Col md="4">
      <Card 
        title="Fast & Lightweight" 
        text="Built with Svelte for optimal performance and minimal bundle size."
      />
    </Col>
    
    <Col md="4">
      <Card 
        title="Modern UI" 
        text="Styled with Bootstrap 5 for a clean, responsive design."
      />
    </Col>
    
    <Col md="4">
      <Card 
        title="Easy to Extend" 
        text="Simple structure makes it easy to add new features and components."
      />
    </Col>
  </Row>

  <Row class="mt-5">
    <Col md="6" class="mx-auto">
      <div class="card bg-light">
        <div class="card-body">
          <h3 class="card-title">Getting Started</h3>
          <p class="card-text">
            This is a proof of concept application demonstrating how to structure
            a Svelte project with Bootstrap components using Sveltestrap.
          </p>
          <ul class="list-unstyled">
            <li>✓ Vite for fast development</li>
            <li>✓ Bootstrap 5 styling</li>
            <li>✓ SPA routing</li>
            <li>✓ Reusable components</li>
          </ul>
        </div>
      </div>
    </Col>
  </Row>
</Container>

