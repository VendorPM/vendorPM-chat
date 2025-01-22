export function formatDate(date: Date): string {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // For today
  if (diffDays === 0) {
    return 'Today';
  }

  // For yesterday
  if (diffDays === 1) {
    return 'Yesterday';
  }

  // For last week (2-6 days ago)
  if (diffDays < 7) {
    return date.toLocaleDateString('en-US', { weekday: 'long' }); // Returns: Monday, Tuesday, etc.
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();

  return `${month}/${day}/${year}`;
}
