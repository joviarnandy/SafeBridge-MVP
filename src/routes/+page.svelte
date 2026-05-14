<script lang="ts">
  import { currentScreen } from '$lib/state/store';
  import QuickExitButton from '$lib/components/QuickExitButton.svelte';
  import LanguageToggle from '$lib/components/LanguageToggle.svelte';
  import CrisisModal from '$lib/components/CrisisModal.svelte';
  import TransitionContainer from '$lib/components/TransitionContainer.svelte';
  import LandingScreen from '$lib/components/LandingScreen.svelte';
  import InputScreen from '$lib/components/InputScreen.svelte';
  import OutputScreen from '$lib/components/OutputScreen.svelte';
  import LoadingState from '$lib/components/LoadingState.svelte';
</script>

<QuickExitButton />

{#if $currentScreen !== 'crisis'}
  <LanguageToggle />
{/if}

{#if $currentScreen === 'crisis'}
  <CrisisModal />
{/if}

<main id="app-root" class="min-h-screen w-full flex flex-col items-center py-6 sm:py-12 px-4">
  <TransitionContainer key={$currentScreen}>
    {#if $currentScreen === 'landing'}
      <LandingScreen />
    {:else if $currentScreen === 'input'}
      <InputScreen />
    {:else if $currentScreen === 'loading'}
      <LoadingState />
    {:else if $currentScreen === 'output'}
      <OutputScreen />
    {/if}
  </TransitionContainer>
</main>
