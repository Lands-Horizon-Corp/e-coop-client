/**
 * Centralized Google Maps configuration
 *
 * This file contains all Google Maps related configuration to ensure consistency
 * across components and prevent the "LoadScript has been reloaded unintentionally" warning.
 *
 * All components using Google Maps should import these constants instead of
 * defining their own to maintain referential equality.
 */

import { GOOGLE_MAPS_API_KEY } from "@/constants";

/**
 * Google Maps libraries to load.
 *
 * Important: This array must maintain referential equality across all usages
 * to prevent React from thinking the configuration has changed.
 */
export const GOOGLE_MAPS_LIBRARIES: ("places" | "geometry")[] = [
  "places",
  "geometry",
];

/**
 * Default Google Maps loader configuration
 */
export const GOOGLE_MAPS_LOADER_CONFIG = {
  id: "google-maps-script",
  googleMapsApiKey: GOOGLE_MAPS_API_KEY ?? "",
  libraries: GOOGLE_MAPS_LIBRARIES,
} as const;
