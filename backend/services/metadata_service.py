"""
TruthLense AI - Genuine Metadata & EXIF Extraction Service
Parses camera hardware tags, GPS, software markers, and container anomalies.
"""

from PIL import Image, ExifTags

def extract_metadata(image: Image.Image, filename: str, filesize_bytes: int):
    raw_exif = None
    try:
        raw_exif = image.getexif()
    except Exception:
        raw_exif = None

    exif_data = {}
    camera_make = None
    camera_model = None
    software = None
    date_time = None

    if raw_exif:
        for tag_id, value in raw_exif.items():
            tag_name = ExifTags.TAGS.get(tag_id, str(tag_id))
            # Filter to readable string
            if isinstance(value, bytes):
                try:
                    value = value.decode('utf-8', errors='ignore')
                except Exception:
                    value = str(value)
            
            exif_data[tag_name] = str(value)

            if tag_name == 'Make':
                camera_make = str(value)
            elif tag_name == 'Model':
                camera_model = str(value)
            elif tag_name == 'Software':
                software = str(value)
            elif tag_name == 'DateTime':
                date_time = str(value)

    has_exif = len(exif_data) > 0

    # Format human-readable file size
    if filesize_bytes < 1024:
        filesize_str = f"{filesize_bytes} Bytes"
    elif filesize_bytes < 1024 * 1024:
        filesize_str = f"{filesize_bytes / 1024:.1f} KB"
    else:
        filesize_str = f"{filesize_bytes / (1024 * 1024):.2f} MB"

    anomalies = []
    if not has_exif:
        anomalies.append("EXIF container tags missing (common with web downloads / synthetic generation)")
    else:
        if software:
            software_lower = software.lower()
            if any(term in software_lower for term in ['photoshop', 'gimp', 'diffusion', 'stablediffusion', 'autoencoder', 'midjourney']):
                anomalies.append(f"Image editing/synthesis software atom detected: {software}")

    return {
        "filename": filename,
        "filesize": filesize_str,
        "format": image.format or "Unknown",
        "has_exif": has_exif,
        "camera_make": camera_make or ("Not available (Stripped / Synthetic)" if not has_exif else "Unknown Maker"),
        "camera_model": camera_model or ("Not available (Stripped / Synthetic)" if not has_exif else "Unknown Model"),
        "software": software or "Direct Optical Capture / Firmware Standard",
        "date_time": date_time or "Not available",
        "color_mode": image.mode,
        "raw_tag_count": len(exif_data),
        "anomalies": anomalies,
        "is_intact": bool(has_exif and len(anomalies) == 0)
    }
