<script lang="ts">
  import { onMount } from 'svelte';
  import { executeQuickExit } from '$lib/utils/quick-exit';
  import { Home } from 'lucide-svelte';

  let touchStartX = $state(0);
  let touchFingers = $state(0);

  onMount(() => {
    // Keyboard trigger
    const handleKeydown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') executeQuickExit();
    };

    // Mobile gesture triggers
    const handleTouchStart = (e: TouchEvent) => {
      touchFingers = e.touches.length;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      if (touchFingers >= 2 && deltaX > 150) executeQuickExit();
    };

    window.addEventListener('keydown', handleKeydown);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('keydown', handleKeydown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  });
</script>

<button
  class="fixed bottom-4 right-4 z-[9999] flex h-14 w-14 items-center justify-center rounded-full bg-[#1A1A2E] shadow-lg border border-[#333355] transition-transform duration-150 ease-out hover:scale-[1.02] active:scale-95 focus:ring-2 focus:ring-[#5B6BBD] focus:outline-none"
  aria-label="Quick Exit"
  title="Quick Exit"
  onclick={executeQuickExit}
>
  <Home size={24} color="#9090B0" />
</button>
