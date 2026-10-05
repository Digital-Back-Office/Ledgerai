/**
 * Helpers for `.cells` grids (see global.css).
 *
 * A `.cells` grid draws its hairlines by letting the container's background
 * show through 1px gaps, so an unfilled slot at the end of the last row would
 * show up as a solid grey block. These pick a column count that suits the
 * number of items and stretch the final cell across whatever is left.
 */

/** Column classes for a grid of `count` cells. */
export function cellGrid(count: number): string {
  if (count <= 1) return "";
  if (count === 2) return "md:grid-cols-2";
  if (count === 4) return "md:grid-cols-2 lg:grid-cols-4";
  return "md:grid-cols-2 lg:grid-cols-3";
}

/** Extra classes for the cell at `index`: the last one fills the rest of its row. */
export function cellSpan(index: number, count: number): string {
  if (index !== count - 1 || count <= 2 || count === 4) return "";
  const md = count % 2 === 1 ? "md:col-span-2" : "";
  const lg = ["lg:col-span-1", "lg:col-span-3", "lg:col-span-2"][count % 3];
  return `${md} ${lg}`.trim();
}
