from PIL import Image
import os

# Path to the uploaded image in brain folder
image_path = r'C:\Users\mugha\.gemini\antigravity-ide\brain\5041059c-ce03-4bbd-be21-657d2dca9d8e\media__1779896080667.png'

if os.path.exists(image_path):
    with Image.open(image_path) as img:
        print(f'Image size: {img.width}x{img.height}')
        print(f'Mode: {img.mode}')
else:
    print('Image not found')
