# pyzart.py
from mingus.core import chords, notes,scales
from scamp import *
from .instrumentkeywords import instrument_keywords
playback_settings.recording_file_path = "rec.wav"

class Instrument:
    """Parent class for all instruments using SCAMP + Mingus."""
    def __init__(self, session, name: str):
        self.name = name
        self.session = session
        self.part = self.session.new_part(name)
        
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

            n =self.part.play_note(midi_note, volume, duration)
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
    
    def play_notes(self, notes_list, octaves_list, duration=1.0, volume=0.8):
        try:
            if not notes_list or not isinstance(notes_list, list):
                raise ValueError(f"Notes list must be a non-empty list: {notes_list}")

            midi_notes = []
            for note, note_octave in zip(notes_list, octaves_list):
                pitch = ''.join([c for c in note if c.isalpha() or c in ['#', 'b']])
                octave_str = ''.join([c for c in note if c.isdigit()])

                # Use octave from note string if present, else from octaves_list, else default 4
                if octave_str:
                    effective_octave = int(octave_str)
                elif note_octave is not None:
                    effective_octave = note_octave
                else:
                    effective_octave = 4  # a general fallback/default

                base_midi = notes.note_to_int(pitch)
                midi_note = base_midi + (12 * (effective_octave + 1))
                midi_notes.append(midi_note)

            self.part.play_chord(midi_notes, volume, duration)
            print(f"{self.name} played notes {notes_list} (MIDI {midi_notes}) for {duration} beats")
        except Exception as e:
            raise RuntimeError(f"Error playing notes {notes_list}: {e}")



    def play_together(self, notes_list, duration=1, octave=4):
        keys = []
        octaves = []
        for item in notes_list:
            if isinstance(item, Chord):
                keys.extend(item.Notes)  # add all notes in the chord
                octaves.extend([item.octave] * len(item.Notes))
            else:
                keys.append(item)
                octaves.append(None)
        self.play_notes(keys, octaves,duration=duration)

    def traverse(self,starting_note,ending_note,steps=1.0):
        midi1=getnotemidi(starting_note)
        midi2=getnotemidi(ending_note)
        i=midi1
        while(i<midi2):
            j=i
            i=i+steps
            self.part.play_note(j+steps,1,0.09)



def getnotemidi(note):
    pitch = ''.join([c for c in note if c.isalpha() or c in ['#', 'b']])
    octave_str = ''.join([c for c in note if c.isdigit()])
    octave = int(octave_str) if octave_str else 4  # default = octave 4
    
    base_midi = notes.note_to_int(pitch)  # "C" -> 0
    midi_note = base_midi + (12 * (octave + 1))
    return midi_note

class Chord():
    def __init__(self,chord_str,octave=4):
        self.Notes=chords.from_shorthand(chord_str)
        self.octave = octave

class MajorScale():
    def __init__(self,note):
        self.Notes=scales.Major(note).ascending()


# ---------------- TEST CODE ---------------- #
if __name__ == "__main__":
    pass