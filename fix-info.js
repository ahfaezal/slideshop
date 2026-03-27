const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "protected-downloads");

function fixInfoJson(dir) {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      const infoPath = path.join(fullPath, "info.json");

      if (fs.existsSync(infoPath)) {
        try {
          const raw = fs.readFileSync(infoPath, "utf-8");
          const data = JSON.parse(raw);

          // ✅ FIX STRUCTURE
          const fixed = {
            title: data.title || "",
            slug: data.slug || "",
            category: data.category || "General",
            price: Number(data.price) || 9.9,
            file: data.file || "",
            thumbnail: "thumbnail.jpg",
            previews: [
              "preview-01.jpg",
              "preview-02.jpg",
              "preview-03.jpg",
            ],
          };

          fs.writeFileSync(
            infoPath,
            JSON.stringify(fixed, null, 2),
            "utf-8"
          );

          console.log("✔ Fixed:", infoPath);
        } catch (err) {
          console.log("❌ Error:", infoPath, err.message);
        }
      }

      // recursive
      fixInfoJson(fullPath);
    }
  });
}

fixInfoJson(baseDir);

console.log("✅ Semua info.json telah dikemaskini");