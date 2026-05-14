<script lang="ts">
  import { onMount } from 'svelte';
  import { fade } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';
  import { currentScreen, translatedOptions, rawInput, selectedAudience, t } from '$lib/state/store';
  import { copyToClipboard } from '$lib/utils/clipboard';
  import { Copy, Check } from 'lucide-svelte';

  let copiedIndex = $state<number | null>(null);
  let showOptions = $state([false, false]);

  onMount(() => {
    // Staggered fade-in
    setTimeout(() => { showOptions[0] = true; }, 0);
    setTimeout(() => { showOptions[1] = true; }, 200);
  });

  async function handleCopy(text: string, index: number) {
    const success = await copyToClipboard(text);
    if (success) {
      copiedIndex = index;
      setTimeout(() => {
        if (copiedIndex === index) copiedIndex = null;
      }, 2000);
    }
  }

  function tryAgain() {
    rawInput.set('');
    currentScreen.set('input');
  }

  function newAudience() {
    rawInput.set('');
    selectedAudience.set(null);
    currentScreen.set('landing');
  }
</script>

<div class="flex w-full flex-col min-h-[80vh] px-6 sm:px-8 py-8">
  <div class="mb-8">
    <h2 class="text-xl font-medium text-[#D4D4E8]">{$t('output_title')}</h2>
  </div>

  <div class="flex flex-col space-y-6 mb-10">
    {#each $translatedOptions as option, i}
      {#if showOptions[i]}
        <div
          in:fade={{ duration: 300, easing: cubicOut }}
          class="flex flex-col sm:flex-row rounded-xl bg-[#222240] p-6 border border-[#333355] gap-6"
        >
          <div class="w-full sm:w-[140px] shrink-0 rounded-lg overflow-hidden bg-[#1A1A2E] h-40 sm:h-auto border border-[#333355]/30">
            <img src={`/images/emotion_${i + 1}.png`} alt="" class="w-full h-full object-cover opacity-90" />
          </div>
          <div class="flex flex-col flex-1">
            <div class="mb-4 text-sm font-medium text-[#9090B0]">{$t('option')} {i + 1}</div>
            <p class="mb-6 text-lg text-[#D4D4E8] leading-relaxed">
              {option}
            </p>
            
            <button
              onclick={() => handleCopy(option, i)}
              class="self-end mt-auto flex items-center justify-center rounded-lg px-6 py-2.5 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#5B6BBD] focus:ring-offset-2 focus:ring-offset-[#222240] min-w-[120px] {copiedIndex === i ? 'bg-[#5BA87C] text-[#1A1A2E]' : 'bg-[#2A2A4A] text-[#D4D4E8] hover:bg-[#333355]'}"
              aria-live="polite"
            >
              {#if copiedIndex === i}
                <Check size={18} class="mr-2" /> {$t('copied')}
              {:else}
                <Copy size={18} class="mr-2" /> {$t('copy')}
              {/if}
            </button>
          </div>
        </div>
      {/if}
    {/each}
  </div>

  <div class="flex flex-col sm:flex-row gap-4 mt-auto">
    <button
      onclick={tryAgain}
      class="flex-1 rounded-xl bg-[#2A2A4A] py-4 font-medium text-[#D4D4E8] border border-[#333355] transition-colors hover:bg-[#333355] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]"
    >
      {$t('try_again')}
    </button>
    <button
      onclick={newAudience}
      class="flex-1 rounded-xl bg-[#2A2A4A] py-4 font-medium text-[#D4D4E8] border border-[#333355] transition-colors hover:bg-[#333355] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]"
    >
      {$t('new_audience')}
    </button>
  </div>
</div>
