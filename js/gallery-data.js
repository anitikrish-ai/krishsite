/*
 * Art gallery data.
 * -----------------------------------------------------------
 * This is the ONLY file you need to touch to add, edit or remove
 * artwork. Drop the image file into /art/images/ and add one
 * entry to the `items` array below.
 *
 * Collections: "traditional" and "digital" always exist. Add
 * more by adding an entry to `collections` and using its id
 * on any item.
 *
 * Item fields:
 *   id          unique string, no spaces (used as a URL/key)
 *   title       shown in the viewer (optional — omit for untitled)
 *   collection  "traditional" | "digital" | a custom collection id
 *   date        "YYYY-MM-DD" — drives the Years / Months grouping
 *   medium      short string, e.g. "Pencil on paper", "Procreate"
 *   description optional longer note
 *   src         path to the image, e.g. "/art/images/sketch-01.jpg"
 *
 * No artwork has been added yet — the gallery below is fully
 * working and will populate itself the moment items are added here.
 */
window.GALLERY = {
  collections: [
    { id: "traditional", name: "Traditional Art", description: "Pencil sketches, pen and paper, hand-drawn portraits and characters." },
    { id: "digital", name: "Digital Art", description: "Digital sketches, illustration, painting and coloring." }
  ],

  items: [
    // Example (remove the leading "//" lines and fill in your own):
    // {
    //   id: "naruto-sketch-01",
    //   title: "Quick study",
    //   collection: "traditional",
    //   date: "2026-09-14",
    //   medium: "Pencil on paper",
    //   description: "A quick character study from reference.",
    //   src: "/art/images/naruto-sketch-01.jpg"
    // },
  ]
};
