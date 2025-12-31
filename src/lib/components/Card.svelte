<script>
  import { Card as BSCard, CardBody, CardTitle, CardText, Button } from '@sveltestrap/sveltestrap';
  
  export let title = '';
  export let text = '';
  export let buttonText = '';
  export let buttonAction = null;
</script>

<BSCard class="h-100">
  <CardBody>
    {#if title}
      <CardTitle tag="h5">{title}</CardTitle>
    {/if}
    
    {#if text}
      <CardText>{text}</CardText>
    {/if}
    
    <slot />
    
    {#if buttonText && buttonAction}
      <Button color="primary" on:click={buttonAction}>
        {buttonText}
      </Button>
    {/if}
  </CardBody>
</BSCard>

