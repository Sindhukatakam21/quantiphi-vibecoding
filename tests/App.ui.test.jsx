// @vitest-environment jsdom
import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../src/App.jsx';
import products from '../src/data/products.js';

afterEach(cleanup);

const count = () => Number(document.querySelector('.result-count strong').textContent);
const titles = () => [...document.querySelectorAll('.card-title')].map((n) => n.textContent);
const prices = () =>
  [...document.querySelectorAll('.card-price')].map((n) => Number(n.textContent.replace(/[^\d]/g, '')));

describe('E-commerce multi-filter UI', () => {
  it('shows the full inventory initially', () => {
    render(<App />);
    expect(count()).toBe(products.length);
    expect(document.querySelectorAll('.card').length).toBe(products.length);
  });

  it('category checkboxes filter instantly with OR logic', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('checkbox', { name: /Footwear/ }));
    const footwear = products.filter((p) => p.category === 'Footwear').length;
    expect(count()).toBe(footwear);

    await user.click(screen.getByRole('checkbox', { name: /Apparel/ }));
    const both = products.filter((p) => ['Footwear', 'Apparel'].includes(p.category)).length;
    expect(count()).toBe(both);

    await user.click(screen.getByRole('checkbox', { name: /Footwear/ })); // uncheck
    expect(count()).toBe(products.filter((p) => p.category === 'Apparel').length);
  });

  it('rating radio: 4 stars shows only products rated 4 or above', async () => {
    const user = userEvent.setup();
    render(<App />);
    const radios = screen.getAllByRole('radio');
    await user.click(radios[4]); // value 4
    expect(count()).toBe(products.filter((p) => p.rating >= 4).length);
  });

  it('price sliders narrow the range and handles cannot cross', () => {
    render(<App />);
    const min = screen.getByLabelText('Minimum price');
    const max = screen.getByLabelText('Maximum price');
    fireEvent.change(max, { target: { value: '2000' } });
    expect(prices().every((p) => p <= 2000)).toBe(true);
    expect(count()).toBe(products.filter((p) => p.price <= 2000).length);

    fireEvent.change(min, { target: { value: '1000' } });
    expect(prices().every((p) => p >= 1000 && p <= 2000)).toBe(true);

    // try to push min above max -> clamped just below max
    fireEvent.change(min, { target: { value: '5000' } });
    expect(Number(min.value)).toBeLessThan(Number(max.value));
  });

  it('combined filters + empty state + reset button', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('checkbox', { name: /Electronics/ }));
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '1000' } });

    expect(screen.getByText('No items match your criteria')).toBeTruthy();
    expect(document.querySelector('.grid')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(count()).toBe(products.length);
    expect(screen.queryByText('No items match your criteria')).toBeNull();
    expect(screen.getByRole('checkbox', { name: /Electronics/ }).checked).toBe(false);
    expect(screen.getByLabelText('Maximum price').value).toBe(String(Math.max(...products.map((p) => p.price))));
    expect(screen.getAllByRole('radio')[0].checked).toBe(true);
  });

  it('sidebar Reset all restores defaults', async () => {
    const user = userEvent.setup();
    render(<App />);
    const reset = screen.getByRole('button', { name: 'Reset all' });
    expect(reset.disabled).toBe(true);
    await user.click(screen.getByRole('checkbox', { name: /Apparel/ }));
    expect(reset.disabled).toBe(false);
    await user.click(reset);
    expect(count()).toBe(products.length);
  });

  it('sorting works on filtered results and does not change the count', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('checkbox', { name: /Footwear/ }));
    const n = count();

    await user.selectOptions(screen.getByRole('combobox'), 'Price: Low to High');
    expect(count()).toBe(n);
    const p = prices();
    expect([...p].sort((a, b) => a - b)).toEqual(p);

    await user.selectOptions(screen.getByRole('combobox'), 'Top Rated First');
    const ratings = [...document.querySelectorAll('.stars-row')].map((el) =>
      Number(el.querySelector('.rating-value').textContent)
    );
    expect([...ratings].sort((a, b) => b - a)).toEqual(ratings);

    await user.selectOptions(screen.getByRole('combobox'), 'Default');
    const defaultOrder = products.filter((x) => x.category === 'Footwear').map((x) => x.name);
    expect(titles()).toEqual(defaultOrder);
  });

  // ---------- New: images, cards, cart, chips, mobile filter drawer ----------

  it('every card shows an image, name, rating, price and an Add to Cart button', () => {
    render(<App />);
    const cards = document.querySelectorAll('.card');
    expect(cards.length).toBe(products.length);
    cards.forEach((card) => {
      expect(card.querySelector('img').getAttribute('src')).toBeTruthy();
      expect(card.querySelector('.card-title').textContent).toBeTruthy();
      expect(card.querySelector('.rating-value')).toBeTruthy();
      expect(card.querySelector('.card-price')).toBeTruthy();
      expect(card.querySelector('.btn-cart').textContent).toBe('Add to Cart');
    });
  });

  it('falls back to a generated image when a product image fails to load', () => {
    render(<App />);
    const img = document.querySelector('.card img');
    const original = img.getAttribute('src');
    expect(original).toMatch(/^https:\/\//);
    fireEvent.error(img);
    const after = document.querySelector('.card img');
    expect(after.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(after.getAttribute('data-fallback')).toBe('true');
    // a second error must not loop or throw
    fireEvent.error(after);
    expect(document.querySelector('.card img').getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
  });

  it('Add to Cart updates the card, header badge, and cart drawer totals', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(screen.queryByTestId('cart-count')).toBeNull();

    const first = products[0];
    const addBtn = screen.getByRole('button', { name: `Add ${first.name} to cart` });
    await user.click(addBtn);
    await user.click(addBtn);
    expect(addBtn.textContent).toContain('Added (2)');
    expect(screen.getByTestId('cart-count').textContent).toBe('2');

    const second = products[6];
    await user.click(screen.getByRole('button', { name: `Add ${second.name} to cart` }));
    expect(screen.getByTestId('cart-count').textContent).toBe('3');

    await user.click(screen.getByRole('button', { name: /Open cart/ }));
    const drawer = screen.getByRole('dialog', { hidden: true });
    expect(drawer.className).toContain('open');
    const expected = first.price * 2 + second.price;
    expect(Number(screen.getByTestId('cart-subtotal').textContent.replace(/[^\d]/g, ''))).toBe(expected);

    // quantity controls
    await user.click(within(drawer).getByRole('button', { name: `Increase quantity of ${second.name}` }));
    expect(screen.getByTestId('cart-count').textContent).toBe('4');
    await user.click(within(drawer).getByRole('button', { name: `Decrease quantity of ${first.name}` }));
    expect(screen.getByTestId('cart-count').textContent).toBe('3');

    // remove + clear
    await user.click(within(drawer).getByRole('button', { name: `Remove ${second.name} from cart` }));
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    await user.click(within(drawer).getByRole('button', { name: 'Clear cart' }));
    expect(screen.queryByTestId('cart-count')).toBeNull();
    expect(within(drawer).getByText('Your cart is empty')).toBeTruthy();

    // close with Escape
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(drawer.className).not.toContain('open');
  });

  it('cart contents survive filtering and sorting', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: `Add ${products[0].name} to cart` }));
    await user.click(screen.getByRole('checkbox', { name: /Footwear/ })); // hides the item
    expect(screen.getByTestId('cart-count').textContent).toBe('1');
    await user.click(screen.getByRole('checkbox', { name: /Footwear/ })); // shows it again
    expect(screen.getByRole('button', { name: `Add ${products[0].name} to cart` }).textContent).toContain('Added (1)');
  });

  it('active filter chips appear, remove individual filters, and clear all', async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(document.querySelector('.chips')).toBeNull();

    await user.click(screen.getByRole('checkbox', { name: /Apparel/ }));
    await user.click(screen.getAllByRole('radio')[3]); // 3 stars
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '3000' } });
    expect(document.querySelectorAll('.chip').length).toBe(3);

    await user.click(screen.getByRole('button', { name: 'Remove Apparel filter' }));
    expect(screen.getByRole('checkbox', { name: /Apparel/ }).checked).toBe(false);
    expect(document.querySelectorAll('.chip').length).toBe(2);

    await user.click(screen.getByRole('button', { name: 'Remove rating filter' }));
    expect(screen.getAllByRole('radio')[0].checked).toBe(true);

    await user.click(screen.getByRole('button', { name: 'Remove price filter' }));
    expect(document.querySelector('.chips')).toBeNull();
    expect(count()).toBe(products.length);

    await user.click(screen.getByRole('checkbox', { name: /Footwear/ }));
    await user.click(screen.getByRole('button', { name: 'Clear all' }));
    expect(count()).toBe(products.length);
  });

  it('mobile filter drawer opens, shows live count, and closes via button, backdrop and Escape', async () => {
    const user = userEvent.setup();
    render(<App />);
    const wrap = document.getElementById('filter-panel');
    expect(wrap.className).not.toContain('open');

    await user.click(screen.getByRole('button', { name: /Filters/ }));
    expect(wrap.className).toContain('open');

    await user.click(screen.getByRole('checkbox', { name: /Footwear/ }));
    const n = products.filter((p) => p.category === 'Footwear').length;
    const showBtn = screen.getByRole('button', { name: `Show ${n} products` });
    await user.click(showBtn);
    expect(wrap.className).not.toContain('open');

    await user.click(screen.getByRole('button', { name: /Filters/ }));
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(wrap.className).not.toContain('open');

    await user.click(screen.getByRole('button', { name: /Filters/ }));
    await user.click(document.querySelector('.layout > .backdrop'));
    expect(wrap.className).not.toContain('open');
  });
});
