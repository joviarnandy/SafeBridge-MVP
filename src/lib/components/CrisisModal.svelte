<script lang="ts">
  import { Phone, MessageSquare } from 'lucide-svelte';
  import { t } from '$lib/state/store';
  
  // This modal is non-dismissible by design.
</script>

<div class="fixed inset-0 z-[9998] flex flex-col bg-[#1A1A2E] p-4 sm:p-6 overflow-y-auto">
  <div class="mx-auto w-full max-w-2xl flex-1 py-8">
    
    <div class="mb-8 text-center">
      <h2 class="mb-4 text-2xl font-semibold text-[#D4A855]">{$t('crisis_title')}</h2>
      <p class="text-[#D4D4E8] text-lg leading-relaxed">
        {@html $t('crisis_desc')}
      </p>
    </div>

    <div class="flex flex-col space-y-4">
      <a href="tel:911" class="flex items-center rounded-xl bg-[#222240] p-4 border border-[#333355] transition-colors hover:bg-[#2A2A4A] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]">
        <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C49A6C]/20 text-[#C49A6C]">
          <Phone size={24} />
        </div>
        <div>
          <div class="text-xl font-bold text-[#D4D4E8]">911 / 112</div>
          <div class="text-sm text-[#9090B0]">{$t('emergency_services')}</div>
        </div>
      </a>

      <a href="tel:988" class="flex items-center rounded-xl bg-[#222240] p-4 border border-[#333355] transition-colors hover:bg-[#2A2A4A] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]">
        <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C49A6C]/20 text-[#C49A6C]">
          <Phone size={24} />
        </div>
        <div>
          <div class="text-xl font-bold text-[#D4D4E8]">988, Press 1</div>
          <div class="text-sm text-[#9090B0]">{$t('veterans_crisis')}</div>
        </div>
      </a>

      <a href="tel:1-800-799-7233" class="flex items-center rounded-xl bg-[#222240] p-4 border border-[#333355] transition-colors hover:bg-[#2A2A4A] focus:outline-none focus:ring-2 focus:ring-[#5B6BBD]">
        <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C49A6C]/20 text-[#C49A6C]">
          <Phone size={24} />
        </div>
        <div>
          <div class="text-xl font-bold text-[#D4D4E8]">1-800-799-7233</div>
          <div class="text-sm text-[#9090B0]">{$t('domestic_violence')}</div>
        </div>
      </a>

      <div class="flex items-center rounded-xl bg-[#222240] p-4 border border-[#333355]">
        <div class="mr-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#C49A6C]/20 text-[#C49A6C]">
          <MessageSquare size={24} />
        </div>
        <div>
          <div class="text-xl font-bold text-[#D4D4E8]">Text START to 88788</div>
          <div class="text-sm text-[#9090B0]">{$t('dv_text_line')}</div>
        </div>
      </div>
    </div>
    
  </div>
</div>
