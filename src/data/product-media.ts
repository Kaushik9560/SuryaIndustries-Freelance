export type ProductMediaCategory = "seating" | "desks" | "storage";

export interface ProductMediaAsset {
  path: string;
  category: ProductMediaCategory;
}

export const PRODUCT_MEDIA_ASSETS: ProductMediaAsset[] = [
  { path: "/office_chair.png", category: "seating" },
  { path: "/waiting_area.png", category: "seating" },
  { path: "/pics/kursi.jpeg", category: "seating" },
  { path: "/pics/ergonomic_mesh_headrest_side.jpeg", category: "seating" },
  { path: "/pics/ergonomic_mesh_highback.jpeg", category: "seating" },
  { path: "/pics/executive_boss_leather_black.jpeg", category: "seating" },
  { path: "/pics/executive_boss_leather_brown.jpeg", category: "seating" },
  { path: "/pics/executive_mesh_chrome.jpeg", category: "seating" },
  { path: "/pics/executive_mesh_lumbar.jpeg", category: "seating" },
  { path: "/pics/mesh_chair_black_base.jpeg", category: "seating" },
  { path: "/pics/mesh_chair_chrome_base.jpeg", category: "seating" },
  { path: "/pics/mesh_chair_midback.jpeg", category: "seating" },
  { path: "/pics/mesh_chair_no_armrest.jpeg", category: "seating" },
  { path: "/pics/mesh_chair_red_seat.jpeg", category: "seating" },
  { path: "/pics/task_chair_black.jpeg", category: "seating" },
  { path: "/pics/task_chair_blue.jpeg", category: "seating" },
  { path: "/pics/task_chair_compact.jpeg", category: "seating" },
  { path: "/pics/task_chair_yellow.jpeg", category: "seating" },
  { path: "/classroom_hero.png", category: "desks" },
  { path: "/pics/sdm.png", category: "desks" },
  { path: "/pics/student_desk_modern.png", category: "desks" },
  { path: "/storage_lockers.png", category: "storage" },
  { path: "/pics/coffer_safe_red_badge.jpeg", category: "storage" },
  { path: "/pics/coffer_safe_red_front.jpeg", category: "storage" },
  { path: "/pics/coffer_safe_red_premium.jpeg", category: "storage" },
  { path: "/pics/coffer_safe_red_room.jpeg", category: "storage" },
  { path: "/pics/digital_safe_black.jpeg", category: "storage" },
  { path: "/pics/digital_safe_compact.jpeg", category: "storage" },
  { path: "/pics/digital_safe_dimensions.jpeg", category: "storage" },
  { path: "/pics/digital_safe_front.jpeg", category: "storage" },
  { path: "/pics/digital_safe_grey.jpeg", category: "storage" },
  { path: "/pics/digital_safe_keypad.jpeg", category: "storage" },
  { path: "/pics/digital_safe_open.jpeg", category: "storage" },
  { path: "/pics/digital_safe_panel.jpeg", category: "storage" },
  { path: "/pics/digital_safe_rhino_yellow.jpeg", category: "storage" },
  { path: "/pics/digital_safe_wardrobe_model.jpeg", category: "storage" },
  { path: "/pics/digital_safe_wardrobe_setup.jpeg", category: "storage" },
  { path: "/pics/digital_safe_white.jpeg", category: "storage" },
  { path: "/pics/digital_safe_white_open.jpeg", category: "storage" },
  { path: "/pics/heavy_duty_safe_brown.jpeg", category: "storage" },
  { path: "/pics/heavy_duty_safe_interior.jpeg", category: "storage" },
];

export function getProductMediaLabel(path: string) {
  const filename = path.split("/").pop() ?? path;
  const label = filename.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ");
  return label.charAt(0).toUpperCase() + label.slice(1);
}
