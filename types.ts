
export interface UploadedImage {
  id: string;
  data: string; // Base64
  mimeType: string;
}

export interface AnalysisResponse {
  description: string;
  subject: string;
  style: string;
  composition: string;
  lighting: string;
  suggestedPrompt: string;
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT = '3:4',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  TALL = '9:16',
}

export enum ImageResolution {
  RES_1K = '1K',
  RES_2K = '2K',
  RES_4K = '4K',
}

export enum GenModel {
  NANO_BANANA = 'gemini-2.5-flash-image',
  NANO_BANANA_PRO = 'gemini-3-pro-image-preview',
}

export enum PromptFormat {
  NATURAL = 'Natural Text',
  JSON = 'JSON',
  YAML = 'YAML',
}

export interface GenerationConfig {
  aspectRatio: AspectRatio;
  resolution: ImageResolution;
  includeReference: boolean;
  model: GenModel;
  count: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  model: string;
}

export enum ViewPoint {
  // Basic angles
  FRONT = 'Front view',
  SIDE = 'Side profile',
  THREE_QUARTER = 'Three-quarter view',
  BACK = 'Back view',
  
  // Height angles
  EYE_LEVEL = 'Eye level',
  LOW_ANGLE = 'Low angle/Worm\'s eye view',
  HIGH_ANGLE = 'High angle',
  EXTREME_LOW = 'Extreme low angle',
  EXTREME_HIGH = 'Extreme high angle/Bird\'s eye view',
  
  // Special angles
  DUTCH = 'Dutch angle/Canted angle',
  AERIAL = 'Aerial/Drone shot',
  OVERHEAD = 'Overhead/Top-down',
  UNDERSIDE = 'Underside/Worm\'s eye',
  
  // Distance/Framing
  EXTREME_CLOSE_UP = 'Extreme close-up (ECU)',
  CLOSE_UP = 'Close-up (CU)',
  MEDIUM_CLOSE_UP = 'Medium close-up (MCU)',
  MEDIUM_SHOT = 'Medium shot (MS)',
  MEDIUM_LONG = 'Medium long shot (MLS)',
  WIDE = 'Wide shot/Long shot',
  EXTREME_WIDE = 'Extreme wide shot (EWS)',
  ESTABLISHING = 'Establishing shot',
  
  // Subject-specific
  OVER_SHOULDER = 'Over-the-shoulder (OTS)',
  POINT_OF_VIEW = 'Point of view (POV)',
  TWO_SHOT = 'Two shot',
  THREE_SHOT = 'Three shot',
  GROUP_SHOT = 'Group shot',
  INSERT_SHOT = 'Insert shot/Cutaway',
  
  // Specialty
  PANORAMIC = 'Panoramic view',
  FISHEYE_VIEW = 'Fisheye perspective',
  SPLIT_SCREEN = 'Split screen',
  REFLECTION = 'Reflection shot',
  SILHOUETTE = 'Silhouette view',
}

export enum Lighting {
  // Natural lighting
  NATURAL = 'Natural lighting',
  DIRECT_SUNLIGHT = 'Direct sunlight',
  DIFFUSED_DAYLIGHT = 'Diffused daylight',
  OVERCAST = 'Overcast/Flat light',
  HARSH_MIDDAY = 'Harsh midday sun',
  GOLDEN_HOUR_LIGHT = 'Golden hour lighting',
  BLUE_HOUR_LIGHT = 'Blue hour lighting',
  MOONLIGHT = 'Moonlight',
  STARLIGHT = 'Starlight',
  BIOLUMINESCENT = 'Bioluminescent light',
  
  // Artificial lighting
  STUDIO = 'Studio lighting',
  CONTINUOUS = 'Continuous lighting',
  STROBE = 'Strobe/Flash lighting',
  LED = 'LED lighting',
  TUNGSTEN = 'Tungsten/Warm artificial',
  FLUORESCENT_COOL = 'Fluorescent/Cool artificial',
  HALOGEN = 'Halogen lighting',
  CANDLELIGHT = 'Candlelight/Fire light',
  
  // Quality of light
  HARD = 'Hard light (sharp shadows)',
  SOFT = 'Soft light/Diffused (gentle shadows)',
  DAPPLED = 'Dappled light',
  SPOTTED = 'Spotted light',
  
  // Directional lighting
  FRONT_LIGHT = 'Front lighting',
  SIDE_LIGHT = 'Side lighting',
  BACK_LIGHT = 'Back lighting',
  RIM = 'Rim lighting (edge highlight)',
  UNDER_LIGHT = 'Under lighting/Uplight',
  TOP_LIGHT = 'Top lighting',
  
  // Special effects
  VOLUMETRIC = 'Volumetric/God rays',
  LENS_FLARE = 'Lens flare',
  BLOOM = 'Bloom/Glow effect',
  CAUSTICS = 'Caustics (light patterns)',
  
  // Atmospheric/Mood lighting
  CINEMATIC = 'Cinematic lighting',
  DRAMATIC = 'Dramatic lighting',
  HIGH_KEY = 'High key (bright, low contrast)',
  LOW_KEY = 'Low key (dark, high contrast)',
  CHIAROSCURO = 'Chiaroscuro (strong contrast)',
  REMBRANDT = 'Rembrandt lighting',
  BUTTERFLY = 'Butterfly/Paramount lighting',
  SPLIT = 'Split lighting',
  LOOP = 'Loop lighting',
  BROAD = 'Broad lighting',
  SHORT = 'Short lighting',
  
  // Color/Style lighting
  NEON = 'Neon lighting/Cyberpunk',
  BLACK_LIGHT = 'Black light/UV',
  INFRARED = 'Infrared look',
  SILVER = 'Silver reflector look',
  GOLD = 'Gold reflector look',
  PRISM = 'Prismatic/Rainbow light',
  HOLOGRAPHIC = 'Holographic lighting',
}

export enum ArtStyle {
  // Photorealistic
  REALISTIC = 'Photorealistic',
  HYPERREALISTIC = 'Hyperrealistic',
  CINEMATIC_REAL = 'Cinematic photorealistic',
  DOCUMENTARY = 'Documentary style',
  EDITORIAL = 'Editorial photography',
  FASHION = 'Fashion photography',
  
  // Traditional painting
  OIL_PAINTING = 'Oil painting',
  IMPASTO = 'Impasto (thick paint)',
  WATERCOLOR = 'Watercolor',
  GOUACHE = 'Gouache',
  ACRYLIC = 'Acrylic painting',
  TEMPERA = 'Tempera',
  ENCAUSTIC = 'Encaustic (wax)',
  
  // Drawing/Sketch
  SKETCH = 'Pencil sketch',
  CHARCOAL = 'Charcoal drawing',
  PASTEL = 'Pastel/Chalk',
  INK_WASH = 'Ink wash/Sumi-e',
  CROSS_HATCHING = 'Cross-hatching',
  STIPPLE = 'Stipple art',
  
