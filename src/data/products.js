// Master product inventory. This array is treated as immutable (frozen) so any
// accidental mutation by the filter/sort pipeline would throw in strict mode.

const img = (seed) => `https://picsum.photos/seed/${seed}/480/360`;

const products = [
  // ---------- Electronics ----------
  { id: 1,  name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 8999,  rating: 4.6, reviews: 1284, image: img('headphones-nc') },
  { id: 2,  name: '4K Ultra HD Smart TV 43"',             category: 'Electronics', price: 28999, rating: 4.3, reviews: 842,  image: img('smart-tv') },
  { id: 3,  name: 'Bluetooth Portable Speaker',           category: 'Electronics', price: 2499,  rating: 4.1, reviews: 2210, image: img('bt-speaker') },
  { id: 4,  name: 'Mirrorless Camera Body',               category: 'Electronics', price: 54999, rating: 4.8, reviews: 312,  image: img('camera-body') },
  { id: 5,  name: 'Smartwatch Pro with AMOLED Display',   category: 'Electronics', price: 6499,  rating: 3.9, reviews: 975,  image: img('smartwatch') },
  { id: 6,  name: 'Mechanical Gaming Keyboard',           category: 'Electronics', price: 3299,  rating: 4.5, reviews: 1503, image: img('mech-keyboard') },

  // ---------- Apparel ----------
  { id: 7,  name: 'Classic Cotton Crew-Neck T-Shirt',     category: 'Apparel', price: 599,  rating: 4.0, reviews: 3120, image: img('cotton-tshirt') },
  { id: 8,  name: 'Slim-Fit Stretch Denim Jeans',         category: 'Apparel', price: 1799, rating: 4.2, reviews: 1876, image: img('denim-jeans') },
  { id: 9,  name: 'Hooded Fleece Sweatshirt',             category: 'Apparel', price: 1399, rating: 4.4, reviews: 940,  image: img('fleece-hoodie') },
  { id: 10, name: 'Floral Print Summer Dress',            category: 'Apparel', price: 1599, rating: 3.7, reviews: 520,  image: img('summer-dress') },
  { id: 11, name: 'Water-Resistant Rain Jacket',          category: 'Apparel', price: 3499, rating: 4.7, reviews: 389,  image: img('rain-jacket') },
  { id: 12, name: 'Formal Linen Shirt',                   category: 'Apparel', price: 1299, rating: 2.9, reviews: 211,  image: img('linen-shirt') },

  // ---------- Footwear ----------
  { id: 13, name: 'Running Shoes – Lightweight Mesh',     category: 'Footwear', price: 3999, rating: 4.5, reviews: 2764, image: img('running-shoes') },
  { id: 14, name: 'Leather Formal Oxford Shoes',          category: 'Footwear', price: 4599, rating: 4.1, reviews: 633,  image: img('oxford-shoes') },
  { id: 15, name: 'Casual Canvas Sneakers',               category: 'Footwear', price: 1499, rating: 3.8, reviews: 1998, image: img('canvas-sneakers') },
  { id: 16, name: 'Trekking Boots – Waterproof',          category: 'Footwear', price: 6299, rating: 4.9, reviews: 287,  image: img('trek-boots') },
  { id: 17, name: 'Comfort Slide Sandals',                category: 'Footwear', price: 499,  rating: 3.2, reviews: 4120, image: img('slide-sandals') },

  // ---------- Accessories ----------
  { id: 18, name: 'Genuine Leather Bifold Wallet',        category: 'Accessories', price: 899,  rating: 4.3, reviews: 1745, image: img('leather-wallet') },
  { id: 19, name: 'Polarized Aviator Sunglasses',         category: 'Accessories', price: 1999, rating: 4.0, reviews: 806,  image: img('aviator-sunglasses') },
  { id: 20, name: 'Anti-Theft Laptop Backpack',           category: 'Accessories', price: 2299, rating: 4.6, reviews: 2381, image: img('laptop-backpack') },
  { id: 21, name: 'Stainless Steel Analog Watch',         category: 'Accessories', price: 7499, rating: 4.4, reviews: 458,  image: img('analog-watch') },
  { id: 22, name: 'Woolen Winter Scarf',                  category: 'Accessories', price: 449,  rating: 2.6, reviews: 132,  image: img('wool-scarf') },

  // ---------- Home & Kitchen ----------
  { id: 23, name: 'Stainless Steel Insulated Bottle 1L',  category: 'Home & Kitchen', price: 799,  rating: 4.7, reviews: 5210, image: img('steel-bottle') },
  { id: 24, name: 'Air Fryer 4.5L Digital',               category: 'Home & Kitchen', price: 5499, rating: 4.4, reviews: 3377, image: img('air-fryer') },
  { id: 25, name: 'Non-Stick Cookware Set (5 pcs)',       category: 'Home & Kitchen', price: 2799, rating: 3.6, reviews: 764,  image: img('cookware-set') },
  { id: 26, name: 'Ceramic Dinner Plate Set (12 pcs)',    category: 'Home & Kitchen', price: 1899, rating: 1.8, reviews: 96,   image: img('dinner-plates') },
];

export default Object.freeze(products.map((p) => Object.freeze(p)));
