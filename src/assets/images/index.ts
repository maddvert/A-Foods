import heroFeastSpread from './hero_feast_spread_1794312533443.webp';
import menuSupremePizza from './menu_supreme_pizza_1794312536282.webp';
import menuCrispyPakoras from './menu_crispy_pakoras_1794396328427.webp';
import menuSamosasChapli from './menu_samosas_chapli_1794313770709.webp';
import menuGolGappay from './menu_gol_gappay_1794313770478.webp';
import menuDahiBaray from './menu_dahi_baray_1794313769535.webp';
import menuPapdiChaat from './menu_papdi_chaat_1794396329733.webp';
import menuChickenCheeseRoll from './menu_chicken_cheese_roll_1794396329122.webp';
import menuParathaRoll from './menu_paratha_roll_1794312535890.webp';

export const FOOD_IMAGES = {
  heroFeastSpread,
  menuSupremePizza,
  menuCrispyPakoras,
  menuSamosasChapli,
  menuGolGappay,
  menuDahiBaray,
  menuPapdiChaat,
  menuChickenCheeseRoll,
  menuParathaRoll,
} as const;

// Maps any legacy "/src/assets/images/*.jpg" path saved in localStorage orders/cart
// to its production-bundled WebP asset URL.
const LEGACY_PATH_MAP: Record<string, string> = {
  'hero_feast_spread_1794312533443': heroFeastSpread,
  'menu_supreme_pizza_1794312536282': menuSupremePizza,
  'menu_crispy_pakoras_1794396328427': menuCrispyPakoras,
  'menu_samosas_chapli_1794313770709': menuSamosasChapli,
  'menu_gol_gappay_1794313770478': menuGolGappay,
  'menu_dahi_baray_1794313769535': menuDahiBaray,
  'menu_papdi_chaat_1794396329733': menuPapdiChaat,
  'menu_chicken_cheese_roll_1794396329122': menuChickenCheeseRoll,
  'menu_paratha_roll_1794312535890': menuParathaRoll,
};

export function resolveFoodImage(src?: string): string {
  if (!src) return heroFeastSpread;
  for (const [key, bundledUrl] of Object.entries(LEGACY_PATH_MAP)) {
    if (src.includes(key) && src.includes('/src/assets/')) {
      return bundledUrl;
    }
  }
  return src;
}