  // Printmaking
  WOODCUT = 'Woodcut print',
  ETCHING = 'Etching/Engraving',
  LITHOGRAPH = 'Lithograph',
  SCREEN_PRINT = 'Screen print/Pop art',
  LINOCUT = 'Linocut',
  
  // Digital/Modern
  DIGITAL = 'Digital Art',
  DIGITAL_PAINTING = 'Digital painting',
  CONCEPT_ART = 'Concept art',
  MATTE_PAINTING = 'Matte painting',
  PIXEL_ART = 'Pixel art',
  VOXEL_ART = 'Voxel art',
  VECTOR_ART = 'Vector/Flat design',
  LOW_POLY = 'Low poly 3D',
  ISOMETRIC = 'Isometric art',
  
  // Anime/Manga
  ANIME = 'Anime style',
  MANGA = 'Manga style',
  CHIBI = 'Chibi/Cute style',
  SHOUJO = 'Shoujo style',
  SHOUNEN = 'Shounen style',
  GHIBLI = 'Studio Ghibli style',
  MECHA = 'Mecha style',
  
  // Stylized
  CARTOON = 'Cartoon style',
  CARICATURE = 'Caricature',
  STORYBOOK = 'Storybook illustration',
  CHILDRENS_BOOK = 'Children\'s book illustration',
  COMIC_BOOK = 'Comic book style',
  GRAPHIC_NOVEL = 'Graphic novel',
  
  // Historical/Classical
  RENAISSANCE = 'Renaissance style',
  BAROQUE = 'Baroque style',
  ROCOCO = 'Rococo style',
  NEOCLASSICAL = 'Neoclassical',
  ROMANTICISM = 'Romanticism',
  IMPRESSIONISM = 'Impressionism',
  POST_IMPRESSIONISM = 'Post-Impressionism',
  EXPRESSIONISM = 'Expressionism',
  ART_NOUVEAU = 'Art Nouveau',
  ART_DECO = 'Art Deco',
  
  // 20th Century
  CUBISM = 'Cubism',
  SURREALISM = 'Surrealism',
  ABSTRACT = 'Abstract art',
  DADA = 'Dada style',
  BAUHAUS = 'Bauhaus style',
  POP_ART = 'Pop Art',
  OP_ART = 'Op Art',
  MINIMALISM = 'Minimalism art',
  
  // Cultural styles
  UKIYO_E = 'Ukiyo-e (Japanese woodblock)',
  CHINESE_INK = 'Chinese ink painting',
  INDIAN_MINIATURE = 'Indian miniature painting',
  PERSIAN_MINIATURE = 'Persian miniature',
  BYZANTINE = 'Byzantine/Mosaic style',
  CELTIC = 'Celtic art',
  AFRICAN_TRIBAL = 'African tribal art',
  PRE_COLUMBIAN = 'Pre-Columbian style',
  
  // Fantasy/Specialty
  FANTASY = 'Fantasy art',
  SCI_FI = 'Science fiction',
  STEAMPUNK = 'Steampunk',
  CYBERPUNK = 'Cyberpunk',
  BIOPUNK = 'Biopunk',
  ATOMPUNK = 'Atompunk',
  DIESELPUNK = 'Dieselpunk',
  SOLARPUNK = 'Solarpunk',
  VAPORWAVE = 'Vaporwave',
  RETROWAVE = 'Retrowave',
  
  // Dark/Moody
  DARK_FANTASY = 'Dark fantasy',
  GOTHIC = 'Gothic style',
  NOIR = 'Film Noir',
  HORROR = 'Horror art',
  MACABRE = 'Macabre style',
  
  // Retro/Vintage
  VINTAGE = 'Vintage/Retro',
  RETRO_80S = '80s retro style',
  RETRO_90S = '90s retro style',
  VICTORIAN = 'Victorian era style',
  MID_CENTURY = 'Mid-century modern',
  
  // Texture-based
  COLLAGE = 'Collage art',
  PHOTOMONTAGE = 'Photomontage',
  MIXED_MEDIA = 'Mixed media',
  TEXTILE_ART = 'Textile art',
  PAPER_CUT = 'Paper cut art',
  QUILLING = 'Quilling art',
}

export enum FocalLength {
  ULTRA_WIDE = '14mm Ultra-wide',
  WIDE = '24mm Wide-angle',
  STANDARD = '35mm Street',
  PORTRAIT_50 = '50mm Standard',
  PORTRAIT_85 = '85mm Portrait',
  TELEPHOTO = '200mm Telephoto',
}

export enum FilmType {
  KODAK_PORTRA = 'Kodak Portra 400',
  KODAK_GOLD = 'Kodak Gold 200',
  FUJIFILM = 'Fujifilm Pro 400H',
  CINESTILL = 'CineStill 800T',
  ILFORD = 'Ilford HP5 (B&W)',
  POLAROID = 'Polaroid/Instant',
  KODACHROME = 'Kodachrome',
}

export enum ShutterSpeed {
  BULB = 'Bulb (long exposure)',
  _1_4000 = '1/4000s (freeze motion)',
  _1_2000 = '1/2000s (sports)',
  _1_1000 = '1/1000s (action)',
  _1_500 = '1/500s (moving subjects)',
  _1_250 = '1/250s (standard)',
  _1_125 = '1/125s (handheld)',
  _1_60 = '1/60s (low light)',
  _1_30 = '1/30s (panning)',
  _1_15 = '1/15s (motion blur)',
  _1_4 = '1/4s (light trails)',
  _1 = '1s (night)',
}

export enum ISO {
  _50 = 'ISO 50 (lowest grain)',
  _100 = 'ISO 100 (daylight)',
  _200 = 'ISO 200 (bright indoor)',
  _400 = 'ISO 400 (general)',
  _800 = 'ISO 800 (low light)',
  _1600 = 'ISO 1600 (night)',
  _3200 = 'ISO 3200 (very dark)',
  _6400 = 'ISO 6400 (extreme)',
  _12800 = 'ISO 12800 (high grain)',
}

export enum Aperture {
  F_1_2 = 'f/1.2 (extreme bokeh)',
  F_1_4 = 'f/1.4 (very shallow)',
  F_1_8 = 'f/1.8 (portrait)',
  F_2_8 = 'f/2.8 (standard fast)',
  F_4 = 'f/4 (light bokeh)',
  F_5_6 = 'f/5.6 (group shots)',
  F_8 = 'f/8 (sharp overall)',
  F_11 = 'f/11 (landscape)',
  F_16 = 'f/16 (maximum depth)',
  F_22 = 'f/22 (diffraction)',
}

