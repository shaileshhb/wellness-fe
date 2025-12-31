<script>
  import { onMount } from 'svelte';
  import { Container, Row, Col, Button, Card, CardBody, CardTitle, CardText, Alert, Badge, Spinner, Nav, NavItem, NavLink, TabContent, TabPane } from '@sveltestrap/sveltestrap';
  import { push } from 'svelte-spa-router';
  import { exercisesService } from '../lib/services';

  export let params = {};
  
  let exerciseId = params.id;
  let exercise = null;
  let loading = true;
  let error = null;
  let activeVideoTab = 'male-front';
  let selectedVideo = null;

  onMount(async () => {
    await fetchExerciseDetails();
  });

  async function fetchExerciseDetails() {
    loading = true;
    error = null;
    
    try {
      exercise = await exercisesService.getExerciseById(exerciseId);
      
      // Set the first video as selected by default
      if (exercise.videos && exercise.videos.length > 0) {
        selectedVideo = exercise.videos[0];
      }
    } catch (err) {
      error = err.response?.data?.message || 'Failed to load exercise details';
      console.error('Error fetching exercise:', err);
    } finally {
      loading = false;
    }
  }

  function goBack() {
    push('/');
  }

  function selectVideo(video) {
    selectedVideo = video;
    activeVideoTab = `${video.gender}-${video.angle}`;
  }

  function getVideoStreamUrl(videoUrl) {
    // Extract the path after /media/videos/
    const path = videoUrl.includes('/media/videos/') 
      ? videoUrl.split('/media/videos/')[1] 
      : videoUrl;
    return exercisesService.getVideoUrl(path);
  }

  function getDifficultyColor(difficulty) {
    const colors = {
      'Novice': 'success',
      'Beginner': 'info',
      'Intermediate': 'warning',
      'Advanced': 'danger',
      'Expert': 'dark'
    };
    return colors[difficulty] || 'secondary';
  }
</script>

