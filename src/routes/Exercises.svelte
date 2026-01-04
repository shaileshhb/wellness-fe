<script>
  import { onMount } from "svelte";
  import { push } from "svelte-spa-router";
  import {
    Container,
    Spinner,
    Alert,
    ListGroup,
    ListGroupItem,
    Button,
    ButtonGroup,
    Input,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
  } from "@sveltestrap/sveltestrap";
  import { exercisesService } from "../lib/services";

  // State
  let exercises = [];
  let loading = true;
  let error = null;
  let total = 0;
  let limit = 20;
  let offset = 0;
  let isSearchModalOpen = false;
  let modalSearchTerm = "";
  let modalResults = [];
  let modalLoading = false;
  let modalError = null;
  let searchDebounceTimeout;

  // Reactive computed values
  $: currentPage = Math.floor(offset / limit) + 1;
  $: totalPages = Math.ceil(total / limit);
  $: hasNextPage = offset + limit < total;
  $: hasPreviousPage = offset > 0;
  $: startItem = total > 0 ? offset + 1 : 0;
  $: endItem = Math.min(offset + limit, total);

  onMount(() => {
    fetchExercises();
  });

  async function fetchExercises() {
    try {
      loading = true;
      error = null;
      const response = await exercisesService.getExercises({
        limit,
        offset,
      });
      exercises = response.results;
      total = response.total;
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      error =
        err.response?.data?.message ||
        err.message ||
        "Failed to fetch exercises";
      console.error("Error fetching exercises:", err);
    } finally {
      loading = false;
    }
  }

  function handleExerciseClick(exerciseId) {
    push(`/exercises/${exerciseId}`);
  }

  function changePage(newOffset) {
    offset = newOffset;
    fetchExercises();
  }

  function handleLimitChange(event) {
    limit = parseInt(event.target.value);
    offset = 0;
    fetchExercises();
  }

  function openSearchModal() {
    isSearchModalOpen = true;
    modalSearchTerm = "";
    modalResults = [];
    modalError = null;
    modalLoading = false;
    clearTimeout(searchDebounceTimeout);
  }

  function closeSearchModal() {
    isSearchModalOpen = false;
    modalLoading = false;
    clearTimeout(searchDebounceTimeout);
  }

  function handleModalInput(event) {
    const term = event.target.value;
    modalSearchTerm = term;
    clearTimeout(searchDebounceTimeout);
    const trimmed = term.trim();

    if (trimmed.length <= 3) {
      modalResults = [];
      modalError = null;
      modalLoading = false;
      return;
    }

    searchDebounceTimeout = setTimeout(() => searchExercisesModal(trimmed), 800);
  }

  async function searchExercisesModal(term) {
    try {
      modalLoading = true;
      modalError = null;
      const response = await exercisesService.searchExercises({
        search: term,
        limit: 50,
      });
      modalResults = Array.isArray(response) ? response : [];
    } catch (err) {
      modalError =
        err.response?.data?.message ||
        err.message ||
        "Failed to search exercises";
      console.error("Error searching exercises:", err);
    } finally {
      modalLoading = false;
    }
  }

  function handleModalExerciseClick(exerciseId) {
    closeSearchModal();
    handleExerciseClick(exerciseId);
  }
</script>

