/** Output of the neural network, flattened row-major (frame * nBins + bin). */
export interface Posteriors {
  nFrames: number;
  /** Note activity, 88 bins (A0..C8). */
  frames: Float32Array;
  /** Note onset probability, 88 bins. */
  onsets: Float32Array;
  /** Pitch salience, 264 bins (3 per semitone). */
  contours: Float32Array;
}

export type Instrument = 'piano' | 'cello';

/** A note detected in the audio, with timing in seconds and timbre features used to guess the instrument. */
export interface RawNote {
  start: number;
  end: number;
  pitch: number;
  /** Mean note activity (0..1). */
  amp: number;
  /** Pitch wobble (vibrato) measured from the fine pitch contour, in 1/3-semitone bins. */
  vibrato: number;
  /** How much the note keeps its strength towards its end (bowed ~1, struck/decaying < 1). */
  sustain: number;
  /** Onset sharpness (0..1). Hammered piano notes are high, bowed notes lower. */
  attack: number;
  /**
   * How sure the piano-specialist model is that a piano key was struck at this pitch
   * when the note began (0..1). Missing when the piano model was not run.
   */
  hammer?: number;
  /** Times the piano model re-triggered inside the note (bowed notes do, struck ones don't). */
  refire?: number;
  /** Seconds from the start to the loudest point, measured from the audio. */
  attackTime?: number;
  /** Loudness change after the peak in dB per second (struck notes fade). */
  decay?: number;
}

export interface LabeledNote extends RawNote {
  instrument: Instrument;
}

/** Everything that comes out of the (slow) audio analysis. The (fast) score building only needs this. */
export interface Analysis {
  duration: number;
  notes: RawNote[];
  /** Notes found by the piano-specialist model (when it was run). */
  pianoNotes?: { start: number; end: number; pitch: number; conf: number }[];
  /** Onset strength envelope used for tempo and beat detection, sampled at `envRate` Hz. */
  onsetEnv: Float32Array;
  envRate: number;
}
