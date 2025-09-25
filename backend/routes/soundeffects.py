import soundfile as sf
from pedalboard import Pedalboard, Reverb, Chorus, Compressor, Delay
import os
# 1. Load the audio file created by SCAMP
#    sf.read returns the raw audio data (as a NumPy array) and the sample rate.
def sound_effects():
    path = os.path.join("..", "rec.wav")
    path = "backend/rec.wav"
    print(path)
    audio, sample_rate = sf.read(path)

    # 2. Create a Pedalboard effects chain.
    #    The order matters, just like with real pedals!
    board = Pedalboard([
        # A compressor to even out the volume dynamics
        Compressor(threshold_db=-10, ratio=2.5),
        
        # A light chorus to add a bit of shimmer and width
        Chorus(rate_hz=1.0, depth=0.25, mix=0.5),

        # A spacious reverb to place the sound in a room
        Reverb(room_size=1, damping=0.5, wet_level=0.3, dry_level=0.7),
        
        # A subtle delay for a bit of echo
        Delay(delay_seconds=0.5, feedback=0.2, mix=0.2)
    ])

    # 3. Apply the effects to the audio.
    #    The first argument is the audio data, the second is the sample rate.
    effected_audio = board(audio, sample_rate)

    # 4. Save the processed audio to a new file.
    with sf.SoundFile(path, 'w', samplerate=sample_rate, channels=effected_audio.shape[1]) as f:
        f.write(effected_audio)

    print("Exported 'final_with_pedalboard.wav' using Pedalboard effects! 🎧")




if __name__ == "__main__":
    sound_effects()