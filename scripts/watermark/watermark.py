from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageChops, ImageFilter


# ============================================================
# Workspace
# ============================================================

WORKSPACE_ROOT = Path(__file__).resolve().parents[2]

SOURCE_DIR = WORKSPACE_ROOT / "raw/images/wiki"
OUTPUT_DIR = WORKSPACE_ROOT / "public/wiki"
WATERMARK_PATH = WORKSPACE_ROOT / "raw/images/watermark.png"


# ============================================================
# Configuration
# ============================================================

# ------------------------------------------------------------
# Watermark size
# ------------------------------------------------------------

# Watermark width as a percentage of the source image width.
#
# 0.18 = 18%
# 0.25 = 25%
#
WATERMARK_SCALE = 1


# ------------------------------------------------------------
# Watermark position
# ------------------------------------------------------------

# Available:
#
# "center"
# "top-left"
# "top-right"
# "bottom-left"
# "bottom-right"
#
WATERMARK_POSITION = "center"

# Distance from the image edge.
MARGIN = 0


# ------------------------------------------------------------
# Emboss strength
# ------------------------------------------------------------

# Overall watermark strength.
#
# Lower = more subtle.
#
WATERMARK_OPACITY = 0.75

# Highlight strength.
HIGHLIGHT_OPACITY = 0.15

# Shadow strength.
SHADOW_OPACITY = 0.20


# ------------------------------------------------------------
# Emboss direction
# ------------------------------------------------------------

# Light comes from top-left.
#
# Highlight:
#   (-1, -1)
#
# Shadow:
#   ( 1,  1)
#
HIGHLIGHT_OFFSET = (-1, -1)
SHADOW_OFFSET = (1, 1)


# ------------------------------------------------------------
# Mask smoothing
# ------------------------------------------------------------

# For Minecraft-style pixel UI, 0 is recommended.
#
# Modern UI:
#   0.5 ~ 1.0
#
# Pixel UI:
#   0
#
BLUR_RADIUS = 0


# ------------------------------------------------------------
# Output
# ------------------------------------------------------------

OUTPUT_FORMAT = "WEBP"

WEBP_QUALITY = 92

# WebP method:
# 0 = fastest
# 6 = slowest / best compression
WEBP_METHOD = 6


# ------------------------------------------------------------
# Supported input formats
# ------------------------------------------------------------

SUPPORTED_EXTENSIONS = {
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
}


# ============================================================
# Utility
# ============================================================


def clamp(value: int) -> int:
    """Clamp an integer to the valid 0-255 range."""

    return max(0, min(255, value))


def scale_mask(
    mask: Image.Image,
    factor: float,
) -> Image.Image:
    """
    Scale the opacity of a grayscale mask.
    """

    return mask.point(
        lambda value: clamp(
            int(value * factor)
        )
    )


def offset_mask(
    mask: Image.Image,
    offset: tuple[int, int],
) -> Image.Image:
    """
    Move a grayscale mask by an x/y offset.

    Pixels moved outside the image are discarded.
    """

    offset_x, offset_y = offset

    result = Image.new(
        "L",
        mask.size,
        0,
    )

    src_left = max(0, -offset_x)
    src_top = max(0, -offset_y)

    src_right = min(
        mask.width,
        mask.width - offset_x,
    )

    src_bottom = min(
        mask.height,
        mask.height - offset_y,
    )

    if src_right <= src_left or src_bottom <= src_top:
        return result

    cropped = mask.crop(
        (
            src_left,
            src_top,
            src_right,
            src_bottom,
        )
    )

    dst_left = max(0, offset_x)
    dst_top = max(0, offset_y)

    result.paste(
        cropped,
        (
            dst_left,
            dst_top,
        ),
    )

    return result


# ============================================================
# Watermark
# ============================================================


def resize_watermark(
    watermark: Image.Image,
    image_width: int,
) -> Image.Image:
    """
    Resize the watermark based on the source image width.
    """

    target_width = max(
        1,
        int(image_width * WATERMARK_SCALE),
    )

    scale = target_width / watermark.width

    target_height = max(
        1,
        int(watermark.height * scale),
    )

    return watermark.resize(
        (
            target_width,
            target_height,
        ),
        Image.Resampling.LANCZOS,
    )


def get_watermark_position(
    image_size: tuple[int, int],
    watermark_size: tuple[int, int],
) -> tuple[int, int]:
    """
    Calculate the watermark position.
    """

    image_width, image_height = image_size
    watermark_width, watermark_height = watermark_size

    if WATERMARK_POSITION == "center":

        x = (
            image_width - watermark_width
        ) // 2

        y = (
            image_height - watermark_height
        ) // 2

    elif WATERMARK_POSITION == "top-left":

        x = MARGIN
        y = MARGIN

    elif WATERMARK_POSITION == "top-right":

        x = (
            image_width
            - watermark_width
            - MARGIN
        )

        y = MARGIN

    elif WATERMARK_POSITION == "bottom-left":

        x = MARGIN

        y = (
            image_height
            - watermark_height
            - MARGIN
        )

    elif WATERMARK_POSITION == "bottom-right":

        x = (
            image_width
            - watermark_width
            - MARGIN
        )

        y = (
            image_height
            - watermark_height
            - MARGIN
        )

    else:

        raise ValueError(
            f"Unknown watermark position: "
            f"{WATERMARK_POSITION}"
        )

    return x, y


