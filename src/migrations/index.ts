import * as migration_20260419_173623 from './20260419_173623';
import * as migration_20260419_180249 from './20260419_180249';

export const migrations = [
  {
    up: migration_20260419_173623.up,
    down: migration_20260419_173623.down,
    name: '20260419_173623',
  },
  {
    up: migration_20260419_180249.up,
    down: migration_20260419_180249.down,
    name: '20260419_180249'
  },
];
