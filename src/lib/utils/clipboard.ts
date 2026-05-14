export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator?.clipboard) {
    console.warn('Clipboard API not available');
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.warn('Clipboard write failed', error);
    return false;
  }
}
