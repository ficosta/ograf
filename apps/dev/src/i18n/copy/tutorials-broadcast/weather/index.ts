import type { Locale } from "../../../locales";
import { en, type WeatherCopy } from "./en";
import { es } from "./es";
import { pt } from "./pt";

export const WEATHER_COPY: Readonly<Record<Locale, WeatherCopy>> = { en, pt, es };
