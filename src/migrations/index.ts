import * as migration_20260419_173623 from './20260419_173623';
import * as migration_20260419_180249 from './20260419_180249';
import * as migration_20260511_184433 from './20260511_184433';
import * as migration_20260511_194222 from './20260511_194222';
import * as migration_20260514_141211 from './20260514_141211';
import * as migration_20260715_183347_important_info_and_rolling_text from './20260715_183347_important_info_and_rolling_text';
import * as migration_20260715_184346_show_important_info_on_service_only from './20260715_184346_show_important_info_on_service_only';
import * as migration_20260715_221843_bottom_iframe_url from './20260715_221843_bottom_iframe_url';
import * as migration_20260716_112305_layout_previews from './20260716_112305_layout_previews';
import * as migration_20260716_145336_screen_type_filters from './20260716_145336_screen_type_filters';
import * as migration_20260719_211802_sso_auth from './20260719_211802_sso_auth';
import * as migration_20260723_135156_enable_info_page_drafts from './20260723_135156_enable_info_page_drafts';

export const migrations = [
  {
    up: migration_20260419_173623.up,
    down: migration_20260419_173623.down,
    name: '20260419_173623',
  },
  {
    up: migration_20260419_180249.up,
    down: migration_20260419_180249.down,
    name: '20260419_180249',
  },
  {
    up: migration_20260511_184433.up,
    down: migration_20260511_184433.down,
    name: '20260511_184433',
  },
  {
    up: migration_20260511_194222.up,
    down: migration_20260511_194222.down,
    name: '20260511_194222',
  },
  {
    up: migration_20260514_141211.up,
    down: migration_20260514_141211.down,
    name: '20260514_141211',
  },
  {
    up: migration_20260715_183347_important_info_and_rolling_text.up,
    down: migration_20260715_183347_important_info_and_rolling_text.down,
    name: '20260715_183347_important_info_and_rolling_text',
  },
  {
    up: migration_20260715_184346_show_important_info_on_service_only.up,
    down: migration_20260715_184346_show_important_info_on_service_only.down,
    name: '20260715_184346_show_important_info_on_service_only',
  },
  {
    up: migration_20260715_221843_bottom_iframe_url.up,
    down: migration_20260715_221843_bottom_iframe_url.down,
    name: '20260715_221843_bottom_iframe_url',
  },
  {
    up: migration_20260716_112305_layout_previews.up,
    down: migration_20260716_112305_layout_previews.down,
    name: '20260716_112305_layout_previews',
  },
  {
    up: migration_20260716_145336_screen_type_filters.up,
    down: migration_20260716_145336_screen_type_filters.down,
    name: '20260716_145336_screen_type_filters',
  },
  {
    up: migration_20260719_211802_sso_auth.up,
    down: migration_20260719_211802_sso_auth.down,
    name: '20260719_211802_sso_auth',
  },
  {
    up: migration_20260723_135156_enable_info_page_drafts.up,
    down: migration_20260723_135156_enable_info_page_drafts.down,
    name: '20260723_135156_enable_info_page_drafts'
  },
];
