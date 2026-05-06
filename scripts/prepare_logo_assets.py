from pathlib import Path

from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
ICON_SOURCE = Path("/Users/nathaneverett/Documents/just the logo icon xamvera.png")
LOCKUP_SOURCE = Path("/Users/nathaneverett/Downloads/Gemini_Generated_Image_t7p2pft7p2pft7p2.png")
ASSETS = ROOT / "assets"

NAVY = (5, 23, 52)


def remove_light_background(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = image.load()
    width, height = image.size

    alpha = Image.new("L", image.size, 0)
    alpha_pixels = alpha.load()

    for y in range(height):
        for x in range(width):
            red, green, blue, _ = pixels[x, y]
            luminance = (0.299 * red) + (0.587 * green) + (0.114 * blue)
            saturation = max(red, green, blue) - min(red, green, blue)
            darkness = 248 - luminance

            if darkness <= 8 and saturation < 22:
                next_alpha = 0
            else:
                next_alpha = int(max(0, min(255, (darkness - 5) * 4.1)))

            alpha_pixels[x, y] = next_alpha

    alpha = alpha.filter(ImageFilter.GaussianBlur(0.35))

    cleaned = Image.new("RGBA", image.size, NAVY + (0,))
    cleaned.putalpha(alpha)
    return cleaned


def content_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bbox = alpha.point(lambda value: 255 if value > 12 else 0).getbbox()
    if bbox is None:
        raise RuntimeError("Logo content was not detected.")
    return bbox


def centered_canvas(image: Image.Image, size: int, padding_ratio: float) -> Image.Image:
    bbox = content_bbox(image)
    cropped = image.crop(bbox)
    max_content = int(size * (1 - (padding_ratio * 2)))
    cropped.thumbnail((max_content, max_content), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - cropped.width) // 2
    y = (size - cropped.height) // 2
    canvas.alpha_composite(cropped, (x, y))
    return canvas


def centered_lockup(image: Image.Image, width: int, height: int) -> Image.Image:
    bbox = content_bbox(image)
    cropped = image.crop(bbox)
    cropped.thumbnail((int(width * 0.9), int(height * 0.78)), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    x = (width - cropped.width) // 2
    y = (height - cropped.height) // 2
    canvas.alpha_composite(cropped, (x, y))
    return canvas


def save_icon_assets() -> None:
    icon = remove_light_background(Image.open(ICON_SOURCE))
    large = centered_canvas(icon, 1024, 0.08)
    medium = large.resize((512, 512), Image.Resampling.LANCZOS)
    small = large.resize((192, 192), Image.Resampling.LANCZOS)
    favicon = large.resize((64, 64), Image.Resampling.LANCZOS)

    large.save(ASSETS / "xanvera-mark.png")
    medium.save(ASSETS / "xanvera-mark-512.png")
    small.save(ASSETS / "xanvera-mark-192.png")
    favicon.save(ASSETS / "favicon.png")


def save_lockup_asset() -> None:
    lockup = remove_light_background(Image.open(LOCKUP_SOURCE))
    centered = centered_lockup(lockup, 1800, 720)
    centered.save(ASSETS / "xanvera-source-lockup-clean.png")


def main() -> None:
    ASSETS.mkdir(exist_ok=True)
    save_icon_assets()
    save_lockup_asset()


if __name__ == "__main__":
    main()