export enum FilmGrain {
  NONE = 'No grain (clean)',
  SUBTLE = 'Subtle grain',
  LIGHT = 'Light film grain',
  MODERATE = 'Moderate grain',
  HEAVY = 'Heavy grain (vintage)',
  EXTREME = 'Extreme grain (expired film)',
  PUSHED = 'Pushed film look',
}

export enum CameraType {
  DSLR = 'DSLR',
  MIRRORLESS = 'Mirrorless',
  POINT_SHOOT = 'Point & Shoot',
  RANGEFINDER = 'Rangefinder',
  MEDIUM_FORMAT = 'Medium Format',
  LARGE_FORMAT = 'Large Format',
  INSTANT = 'Instant Camera',
  ACTION = 'Action Camera',
  VINTAGE = 'Vintage/Retro Camera',
}

export enum LensType {
  PRIME = 'Prime Lens',
  ZOOM = 'Zoom Lens',
  MACRO = 'Macro Lens',
  TILT_SHIFT = 'Tilt-Shift Lens',
  FISHEYE = 'Fisheye Lens',
  ANAMORPHIC = 'Anamorphic Lens',
  VINTAGE = 'Vintage Lens',
  SOFT = 'Soft Focus Lens',
}

export enum WhiteBalance {
  AUTO = 'Auto WB',
  DAYLIGHT = 'Daylight (5500K)',
  CLOUDY = 'Cloudy (6500K)',
  SHADE = 'Shade (7500K)',
  TUNGSTEN = 'Tungsten (3200K)',
  FLUORESCENT = 'Fluorescent (4000K)',
  WARM = 'Warm (golden)',
  COOL = 'Cool (blue)',
}

export enum FocusStyle {
  AUTO = 'Auto Focus',
  MANUAL = 'Manual Focus',
  SHALLOW_DOF = 'Shallow Depth of Field',
  DEEP_DOF = 'Deep Depth of Field',
  SELECTIVE = 'Selective Focus',
  RACK_FOCUS = 'Rack Focus',
  TILT_SHIFT_EFFECT = 'Tilt-Shift Effect',
  PINHOLE = 'Pinhole/Soft Focus',
}

export enum TimeOfDay {
  // Night to morning
  DEEP_NIGHT = 'Deep Night (Midnight-3am)',
  PRE_DAWN = 'Pre-dawn/Twilight',
  DAWN = 'Dawn/Sunrise',
  EARLY_MORNING = 'Early morning (6-8am)',
  MORNING = 'Morning (8-11am)',
  LATE_MORNING = 'Late morning (11am-12pm)',
  
  // Midday
  NOON = 'High Noon',
  AFTERNOON = 'Afternoon',
  LATE_AFTERNOON = 'Late afternoon',
  
  // Evening transitions
  GOLDEN_HOUR = 'Golden Hour (sunset)',
  SUNSET = 'Sunset',
  TWILIGHT = 'Twilight/Dusk',
  BLUE_HOUR = 'Blue Hour',
  EVENING = 'Evening/Nightfall',
  NIGHT = 'Night',
}

export enum Weather {
  // Clear/Calm
  SUNNY = 'Sunny/Clear',
  PARTLY_CLOUDY = 'Partly cloudy',
  MOSTLY_CLOUDY = 'Mostly cloudy',
  
  // Overcast
  CLOUDY = 'Cloudy/Overcast',
  HEAVY_CLOUDS = 'Heavy cloud cover',
  
  // Precipitation
  DRIZZLE = 'Light drizzle',
  RAINY = 'Rainy',
  HEAVY_RAIN = 'Heavy rain/Downpour',
  FREEZING_RAIN = 'Freezing rain',
  
  // Storms
  STORMY = 'Stormy',
  THUNDERSTORM = 'Thunderstorm',
  HAIL = 'Hail storm',
  SANDSTORM = 'Sand/Dust storm',
  
  // Snow/Ice
  LIGHT_SNOW = 'Light snow flurries',
  SNOWY = 'Snowy',
  HEAVY_SNOW = 'Heavy snowfall/Blizzard',
  SLEET = 'Sleet',
  ICY = 'Icy/Frost',
  
  // Atmospheric
  FOGGY = 'Foggy',
  MISTY = 'Misty/Hazy',
  SMOG = 'Smog/Polluted air',
  
  // Wind
  BREEZY = 'Breezy',
  WINDY = 'Windy',
  GALE = 'Strong gale',
  
  // Special
  RAINBOW = 'Rainbow weather',
  AURORA = 'Aurora borealis',
  HEAT_WAVE = 'Heat wave/Hazy',
  DRY = 'Arid/Dry climate',
  HUMID = 'Humid/Tropical',
}

export enum Season {
  SPRING = 'Spring',
  SPRING_EARLY = 'Early spring',
  SPRING_LATE = 'Late spring',
  SUMMER = 'Summer',
  SUMMER_EARLY = 'Early summer',
  SUMMER_LATE = 'Late summer/Pre-fall',
  AUTUMN = 'Autumn/Fall',
  AUTUMN_EARLY = 'Early autumn',
  AUTUMN_LATE = 'Late autumn',
  WINTER = 'Winter',
  WINTER_EARLY = 'Early winter',
  WINTER_LATE = 'Late winter',
}

export enum LocationType {
  // Urban
  CITY_STREET = 'City street',
  DOWNTOWN = 'Downtown/Urban center',
  SUBURB = 'Suburban neighborhood',
  INDUSTRIAL = 'Industrial area',
  CONSTRUCTION = 'Construction site',
  PARK_URBAN = 'Urban park',
  ALLEY = 'Alleyway',
  ROOFTOP = 'Rooftop',
  
  // Architecture
  INTERIOR = 'Interior space',
  EXTERIOR = 'Exterior facade',
  ABANDONED = 'Abandoned building',
  HISTORICAL = 'Historical building',
  MODERN = 'Modern architecture',
  BRUTALIST = 'Brutalist architecture',
  GOTHIC_BUILDING = 'Gothic architecture',
  
  // Nature
  FOREST = 'Forest/Woods',
  RAINFOREST = 'Rainforest/Jungle',
  MOUNTAIN = 'Mountain range',
  HILLS = 'Rolling hills',
  VALLEY = 'Valley',
  CANYON = 'Canyon/Gorge',
  DESERT = 'Desert',
  BEACH = 'Beach/Coast',
  OCEAN = 'Ocean/Sea',
  LAKE = 'Lake/Pond',
  RIVER = 'River/Stream',
  WATERFALL = 'Waterfall',
  WETLANDS = 'Wetlands/Marsh',
  PRAIRIE = 'Prairie/Grassland',
  TUNDRA = 'Tundra',
  GLACIER = 'Glacier/Ice field',
  CAVE = 'Cave/Underground',
  
  // Special locations
  SPACE = 'Outer space',
  UNDERWATER = 'Underwater',
  SKY = 'Sky/Clouds',
  DREAMSCAPE = 'Dreamscape/Abstract space',
}

