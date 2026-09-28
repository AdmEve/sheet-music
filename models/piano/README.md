# Piano model

Weights of Google Magenta's **Onsets and Frames** piano transcription model
(`onsets_frames_uni`, trained on the MAESTRO dataset), licensed under Apache-2.0 by the
Magenta authors.

Source checkpoint: https://storage.googleapis.com/magentadata/js/checkpoints/transcription/onsets_frames_uni/

Converted with `scripts/convert-piano-model.py`: the velocity branch (not used here) is
removed and the weights are stored as float16, which halves the size without a measurable
change in the output.
