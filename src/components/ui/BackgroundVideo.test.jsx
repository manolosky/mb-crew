import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { BackgroundVideo } from './BackgroundVideo';

const queryVideo = (container) => container.querySelector('video');

describe('BackgroundVideo', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // jsdom does not implement media playback
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders nothing before any user interaction', () => {
    const { container } = render(<BackgroundVideo src="/videos/x.mp4" poster="/p.webp" />);

    expect(queryVideo(container)).toBeNull();
  });

  it('mounts the video on first interaction', () => {
    const { container } = render(<BackgroundVideo src="/videos/x.mp4" poster="/p.webp" />);

    fireEvent.scroll(window);

    expect(queryVideo(container)).not.toBeNull();
    expect(container.querySelector('source')).toHaveAttribute('src', '/videos/x.mp4');
  });

  it('mounts the video after the fallback timeout for passive visitors', () => {
    const { container } = render(<BackgroundVideo src="/videos/x.mp4" poster="/p.webp" />);

    act(() => {
      vi.advanceTimersByTime(8000);
    });

    expect(queryVideo(container)).not.toBeNull();
  });

  it('stays hidden from assistive technology', () => {
    const { container } = render(<BackgroundVideo src="/videos/x.mp4" poster="/p.webp" />);

    fireEvent.pointerDown(window);

    expect(queryVideo(container)).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('video')).toBeNull();
  });
});
