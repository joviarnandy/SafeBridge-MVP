<script lang="ts">
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  
  let { key, children } = $props<{
    key: string;
    children: import('svelte').Snippet;
  }>();
</script>

<div class="w-full max-w-2xl mx-auto grid" style="grid-template-columns: 100%;">
  {#key key}
    <div
      in:fade={{ duration: 250, easing: cubicOut, delay: 50 }}
      out:fade={{ duration: 150, easing: cubicOut }}
      class="col-start-1 row-start-1 w-full relative"
    >
      {@render children()}
    </div>
  {/key}
</div>
