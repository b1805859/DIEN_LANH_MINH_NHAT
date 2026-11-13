"""Generate pixel-accurate human-only foreground mask using MODNet + RMBG-1.4."""
from pathlib import Path
import cv2
import numpy as np
import onnxruntime as ort
from PIL import Image

root = Path(__file__).resolve().parents[1] / 'apps/web/public/images/redesign'
source = np.array(Image.open(root / 'hero-family-service-finder-v5.webp').convert('RGB'))
H, W = source.shape[:2]

mod_sess = ort.InferenceSession('/tmp/modnet.onnx', providers=['CPUExecutionProvider'])
rmbg_sess = ort.InferenceSession('/tmp/rmbg14_fp16.onnx', providers=['CPUExecutionProvider'])


def predict_modnet(rgb_crop: np.ndarray, target_short: int = 640) -> np.ndarray:
    h, w = rgb_crop.shape[:2]
    scale = target_short / min(h, w)
    nh = int(round(h * scale / 32.0)) * 32
    nw = int(round(w * scale / 32.0)) * 32
    resized = cv2.resize(rgb_crop, (nw, nh), interpolation=cv2.INTER_AREA).astype(np.float32)
    inp = np.transpose((resized / 255.0 - 0.5) / 0.5, (2, 0, 1))[None, ...]
    out = mod_sess.run(None, {mod_sess.get_inputs()[0].name: inp})[0][0, 0]
    return np.clip(cv2.resize(out, (w, h), interpolation=cv2.INTER_CUBIC), 0.0, 1.0)


def predict_rmbg(rgb_crop: np.ndarray) -> np.ndarray:
    h, w = rgb_crop.shape[:2]
    resized = cv2.resize(rgb_crop, (1024, 1024), interpolation=cv2.INTER_CUBIC).astype(np.float32) / 255.0
    inp = np.transpose(resized - 0.5, (2, 0, 1))[None, ...]
    out = rmbg_sess.run(None, {rmbg_sess.get_inputs()[0].name: inp})[0][0, 0]
    out = (out - out.min()) / (out.max() - out.min() + 1e-8)
    return np.clip(cv2.resize(out, (w, h), interpolation=cv2.INTER_CUBIC), 0.0, 1.0)


fx1, fy1, fx2, fy2 = 810, 450, 1170, 775
fam_a = predict_modnet(source[fy1:fy2, fx1:fx2], 640)

tx1, ty1, tx2, ty2 = 1230, 300, 1650, 947
tech_mod = predict_modnet(source[ty1:ty2, tx1:tx2], 640)
tech_rmbg = predict_rmbg(source[ty1:ty2, tx1:tx2])
tech_gate = cv2.GaussianBlur((tech_mod > 0.15).astype(np.float32), (15, 15), 5.0)
tech_a = np.clip(tech_rmbg * np.clip(tech_gate * 1.5, 0.0, 1.0), 0.0, 1.0)

full_alpha = np.zeros((H, W), dtype=np.float32)
full_alpha[fy1:fy2, fx1:fx2] = fam_a

sub = source[605:722, 835:965].astype(np.float32)
sr, sg, sb = sub[:, :, 0], sub[:, :, 1], sub[:, :, 2]
sh, sw = sub.shape[:2]
sy, sx = np.mgrid[0:sh, 0:sw]
gx = sx + 835
gy = sy + 605

is_warm_khaki = (
    ((sr - sg) >= 6.0)
    & ((sr - sb) >= 22.0)
    & ((sg - sb) <= 2.1 * (sr - sg) + 4.0)
    & (sr >= 85.0)
)
in_crotch_zone = (gx >= 872) & (gx <= 922) & (gy >= 610) & (gy <= 655)
in_crotch_sofa = (gx >= 908) & (gx <= 924) & (gy >= 645)
khaki_fill = cv2.GaussianBlur(
    (in_crotch_zone & ~in_crotch_sofa & is_warm_khaki).astype(np.float32), (5, 5), 1.0
)
full_alpha[605:722, 835:965] = np.maximum(full_alpha[605:722, 835:965], khaki_fill)

in_lower_plant_core = (((gx - 877.0) / 29.0) ** 2 + ((gy - 657.0) / 19.0) ** 2) < 1.0
is_plant_leaf = (
    (gy >= 620)
    & (gy <= 672)
    & (gx >= 836)
    & (gx <= 918)
    & ((~is_warm_khaki) | in_lower_plant_core)
)
is_pot_or_cup = (gy >= 670) & ~((gx >= 946) & (gy <= 682) & ((sr - sb) > 25))
is_cup_rim = (gx >= 905) & (gx <= 954) & (gy >= 663) & (gy <= 672) & ((sr - sb) < 24)

remove_mask = (is_plant_leaf | is_pot_or_cup | is_cup_rim).astype(np.uint8)
remove_mask = cv2.morphologyEx(
    remove_mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
)
keep_mask = 1.0 - cv2.GaussianBlur(remove_mask.astype(np.float32), (5, 5), 1.0)
full_alpha[605:722, 835:965] *= keep_mask

sub2 = source[598:628, 966:982].astype(np.float32)
grey_sofa = (np.max(sub2, axis=2) - np.min(sub2, axis=2) < 22) & (sub2[:, :, 0] < 115)
full_alpha[598:628, 966:982] *= 1.0 - cv2.GaussianBlur(grey_sofa.astype(np.float32), (3, 3), 0.8)

full_alpha[ty1:ty2, tx1:tx2] = np.maximum(full_alpha[ty1:ty2, tx1:tx2], tech_a)

rgba = np.dstack((source, np.round(full_alpha * 255.0).astype(np.uint8)))
Image.fromarray(rgba).save(root / 'hero-family-foreground-v1.webp', lossless=True)
Image.fromarray(rgba).save(root / 'hero-family-foreground-v2.webp', lossless=True)
