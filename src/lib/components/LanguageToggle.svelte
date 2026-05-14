<script lang="ts">
  import { currentLanguage } from '$lib/state/store';
  import { Globe } from 'lucide-svelte';

  function toggleLanguage() {
    currentLanguage.update(lang => lang === 'en' ? 'id' : 'en');
  }
</script>

<button
  onclick={toggleLanguage}
  class="fixed top-4 right-4 z-[9900] flex items-center justify-center rounded-full bg-[#222240] px-4 py-2 text-sm font-medium text-[#D4D4E8] shadow-md border border-[#333355] transition-all duration-200 hover:bg-[#2A2A4A] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]"
  aria-label="Toggle Language"
>
  <Globe size={16} class="mr-2 text-[#9090B0]" />
  {$currentLanguage === 'en' ? 'EN' : 'ID'}
</button>
