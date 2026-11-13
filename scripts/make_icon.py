# Generates build/icon.ico and renderer/logo.png (needs: pip install pillow)
from PIL import Image, ImageDraw
import os
S = 256
g = Image.new("RGBA", (S, S)); px = g.load()
for y in range(S):
    for x in range(S):
        t = (x + y) / (2 * S)
        px[x, y] = (int(91 + 69 * t), int(108 - 38 * t), 255, 255)
mask = Image.new("L", (S, S), 0)
ImageDraw.Draw(mask).rounded_rectangle((8, 8, S - 8, S - 8), 56, fill=255)
im = Image.new("RGBA", (S, S), (0, 0, 0, 0)); im.paste(g, (0, 0), mask)
d = ImageDraw.Draw(im)
for i, (x, y) in enumerate([(64, 64), (136, 64), (64, 136), (136, 136)]):
    d.rounded_rectangle((x, y, x + 56, y + 56), 14, fill=(255, 255, 255, 235 if i < 3 else 150))
os.makedirs("build", exist_ok=True); os.makedirs("renderer", exist_ok=True)
im.save("build/icon.ico", sizes=[(256, 256), (128, 128), (64, 64), (48, 48), (32, 32), (16, 16)])
im.save("renderer/logo.png")