export enum Mood {
  JOYFUL = 'Joyful/Happy',
  ENERGETIC = 'Energetic/Excited',
  PEACEFUL = 'Peaceful/Serene',
  CALM = 'Calm/Relaxed',
  NOSTALGIC = 'Nostalgic/Sentimental',
  ROMANTIC = 'Romantic/Tender',
  MELANCHOLIC = 'Melancholic/Sad',
  LONELY = 'Lonely/Isolated',
  MYSTERIOUS = 'Mysterious/Enigmatic',
  EERIE = 'Eerie/Unsettling',
  SINISTER = 'Sinister/Menacing',
  TENSE = 'Tense/Suspenseful',
  DRAMATIC = 'Dramatic/Intense',
  EPIC = 'Epic/Grandiose',
  HOPEFUL = 'Hopeful/Optimistic',
  DESPAIR = 'Despair/Hopeless',
  WONDER = 'Wonder/Awe',
  CHAOS = 'Chaotic/Frantic',
  CONTEMPLATIVE = 'Contemplative/Pensive',
  WHIMSICAL = 'Whimsical/Playful',
  SOMBER = 'Somber/Grave',
  ETHEREAL = 'Ethereal/Dreamy',
  HAUNTING = 'Haunting/Ghostly',
}

export enum ColorPalette {
  // Monochromatic
  MONOCHROME = 'Monochrome',
  MONOCHROME_WARM = 'Monochrome warm (sepia tones)',
  MONOCHROME_COOL = 'Monochrome cool (blue tones)',
  
  // Black & White
  BLACK_WHITE = 'Black and white',
  BLACK_WHITE_HIGH_CONTRAST = 'High contrast B&W',
  BLACK_WHITE_LOW_CONTRAST = 'Low contrast B&W',
  DUOTONE = 'Duotone',
  
  // Earth tones
  EARTH_TONES = 'Earth tones (browns, ochres)',
  DESERT_PALETTE = 'Desert palette (warm, sandy)',
  FOREST_PALETTE = 'Forest palette (greens, browns)',
  
  // Cool palettes
  COOL_BLUES = 'Cool blues',
  TEAL_ORANGE = 'Teal and orange (blockbuster)',
  CYAN_MAGENTA = 'Cyan and magenta',
  
  // Warm palettes
  WARM_AMBERS = 'Warm ambers/oranges',
  RED_CRIMSON = 'Red and crimson',
  GOLDEN_HOUR_PALETTE = 'Golden hour palette',
  
  // Vibrant
  VIBRANT_PRIMARIES = 'Vibrant primaries',
  NEON_ACCENT = 'Neon accent colors',
  RAINBOW = 'Rainbow/Multi-colored',
  PASTEL = 'Pastel soft colors',
  
  // Specialized
  VINTAGE_FADED = 'Vintage faded',
  CROSS_PROCESSED = 'Cross-processed look',
  INFRARED_PALETTE = 'Infrared palette',
  BLEACH_BYPASS = 'Bleach bypass look',
  MATTE = 'Matte/low contrast',
  HIGH_SATURATION = 'Highly saturated',
  DESATURATED = 'Desaturated/muted',
  
  // Specific
  CINEMATIC_ORANGE_TEAL = 'Cinematic orange-teal',
  WONG_KAR_WAI = 'Wong Kar-wai style colors',
  FINCHER_LOOK = 'David Fincher desaturated',
  SPielBERG_AMBERS = 'Spielberg amber warmth',
  
  // Single color dominance
  DOMINANT_RED = 'Red dominant',
  DOMINANT_BLUE = 'Blue dominant',
  DOMINANT_GREEN = 'Green dominant',
  DOMINANT_PURPLE = 'Purple dominant',
  DOMINANT_YELLOW = 'Yellow dominant',
}

export enum Texture {
  SMOOTH = 'Smooth/Polished',
  GLOSSY = 'Glossy/Shiny',
  MATTE_SURFACE = 'Matte/Dull',
  ROUGH = 'Rough/Textured',
  GRAINY = 'Grainy/Noisy',
  GRITTY = 'Gritty/Distressed',
  WEATHERED = 'Weathered/Aged',
  RUSTIC = 'Rustic/Raw',
  METALLIC = 'Metallic/Chrome',
  GLASSY = 'Glassy/Transparent',
  FROSTED = 'Frosted/Diffused',
  WOVEN = 'Woven/Fabric',
  KNITTED = 'Knitted/Crocheted',
  LEATHER = 'Leather/Suede',
  WOOD = 'Wood grain',
  STONE = 'Stone/Rock',
  CONCRETE = 'Concrete/Cement',
  BRICK = 'Brick/Masonry',
  PAPER = 'Paper/Cardboard',
  CANVAS = 'Canvas texture',
  MARBLE = 'Marble/Stone polished',
  CRYSTAL = 'Crystalline/Faceted',
  LIQUID = 'Liquid/Fluid',
  SMOKE = 'Smoke/Mist texture',
  CLOUD = 'Cloud/Soft texture',
  FEATHER = 'Feather/Downy',
  FUR = 'Fur/Hairy',
  SCALES = 'Scales/Reptilian',
  BARK = 'Tree bark',
  SAND = 'Sand/Granular',
  ICE = 'Ice/Frozen texture',
}

export enum Era {
  ANCIENT = 'Ancient/Classical',
  MEDIEVAL = 'Medieval/Middle Ages',
  RENAISSANCE_ERA = 'Renaissance period',
  BAROQUE_ERA = 'Baroque period',
  VICTORIAN_ERA = 'Victorian era (1837-1901)',
  EDWARDIAN = 'Edwardian era (1901-1910)',
  ROARING_TWENTIES = '1920s/Roaring Twenties',
  GREAT_DEPRESSION = '1930s/Depression era',
  WORLD_WAR_2 = '1940s/WWII era',
  FIFTIES = '1950s/Mid-century',
  SIXTIES = '1960s/Swinging Sixties',
  SEVENTIES = '1970s/Disc era',
  EIGHTIES = '1980s/Neon era',
  NINETIES = '1990s/Grunge era',
  Y2K = '2000s/Y2K era',
  TWENTY_TENS = '2010s/Modern',
  FUTURISTIC = 'Futuristic/Sci-fi',
  POST_APOCALYPTIC = 'Post-apocalyptic',
  STEAMPUNK_ERA = 'Steampunk alternate history',
  ATOMPUNK_ERA = 'Atompunk 1950s sci-fi',
  CYBERPUNK_ERA = 'Cyberpunk near-future',
  SOLARPUNK_ERA = 'Solarpunk eco-future',
}

