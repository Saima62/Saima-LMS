// Converts a plain YouTube/Vimeo watch URL (whatever a non-technical teacher
// would paste in) into an embeddable iframe URL. Falls back to returning
// the original URL unchanged if it doesn't recognize the host, so a direct
// embed link or a Supabase Storage video URL still works.

export function embeddableVideoUrl(url?: string | null): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.replace(/^www\./, '');

    // youtu.be/VIDEOID
    if (host === 'youtu.be') {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : trimmed;
    }

    // youtube.com/watch?v=VIDEOID
    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        const id = parsed.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : trimmed;
      }
      // Already an /embed/ or /live/ link — use as-is.
      if (parsed.pathname.startsWith('/embed/')) return trimmed;
    }

    // vimeo.com/VIDEOID
    if (host === 'vimeo.com') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : trimmed;
    }
    if (host === 'player.vimeo.com') return trimmed;

    // Unrecognized host (e.g. a direct Supabase Storage .mp4 link) — return as-is;
    // the lesson page will still try to embed it in an iframe/video tag.
    return trimmed;
  } catch {
    return null;
  }
}
