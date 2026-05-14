import * as migration_20260419_173623 from './20260419_173623';
import * as migration_20260419_180249 from './20260419_180249';
import * as migration_20260511_184433 from './20260511_184433';
import * as migration_20260511_194222 from './20260511_194222';
import * as migration_20260514_141211 from './20260514_141211';

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
    name: '20260514_141211'
  },
];
