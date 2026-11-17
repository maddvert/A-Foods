import { MenuItem } from '../types/restaurant';

export const RESTAURANT_COORDINATES = {
  lat: 24.9961,
  lng: 67.0655,
  name: 'A. FOODS',
  mapsUrl: 'https://maps.app.goo.gl/2fzgaM6cwhQF1mii6',
};

export const RESTAURANT_INFO = {
  name: 'A. FOODS',
  tagline: 'Pizza, Samosas, Chaat, Gol Gappay & Chicken Cheese Rolls',
  phone: '0303-3477887',
  phoneClean: '+923033477887',
  whatsappUrl: 'https://wa.me/923033477887',
  address: 'Main Commercial Market, Near 4K Chowrangi, North Karachi',
  timings: 'Open Daily: 12:00 PM – 2:00 AM',
  deliveryTime: '30 - 45 Mins',
  baseDeliveryDistanceKm: 3.0,
  baseDeliveryFee: 100, // 4K Chowrangi benchmark = Rs. 100
  perKmExtraFee: 25,
  freeDeliveryThreshold: 2000,
};

// Comprehensive list of Karachi delivery areas as shown in reference video
export const KARACHI_AREAS: { name: string; distanceKm: number; deliveryFee: number }[] = [
  { name: '4K Chowrangi', distanceKm: 2.2, deliveryFee: 100 },
  { name: 'Askari 4', distanceKm: 14.5, deliveryFee: 350 },
  { name: 'Bahadurabad', distanceKm: 16.0, deliveryFee: 380 },
  { name: 'Bahria Town', distanceKm: 28.0, deliveryFee: 600 },
  { name: 'Bufferzone', distanceKm: 4.8, deliveryFee: 150 },
  { name: 'Defence View Phase 1', distanceKm: 19.5, deliveryFee: 420 },
  { name: 'DHA Phase 1', distanceKm: 21.0, deliveryFee: 450 },
  { name: 'DHA Phase 2', distanceKm: 21.5, deliveryFee: 450 },
  { name: 'DHA Phase 4', distanceKm: 22.0, deliveryFee: 460 },
  { name: 'DHA Phase 5', distanceKm: 23.5, deliveryFee: 480 },
  { name: 'DHA Phase 6', distanceKm: 24.5, deliveryFee: 500 },
  { name: 'DHA Phase 7', distanceKm: 25.0, deliveryFee: 500 },
  { name: 'DHA Phase 8', distanceKm: 26.5, deliveryFee: 520 },
  { name: 'Farm House (Gadap / Malir)', distanceKm: 22.0, deliveryFee: 460 },
  { name: 'FB Area Block 1 - 5', distanceKm: 8.5, deliveryFee: 240 },
  { name: 'FB Area Block 6 - 10', distanceKm: 9.5, deliveryFee: 260 },
  { name: 'FB Area Block 11 - 15', distanceKm: 10.5, deliveryFee: 280 },
  { name: 'FB Area Block 16 - 20', distanceKm: 11.5, deliveryFee: 300 },
  { name: 'Gulshan-e-Iqbal - Block 1 - 5', distanceKm: 12.0, deliveryFee: 300 },
  { name: 'Gulshan-e-Iqbal - Block 6 - 10', distanceKm: 13.0, deliveryFee: 320 },
  { name: 'Gulshan-e-Iqbal - Block 11 - 15', distanceKm: 14.0, deliveryFee: 340 },
  { name: 'Gulshan-e-Iqbal - Block 16 - 19', distanceKm: 15.0, deliveryFee: 360 },
  { name: 'Gulshan-e-Maymar', distanceKm: 9.0, deliveryFee: 250 },
  { name: 'Gulistan-e-Johar - Block 1 - 6', distanceKm: 15.5, deliveryFee: 360 },
  { name: 'Gulistan-e-Johar - Block 7 - 13', distanceKm: 16.5, deliveryFee: 380 },
  { name: 'Gulistan-e-Johar - Block 14 - 20', distanceKm: 17.5, deliveryFee: 400 },
  { name: 'Haroon Square', distanceKm: 11.0, deliveryFee: 290 },
  { name: 'Korangi', distanceKm: 22.0, deliveryFee: 460 },
  { name: 'Malir', distanceKm: 20.0, deliveryFee: 440 },
  { name: 'Nazimabad (All Blocks)', distanceKm: 10.5, deliveryFee: 280 },
  { name: 'North Karachi (Sector 5 - 11)', distanceKm: 2.5, deliveryFee: 100 },
  { name: 'North Nazimabad (All Blocks)', distanceKm: 7.5, deliveryFee: 220 },
  { name: 'Powerhouse Chowrangi', distanceKm: 3.5, deliveryFee: 150 },
  { name: 'Scheme 33', distanceKm: 12.5, deliveryFee: 310 },
  { name: 'Shadman 1', distanceKm: 6.2, deliveryFee: 190 },
  { name: 'Shadman 2', distanceKm: 6.8, deliveryFee: 200 },
  { name: 'Surjani Town', distanceKm: 2.8, deliveryFee: 100 },
  { name: 'UP More', distanceKm: 4.1, deliveryFee: 150 },
];

