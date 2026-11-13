// Master product inventory. This array is treated as immutable (frozen) so any
// accidental mutation by the filter/sort pipeline would throw in strict mode.

// Real product photos from Pexels (free to use). Keyed by product id.
// If a photo fails to load, <ProductImage> swaps in a generated fallback.
const PEXELS = {
  1: 3394650, 2: 5202925, 3: 31683433, 4: 11486464, 5: 267394, 6: 841228,
  7: 11671964, 8: 4109760, 9: 1482476, 10: 4352249, 11: 27255129, 12: 7432216,
  13: 1456705, 14: 2857040, 15: 2530912, 16: 10433248, 17: 18186215,
  18: 915917, 19: 1705391, 20: 16359299, 21: 190819, 22: 1903760,
  23: 3737800, 24: 35285814, 25: 28726706, 26: 290524,
};
const img = (id) =>
  `https://images.pexels.com/photos/${PEXELS[id]}/pexels-photo-${PEXELS[id]}.jpeg?auto=compress&cs=tinysrgb&w=640&h=480&fit=crop`;

const products = [
  // ---------- Electronics ----------
  { id: 1,  name: 'Wireless Noise-Cancelling Headphones', category: 'Electronics', price: 8999,  rating: 4.6, reviews: 1284, image: img(1, 'headphones') },
  { id: 2,  name: '4K Ultra HD Smart TV 43"',             category: 'Electronics', price: 28999, rating: 4.3, reviews: 842,  image: img(2, 'television') },
  { id: 3,  name: 'Bluetooth Portable Speaker',           category: 'Electronics', price: 2499,  rating: 4.1, reviews: 2210, image: img(3, 'speaker') },
  { id: 4,  name: 'Mirrorless Camera Body',               category: 'Electronics', price: 54999, rating: 4.8, reviews: 312,  image: img(4, 'camera') },
  { id: 5,  name: 'Smartwatch Pro with AMOLED Display',   category: 'Electronics', price: 6499,  rating: 3.9, reviews: 975,  image: img(5, 'smartwatch') },
  { id: 6,  name: 'Mechanical Gaming Keyboard',           category: 'Electronics', price: 3299,  rating: 4.5, reviews: 1503, image: img(6, 'keyboard') },

  // ---------- Apparel ----------
  { id: 7,  name: 'Classic Cotton Crew-Neck T-Shirt',     category: 'Apparel', price: 599,  rating: 4.0, reviews: 3120, image: img(7, 'tshirt') },
  { id: 8,  name: 'Slim-Fit Stretch Denim Jeans',         category: 'Apparel', price: 1799, rating: 4.2, reviews: 1876, image: img(8, 'jeans') },
  { id: 9,  name: 'Hooded Fleece Sweatshirt',             category: 'Apparel', price: 1399, rating: 4.4, reviews: 940,  image: img(9, 'hoodie') },
  { id: 10, name: 'Floral Print Summer Dress',            category: 'Apparel', price: 1599, rating: 3.7, reviews: 520,  image: img(10, 'dress') },
  { id: 11, name: 'Water-Resistant Rain Jacket',          category: 'Apparel', price: 3499, rating: 4.7, reviews: 389,  image: img(11, 'jacket') },
  { id: 12, name: 'Formal Linen Shirt',                   category: 'Apparel', price: 1299, rating: 2.9, reviews: 211,  image: img(12, 'shirt') },

  // ---------- Footwear ----------
  { id: 13, name: 'Running Shoes – Lightweight Mesh',     category: 'Footwear', price: 3999, rating: 4.5, reviews: 2764, image: img(13, 'running,shoes') },
  { id: 14, name: 'Leather Formal Oxford Shoes',          category: 'Footwear', price: 4599, rating: 4.1, reviews: 633,  image: img(14, 'leather,shoes') },
  { id: 15, name: 'Casual Canvas Sneakers',               category: 'Footwear', price: 1499, rating: 3.8, reviews: 1998, image: img(15, 'sneakers') },
  { id: 16, name: 'Trekking Boots – Waterproof',          category: 'Footwear', price: 6299, rating: 4.9, reviews: 287,  image: img(16, 'hiking,boots') },
  { id: 17, name: 'Comfort Slide Sandals',                category: 'Footwear', price: 499,  rating: 3.2, reviews: 4120, image: img(17, 'sandals') },

  // ---------- Accessories ----------
  { id: 18, name: 'Genuine Leather Bifold Wallet',        category: 'Accessories', price: 899,  rating: 4.3, reviews: 1745, image: img(18, 'wallet') },
  { id: 19, name: 'Polarized Aviator Sunglasses',         category: 'Accessories', price: 1999, rating: 4.0, reviews: 806,  image: img(19, 'sunglasses') },
  { id: 20, name: 'Anti-Theft Laptop Backpack',           category: 'Accessories', price: 2299, rating: 4.6, reviews: 2381, image: img(20, 'backpack') },
  { id: 21, name: 'Stainless Steel Analog Watch',         category: 'Accessories', price: 7499, rating: 4.4, reviews: 458,  image: img(21, 'wristwatch') },
  { id: 22, name: 'Woolen Winter Scarf',                  category: 'Accessories', price: 449,  rating: 2.6, reviews: 132,  image: img(22, 'scarf') },

  // ---------- Home & Kitchen ----------
  { id: 23, name: 'Stainless Steel Insulated Bottle 1L',  category: 'Home & Kitchen', price: 799,  rating: 4.7, reviews: 5210, image: img(23, 'water,bottle') },
  { id: 24, name: 'Air Fryer 4.5L Digital',               category: 'Home & Kitchen', price: 5499, rating: 4.4, reviews: 3377, image: img(24, 'kitchen,appliance') },
  { id: 25, name: 'Non-Stick Cookware Set (5 pcs)',       category: 'Home & Kitchen', price: 2799, rating: 3.6, reviews: 764,  image: img(25, 'cookware') },
  { id: 26, name: 'Ceramic Dinner Plate Set (12 pcs)',    category: 'Home & Kitchen', price: 1899, rating: 1.8, reviews: 96,   image: img(26, 'plates,dishes') },
];

export default Object.freeze(products.map((p) => Object.freeze(p)));