<Container class="py-4">
  <!-- Header Section -->
  <div class="header-section mb-4">
    <div class="d-flex justify-content-between align-items-start">
      <div>
        <h1 class="display-5 fw-bold mb-2">Exercises</h1>
        <p class="text-muted mb-0">Browse and explore exercises</p>
      </div>
      {#if total > 0}
        <div class="total-count-card">
          <div class="total-count-label">Total Exercises</div>
          <div class="total-count-value">{total.toLocaleString()}</div>
        </div>
      {/if}
    </div>
    <div class="search-bar mt-3">
      <Button color="primary" on:click={openSearchModal}>
        <i class="bi bi-search"></i> Search exercises
      </Button>
    </div>
  </div>

  {#if loading}
    <!-- Loading State -->
    <div class="text-center py-5">
      <Spinner color="primary" style="width: 3rem; height: 3rem;" />
      <p class="mt-3 text-muted">Loading exercises...</p>
    </div>
  {:else if error}
    <!-- Error State -->
    <Alert color="danger">
      <h4 class="alert-heading">Error!</h4>
      <p class="mb-0">{error}</p>
    </Alert>
  {:else if exercises?.length === 0}
    <!-- Empty State -->
    <Alert color="info">
      <p class="mb-0">No exercises found.</p>
    </Alert>
  {:else}
    <!-- Pagination Controls Top -->
    <div class="pagination-controls-wrapper mb-3">
      <div class="pagination-info">
        <span class="text-muted">
          Showing <strong>{startItem}-{endItem}</strong> of
          <strong>{total.toLocaleString()}</strong>
        </span>
      </div>
      <div class="pagination-controls">
        <div class="items-per-page">
          <label for="limitSelectTop">Per page:</label>
          <Input
            type="select"
            id="limitSelectTop"
            bind:value={limit}
            on:change={handleLimitChange}
            bsSize="sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Input>
        </div>
        {#if totalPages > 1}
          <ButtonGroup size="sm">
            <Button
              color="primary"
              outline
              disabled={!hasPreviousPage}
              on:click={() => changePage(0)}
              title="First page"
            >
              <i class="bi bi-chevron-double-left"></i>
            </Button>
            <Button
              color="primary"
              outline
              disabled={!hasPreviousPage}
              on:click={() => changePage(Math.max(0, offset - limit))}
              title="Previous page"
            >
              <i class="bi bi-chevron-left"></i>
            </Button>
            <Button color="primary" disabled class="page-indicator">
              {currentPage} / {totalPages}
            </Button>
            <Button
              color="primary"
              outline
              disabled={!hasNextPage}
              on:click={() => changePage(offset + limit)}
              title="Next page"
            >
              <i class="bi bi-chevron-right"></i>
            </Button>
            <Button
              color="primary"
              outline
              disabled={!hasNextPage}
              on:click={() => changePage((totalPages - 1) * limit)}
              title="Last page"
            >
              <i class="bi bi-chevron-double-right"></i>
            </Button>
          </ButtonGroup>
        {/if}
      </div>
    </div>

    <!-- Exercise List -->
    {#if exercises?.length > 0}
      <ListGroup class="exercise-list">
        {#each exercises as exercise (exercise.id)}
          <ListGroupItem
            action
            on:click={() => handleExerciseClick(exercise.id)}
            class="exercise-item"
          >
            <div class="exercise-content">
              <h5 class="exercise-name">{exercise.name}</h5>
            </div>
            <i class="bi bi-chevron-right text-muted"></i>
          </ListGroupItem>
        {/each}
      </ListGroup>
    {/if}

    <!-- Pagination Controls Bottom -->
    <div class="pagination-controls-wrapper mt-3">
      <div class="pagination-info">
        <span class="text-muted">
          Showing <strong>{startItem}-{endItem}</strong> of
          <strong>{total.toLocaleString()}</strong>
        </span>
      </div>
      <div class="pagination-controls">
        <div class="items-per-page">
          <label for="limitSelectBottom">Per page:</label>
          <Input
            type="select"
            id="limitSelectBottom"
            bind:value={limit}
            on:change={handleLimitChange}
            bsSize="sm"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </Input>
        </div>
        {#if totalPages > 1}
          <ButtonGroup size="sm">
            <Button
              color="primary"
              outline
              disabled={!hasPreviousPage}
              on:click={() => changePage(0)}
              title="First page"
            >
              <i class="bi bi-chevron-double-left"></i>
            </Button>
            <Button
              color="primary"
              outline
              disabled={!hasPreviousPage}
              on:click={() => changePage(Math.max(0, offset - limit))}
              title="Previous page"
            >
              <i class="bi bi-chevron-left"></i>
            </Button>
            <Button color="primary" disabled class="page-indicator">
              {currentPage} / {totalPages}
            </Button>
            <Button
              color="primary"
              outline
              disabled={!hasNextPage}
              on:click={() => changePage(offset + limit)}
              title="Next page"
            >
              <i class="bi bi-chevron-right"></i>
            </Button>
            <Button
              color="primary"
              outline
              disabled={!hasNextPage}
              on:click={() => changePage((totalPages - 1) * limit)}
              title="Last page"
            >
              <i class="bi bi-chevron-double-right"></i>
            </Button>
          </ButtonGroup>
        {/if}
      </div>
    </div>
  {/if}
</Container>

<Modal isOpen={isSearchModalOpen} toggle={closeSearchModal} size="lg" scrollable>
  <ModalHeader toggle={closeSearchModal}>Search exercises</ModalHeader>
  <ModalBody>
    <div class="modal-search-bar">
      <Input
        type="search"
        placeholder="Type at least 4 characters"
        bind:value={modalSearchTerm}
        on:input={handleModalInput}
      />
      {#if modalLoading}
        <Spinner
          color="primary"
          style="width: 1.5rem; height: 1.5rem;"
          class="ms-2"
        />
      {/if}
    </div>

    {#if modalError}
      <Alert color="danger" class="mt-3">
        {modalError}
      </Alert>
    {/if}

    {#if !modalLoading && !modalError && modalSearchTerm.trim().length > 3 && modalResults.length === 0}
      <p class="text-muted mt-3">
        No results for "{modalSearchTerm.trim()}".
      </p>
    {/if}

    {#if modalResults.length > 0}
      <ListGroup class="mt-3">
        {#each modalResults as exercise (exercise.id)}
          <ListGroupItem
            action
            on:click={() => handleModalExerciseClick(exercise.id)}
            class="exercise-item"
          >
            <div class="exercise-content">
              <h5 class="exercise-name">{exercise.name}</h5>
              {#if exercise.primary_muscles?.length}
                <small class="text-muted">
                  {exercise.primary_muscles.join(", ")}
                </small>
              {/if}
            </div>
            <i class="bi bi-chevron-right text-muted"></i>
          </ListGroupItem>
        {/each}
      </ListGroup>
    {/if}
  </ModalBody>
  <ModalFooter>
    <Button color="secondary" on:click={closeSearchModal}>Close</Button>
  </ModalFooter>
</Modal>

<style>
  /* Header Section */
  .header-section {
    padding-bottom: 1.5rem;
    border-bottom: 2px solid #e9ecef;
  }

  .search-bar {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
  }

  :global(.search-input) {
    min-width: 240px;
  }

  .modal-search-bar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .total-count-card {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    min-width: 150px;
  }

  .total-count-label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    opacity: 0.9;
    margin-bottom: 0.25rem;
  }

  .total-count-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1;
  }

  /* Pagination Controls */
  .pagination-controls-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem 1rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    flex-wrap: wrap;
  }

  .pagination-info {
    font-size: 0.9rem;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .items-per-page {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .items-per-page label {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6c757d;
    white-space: nowrap;
  }

  .items-per-page :global(select) {
    width: 70px;
  }

  :global(.page-indicator) {
    font-weight: 600;
    min-width: 80px;
    cursor: default !important;
  }

  /* Exercise List */
  :global(.exercise-list) {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    overflow: hidden;
  }

  :global(.exercise-item) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    border-left: 3px solid transparent;
  }

  :global(.exercise-item:hover) {
    background-color: #f8f9fa;
    border-left-color: #667eea;
    transform: translateX(2px);
  }

  .exercise-content {
    flex: 1;
  }

  .exercise-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 500;
    color: #2c3e50;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .header-section {
      padding-bottom: 1rem;
    }

    .header-section .d-flex {
      flex-direction: column;
      gap: 1rem;
    }

    .search-bar {
      flex-direction: column;
      align-items: stretch;
    }

    :global(.search-input) {
      width: 100%;
    }

    .total-count-card {
      width: 100%;
      padding: 0.75rem 1rem;
    }

    .total-count-value {
      font-size: 1.5rem;
    }

    .pagination-controls-wrapper {
      flex-direction: column;
      align-items: stretch;
      padding: 0.5rem;
    }

    .pagination-info {
      text-align: center;
    }

    .pagination-controls {
      flex-direction: column;
      width: 100%;
    }

    .items-per-page {
      justify-content: center;
    }

    :global(.btn-group) {
      width: 100%;
    }

    :global(.btn-group .btn) {
      flex: 1;
      font-size: 0.75rem;
      padding: 0.375rem 0.5rem;
    }

    :global(.page-indicator) {
      min-width: 60px;
    }

    .exercise-name {
      font-size: 1rem;
    }

    :global(.exercise-item) {
      padding: 0.875rem 1rem;
    }
  }

  @media (max-width: 576px) {
    :global(.btn-group .btn span) {
      display: none;
    }

    :global(.btn-group .btn i) {
      margin: 0;
    }
  }
</style>
