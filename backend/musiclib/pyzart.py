# pyzart.py
from mingus.core import chords, notes
from scamp import *
playback_settings.recording_file_path = "rec.wav"
class Instrument:
    """Parent class for all instruments using SCAMP + Mingus."""

    _session = Session()
    
    def __init__(self, name: str):
        self.name = name
        self.part = self._session.new_part(name)
        
        #self.part.instrument.set_polyphony(128)

    def play_note(self, note: str, duration: float = 1.0, volume: float = 0.8):
        """
        Play a single note (e.g. 'C4', 'A#3', 'F#5').
        """
        try:
            # Split pitch and octave
            pitch = ''.join([c for c in note if c.isalpha() or c in ['#', 'b']])
            octave_str = ''.join([c for c in note if c.isdigit()])
            octave = int(octave_str) if octave_str else 4  # default = octave 4
            
            base_midi = notes.note_to_int(pitch)  # "C" -> 0
            midi_note = base_midi + (12 * (octave + 1))  # "C4" = 60

            self.part.play_note(midi_note, volume, duration)
            print(f"{self.name} played note {note} (MIDI {midi_note}) for {duration} beats")
        except Exception as e:
            raise RuntimeError(f"Error playing note {note}: {e}")

    def play_chord(self, chord_name: str, duration: float = 1.0, octave: int = 4, volume: float = 0.8):
        """
        Play a chord, e.g. 'Cmaj7', 'Am'.
        """
        try:
            chord_notes = chords.from_shorthand(chord_name)
            if not chord_notes:
                raise ValueError(f"Invalid chord: {chord_name}")

            midi_notes = [notes.note_to_int(n) + (12 * (octave + 1)) for n in chord_notes]
            self.part.play_chord(midi_notes, volume, duration)
            print(f"{self.name} played chord {chord_name} (MIDI {midi_notes}) for {duration} beats")
        except Exception as e:
            raise RuntimeError(f"Error playing chord {chord_name}: {e}")


# Derived classes
class Piano(Instrument):
    def __init__(self):
        super().__init__("piano")


class Guitar(Instrument):
    def __init__(self):
        super().__init__("acoustic guitar")


# ---------------- TEST CODE ---------------- #
if __name__ == "__main__":
    piano = Piano()
    guitar = Guitar()

    # Test chords
    #piano.play_chord("Cmaj7", duration=1.0, octave=4)
    for i in range(3):
        piano.play_note("C5",duration=0.4)
    piano.play_note("A#4",duration=0.4)
    piano.play_note("G4",duration=0.4)
    piano.play_note("G4",duration=0.8)
    for i in range(2):
        piano.play_note("F4",duration=0.4)
    piano.play_note("D#4",duration=0.4)
    piano.play_note("F",duration=0.4)
    piano.play_note("G4",duration=4)
    for i in range(1,30):
        piano.play_note("C4", duration=i/100)
    for i in range(30,1,-1):
        piano.play_note("C4",duration=i/100)
    
    chordss= [
    # Major chords
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
    
    # Minor chords
    "Cm", "C#m", "Dm", "D#m", "Em", "Fm", "F#m", "Gm", "G#m", "Am", "A#m", "Bm"
]
    for chord in chordss:
        piano.play_chord(chord,0.5)
    