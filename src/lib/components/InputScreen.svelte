<script lang="ts">
  import { onMount } from 'svelte';
  import { currentScreen, selectedAudience, rawInput, translatedOptions, errorState, t } from '$lib/state/store';
  import { interceptInput } from '$lib/middleware/input-interceptor';
  import { ArrowLeft } from 'lucide-svelte';

  let textareaRef = $state<HTMLTextAreaElement | null>(null);

  onMount(() => {
    // Focus after transition completes
    setTimeout(() => {
      if (textareaRef) textareaRef.focus();
    }, 400);
  });

  const AUDIENCE_KEYS: Record<string, { icon: string; key: 'med_title' | 'fam_title' | 'work_title' }> = {
    medical: { icon: '🏥', key: 'med_title' },
    family: { icon: '🏠', key: 'fam_title' },
    work: { icon: '💼', key: 'work_title' }
  };

  let currentAudience = $derived($selectedAudience ? AUDIENCE_KEYS[$selectedAudience] : null);
  let canSubmit = $derived($rawInput.trim().length >= 10);
  let showCounter = $derived($rawInput.length > 750);

  function handleInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    if (target.value.length <= 1000) {
      rawInput.set(target.value);
    } else {
      // Hard limit
      rawInput.set(target.value.substring(0, 1000));
      target.value = $rawInput;
    }
  }

  async function translate() {
    if (!canSubmit || !$selectedAudience) return;

    const interceptResult = interceptInput($rawInput);
    if (!interceptResult.safe) {
      currentScreen.set('crisis');
      return;
    }

    currentScreen.set('loading');
    errorState.set('none');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 600000);

      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText: interceptResult.sanitized,
          audience: $selectedAudience
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) throw new Error('Network error');

      const data = await response.json();
      
      if (!data.success || !data.options || data.options.length === 0) {
        throw new Error('Translation failed');
      }

      translatedOptions.set(data.options);
      currentScreen.set('output');

    } catch (err: any) {
      if (err.name === 'AbortError') {
        errorState.set('network');
      } else {
        errorState.set('translation_failed');
      }
      currentScreen.set('input');
    }
  }

  function changeAudience() {
    currentScreen.set('landing');
  }
</script>

<div class="flex w-full flex-col min-h-[80vh] px-6 sm:px-8 py-8">
  <div class="mb-6 flex items-center justify-between">
    <button
      onclick={changeAudience}
      class="flex items-center text-sm font-medium text-[#9090B0] hover:text-[#D4D4E8] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD] rounded px-2 py-1 transition-colors"
    >
      <ArrowLeft size={16} class="mr-2" />
      {$t('change_audience')}
    </button>
    
    {#if currentAudience}
      <div class="flex items-center text-[#D4D4E8] bg-[#222240] px-3 py-1.5 rounded-full border border-[#333355] text-sm font-medium">
        <span class="mr-2">{currentAudience.icon}</span>
        {$t(currentAudience.key)}
      </div>
    {/if}
  </div>

  {#if $errorState !== 'none'}
    <div class="mb-6 rounded-xl bg-[#222240] border border-[#D4A855] p-4 text-[#D4A855]">
      {#if $errorState === 'network'}
        {$t('error_network')}
      {:else}
        {$t('error_failed')}
      {/if}
    </div>
  {/if}

  <!-- Gentle Onboarding Tooltip -->
  {#if $rawInput.length === 0}
    <div class="mb-4 text-sm text-[#7B8CDE] bg-[#7B8CDE]/10 px-4 py-3 rounded-lg border border-[#7B8CDE]/20">
      {$t('onboarding_tooltip')}
    </div>
  {/if}

  <div class="flex flex-col flex-1 relative mb-6">
    <div class="absolute -top-3 left-4 bg-[#1A1A2E] px-2 text-sm text-[#9090B0] z-10">
      {$t('input_emotion_prompt')}
    </div>
    <textarea
      bind:this={textareaRef}
      value={$rawInput}
      oninput={handleInput}
      placeholder={$t('input_placeholder')}
      class="w-full flex-1 resize-none rounded-xl border border-[#333355] bg-[#16162B] p-5 pt-6 text-lg text-[#D4D4E8] placeholder:text-[#9090B0]/50 focus:border-[#5B6BBD] focus:outline-none focus:ring-1 focus:ring-[#5B6BBD] transition-colors"
    ></textarea>
    
    {#if showCounter}
      <div class="absolute bottom-4 right-4 text-xs text-[#9090B0]">
        {$rawInput.length}/1000
      </div>
    {/if}
  </div>

  <button
    onclick={translate}
    disabled={!canSubmit}
    class="w-full rounded-xl bg-[#7B8CDE] py-4 text-lg font-semibold text-[#1A1A2E] transition-all hover:bg-[#8CA0F9] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD] focus:ring-offset-2 focus:ring-offset-[#1A1A2E] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[#7B8CDE]"
  >
    {$t('translate_btn')}
  </button>
  
  <p class="mt-6 text-center text-sm text-[#9090B0]">
    {$t('input_footer')}
  </p>
</div>
