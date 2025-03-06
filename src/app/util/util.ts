export function debounce(func: (value: string) => void, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: void, ...args: [string]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function setImagePlaceholder(event: Event) {
  console.log('triggered');

  const imgElement = event.target as HTMLImageElement;
  imgElement.src = 'https://placehold.co/300x450?text=No+Image'; // Online placeholder
}
