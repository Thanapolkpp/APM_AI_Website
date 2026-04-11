/**
 * Global Asset Configuration
 * All Cloudinary URLs are centralized here for easy maintenance.
 * You can enable optimization by adding transformations to the BASE_URL.
 */

const CLOUD_NAME = "dxfxkq0zs";
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto`;

export const ASSETS = {
    // 1. Branding & Icons
    BRANDING: {
        LOGO: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359069/logo_wrriem.png",
    },

    // 2. Character Avatars (2D Portraits)
    AVATARS: {
        BRO: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359062/Bro.png",
        GIRL: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359064/Girl.png",
        NERD1: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359068/Nerd.1.1_hnileu.png",
        NERD2: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359070/Nerd_pijabx.png",
    },

    // 3. 3D Character Models (GLB)
    MODELS: {
        BRO: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359412/bro_swukrc.glb",
        GIRL: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359288/girl_ntv6t4.glb",
        NERD: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359430/models_nerd.glb",
    },

    // 4. Reading System & Focus Mode Assets
    READING: {
        BACKGROUND: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359061/Backgroundroom.jpg",
        MOTION_GIF: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359077/Motion_Readding_mvuxem.gif",
        TABLE: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359083/Table_yazngk.png",
        CHAIR: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359064/Chair.png",
        GLASS_BEAR: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359067/GlassBear.gif",
        SPEAKER: "https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359086/SpeakerAPM_e0ezxt.gif",
    },

    // 5. Room Backgrounds & Scenes
    ROOMS: {
        NERD_STUDIO: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359087/NERD_ROOM_nomyir.png`,
        ROCK_STUDIO: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359079/Rock_Room_i3mdhl.png`,
        CHRISTMAS_NIGHT: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359067/Chirtmas_room.png`,
        DEFAULT_ROOM: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359061/Backgroundroom.jpg`,
    },

    // 6. UI & General Assets
    GENERAL: {
        SAMPLE_IMAGE_1: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359061/1.png`,
        SAMPLE_IMAGE_2: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359061/2.png`,
        SAMPLE_IMAGE_3: `https://res.cloudinary.com/dxfxkq0zs/image/upload/v1775359061/3.png`,
    }
};

/**
 * Helper to get a static frame from a GIF for performance/statis views
 * @param {string} gifUrl The Cloudinary GIF URL
 * @returns {string} URL pointing to the first frame of the GIF
 */
export const getStaticFrame = (gifUrl) => {
    if (!gifUrl || !gifUrl.includes('image/upload/')) return gifUrl;
    return gifUrl.replace('/image/upload/', '/image/upload/pg_1,f_auto,q_auto/');
};

/**
 * Maps database model paths (e.g. /models/bro.glb) to Cloudinary URLs
 */
export const mapModelPath = (path) => {
    if (!path) return null;
    const p = path.toLowerCase();
    if (p.includes("bro")) return ASSETS.MODELS.BRO;
    if (p.includes("girl")) return ASSETS.MODELS.GIRL;
    if (p.includes("nerd")) return ASSETS.MODELS.NERD;
    return path;
};

/**
 * Maps database image paths (e.g. NERD_ROOM.png) to Cloudinary URLs
 */
export const mapImagePath = (path) => {
    if (!path) return null;
    const p = path.toLowerCase();
    // Rooms mapping
    if (p.includes("nerd_room")) return ASSETS.ROOMS.NERD_STUDIO;
    if (p.includes("rock_room")) return ASSETS.ROOMS.ROCK_STUDIO;
    if (p.includes("chirtmas") || p.includes("christmas")) return ASSETS.ROOMS.CHRISTMAS_NIGHT;
    if (p.includes("backgroundroom")) return ASSETS.ROOMS.DEFAULT_ROOM;

    // Avatars (portraits) mapping
    if (p.includes("bro")) return ASSETS.AVATARS.BRO;
    if (p.includes("girl")) return ASSETS.AVATARS.GIRL;
    if (p.includes("nerd")) return ASSETS.AVATARS.NERD2;

    return path;
};

/**
 * Shared utility to get the correct avatar icon URL based on character name.
 * Handles all variants and cases.
 */
export const getAvatarIcon = (name) => {
    if (!name) return ASSETS.BRANDING.LOGO;
    const p = name.toLowerCase();
    if (p.includes("girl") || p.includes("bestie") || p.includes("cute")) return ASSETS.AVATARS.GIRL;
    else if (p.includes("nerd") || p.includes("genius")) return ASSETS.AVATARS.NERD2;
    else if (p.includes("bro")) return ASSETS.AVATARS.BRO;
    else return ASSETS.BRANDING.LOGO; // Default (if absolutely no data)
};
