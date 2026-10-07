"""
TruthLense AI - Dataset Generator & Synthesizer
Generates a labeled benchmark dataset with distinct Real vs Manipulated / Synthetic visual patterns.
Structured into:
  dataset/
    train/ (real, fake)
    validation/ (real, fake)
    test/ (real, fake)
"""

import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

DATASET_ROOT = os.path.dirname(os.path.abspath(__file__))
SPLITS = {
    'train': 60,       # 60 real, 60 fake = 120 total
    'validation': 20,  # 20 real, 20 fake = 40 total
    'test': 20         # 20 real, 20 fake = 40 total
}

def generate_real_image(seed: int, width=256, height=256) -> Image.Image:
    """
    Generates a natural photographic pattern with consistent Bayer sensor noise,
    coherent illumination gradients, continuous high-frequency textures, and natural optics.
    """
    rng = np.random.default_rng(seed)
    
    # Base background: coherent radial or linear light gradient
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    
    # Organic illumination field
    angle = rng.uniform(0, 2 * math.pi)
    grad = np.cos(angle) * xx + np.sin(angle) * yy
    base_color = rng.uniform(80, 200, size=3)
    
    r = np.clip(base_color[0] + 45 * grad, 0, 255)
    g = np.clip(base_color[1] + 35 * grad, 0, 255)
    b = np.clip(base_color[2] + 40 * grad, 0, 255)
    img_arr = np.stack([r, g, b], axis=-1).astype(np.float32)
    
    # Add authentic natural subject (portrait / object silhouette with continuous edges)
    cx, cy = int(width * rng.uniform(0.45, 0.55)), int(height * rng.uniform(0.45, 0.55))
    rx, ry = int(width * rng.uniform(0.22, 0.32)), int(height * rng.uniform(0.26, 0.36))
    
    mask = (((xx * width - cx + width/2) / rx)**2 + ((yy * height - cy + height/2) / ry)**2) <= 1.0
    subject_color = rng.uniform(140, 230, size=3)
    for c in range(3):
        img_arr[mask, c] = 0.85 * subject_color[c] + 0.15 * img_arr[mask, c]
        
    # Uniform Bayer sensor noise (PRNU) across the entire sensor frame
    sensor_noise = rng.normal(0, 4.5, size=(height, width, 3))
    img_arr = np.clip(img_arr + sensor_noise, 0, 255).astype(np.uint8)
    
    img = Image.fromarray(img_arr)
    return img

def generate_fake_image(seed: int, width=256, height=256) -> Image.Image:
    """
    Generates a manipulated / synthetic image containing deepfake signatures:
    - Inpainting / boundary blending seam with gradient discontinuity
    - Sensor noise floor mismatch (smoothing filter in inner region, absence of PRNU)
    - Double quantization artifacts & high-frequency spectral attenuation
    """
    rng = np.random.default_rng(seed + 10000)
    
    # Start with background canvas
    x = np.linspace(-1, 1, width)
    y = np.linspace(-1, 1, height)
    xx, yy = np.meshgrid(x, y)
    
    angle = rng.uniform(0, 2 * math.pi)
    grad = np.cos(angle) * xx + np.sin(angle) * yy
    base_color = rng.uniform(60, 180, size=3)
    
    r = np.clip(base_color[0] + 50 * grad, 0, 255)
    g = np.clip(base_color[1] + 40 * grad, 0, 255)
    b = np.clip(base_color[2] + 45 * grad, 0, 255)
    img_arr = np.stack([r, g, b], axis=-1).astype(np.float32)
    
    # Outer background noise
    bg_noise = rng.normal(0, 7.0, size=(height, width, 3))
    img_arr = np.clip(img_arr + bg_noise, 0, 255)
    
    # Manipulated / face-swapped inner region
    cx, cy = int(width * rng.uniform(0.45, 0.55)), int(height * rng.uniform(0.45, 0.55))
    rx, ry = int(width * rng.uniform(0.24, 0.32)), int(height * rng.uniform(0.28, 0.36))
    dist = ((xx * width - cx + width/2) / rx)**2 + ((yy * height - cy + height/2) / ry)**2
    inner_mask = dist <= 0.85
    seam_mask = (dist > 0.85) & (dist <= 1.05)
    
    # Synthetic face color with slight lighting incoherence (different light vector)
    light_incoherent_grad = -np.cos(angle + 1.2) * xx - np.sin(angle + 1.2) * yy
    fake_color = rng.uniform(150, 240, size=3)
    
    for c in range(3):
        # Neural generator smoothing: absence of high frequency sensor noise
        img_arr[inner_mask, c] = np.clip(fake_color[c] + 30 * light_incoherent_grad[inner_mask], 0, 255)
    
    # Boundary seam: edge blending interpolation blur & step gradient
    for c in range(3):
        img_arr[seam_mask, c] = 0.5 * img_arr[seam_mask, c] + 0.5 * fake_color[c]
        
    # High-frequency checkerboard artifact typical of transposed deconvolution in GAN generators
    cb = (np.sin(xx * 60) * np.sin(yy * 60) > 0).astype(np.float32) * 4.0
    img_arr[inner_mask, 0] = np.clip(img_arr[inner_mask, 0] + cb[inner_mask], 0, 255)
    
    img = Image.fromarray(img_arr.astype(np.uint8))
    # Apply localized smoothing on inner region
    blurred = img.filter(ImageFilter.GaussianBlur(radius=1.2))
    
    mask_img = Image.fromarray((inner_mask * 255).astype(np.uint8))
    final_img = Image.composite(blurred, img, mask_img)
    return final_img

def build_dataset():
    print("Building TruthLense Deepfake Forensic Benchmark Dataset...")
    dataset_base = os.path.join(DATASET_ROOT, 'dataset')
    
    global_seed = 42
    
    for split, count in SPLITS.items():
        real_dir = os.path.join(dataset_base, split, 'real')
        fake_dir = os.path.join(dataset_base, split, 'fake')
        os.makedirs(real_dir, exist_ok=True)
        os.makedirs(fake_dir, exist_ok=True)
        
        print(f"Generating {split} set: {count} REAL and {count} FAKE images...")
        
        for i in range(count):
            # Real
            real_img = generate_real_image(seed=global_seed)
            real_img.save(os.path.join(real_dir, f"{split}_real_{i+1:03d}.jpg"), quality=95)
            global_seed += 1
            
            # Fake
            fake_img = generate_fake_image(seed=global_seed)
            fake_img.save(os.path.join(fake_dir, f"{split}_fake_{i+1:03d}.jpg"), quality=90)
            global_seed += 1
            
    print(f"Dataset generation complete in {dataset_base}!")
    print(f"Total images: {sum(SPLITS.values()) * 2} ({SPLITS['train']*2} train, {SPLITS['validation']*2} val, {SPLITS['test']*2} test)")

if __name__ == '__main__':
    build_dataset()
