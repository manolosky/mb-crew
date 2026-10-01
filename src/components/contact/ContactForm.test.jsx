import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { submitContact } from '@/lib/contact/actions';

import { ContactForm } from './ContactForm';

vi.mock('@/lib/contact/actions', () => ({ submitContact: vi.fn() }));

const EMAIL = 'hello@example.com';

const renderForm = () => render(<ContactForm source="portfolio" email={EMAIL} />);

describe('ContactForm', () => {
  beforeEach(() => {
    vi.mocked(submitContact).mockReset();
  });

  it('labels every field', () => {
    renderForm();

    ['Name', 'Email', /company or organization/i, 'Message'].forEach((label) => {
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /privacy notice/i })).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /occasional updates/i })).not.toBeChecked();
  });

  it('shows server-side field errors, refills the values and focuses the summary', async () => {
    vi.mocked(submitContact).mockResolvedValue({
      status: 'invalid',
      fieldErrors: { email: ['Please enter a valid email address.'] },
      values: { name: 'Ada', email: 'nope', message: 'Short', consent: false },
    });
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /send message/i }));

    const emailField = await screen.findByLabelText('Email');
    await waitFor(() => expect(emailField).toHaveAttribute('aria-invalid', 'true'));
    expect(emailField).toHaveValue('nope');
    expect(emailField).toHaveAccessibleDescription('Please enter a valid email address.');
    expect(screen.getByLabelText('Name')).toHaveValue('Ada');
    expect(screen.getByLabelText('Message')).toHaveValue('Short');
    expect(screen.getByRole('link', { name: 'Please enter a valid email address.' })).toBeVisible();
    expect(document.activeElement).toHaveTextContent(/please check these fields/i);
  });

  it('offers the email address when sending fails', async () => {
    vi.mocked(submitContact).mockResolvedValue({ status: 'error', code: 'rate_limited' });
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByText(/too many messages/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: EMAIL })).toHaveAttribute('href', `mailto:${EMAIL}`);
  });

  it('replaces the form with a confirmation on success', async () => {
    vi.mocked(submitContact).mockResolvedValue({ status: 'success' });
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole('button', { name: /send message/i }));

    expect(await screen.findByRole('status')).toHaveTextContent(/message received/i);
    expect(screen.queryByRole('button', { name: /send message/i })).not.toBeInTheDocument();
  });

  it('sends the source and hides the honeypot from people', () => {
    const { container } = renderForm();

    expect(container.querySelector('input[name="source"]')).toHaveValue('portfolio');
    expect(
      container.querySelector('input[name="website"]').closest('[aria-hidden="true"]'),
    ).not.toBeNull();
    expect(container.querySelector('input[name="startedAt"]').defaultValue).toMatch(/^\d+$/);
  });
});
