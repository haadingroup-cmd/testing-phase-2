/**
 * Material Symbols used across the site (the Stitch design's icon set).
 * The self-hosted font (public/fonts/material-symbols-subset.woff2) contains
 * only these glyphs. To add an icon: add its name here, then run
 * `npm run icons:update` to regenerate the font.
 */
export const ICON_NAMES = [
  "accessibility_new", "account_balance_wallet", "add", "ads_click", "all_inclusive", "analytics", "arrow_back", "arrow_forward",
  "article", "auto_awesome", "badge", "bolt", "business", "calculate", "calendar_month", "call", "campaign", "cancel",
  "category", "chat", "check_circle", "chevron_left", "chevron_right", "close", "code", "content_copy", "dashboard",
  "delete", "description", "domain", "done", "download", "east", "edit", "edit_note", "error", "expand_more", "fact_check",
  "filter_list", "forum", "grid_view", "groups", "handshake", "help_outline", "history_edu", "home", "hub", "image", "inbox",
  "info", "language", "lightbulb", "link", "local_fire_department", "location_on", "lock", "lock_open", "logout", "mail",
  "manage_search", "menu", "menu_book", "monitoring", "neurology", "north_east", "open_in_new", "palette", "payments",
  "person", "phone_iphone", "picture_as_pdf", "play_circle", "progress_activity", "public", "query_stats", "quiz",
  "receipt_long", "refresh", "report_problem", "rocket_launch", "schedule", "search", "sell", "settings", "share",
  "shopping_bag", "show_chart", "smart_toy", "speed", "star", "stars", "support_agent", "sync", "task_alt", "terminal",
  "trending_up", "troubleshoot", "tune", "verified", "verified_user", "video_settings", "visibility", "visibility_off",
  "warning", "work", "workspace_premium",
] as const;

export type IconName = (typeof ICON_NAMES)[number];

export function isIconName(value: string): value is IconName {
  return (ICON_NAMES as readonly string[]).includes(value);
}
