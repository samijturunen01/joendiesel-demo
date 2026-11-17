import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { App } from './App';
import { pages, prerenderPaths } from './data/site';

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('routes', () => {
  it.each(prerenderPaths)('%s renders one h1, header and footer', (path) => {
    renderAt(path);
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('shows the branded 404 for unknown paths', () => {
    renderAt('/ei-tallaista');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/linja.*tukossa/i);
  });

  it('labels the site as a concept demo', () => {
    renderAt('/');
    expect(screen.getAllByText(/Konseptidemo/).length).toBeGreaterThan(0);
  });
});

describe('Laitehaku (equipment finder)', () => {
  it('updates the measuring glasses and result for the chosen manufacturer and component', async () => {
    const user = userEvent.setup();
    renderAt(pages.home.path);
    const finder = screen.getByRole('heading', { name: 'Huollammeko laitteesi?' }).closest('section')!;
    const f = within(finder);

    expect(f.getByText(/7\/7 laitetyyppiä/)).toBeInTheDocument();
    await user.click(f.getByRole('radio', { name: /Stanadyne/ }));
    expect(f.getByText(/2\/7 laitetyyppiä/)).toBeInTheDocument();

    await user.click(f.getByRole('radio', { name: /Denso/ }));
    await user.click(f.getByRole('button', { name: /CR-suuttimet/ }));
    expect(f.getByRole('heading', { level: 3 })).toHaveTextContent('Denso – common rail -suuttimet');
    expect(f.getByRole('link', { name: /Pyydä tarjous tästä/ })).toHaveAttribute(
      'href',
      '/yhteystiedot?aihe=common-rail&valmistaja=denso&laite=cr-suuttimet#tarjouspyynto',
    );
  });
});

describe('inquiry form (demo)', () => {
  it('validates, then shows the demo notice instead of a delivery confirmation', async () => {
    const user = userEvent.setup();
    renderAt(pages.contact.path);
    const form = screen.getByRole('heading', { name: 'Kerro laitteesta.' }).closest('section')!;
    const f = within(form);

    await user.click(f.getByRole('button', { name: /Kokeile lähetystä/ }));
    expect(await f.findByRole('alert')).toHaveTextContent(/Tarkista 4 kohtaa/);
    expect(f.getByLabelText(/^Nimi/)).toHaveAttribute('aria-invalid', 'true');

    await user.selectOptions(f.getByLabelText(/^Aihe/), 'common-rail');
    await user.type(f.getByLabelText(/^Viesti/), 'Suutin vuotaa, pyydän tarjousta.');
    await user.type(f.getByLabelText(/^Nimi/), 'Testi Asiakas');
    await user.type(f.getByLabelText(/^Puhelinnumero/), '040 123 4567');
    await user.click(f.getByRole('button', { name: /Kokeile lähetystä/ }));

    expect(await f.findByText('Demoversio – viestiä ei lähetetty.', {}, { timeout: 3000 })).toBeInTheDocument();
    expect(f.queryByText(/Kiitos – viesti on vastaanotettu/)).not.toBeInTheDocument();
  });

  it('pre-selects values from the URL', async () => {
    renderAt('/yhteystiedot?aihe=varaosat&valmistaja=bosch&laite=vp');
    expect(await screen.findByDisplayValue('Varaosat ja tarvikkeet')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Bosch')).toBeInTheDocument();
    expect(screen.getByDisplayValue('VP30- ja VP44-jakajapumput')).toBeInTheDocument();
  });
});