// Human Subject Enums
export enum Gender {
  FEMININE = 'Feminine',
  MASCULINE = 'Masculine',
  ANDROGYNOUS = 'Androgynous',
  UNSPECIFIED = 'Unspecified/Any',
}

export enum AgeGroup {
  INFANT = 'Infant (0-1)',
  TODDLER = 'Toddler (1-3)',
  CHILD = 'Child (4-12)',
  TEENAGER = 'Teenager (13-19)',
  YOUNG_ADULT = 'Young adult (20-30)',
  ADULT = 'Adult (30-50)',
  MIDDLE_AGED = 'Middle-aged (50-65)',
  ELDERLY = 'Elderly (65+)',
}

export enum BodyType {
  SLIM = 'Slim/Lean',
  ATHLETIC = 'Athletic/Toned',
  AVERAGE = 'Average/Medium',
  CURVY = 'Curvy/Voluptuous',
  MUSCULAR = 'Muscular/Bodybuilder',
  PLUS_SIZE = 'Plus-size',
  PETITE = 'Petite/Small frame',
  TALL = 'Tall/Lanky',
}

export enum Posture {
  STANDING = 'Standing/Upright',
  SITTING = 'Sitting',
  RECLINING = 'Reclining/Lounging',
  LEANING = 'Leaning',
  CROUCHING = 'Crouching/Squatting',
  KNEELING = 'Kneeling',
  PRONE = 'Lying prone',
  SUPINE = 'Lying on back',
  SIDE_LYING = 'Lying on side',
  WALKING = 'Walking/Striding',
  RUNNING = 'Running',
  JUMPING = 'Jumping/Leaping',
  DANCING = 'Dancing',
  STRETCHING = 'Stretching',
  BENDING = 'Bending forward',
  ARCHING = 'Arching back',
  TWISTING = 'Twisting torso',
  ARMS_CROSSED = 'Arms crossed',
  HANDS_ON_HIPS = 'Hands on hips',
  HANDS_BEHIND_HEAD = 'Hands behind head',
  HANDS_IN_POCKETS = 'Hands in pockets',
  REACHING = 'Reaching out',
  POINTING = 'Pointing',
  WAVING = 'Waving',
  CLAPPING = 'Clapping',
  FIST_RAISED = 'Fist raised',
  PRAYER = 'Prayer pose',
  MEDITATION = 'Meditation pose',
  POWER_POSE = 'Power pose/Confident stance',
  SHY = 'Shy/Reserved posture',
  RELAXED = 'Relaxed/Casual',
  FORMAL = 'Formal/Stiff posture',
  DEFENSIVE = 'Defensive/Closed posture',
  OPEN = 'Open/Inviting posture',
  FATIGUED = 'Fatigued/Slumped',
  CONFIDENT = 'Confident/Assertive',
  SUBMISSIVE = 'Submissive/Humble',
}

export enum Expression {
  NEUTRAL = 'Neutral/Calm',
  SMILING = 'Smiling/Happy',
  LAUGHING = 'Laughing/Joyful',
  GRINNING = 'Grinning/Mischievous',
  CONTENT = 'Content/Serene',
  THOUGHTFUL = 'Thoughtful/Contemplative',
  CONCENTRATING = 'Concentrating/Focused',
  SURPRISED = 'Surprised/Shocked',
  AMAZED = 'Amazed/Wonderstruck',
  CONFUSED = 'Confused/Puzzled',
  WORRIED = 'Worried/Anxious',
  SAD = 'Sad/Melancholic',
  CRYING = 'Crying/Tearful',
  ANGRY = 'Angry/Furious',
  ANNOYED = 'Annoyed/Irritated',
  DISGUSTED = 'Disgusted/Revolted',
  FEARFUL = 'Fearful/Scared',
  HORRIFIED = 'Horrified/Terrified',
  BORED = 'Bored/Disinterested',
  TIRED = 'Tired/Exhausted',
  SLEEPY = 'Sleepy/Drowsy',
  DETERMINED = 'Determined/Resolute',
  CONFIDENT_FACE = 'Confident/Self-assured',
  SEDUCTIVE = 'Seductive/Alluring',
  MYSTERIOUS = 'Mysterious/Enigmatic',
  PLAYFUL = 'Playful/Mischievous',
  SARCASTIC = 'Sarcastic/Wry',
  EMPATHETIC = 'Empathetic/Understanding',
  COMPASSIONATE = 'Compassionate/Caring',
  PROUD = 'Proud/Achievement',
  HOPEFUL = 'Hopeful/Optimistic',
  DISAPPOINTED = 'Disappointed/Defeated',
  EMBARRASSED = 'Embarrassed/Shy',
  FLIRTATIOUS = 'Flirtatious/Playful',
  DEFIANT = 'Defiant/Challenging',
  LONGING = 'Longing/Yearning',
  NOSTALGIC = 'Nostalgic/Wistful',
  ECSTATIC = 'Ecstatic/Euphoric',
}

export enum HairStyle {
  // Length
  BALD = 'Bald/Shaved',
  BUZZ_CUT = 'Buzz cut/Very short',
  SHORT = 'Short hair',
  MEDIUM = 'Medium length',
  LONG = 'Long hair',
  VERY_LONG = 'Very long/Flowing',
  
  // Styles - Women
  BOB = 'Bob cut',
  LOB = 'Long bob (Lob)',
  PIXIE = 'Pixie cut',
  SHAG = 'Shag cut',
  LAYERED = 'Layered cut',
  FEATHERED = 'Feathered cut',
  ASYMMETRIC = 'Asymmetric cut',
  UNDERCUT = 'Undercut',
  FADE = 'Fade cut',
  TAPERED = 'Tapered cut',
  
  // Updos
  BUN = 'Bun/Chignon',
  TOP_KNOT = 'Top knot',
  PONYTAIL = 'Ponytail',
  HIGH_PONYTAIL = 'High ponytail',
  LOW_PONYTAIL = 'Low ponytail',
  BRAID = 'Braid/Single',
  BRAIDS = 'Braids/Multiple',
  FRENCH_BRAID = 'French braid',
  DUTCH_BRAID = 'Dutch braid',
  FISHTAIL = 'Fishtail braid',
  CORNROWS = 'Cornrows',
  DREADLOCKS = 'Dreadlocks/Locs',
  UPDO = 'Updo/Elegant',
  HALF_UP = 'Half up/Half down',
  
  // Special
  CURLY = 'Curly/Natural curls',
  WAVY = 'Wavy hair',
  STRAIGHT = 'Straight/Sleek',
  AFRO = 'Afro/Natural',
  PERM = 'Permed hair',
  SPIKED = 'Spiked hair',
  MOHAWK = 'Mohawk/Faux hawk',
  POMPADOUR = 'Pompadour',
  QUIFF = 'Quiff',
  PIGTAILS = 'Pigtails',
  SPACE_BUNS = 'Space buns',
  
