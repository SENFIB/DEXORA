# Generates build/icon.ico and renderer/logo.png for DEXORA (needs: pip install pillow)
from PIL import Image, ImageDraw
import os

S = 256
g = Image.new("RGBA", (S, S))
px = g.load()
for y in range(S):
    for x in range(S):
        t = (x * 0.6 + y * 0.4) / S
        r = int(18 + 88 * t)
        gr = int(22 + 52 * (1 - abs(t - 0.5) * 2))
        b = int(48 + 195 * t)
        px[x, y] = (r, gr, min(255, b), 255)

mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle((8, 8, S - 8, S - 8), 58, fill=255)
im = Image.new("RGBA", (S, S), (0, 0, 0, 0))
im.paste(g, (0, 0), mask)

d = ImageDraw.Draw(im)
d.rounded_rectangle((14, 14, S - 14, S - 14), 52, outline=(120, 170, 255, 95), width=3)
# Sleek geometric DEXORA crystal / D-portal emblem
d.polygon([(74, 56), (148, 56), (196, 128), (148, 200), (74, 200)], fill=(255, 255, 255, 240))
d.polygon([(102, 88), (138, 88), (164, 128), (138, 168), (102, 168)], fill=(32, 42, 108, 255))
d.polygon([(74, 106), (126, 128), (74, 150)], fill=(0, 230, 195, 245))

os.makedirs("build", exist_ok=True)
os.makedirs("renderer", exist_ok=True)
im.save("build/icon.ico", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
im.save("renderer/logo.png")
