import os
from mingus.containers import NoteContainer
from mingus.core import chords
from mingus.midi import midi_file_out
from midi2audio import FluidSynth


class Instrument:
    # 🔹 Set your SoundFont path here (only once for all instruments)
    SOUND_FONT = "backend/musiclib/FluidR3_GM.sf2"

    def init(self, output_dir: str = "output"):
        if not os.path.exists(self.SOUND_FONT):
            raise FileNotFoundError(f"SoundFont not found: {self.SOUND_FONT}")
        
        self.fs = FluidSynth(self.SOUND_FONT)
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    def _save_midi(self, filename: str, notes: list):
        """Save notes/chords into a MIDI file using Mingus."""
        midi_path = os.path.join(self.output_dir, f"{filename}.mid")
        midi_file_out.write_NoteContainer(midi_path, NoteContainer(notes))
        return midi_path

    def _midi_to_audio(self, midi_path: str, out_name: str):
        """Convert MIDI to audio using FluidSynth."""
        out_path = os.path.join(self.output_dir, f"{out_name}.wav")
        self.fs.midi_to_audio(midi_path, out_path)
        return out_path


class Piano(Instrument):
    def init(self, output_dir: str = "output"):
        super().init(output_dir)

    def play_chord(self, chord_name: str, filename: str = "chord"):
        """
        Generate a chord (Cmaj, Am7, etc.) and render it as audio.
        """
        try:
            chord_notes = chords.from_shorthand(chord_name)  # e.g. "Cmaj7" -> ["C", "E", "G", "B"]
            if not chord_notes:
                raise ValueError(f"Invalid chord: {chord_name}")
            
            midi_path = self._save_midi(filename, chord_notes)
            audio_path = self._midi_to_audio(midi_path, filename)
            return audio_path

        except Exception as e:
            raise RuntimeError(f"Failed to generate chord {chord_name}: {e}")

    def play_note(self, note: str, filename: str = "note"):
        """
        Generate a single note (e.g., 'C', 'A#4', 'F#3') and render it as audio.
        """
        try:
            midi_path = self._save_midi(filename, [note])
            audio_path = self._midi_to_audio(midi_path, filename)
            return audio_path

        except Exception as e:
            raise RuntimeError(f"Failed to generate note {note}: {e}")


# ---------------- TEST CODE ---------------- #
if _name_ == "main":
    try:
        piano = Piano()

        # Test 1: Single note
        note_file = piano.play_note("C4", filename="C4_note_test")
        print(f"Generated note file: {note_file}")

        # Test 2: C major chord
        chord_file = piano.play_chord("Cmaj", filename="C_major_test")
        print(f"Generated chord file: {chord_file}")

        # Test 3: A minor 7 chord
        chord_file = piano.play_chord("Am7", filename="A_minor7_test")
        print(f"Generated chord file: {chord_file}")

    except Exception as e:
        print("Error:",e)