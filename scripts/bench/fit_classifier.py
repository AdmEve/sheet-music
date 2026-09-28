"""Fits the piano-vs-cello note classifier (logistic regression) on benchmark features.

    python3 scripts/bench/fit_classifier.py features.json
Reports held-out accuracy (train on some soundfonts / pieces, test on the others) and
prints weights to paste into src/engine/assign.ts (bowedScore).
"""
import json
import sys

import numpy as np

rows = [r for r in json.load(open(sys.argv[1])) if r["label"] in ("piano", "cello")]
FEATURES = ["vibrato", "sustain", "attack", "len", "refire1", "refireN", "attackTime", "decay", "hammer"]


def feats(r):
    dur = r["end"] - r["start"]
    return [
        min(r["vibrato"], 0.8),
        max(-0.5, min(0.8, r["sustain"] - 0.9)),
        r["attack"] - 0.6,
        max(-1.0, min(1.5, np.log2(dur / 0.4))),
        1.0 if r.get("refire", 0) >= 1 else 0.0,
        min(r.get("refire", 0), 3) / 3,
        min(r.get("attackTime", 0), 0.3) / 0.3,
        max(-60, min(20, r.get("decay", 0))) / 20,
        r.get("hammer", 0.5),
    ]


X = np.array([feats(r) for r in rows])
y = np.array([1.0 if r["label"] == "cello" else 0.0 for r in rows])
sf = np.array([r["file"].rsplit("-", 1)[1].replace(".wav", "") for r in rows])
piece = np.array([r["file"].rsplit("-", 1)[0] for r in rows])


def fit(X, y, l2=0.3, iters=4000, lr=0.2):
    Xb = np.hstack([X, np.ones((len(X), 1))])
    w = np.zeros(Xb.shape[1])
    # Balance classes so the rarer cello notes count as much as piano notes.
    cw = np.where(y == 1, 0.5 / max(1, y.mean()), 0.5 / max(1e-9, 1 - y.mean()))
    for _ in range(iters):
        p = 1 / (1 + np.exp(-Xb @ w))
        g = Xb.T @ ((p - y) * cw) / len(y) + l2 * np.r_[w[:-1], 0] / len(y)
        w -= lr * g
    return w


def acc(w, X, y):
    Xb = np.hstack([X, np.ones((len(X), 1))])
    pred = (Xb @ w) > 0
    cello = y == 1
    return (pred == cello).mean(), (pred[cello]).mean(), (~pred[~cello]).mean()


def old_rule(X):
    vib, sus, att, ln = X[:, 0], X[:, 1], X[:, 2], X[:, 3]
    return (1.8 * vib + 1.2 * sus - 0.8 * att + 0.1 * ln - 0.15) > 0


print(f"notes: {len(y)} ({int(y.sum())} cello)")
o = old_rule(X)
print(f"current hand-made rule: accuracy {(o == (y == 1)).mean():.2f}, cello found {o[y == 1].mean():.2f}, piano kept {(~o[y == 0]).mean():.2f}")
for name, groups in (("sound set", sf), ("piece", piece)):
    accs = []
    for g in sorted(set(groups)):
        tr, te = groups != g, groups == g
        w = fit(X[tr], y[tr])
        a = acc(w, X[te], y[te])
        accs.append(a)
        print(f"  held-out {name} {g:12s}: accuracy {a[0]:.2f}  cello found {a[1]:.2f}  piano kept {a[2]:.2f}")
    print(f"  mean over held-out {name}s: {np.mean([a[0] for a in accs]):.2f}")
w = fit(X, y)
print("weights:", {f: round(float(v), 3) for f, v in zip(FEATURES + ["bias"], w)})
