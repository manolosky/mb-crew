import { act, render } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { loadGoogleTagManager, revokeAnalytics } = vi.hoisted(() => ({
  loadGoogleTagManager: vi.fn(),
  revokeAnalytics: vi.fn(),
}));

vi.mock('@/lib/analytics', () => ({ loadGoogleTagManager, revokeAnalytics }));

// The consent store keeps per-visit state, so every test loads fresh modules.
const loadAnalytics = async () => {
  vi.resetModules();
  const [{ Analytics }, consent] = await Promise.all([
    import('./Analytics'),
    import('@/lib/consent'),
  ]);

  return { Analytics, consent };
};

describe('Analytics', () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it('loads nothing until the visitor decides', async () => {
    const { Analytics } = await loadAnalytics();
    render(<Analytics />);

    expect(loadGoogleTagManager).not.toHaveBeenCalled();
    expect(revokeAnalytics).not.toHaveBeenCalled();
  });

  it('loads Google Tag Manager once analytics are accepted', async () => {
    const { Analytics, consent } = await loadAnalytics();
    render(<Analytics />);

    act(() => consent.saveConsent('granted'));

    expect(loadGoogleTagManager).toHaveBeenCalledTimes(1);
  });

  it('withdraws analytics when the visitor rejects them', async () => {
    const { Analytics, consent } = await loadAnalytics();
    render(<Analytics />);

    act(() => consent.saveConsent('denied'));

    expect(revokeAnalytics).toHaveBeenCalledTimes(1);
    expect(loadGoogleTagManager).not.toHaveBeenCalled();
  });
});