  // Accessories
  HAIR_FLOWERS = 'With flowers in hair',
  HAIR_RIBBON = 'With ribbon/bow',
  HAIR_CLIPS = 'With decorative clips',
  HEADBAND = 'With headband',
  HAIR_PINS = 'With bobby pins visible',
  TIARA = 'With tiara/crown',
  VEIL = 'With veil',
  HAIR_WRAP = 'Head wrap/Scarf',
}

export enum HairColor {
  BLACK = 'Black hair',
  JET_BLACK = 'Jet black',
  OFF_BLACK = 'Off-black',
  DARK_BROWN = 'Dark brown',
  MEDIUM_BROWN = 'Medium brown',
  LIGHT_BROWN = 'Light brown',
  CHESTNUT = 'Chestnut/Auburn brown',
  AUBURN = 'Auburn/Red-brown',
  COPPER = 'Copper/Red-orange',
  RED = 'Red hair',
  BURGUNDY = 'Burgundy/Wine red',
  CHERRY_RED = 'Cherry red',
  STRAWBERRY_BLONDE = 'Strawberry blonde',
  HONEY_BLONDE = 'Honey blonde',
  GOLDEN_BLONDE = 'Golden blonde',
  PLATINUM_BLONDE = 'Platinum blonde',
  ASH_BLONDE = 'Ash blonde',
  DIRTY_BLONDE = 'Dirty blonde',
  SANDY_BLONDE = 'Sandy blonde',
  WHITE = 'White hair',
  SILVER = 'Silver/Grey',
  SALT_PEPPER = 'Salt and pepper',
  
  // Fashion colors
  PASTEL_PINK = 'Pastel pink',
  HOT_PINK = 'Hot pink',
  LAVENDER = 'Lavender/Purple',
  BLUE = 'Blue hair',
  TEAL = 'Teal/Turquoise',
  GREEN = 'Green hair',
  MINT = 'Mint green',
  ORANGE = 'Orange hair',
  YELLOW = 'Yellow hair',
  RAINBOW = 'Rainbow/Multi-colored',
  OMBRE = 'Ombre gradient',
  BALAYAGE = 'Balayage highlights',
  HIGHLIGHTS = 'With highlights',
  LOWLIGHTS = 'With lowlights',
  TWO_TONE = 'Two-tone/Split dye',
}

export enum SkinTone {
  VERY_FAIR = 'Very fair/Porcelain',
  FAIR = 'Fair/Light',
  LIGHT_BEIGE = 'Light beige',
  MEDIUM_FAIR = 'Medium fair',
  OLIVE = 'Olive/Medium',
  TAN = 'Tan/Moderate brown',
  MEDIUM_DEEP = 'Medium-deep brown',
  DEEP = 'Deep brown',
  VERY_DEEP = 'Very deep brown',
  DARK_CHOCOLATE = 'Dark chocolate',
  EBONY = 'Ebony/Black',
  
  // Undertones specified
  COOL_PINK = 'Cool with pink undertone',
  COOL_BLUE = 'Cool with blue undertone',
  WARM_GOLDEN = 'Warm with golden undertone',
  WARM_PEACH = 'Warm with peach undertone',
  NEUTRAL = 'Neutral undertone',
  YELLOW_OLIVE = 'Yellow-olive undertone',
  RED_BRONZE = 'Red-bronze undertone',
}

export enum EyeColor {
  DARK_BROWN = 'Dark brown eyes',
  MEDIUM_BROWN = 'Medium brown eyes',
  LIGHT_BROWN = 'Light brown/Amber eyes',
  HAZEL = 'Hazel eyes',
  GREEN = 'Green eyes',
  EMERALD = 'Emerald green eyes',
  BLUE = 'Blue eyes',
  ICE_BLUE = 'Ice blue eyes',
  NAVY = 'Navy/Dark blue eyes',
  GREY = 'Grey eyes',
  STEEL_GREY = 'Steel grey eyes',
  VIOLET = 'Violet/Purple eyes',
  AMBER = 'Amber/Gold eyes',
  HETEROCHROMIA = 'Heterochromia (different colors)',
  BLACK = 'Black eyes',
  ALBINO_RED = 'Albino red/pink',
  CAT_EYES = 'Cat-like eyes',
  GLOWING = 'Glowing/Supernatural eyes',
}

export enum ClothingStyle {
  // Casual
  CASUAL = 'Casual/Everyday',
  STREETWEAR = 'Streetwear/Urban',
  ATHLEISURE = 'Athleisure/Sporty casual',
  MINIMALIST = 'Minimalist/Basics',
  PREPPY = 'Preppy',
  BOHO = 'Bohemian/Boho-chic',
  
  // Formal
  FORMAL = 'Formal/Evening wear',
  BLACK_TIE = 'Black tie/Gala',
  WHITE_TIE = 'White tie/Ultra formal',
  BUSINESS = 'Business/Professional',
  BUSINESS_CASUAL = 'Business casual',
  COCKTAIL = 'Cocktail attire',
  
  // Historical/Period
  VINTAGE_20S = '1920s Flapper/Art Deco',
  VINTAGE_40S = '1940s/Wartime style',
  VINTAGE_50S = '1950s/Rockabilly',
  VINTAGE_60S = '1960s/Mod style',
  VINTAGE_70S = '1970s/Disco/Boho',
  VINTAGE_80S = '1980s/Neon/Big hair era',
  VINTAGE_90S = '1990s/Grunge',
  VICTORIAN = 'Victorian era dress',
  EDWARDIAN = 'Edwardian era dress',
  RENAISSANCE = 'Renaissance/Medieval',
  ANCIENT_ROMAN = 'Ancient Roman/Greek',
  BAROQUE = 'Baroque/Rococo fashion',
  
  // Subcultures
  PUNK = 'Punk/Rock',
  GOTH = 'Goth/Dark aesthetic',
  EMO = 'Emo/Scene',
  METAL = 'Metal/Headbanger',
  HIP_HOP = 'Hip-hop/Urban',
  SKATER = 'Skater style',
  SURFER = 'Surfer/Beach',
  HIPSTER = 'Hipster/Indie',
  NORMCORE = 'Normcore',
  
  // Alternative/Fantasy
  FANTASY_ARMOR = 'Fantasy armor/Warrior',
  ELVEN = 'Elven/Ethereal',
  STEAMPUNK_FASHION = 'Steampunk fashion',
  CYBERPUNK_FASHION = 'Cyberpunk/Techwear',
  FUTURISTIC = 'Futuristic/Sci-fi',
  POST_APOCALYPTIC = 'Post-apocalyptic/Mad Max',
  PIRATE = 'Pirate/Swashbuckler',
  NINJA = 'Ninja/Assassin',
  SAMURAI = 'Samurai/Ronin',
  VAMPIRE = 'Vampire/Gothic romantic',
  FAIRY = 'Fairy/Pixie aesthetic',
  
