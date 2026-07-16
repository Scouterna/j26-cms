# Layout preview images

The layout picker in a slide (`src/fields/LayoutField.tsx`) shows one card per
layout, each with a preview image loaded from this folder.

There is one image per layout, named `<value>.png`, where `<value>` matches the
layout's `value` in `src/fields/layoutOptions.ts`:

- `kom_single.png`
- `kom_two_rows.png`
- `kom_gallery.png`
- `kom_vote_single.png`
- `kom_vote_gallery.png`
- `ser_info.png`

Images are shown in a 16:9 box (`object-fit: contain`), so any aspect ratio
works. A card whose image is missing simply renders without a preview.
3826f701