export const POPULAR_DELIVERY_AREAS = KARACHI_AREAS;

export function calculateDistanceAndFee(
  userLat?: number,
  userLng?: number,
  areaName?: string
): { distanceKm: number; deliveryFee: number } {
  if (userLat && userLng) {
    const R = 6371;
    const dLat = ((userLat - RESTAURANT_COORDINATES.lat) * Math.PI) / 180;
    const dLon = ((userLng - RESTAURANT_COORDINATES.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((RESTAURANT_COORDINATES.lat * Math.PI) / 180) *
        Math.cos((userLat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightDistance = R * c;
    const roadDistance = Math.max(1.5, Math.round(straightDistance * 1.35 * 10) / 10);

    let fee = 100;
    if (roadDistance > 3.0) {
      fee = 100 + Math.ceil(roadDistance - 3.0) * 25;
    }
    return { distanceKm: roadDistance, deliveryFee: fee };
  }

  if (areaName) {
    const matched = KARACHI_AREAS.find((a) =>
      areaName.toLowerCase().includes(a.name.toLowerCase())
    );
    if (matched) {
      return { distanceKm: matched.distanceKm, deliveryFee: matched.deliveryFee };
    }
  }

  return { distanceKm: 2.2, deliveryFee: 100 };
}

// STRICTLY ITEMS FROM USER REFERENCE BANNER IMAGE (PAKORAS, SAMOSAS, CHAAT, GOL GAPPAY, ROLLS & KABABS)
export const MENU_ITEMS: MenuItem[] = [
  // --- PIZZA CATEGORY ---
  {
    id: 'pizza-chicken-tikka',
    name: 'Special Chicken Tikka Supreme Pizza',
    description: 'Crispy hand-stretched crust topped with traditional spiced chicken tikka chunks, rich pizza sauce, sliced onions, capsicum, and 100% mozzarella cheese melted to perfection.',
    category: 'pizza',
    basePrice: 590,
    image: '/src/assets/images/menu_supreme_pizza_1794312536282.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Medium',
    sizes: [
      { name: 'Small (7")', priceDelta: 0, serves: '1 Person' },
      { name: 'Medium (10")', priceDelta: 450, serves: '2-3 Persons' },
      { name: 'Large (13")', priceDelta: 950, serves: '4-5 Persons' },
    ],
    crusts: [
      { name: 'Regular Pan Crust', priceDelta: 0 },
      { name: 'Cheese Stuffed Rim Crust', priceDelta: 180 },
    ],
    availableAddOns: [
      { id: 'extra-cheese', name: 'Extra Mozzarella Melt', price: 120 },
      { id: 'extra-dip', name: 'Garlic Herb Dipping Sauce', price: 60 },
    ],
  },
  {
    id: 'pizza-fajita-sicilian',
    name: 'Spicy Chicken Fajita Pizza',
    description: 'Loaded with smoky spiced chicken fajita slices, diced bell peppers, sweet red onions, mushrooms, and golden bubbling cheddar mozzarella blend.',
    category: 'pizza',
    basePrice: 620,
    image: '/src/assets/images/menu_supreme_pizza_1794312536282.jpg',
    isPopular: true,
    spiceLevel: 'Spicy Hot',
    sizes: [
      { name: 'Small (7")', priceDelta: 0, serves: '1 Person' },
      { name: 'Medium (10")', priceDelta: 450, serves: '2-3 Persons' },
      { name: 'Large (13")', priceDelta: 950, serves: '4-5 Persons' },
    ],
    crusts: [
      { name: 'Regular Pan Crust', priceDelta: 0 },
      { name: 'Cheese Stuffed Rim Crust', priceDelta: 180 },
    ],
    availableAddOns: [
      { id: 'extra-cheese', name: 'Extra Mozzarella Melt', price: 120 },
      { id: 'drink-can', name: 'Add Chilled Cold Drink 345ml', price: 100 },
    ],
  },

  // --- PAKORAS CATEGORY ---
  {
    id: 'item-mix-pakoras',
    name: 'Crispy Mix Pakoras (Plate / 250g)',
    description: 'Crisp and crunchy traditional golden vegetable fritters loaded with thinly sliced onions, potatoes, spinach, crushed coriander, and roasted cumin seeds. Served hot with fresh mint raita.',
    category: 'pakoras',
    basePrice: 180,
    image: '/src/assets/images/menu_crispy_pakoras_1794396328427.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-raita', name: 'Extra Mint Raita Cup', price: 50 },
      { id: 'chilli-chutney', name: 'Spicy Green Chili Dip', price: 40 },
    ],
  },
  {
    id: 'item-chicken-pakoras',
    name: 'Crispy Chicken Pakoras (Plate / 250g)',
    description: 'Bite-sized boneless chicken pieces marinated in authentic Karachi spices, coated in seasoned gram flour batter, and deep-fried to crispy perfection. Served with onion rings and mint chutney.',
    category: 'pakoras',
    basePrice: 320,
    image: '/src/assets/images/menu_crispy_pakoras_1794396328427.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Spicy Hot',
    availableAddOns: [
      { id: 'extra-portion', name: 'Extra 100g Chicken Pakoras', price: 140 },
      { id: 'extra-raita', name: 'Extra Mint Raita Cup', price: 50 },
    ],
  },

  // --- KABABS CATEGORY ---
  {
    id: 'item-chapli-kabab',
    name: 'Peshawari Chapli Kabab (2 Pcs)',
    description: 'Authentic spiced ground meat patties infused with crushed coriander, pomegranate seeds, roasted cumin, topped with fresh sliced tomatoes and green chilies, pan-fried on a traditional flat tawa.',
    category: 'kababs',
    basePrice: 380,
    image: '/src/assets/images/menu_samosas_chapli_1794313770709.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Spicy Hot',
    availableAddOns: [
      { id: 'extra-kabab', name: '1 Extra Chapli Kabab', price: 180 },
      { id: 'mint-raita', name: 'Extra Mint Raita & Salad', price: 60 },
      { id: 'fresh-naan', name: 'Fresh Hot Naan / Roti', price: 40 },
    ],
  },
  {
    id: 'item-shami-kabab',
    name: 'Crispy Shami Kabab (4 Pcs)',
    description: 'Tender pan-fried shami kababs made with finely minced meat, chana daal, aromatic herbs, and traditional spices. Pan-seared with egg wash until golden brown and crispy on the edges.',
    category: 'kababs',
    basePrice: 320,
    image: '/src/assets/images/menu_samosas_chapli_1794313770709.jpg',
    isPopular: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-shami', name: '2 Extra Shami Kababs', price: 150 },
      { id: 'fresh-buns', name: '2 Fresh Bakery Buns', price: 50 },
    ],
  },

  // --- CHAAT & GOL GAPPAY CATEGORY ---
  {
    id: 'item-gol-gappay',
    name: 'Special Crunchy Gol Gappay Platter (10 Pcs)',
    description: 'Crispy round semolina puris filled with boiled chickpeas and diced spiced potatoes, accompanied by chilled tangy khatta mint water and sweet tamarind sonth chutney.',
    category: 'chaat',
    basePrice: 240,
    image: '/src/assets/images/menu_gol_gappay_1794313770478.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-pani', name: 'Extra Chilled Khatta Water Bottle', price: 50 },
      { id: 'extra-puris', name: '5 Extra Puris', price: 90 },
      { id: 'sweet-water', name: 'Extra Meetha Water Bowl', price: 40 },
    ],
  },
  {
    id: 'item-dahi-baray',
    name: 'Special Meethi Dahi Baray (Bowl)',
    description: 'Soft melt-in-the-mouth lentil dumplings submerged in thick sweetened creamy yogurt, drizzled with sweet tamarind sonth, roasted cumin powder, and chaat masala.',
    category: 'chaat',
    basePrice: 240,
    image: '/src/assets/images/menu_dahi_baray_1794313769535.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Mild',
    availableAddOns: [
      { id: 'extra-papdi', name: 'Extra Crunchy Papdi Bag', price: 50 },
      { id: 'extra-yogurt', name: 'Extra Thick Sweet Curd', price: 60 },
    ],
  },
  {
    id: 'item-papdi-chaat',
    name: 'Crispy Papdi Chaat (Bowl)',
    description: 'Crunchy fried pastry crisps layered with spiced boiled chickpeas, potatoes, chopped red onions, tomatoes, sweetened yogurt, and tangy imli chutney sprinkles.',
    category: 'chaat',
    basePrice: 220,
    image: '/src/assets/images/menu_papdi_chaat_1794396329733.jpg',
    isPopular: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-papdi', name: 'Extra Crunchy Papdi Cup', price: 40 },
      { id: 'extra-chutney', name: 'Extra Tamarind Chutney Dip', price: 30 },
    ],
  },
  {
    id: 'item-chana-chaat',
    name: 'Karachi Spiced Chana Chaat Bowl',
    description: 'Tender black and white chickpeas tossed with cubed boiled potatoes, crisp onions, juicy diced tomatoes, fresh green coriander, zesty lemon juice, and tangy tamarind.',
    category: 'chaat',
    basePrice: 200,
    image: '/src/assets/images/menu_dahi_baray_1794313769535.jpg',
    isPopular: false,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-papdi', name: 'Add Crunchy Papdi on Top', price: 40 },
      { id: 'lemon-twist', name: 'Extra Lemon & Green Chili Garnish', price: 20 },
    ],
  },

  // --- SAMOSAS CATEGORY ---
  {
    id: 'item-potato-samosas',
    name: 'Crispy Potato Samosas (4 Pcs)',
    description: 'Classic flaky golden fried triangular samosas stuffed with seasoned potato mash, whole cumin, crushed coriander seeds, and green peas. Served with sweet and sour tamarind chutney.',
    category: 'samosas',
    basePrice: 180,
    image: '/src/assets/images/menu_samosas_chapli_1794313770709.jpg',
    isPopular: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-chutney', name: 'Extra Imli Tamarind Dip', price: 30 },
      { id: 'samosa-pair', name: 'Add 2 Extra Potato Samosas', price: 80 },
    ],
  },
  {
    id: 'item-chicken-samosas',
    name: 'Crispy Chicken Samosas (4 Pcs)',
    description: 'Crispy golden thin pastry cones filled with savory seasoned minced chicken, herbs, spring onions, and roasted spices. Golden fried to a crunchy finish.',
    category: 'samosas',
    basePrice: 260,
    image: '/src/assets/images/menu_samosas_chapli_1794313770709.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-chutney', name: 'Extra Mint Green Chutney', price: 30 },
      { id: 'samosa-pair', name: 'Add 2 Extra Chicken Samosas', price: 120 },
    ],
  },

  // --- ROLLS CATEGORY ---
  {
    id: 'roll-chicken-cheese',
    name: 'Chicken Cheese Roll (2 Pcs)',
    description: 'Succulent spiced shredded chicken and melted gooey mozzarella cheese rolled in soft golden fried crusts, toasted until crisp on the outside with molten cheese on the inside.',
    category: 'rolls',
    basePrice: 320,
    image: '/src/assets/images/menu_chicken_cheese_roll_1794396329122.jpg',
    isPopular: true,
    isChefSpecial: true,
    spiceLevel: 'Medium',
    availableAddOns: [
      { id: 'extra-cheese', name: 'Extra Molten Mozzarella Fill', price: 70 },
      { id: 'garlic-mayo', name: 'Signature Garlic Mayo Dip', price: 50 },
    ],
  },
  {
    id: 'roll-chicken-spring',
    name: 'Crispy Chicken Spring Rolls (4 Pcs)',
    description: 'Golden-fried crunchy pastry rolls filled with shredded tender chicken, sautéed julienned carrots, fresh cabbage, and oriental spices. Served with sweet chili dipping sauce.',
    category: 'rolls',
    basePrice: 280,
    image: '/src/assets/images/menu_paratha_roll_1794312535890.jpg',
    isPopular: true,
    spiceLevel: 'Mild',
    availableAddOns: [
      { id: 'sweet-chili', name: 'Extra Sweet Chili Sauce Cup', price: 40 },
    ],
  },
  {
    id: 'roll-vegetable-spring',
    name: 'Crispy Vegetable Spring Rolls (4 Pcs)',
    description: 'Delicate crispy rolled wrappers packed with seasoned stir-fried cabbage, shredded carrots, green bell peppers, and crushed black pepper. Golden fried and deliciously crunchy.',
    category: 'rolls',
    basePrice: 220,
    image: '/src/assets/images/menu_paratha_roll_1794312535890.jpg',
    isPopular: false,
    spiceLevel: 'Mild',
    availableAddOns: [
      { id: 'sweet-chili', name: 'Extra Sweet Chili Sauce Cup', price: 40 },
    ],
  },

  // --- SUPER COMBO DEALS ---
  {
    id: 'deal-pakora-samosa-snack',
    name: 'Deal 1: Crispy Street Snack Box',
    description: 'Crispy Mix Pakoras (250g) + 4 Crispy Potato Samosas + Mint Raita + Sweet Tamarind Chutney + 2 Chilled Soft Drink Cans.',
    category: 'deals',
    basePrice: 650,
    image: '/src/assets/images/menu_crispy_pakoras_1794396328427.jpg',
    isPopular: true,
    isChefSpecial: true,
  },
  {
    id: 'deal-chaat-gol-gappay-duo',
    name: 'Deal 2: Gol Gappay & Chaat Fiesta',
    description: '1 Special Crunchy Gol Gappay Platter (10 Pcs) + 1 Special Meethi Dahi Baray Bowl + 1 Crispy Papdi Chaat Bowl with full chutneys and spiced khatta water.',
    category: 'deals',
    basePrice: 640,
    image: '/src/assets/images/menu_gol_gappay_1794313770478.jpg',
    isPopular: true,
    isChefSpecial: true,
  },
  {
    id: 'deal-mega-counter-feast',
    name: 'Deal 3: A. Foods Grand Counter Feast',
    description: '2 Chicken Cheese Rolls + 2 Peshawari Chapli Kababs + 4 Crispy Chicken Samosas + 4 Crispy Chicken Spring Rolls + Crispy Mix Pakoras (250g) + 1.5 Liter Chilled Cold Drink.',
    category: 'deals',
    basePrice: 1690,
    image: '/src/assets/images/hero_feast_spread_1794312533443.jpg',
    isPopular: true,
    isChefSpecial: true,
  },

  // --- BEVERAGES ---
  {
    id: 'bev-cold-drink-can',
    name: 'Chilled Soft Drink (Can / 345ml)',
    description: 'Choice of Pepsi, 7Up, Mirinda, or Pakola Ice Cold.',
    category: 'beverages',
    basePrice: 100,
    image: '/src/assets/images/hero_feast_spread_1794312533443.jpg',
  },
  {
    id: 'bev-cold-drink-1-5l',
    name: 'Cold Drink 1.5 Liter Bottle',
    description: 'Chilled 1.5L bottle (Pepsi / 7Up) perfect for family feasts.',
    category: 'beverages',
    basePrice: 250,
    image: '/src/assets/images/hero_feast_spread_1794312533443.jpg',
  },
  {
    id: 'bev-mint-lemonade',
    name: 'Fresh Mint Margarita Lemonade',
    description: 'Crushed fresh mint leaves, lemon juice, black salt, and sparkling soda served ice-cold.',
    category: 'beverages',
    basePrice: 220,
    image: '/src/assets/images/hero_feast_spread_1794312533443.jpg',
  },
];