  // Professional/Functional
  MILITARY = 'Military/Combat uniform',
  POLICE = 'Police/Law enforcement',
  MEDICAL = 'Medical/Scrubs',
  CONSTRUCTION = 'Construction/Work wear',
  CHEF = 'Chef/Professional kitchen',
  SPORTS_UNIFORM = 'Sports uniform/Jersey',
  
  // Cultural
  TRADITIONAL_ASIAN = 'Traditional Asian (Hanfu, Kimono, etc.)',
  TRADITIONAL_INDIAN = 'Traditional Indian (Sari, Lehenga)',
  TRADITIONAL_AFRICAN = 'Traditional African (Dashiki, Ankara)',
  TRADITIONAL_MIDDLE_EASTERN = 'Traditional Middle Eastern',
  TRADITIONAL_NATIVE = 'Indigenous/Native traditional',
  TRADITIONAL_EUROPEAN = 'Traditional European folk',
  
  // Summer/Beach
  SWIMWEAR = 'Swimwear/Bikini',
  SUMMER_DRESS = 'Summer dress/Flowing',
  RESORT_WEAR = 'Resort wear/Luxury casual',
  
  // Seasonal
  WINTER_COAT = 'Winter coat/Heavy layers',
  AUTUMN_LAYERED = 'Autumn layered/Earth tones',
  SPRING_FRESH = 'Spring pastels/Light fabrics',
}

export enum MakeupBase {
  NO_MAKEUP = 'No makeup/Natural',
  BB_CREAM = 'BB cream/Light coverage',
  SHEER = 'Sheer/Natural foundation',
  MEDIUM_COVERAGE = 'Medium coverage',
  FULL_COVERAGE = 'Full coverage/Flawless',
  MATTE = 'Matte finish',
  DEWY = 'Dewy/Glowing finish',
  SATIN = 'Satin finish',
  LUMINOUS = 'Luminous/Radiant',
  GLASS_SKIN = 'Glass skin/K-beauty',
  AIRBRUSHED = 'Airbrushed finish',
}

export enum EyeshadowStyle {
  NO_EYESHADOW = 'No eyeshadow',
  NATURAL = 'Natural/Neutral tones',
  WARM_TONES = 'Warm tones (browns, oranges)',
  COOL_TONES = 'Cool tones (greys, blues)',
  SMOKY_EYE = 'Smoky eye',
  SOFT_SMOKEY = 'Soft smokey eye',
  DRAMATIC_SMOKEY = 'Dramatic black smokey eye',
  CUT_CREASE = 'Cut crease',
  HALO_EYE = 'Halo eye',
  WINGED_SHADOW = 'Winged/Extended shadow',
  GLITTER = 'Glitter eyeshadow',
  SHIMMER = 'Shimmer/Metallic',
  MATTE_EYESHADOW = 'Matte eyeshadow',
  MONOCHROMATIC = 'Monochromatic eye',
  NEON = 'Neon/Bright colors',
  PASTEL_EYE = 'Pastel eyeshadow',
  JEWEL_TONES = 'Jewel tones (emerald, sapphire)',
  GOLD = 'Gold eyeshadow',
  SILVER_EYE = 'Silver eyeshadow',
  BRONZE = 'Bronze/Copper',
  RED_EYE = 'Red/Burgundy tones',
  PINK_ROSE = 'Pink/Rose gold',
  PURPLE_EYE = 'Purple/Lavender',
  BLUE_EYE = 'Blue/Cobalt eyeshadow',
  GREEN_EYE = 'Green/Forest eyeshadow',
  GRAPHIC_LINER = 'Graphic liner eyeshadow',
  NEGATIVE_SPACE = 'Negative space eye makeup',
}

export enum EyelinerStyle {
  NO_EYELINER = 'No eyeliner',
  TIGHTLINE = 'Tightline/Upper waterline',
  THIN_NATURAL = 'Thin natural line',
  CLASSIC_WING = 'Classic winged eyeliner',
  CAT_EYE = 'Cat eye/Dramatic wing',
  DOUBLE_WING = 'Double wing eyeliner',
  SMOKEY_LINER = 'Smudged/Smokey liner',
  GRAPHIC = 'Graphic eyeliner shapes',
  COLORED_LINER = 'Colored eyeliner',
  WHITE_WATERLINE = 'White waterline',
  FLOATING_CREASE = 'Floating crease liner',
  PUPPY_DOG = 'Puppy dog eye (downward wing)',
  FOX_EYE = 'Fox eye (elongated upward)',
  EGIRL_LINER = 'E-girl eyeliner (heart, star)',
  NEGATIVE_LINER = 'Negative space liner',
  DECORATIVE = 'Decorative gems/glitter liner',
}

export enum MascaraStyle {
  NO_MASCARA = 'No mascara',
  NATURAL_LASHES = 'Natural lashes',
  LENGTHENING = 'Lengthening mascara',
  VOLUMIZING = 'Volumizing/Thick lashes',
  CURLING = 'Curled lashes',
  DRAMATIC = 'Dramatic/False lash look',
  SPIDER_LASHES = 'Spider lashes',
  COLORED_MASCARA = 'Colored mascara',
  BOTTOM_LASH = 'Emphasized bottom lashes',
  CLUMPED = 'Clumped/Doll-like lashes',
  WISPY = 'Wispy lashes',
  FEATHERED = 'Feathered lash look',
}

export enum EyebrowStyle {
  NATURAL_BROWS = 'Natural/Untouched brows',
  BRUSHED_UP = 'Brushed up/Soap brows',
  ARCHED = 'Arched/Defined',
  STRAIGHT = 'Straight/Korean style',
  ROUNDED = 'Rounded/Soft arch',
  S_SHAPED = 'S-shaped brows',
  HIGH_ARCH = 'High dramatic arch',
  BOY_BROWS = 'Boyish/Thick brows',
  PENCIL_THIN = 'Pencil thin/90s style',
  MICROBLADED = 'Microbladed look',
  OMBRE_BROWS = 'Ombre/Powder brows',
  BLEACHED = 'Bleached brows',
  COLORED_BROWS = 'Colored/Unusual brow color',
  GLITTER_BROWS = 'Glitter/Decorated brows',
  UNIBROW = 'Unibrow/Connected',
  FEATHERED_BROW = 'Feathered/Hair stroke look',
}

