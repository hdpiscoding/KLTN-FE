interface LatLng {
  lat: number;
  lng: number;
}

export const parseWKTToPaths = (wkt: string): LatLng[][] => {
  if (!wkt || !wkt.startsWith("MULTIPOLYGON")) return [];

  // Remove "MULTIPOLYGON" and outer parentheses
  const cleanWkt = wkt.replace("MULTIPOLYGON", "").trim();

  // This regex is a simplified parser for standard MULTIPOLYGON WKT
  // It assumes structure like (((x y, x y, ...)), ((x y, ...)))
  // Split by "), (" to separate polygons
  const polygonStrings = cleanWkt.slice(2, -2).split(")), ((");

  return polygonStrings.map((polyStr) => {
    // Remove extra parens if any and split coordinate pairs
    const coordPairs = polyStr.replace(/[()]/g, "").split(",");

    return coordPairs.map((pair) => {
      const [lng, lat] = pair.trim().split(" ").map(Number);
      return { lat, lng };
    });
  });
};
