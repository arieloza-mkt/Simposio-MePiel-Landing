type ScrollToEdition = (index: number) => void;

let scrollToEditionFn: ScrollToEdition | null = null;

export function registerScrollToEdition(fn: ScrollToEdition) {
  scrollToEditionFn = fn;
}

export function unregisterScrollToEdition() {
  scrollToEditionFn = null;
}

export function scrollToEdition(index: number) {
  scrollToEditionFn?.(index);
}