def create_watermark_mask(
    image: Image.Image,
    watermark: Image.Image,
) -> Image.Image:
    """
    Create a full-size grayscale watermark mask.
    """

    watermark = resize_watermark(
        watermark,
        image.width,
    )

    # The alpha channel determines the watermark shape.
    mask = watermark.getchannel("A")

    if BLUR_RADIUS > 0:

        mask = mask.filter(
            ImageFilter.GaussianBlur(
                BLUR_RADIUS
            )
        )

    full_mask = Image.new(
        "L",
        image.size,
        0,
    )

    x, y = get_watermark_position(
        image.size,
        watermark.size,
    )

    full_mask.paste(
        mask,
        (
            x,
            y,
        ),
    )

    return scale_mask(
        full_mask,
        WATERMARK_OPACITY,
    )


def create_emboss_layers(
    image: Image.Image,
    mask: Image.Image,
) -> tuple[Image.Image, Image.Image]:
    """
    Create fake 3D emboss highlight and shadow layers.
    """

    # --------------------------------------------------------
    # Highlight
    # --------------------------------------------------------

    highlight_shifted = offset_mask(
        mask,
        HIGHLIGHT_OFFSET,
    )

    highlight_edge = ImageChops.subtract(
        mask,
        highlight_shifted,
    )

    highlight_edge = scale_mask(
        highlight_edge,
        HIGHLIGHT_OPACITY,
    )

    highlight = Image.new(
        "RGBA",
        image.size,
        (255, 255, 255, 0),
    )

    highlight.putalpha(
        highlight_edge
    )

    # --------------------------------------------------------
    # Shadow
    # --------------------------------------------------------

    shadow_shifted = offset_mask(
        mask,
        SHADOW_OFFSET,
    )

    shadow_edge = ImageChops.subtract(
        mask,
        shadow_shifted,
    )

    shadow_edge = scale_mask(
        shadow_edge,
        SHADOW_OPACITY,
    )

    shadow = Image.new(
        "RGBA",
        image.size,
        (0, 0, 0, 0),
    )

    shadow.putalpha(
        shadow_edge
    )

    return highlight, shadow


def apply_watermark(
    image: Image.Image,
    watermark: Image.Image,
) -> Image.Image:
    """
    Apply the embossed watermark to an image.
    """

    image = image.convert("RGBA")

    mask = create_watermark_mask(
        image,
        watermark,
    )

    highlight, shadow = create_emboss_layers(
        image,
        mask,
    )

    # Shadow first.
    result = Image.alpha_composite(
        image,
        shadow,
    )

    # Highlight on top.
    result = Image.alpha_composite(
        result,
        highlight,
    )

    return result


# ============================================================
# File processing
# ============================================================


def process_image(
    source_path: Path,
    output_path: Path,
    watermark: Image.Image,
) -> None:
    """
    Process one image.
    """

    print(
        f"[PROCESS] "
        f"{source_path.relative_to(WORKSPACE_ROOT)}"
    )

    with Image.open(source_path) as source:

        image = source.convert("RGBA")

        result = apply_watermark(
            image,
            watermark,
        )

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        result.save(
            output_path,
            "WEBP",
            quality=WEBP_QUALITY,
            method=WEBP_METHOD,
        )

    print(
        f"       -> "
        f"{output_path.relative_to(WORKSPACE_ROOT)}"
    )


# ============================================================
# Main
# ============================================================


def main() -> None:

    print()
    print("========================================")
    print(" MC521 Wiki Image Watermark")
    print("========================================")
    print()

    # --------------------------------------------------------
    # Validate paths
    # --------------------------------------------------------

    if not SOURCE_DIR.exists():

        raise FileNotFoundError(
            f"Source directory does not exist:\n"
            f"  {SOURCE_DIR}"
        )

    if not WATERMARK_PATH.exists():

        raise FileNotFoundError(
            f"Watermark file does not exist:\n"
            f"  {WATERMARK_PATH}"
        )

    OUTPUT_DIR.mkdir(
        parents=True,
        exist_ok=True,
    )

    print(
        f"Workspace : {WORKSPACE_ROOT}"
    )

    print(
        f"Source    : {SOURCE_DIR}"
    )

    print(
        f"Output    : {OUTPUT_DIR}"
    )

    print(
        f"Watermark : {WATERMARK_PATH}"
    )

    print()

    # --------------------------------------------------------
    # Load watermark
    # --------------------------------------------------------

    with Image.open(
        WATERMARK_PATH
    ) as watermark_source:

        watermark = watermark_source.convert(
            "RGBA"
        )

    if "A" not in watermark.getbands():

        raise ValueError(
            "Watermark image must contain "
            "an alpha channel."
        )

    # --------------------------------------------------------
    # Find source images
    # --------------------------------------------------------

    files = sorted(
        path
        for path in SOURCE_DIR.rglob("*")
        if (
            path.is_file()
            and path.suffix.lower()
            in SUPPORTED_EXTENSIONS
        )
    )

    if not files:

        print(
            "No supported images found."
        )

        return

    print(
        f"Found {len(files)} image(s)."
    )

    print()

    # --------------------------------------------------------
    # Process
    # --------------------------------------------------------

    success = 0
    failed = 0

    for source_path in files:

        relative_path = (
            source_path.relative_to(
                SOURCE_DIR
            )
        )

        output_path = (
            OUTPUT_DIR
            / relative_path.with_suffix(
                ".webp"
            )
        )

        try:

            process_image(
                source_path,
                output_path,
                watermark,
            )

            success += 1

        except Exception as error:

            failed += 1

            print(
                f"[ERROR] "
                f"{source_path}"
            )

            print(
                f"        {error}"
            )

        print()

    # --------------------------------------------------------
    # Summary
    # --------------------------------------------------------

    print("========================================")
    print(" Finished")
    print("========================================")
    print(
        f"Success : {success}"
    )
    print(
        f"Failed  : {failed}"
    )
    print(
        f"Output  : {OUTPUT_DIR}"
    )
    print()


if __name__ == "__main__":
    main()