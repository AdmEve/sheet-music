"""Converts Magenta's Onsets-and-Frames (onsets_frames_uni) TF.js checkpoint for bundling:
drops the velocity branch (unused) and stores weights as float16 (half the size).

    python3 scripts/convert-piano-model.py <downloaded checkpoint dir> models/piano
Checkpoint: https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni/
"""
import json
import os
import sys

import numpy as np

src, dst = sys.argv[1], sys.argv[2]
os.makedirs(dst, exist_ok=True)
manifest = json.load(open(os.path.join(src, "weights_manifest.json")))
specs, blobs = [], []
for group in manifest:
    data = b"".join(open(os.path.join(src, p), "rb").read() for p in group["paths"])
    off = 0
    for w in group["weights"]:
        n = int(np.prod(w["shape"])) if w["shape"] else 1
        assert w.get("dtype", "float32") == "float32" and "quantization" not in w
        arr = np.frombuffer(data, dtype="<f4", count=n, offset=off)
        off += n * 4
        if w["name"].startswith("velocity/"):
            continue
        specs.append({"name": w["name"], "shape": w["shape"], "dtype": "float32",
                      "quantization": {"dtype": "float16", "original_dtype": "float32"}})
        blobs.append(arr.astype("<f2").tobytes())
blob = b"".join(blobs)
shard = 4 * 1024 * 1024
paths = []
for i in range(0, len(blob), shard):
    name = f"group1-shard{i // shard + 1}of{(len(blob) + shard - 1) // shard}"
    open(os.path.join(dst, name), "wb").write(blob[i:i + shard])
    paths.append(name)
json.dump([{"paths": paths, "weights": specs}], open(os.path.join(dst, "weights_manifest.json"), "w"))
print(f"{len(specs)} weights, {len(blob) / 1e6:.1f} MB in {len(paths)} shards")