export enum BlushStyle {
  NO_BLUSH = 'No blush',
  NATURAL_FLUSH = 'Natural flush/Subtle',
  SUN_KISSED = 'Sun-kissed/Across nose',
  DRAPING = 'Draping/Sculpted blush',
  APPLE_CHEEKS = 'Apple cheeks/Cute',
  CONTOUR_BLUSH = 'Contoured/Structured',
  DRUNK_BLUSH = 'Drunk blush/Low on cheeks',
  E_GIRL = 'E-girl style (nose + cheeks)',
  DRAMA = 'Dramatic/Heavy blush',
  MONOCHROME = 'Monochrome matching',
  PINK_TONES = 'Pink/Rosy blush',
  PEACH_TONES = 'Peach/Coral blush',
  PLUM_TONES = 'Plum/Berry blush',
  ORANGE_TONES = 'Orange/Terracotta blush',
  BRONZER_GLOW = 'Bronzer as blush',
}

export enum ContourStyle {
  NO_CONTOUR = 'No contour',
  NATURAL_CONTOUR = 'Natural/Subtle contour',
  DRAMATIC_CONTOUR = 'Dramatic chiselled look',
  NOSE_CONTOUR = 'Defined nose contour',
  JAWLINE = 'Strong jawline definition',
  CHEEKBONES = 'Prominent cheekbones',
  FOREHEAD = 'Forehead contour',
  FULL_FACE = 'Full face contouring',
  CREAM_CONTOUR = 'Cream/Bronzed contour',
  COOL_TONE = 'Cool tone/Ash contour',
}

export enum HighlightStyle {
  NO_HIGHLIGHT = 'No highlight',
  NATURAL_GLOW = 'Natural subtle glow',
  DEWY_HIGHLIGHT = 'Dewy/Wet look',
  BLINDING = 'Blinding/Intense highlight',
  GOLDEN_HOUR = 'Golden highlight',
  SILVER_HIGHLIGHT = 'Silver/Icy highlight',
  CHAMPAGNE = 'Champagne/Rose gold',
  HOLOGRAPHIC = 'Holographic/Duochrome',
  GLITTER = 'Glitter highlight',
  INNER_CORNER = 'Inner corner highlight',
  BROW_BONE = 'Brow bone highlight',
  CUPIDS_BOW = "Cupid's bow highlight",
  NOSE_BRIDGE = 'Nose bridge highlight',
  COLLARBONE = 'Collarbone/Body highlight',
}

export enum LipStyle {
  NO_LIP_PRODUCT = 'No lip product',
  NATURAL_LIPS = 'Natural lip color',
  TINTED_BALM = 'Tinted balm/Sheer',
  GLOSS = 'Lip gloss/Shiny',
  SATIN_LIP = 'Satin finish',
  MATTE_LIP = 'Matte lipstick',
  VELVET = 'Velvet finish',
  CREAM = 'Cream finish',
  STAIN = 'Lip stain/Tint',
  OMBRE_LIPS = 'Ombre/Gradient lips',
  LINED_LIPS = 'Lip liner defined',
  OVERLINED = 'Overlined/Full lips',
  UNDERLINED = 'Understated liner',
  GLOSSY_CENTER = 'Glossy center/Dewy',
  
  // Colors
  NUDE = 'Nude/Natural pink',
  BROWN_NUDE = 'Brown nude',
  PEACH = 'Peach/Coral',
  PINK = 'Pink/Baby pink',
  HOT_PINK_LIP = 'Hot pink/Fuchsia',
  RED = 'Classic red',
  DEEP_RED = 'Deep red/Burgundy',
  BERRY = 'Berry/Wine',
  PLUM = 'Plum/Purple',
  ORANGE_LIP = 'Orange/Coral red',
  CORAL_LIP = 'Coral',
  MAUVE = 'Mauve/Dusty rose',
  
  // Special
  GLITTER_LIP = 'Glitter lip',
  METALLIC_LIP = 'Metallic/Chrome lip',
  BLACK_LIP = 'Black/Dark goth',
  UNUSUAL_COLOR = 'Unusual color (blue, green, etc.)',
  GLOSSY_BLACK = 'Glossy black',
  GLITTER_TOPPER = 'Glitter topper',
}

export enum NailStyle {
  NO_POLISH = 'No polish/Natural',
  CLEAR = 'Clear gloss',
  NATURAL_PINK = 'Natural pink/Manicured',
  FRENCH_MANICURE = 'French manicure',
  AMERICAN_MANICURE = 'American manicure',
  
  // Solid colors
  RED_NAILS = 'Red nails',
  PINK_NAILS = 'Pink nails',
  CORAL_NAILS = 'Coral/Peach nails',
  ORANGE_NAILS = 'Orange nails',
  YELLOW_NAILS = 'Yellow nails',
  GREEN_NAILS = 'Green nails',
  BLUE_NAILS = 'Blue nails',
  PURPLE_NAILS = 'Purple nails',
  BLACK_NAILS = 'Black nails',
  WHITE_NAILS = 'White nails',
  NUDE_NAILS = 'Nude/Neutral nails',
  BROWN_NAILS = 'Brown/Taupe nails',
  GREY_NAILS = 'Grey nails',
  
  // Designs
  FRENCH_TIP = 'Colored French tip',
  OMBRE_NAILS = 'Ombre/Gradient nails',
  GLITTER_NAILS = 'Glitter/Sparkle',
  CHROME_NAILS = 'Chrome/Mirror nails',
  METALLIC_NAILS = 'Metallic/Gold/Silver',
  MATTE_NAILS = 'Matte finish',
  GLOSSY_NAILS = 'High gloss/Shine',
  
  // Art
  MINIMALIST_ART = 'Minimalist nail art',
  FLORAL_NAILS = 'Floral designs',
  GEOMETRIC = 'Geometric patterns',
  ABSTRACT_NAIL = 'Abstract art',
  ANIMAL_PRINT = 'Animal print',
  MARBLE = 'Marble effect',
  HOLOGRAPHIC_NAIL = 'Holographic/Aurora',
  CAT_EYE_NAIL = 'Cat eye/Magnetic',
  JELLY_NAILS = 'Jelly/Translucent',
  MILK_BATH = 'Milk bath nails',
  
  // Length/Shape
  SHORT_NAILS = 'Short nails',
  MEDIUM_LENGTH = 'Medium length',
  LONG_NAILS = 'Long nails',
  STILETTO = 'Stiletto shape',
  COFFIN = 'Coffin/Ballerina',
  ALMOND = 'Almond shape',
  SQUARE = 'Square shape',
  ROUNDED = 'Rounded shape',
  OVAL = 'Oval shape',
  EDGE = 'Edge/Pointed square',
  LIPSTICK = 'Lipstick shape',
  ARROWHEAD = 'Arrowhead shape',
  
  // Special
  ACRYLIC = 'Acrylic extensions',
  GEL = 'Gel polish',
  DIP_POWDER = 'Dip powder',
  PRESS_ON = 'Press-on nails',
  RHINESTONES = 'Rhinestones/Gems',
  CHAINS = 'Nail chains/Jewelry',
  THREE_D_ART = '3D nail art',
  PIERCED = 'Pierced nails',
}