<Container class="py-5">
  <!-- Back Button -->
  <Row class="mb-4">
    <Col>
      <Button color="secondary" outline on:click={goBack}>
        <i class="bi bi-arrow-left"></i> Back to Exercises
      </Button>
    </Col>
  </Row>

  {#if loading}
    <Row>
      <Col class="text-center py-5">
        <Spinner color="primary" />
        <p class="mt-3 text-muted">Loading exercise details...</p>
      </Col>
    </Row>
  {:else if error}
    <Row>
      <Col>
        <Alert color="danger">
          <h4 class="alert-heading">Error!</h4>
          <p>{error}</p>
          <hr />
          <Button color="danger" outline on:click={fetchExerciseDetails}>
            Try Again
          </Button>
        </Alert>
      </Col>
    </Row>
  {:else if exercise}
    <!-- Exercise Header -->
    <Row class="mb-4">
      <Col>
        <Card class="shadow-sm">
          <CardBody>
            <div class="d-flex justify-content-between align-items-start flex-wrap">
              <div>
                <CardTitle tag="h2" class="mb-3">{exercise.name}</CardTitle>
                <div class="mb-2">
                  <Badge color="primary" class="me-2">{exercise.category}</Badge>
                  <Badge color={getDifficultyColor(exercise.difficulty)} class="me-2">{exercise.difficulty}</Badge>
                  {#if exercise.force}
                    <Badge color="secondary" class="me-2">{exercise.force}</Badge>
                  {/if}
                  {#if exercise.mechanic}
                    <Badge color="info">{exercise.mechanic}</Badge>
                  {/if}
                </div>
              </div>
              <div class="exercise-stats">
                <div class="stat-item">
                  <i class="bi bi-camera-video"></i> {exercise.video_count} videos
                </div>
                <div class="stat-item">
                  <i class="bi bi-list-ol"></i> {exercise.step_count} steps
                </div>
              </div>
            </div>

            {#if exercise.grips && exercise.grips.length > 0}
              <div class="mt-3">
                <strong>Grips:</strong>
                {#each exercise.grips as grip, index}
                  <Badge color="light" class="text-dark ms-2">{grip}</Badge>
                {/each}
              </div>
            {/if}

            {#if exercise.primaryMuscles && exercise.primaryMuscles.length > 0}
              <div class="mt-2">
                <strong>Primary Muscles:</strong>
                {#each exercise.primaryMuscles as muscle}
                  <Badge color="success" class="ms-2">{muscle}</Badge>
                {/each}
              </div>
            {/if}
          </CardBody>
        </Card>
      </Col>
    </Row>

    <!-- Video Section -->
    {#if exercise.videos && exercise.videos.length > 0}
      <Row class="mb-4">
        <Col>
          <Card class="shadow-sm">
            <CardBody>
              <CardTitle tag="h4" class="mb-3">
                <i class="bi bi-play-circle"></i> Exercise Videos
              </CardTitle>

              <!-- Video Tabs -->
              <Nav tabs class="mb-3">
                {#each exercise.videos as video}
                  <NavItem>
                    <NavLink
                      active={activeVideoTab === `${video.gender}-${video.angle}`}
                      on:click={() => selectVideo(video)}
                      style="cursor: pointer;"
                    >
                      <i class="bi bi-{video.gender === 'male' ? 'gender-male' : 'gender-female'}"></i>
                      {video.gender.charAt(0).toUpperCase() + video.gender.slice(1)} - {video.angle.charAt(0).toUpperCase() + video.angle.slice(1)}
                    </NavLink>
                  </NavItem>
                {/each}
              </Nav>

              <!-- Video Player -->
              {#if selectedVideo}
                {#key selectedVideo.url}
                  <div class="video-container">
                    <!-- svelte-ignore a11y-media-has-caption -->
                    <video
                      controls
                      preload="metadata"
                      class="w-100 rounded"
                      src={getVideoStreamUrl(selectedVideo.url)}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                {/key}
              {/if}
            </CardBody>
          </Card>
        </Col>
      </Row>
    {/if}

    <!-- Steps Section -->
    {#if exercise.steps && exercise.steps.length > 0}
      <Row class="mb-4">
        <Col>
          <Card class="shadow-sm">
            <CardBody>
              <CardTitle tag="h4" class="mb-3">
                <i class="bi bi-list-check"></i> How to Perform
              </CardTitle>
              <ol class="steps-list">
                {#each exercise.steps as step, index}
                  <li class="step-item">{step}</li>
                {/each}
              </ol>
            </CardBody>
          </Card>
        </Col>
      </Row>
    {/if}

    <!-- Additional Information -->
    <Row>
      <Col>
        <Card class="shadow-sm">
          <CardBody>
            <CardTitle tag="h4" class="mb-3">
              <i class="bi bi-info-circle"></i> Exercise Information
            </CardTitle>
            <Row>
              <Col md="6">
                <div class="info-item">
                  <strong>Category:</strong>
                  <span class="text-muted ms-2">{exercise.category}</span>
                </div>
                <div class="info-item">
                  <strong>Difficulty:</strong>
                  <span class="text-muted ms-2">{exercise.difficulty}</span>
                </div>
              </Col>
              <Col md="6">
                {#if exercise.force}
                  <div class="info-item">
                    <strong>Force Type:</strong>
                    <span class="text-muted ms-2">{exercise.force}</span>
                  </div>
                {/if}
                {#if exercise.mechanic}
                  <div class="info-item">
                    <strong>Mechanic:</strong>
                    <span class="text-muted ms-2">{exercise.mechanic}</span>
                  </div>
                {/if}
                <div class="info-item">
                  <strong>Available Videos:</strong>
                  <span class="text-muted ms-2">{exercise.video_count}</span>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  {/if}
</Container>

<style>
  .bi-arrow-left {
    margin-right: 0.5rem;
  }

  .exercise-stats {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.95rem;
    color: #6c757d;
  }

  .stat-item i {
    font-size: 1.1rem;
  }

  .video-container {
    background: #000;
    border-radius: 0.5rem;
    overflow: hidden;
  }

  .video-container video {
    max-height: 600px;
    object-fit: contain;
    background: #000;
  }

  .steps-list {
    padding-left: 1.5rem;
    margin: 0;
  }

  .step-item {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e9ecef;
    line-height: 1.6;
  }

  .step-item:last-child {
    border-bottom: none;
  }

  .info-item {
    padding: 0.5rem 0;
    border-bottom: 1px solid #f0f0f0;
  }

  .info-item:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    .exercise-stats {
      margin-top: 1rem;
      flex-direction: row;
      gap: 1rem;
    }

    .video-container video {
      max-height: 400px;
    }
  }
</style>

