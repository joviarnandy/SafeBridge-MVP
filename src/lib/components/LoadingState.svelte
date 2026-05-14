<script lang="ts">
  import { t } from '$lib/state/store';
</script>

<div class="flex flex-col items-center justify-center py-12 px-4 text-center">
  <p class="mb-8 text-lg text-[#D4D4E8]">{$t('loading_text')}</p>
  
  <div class="h-2 w-full max-w-[200px] overflow-hidden rounded-full bg-[#16162B]">
    <div class="h-full w-full bg-[#7B8CDE] animate-pulse-slow"></div>
  </div>
</div>

<style>
  .animate-pulse-slow {
    animation: pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 1;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-pulse-slow {
      animation: none;
      opacity: 0.7;
    }
  }
</style>
