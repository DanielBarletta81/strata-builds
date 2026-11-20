export function mapPointIndex(key: string, index: number, count: number): number | null {
  if (count === 0) return null;

  switch (key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      return (index + count - 1) % count;
    case 'ArrowRight':
    case 'ArrowDown':
      return (index + 1) % count;
    case 'Home':
      return 0;
    case 'End':
      return count - 1;
    default:
      return null;
  }
}
