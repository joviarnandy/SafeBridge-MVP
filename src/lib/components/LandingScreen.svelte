<script lang="ts">
  import { currentScreen, selectedAudience, t } from '$lib/state/store';
  import type { Audience } from '$lib/state/store';

  function selectAudience(audience: Audience) {
    selectedAudience.set(audience);
    setTimeout(() => {
      currentScreen.set('input');
    }, 300);
  }
</script>

<div class="flex w-full flex-col items-center justify-center min-h-[80vh] px-6 sm:px-8 text-center">
  <div class="mb-12">
    <h1 class="mb-4 text-3xl font-bold text-[#D4D4E8]">{$t('app_title')}</h1>
    <p class="text-lg text-[#9090B0]">
      {@html $t('app_subtitle')}
    </p>
  </div>

  <div class="w-full max-w-lg text-left mb-6">
    <p class="mb-4 text-sm font-medium text-[#9090B0]">{$t('audience_prompt')}</p>
  </div>

  <div class="flex w-full max-w-lg flex-col space-y-4">
    <button
      onclick={() => selectAudience('medical')}
      class="group text-left flex items-center rounded-xl bg-[#222240] p-5 border border-[#333355] transition-all duration-250 ease-custom hover:bg-[#2A2A4A] hover:border-l-4 hover:border-l-[#7B8CDE] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]"
    >
      <div class="h-20 w-20 mr-5 shrink-0 overflow-hidden rounded-lg bg-[#1A1A2E]">
        <img src="/images/medical.png" alt="" class="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-[#D4D4E8]">{$t('med_title')}</span>
        <span class="text-sm text-[#9090B0]">{$t('med_desc')}</span>
      </div>
    </button>

    <button
      onclick={() => selectAudience('family')}
      class="group text-left flex items-center rounded-xl bg-[#222240] p-5 border border-[#333355] transition-all duration-250 ease-custom hover:bg-[#2A2A4A] hover:border-l-4 hover:border-l-[#7B8CDE] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]"
    >
      <div class="h-20 w-20 mr-5 shrink-0 overflow-hidden rounded-lg bg-[#1A1A2E]">
        <img src="/images/family.png" alt="" class="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-[#D4D4E8]">{$t('fam_title')}</span>
        <span class="text-sm text-[#9090B0]">{$t('fam_desc')}</span>
      </div>
    </button>

    <button
      onclick={() => selectAudience('work')}
      class="group text-left flex items-center rounded-xl bg-[#222240] p-5 border border-[#333355] transition-all duration-250 ease-custom hover:bg-[#2A2A4A] hover:border-l-4 hover:border-l-[#7B8CDE] hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]"
    >
      <div class="h-20 w-20 mr-5 shrink-0 overflow-hidden rounded-lg bg-[#1A1A2E]">
        <img src="/images/work.png" alt="" class="h-full w-full object-cover opacity-85 group-hover:opacity-100 transition-opacity" />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-semibold text-[#D4D4E8]">{$t('work_title')}</span>
        <span class="text-sm text-[#9090B0]">{$t('work_desc')}</span>
      </div>
    </button>
  </div>

  <div class="mt-12 text-sm text-[#9090B0]">
    {$t('footer_note')}
  </div>
</div>
