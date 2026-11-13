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
    await user.click(screen.getByLabelText(/Footwear/));
    const footwear = products.filter((p) => p.category === 'Footwear').length;
    expect(count()).toBe(footwear);

    await user.click(screen.getByLabelText(/Apparel/));
    const both = products.filter((p) => ['Footwear', 'Apparel'].includes(p.category)).length;
    expect(count()).toBe(both);

    await user.click(screen.getByLabelText(/Footwear/)); // uncheck
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
    await user.click(screen.getByLabelText(/Electronics/));
    fireEvent.change(screen.getByLabelText('Maximum price'), { target: { value: '1000' } });

    expect(screen.getByText('No items match your criteria')).toBeTruthy();
    expect(document.querySelector('.grid')).toBeNull();

    await user.click(screen.getByRole('button', { name: 'Reset Filters' }));
    expect(count()).toBe(products.length);
    expect(screen.queryByText('No items match your criteria')).toBeNull();
    expect(screen.getByLabelText(/Electronics/).checked).toBe(false);
    expect(screen.getByLabelText('Maximum price').value).toBe(String(Math.max(...products.map((p) => p.price))));
    expect(screen.getAllByRole('radio')[0].checked).toBe(true);
  });

  it('sidebar Reset all restores defaults', async () => {
    const user = userEvent.setup();
    render(<App />);
    const reset = screen.getByRole('button', { name: 'Reset all' });
    expect(reset.disabled).toBe(true);
    await user.click(screen.getByLabelText(/Apparel/));
    expect(reset.disabled).toBe(false);
    await user.click(reset);
    expect(count()).toBe(products.length);
  });

  it('sorting works on filtered results and does not change the count', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByLabelText(/Footwear/));
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
});
