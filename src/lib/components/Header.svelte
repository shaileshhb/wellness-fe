<script>
  import {
    Navbar,
    Nav,
    NavItem,
    Collapse,
    NavbarToggler,
  } from "@sveltestrap/sveltestrap";
  import { link, location } from "svelte-spa-router";

  let isOpen = false;

  function toggle() {
    isOpen = !isOpen;
  }

  // Reactive statement to check active route
  $: currentPath = $location;
</script>

<Navbar color="primary" dark expand="md" class="mb-3">
  <a class="navbar-brand" href="/" use:link> FE Wellness </a>
  <NavbarToggler on:click={toggle} />
  <Collapse {isOpen} navbar expand="md">
    <Nav class="ms-auto" navbar>
      <NavItem>
        <a
          class="nav-link {currentPath === '/' ? 'active' : ''}"
          href="/"
          use:link>
          Exercises
        </a>
      </NavItem>
    </Nav>
  </Collapse>
</Navbar>
