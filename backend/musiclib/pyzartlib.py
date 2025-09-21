from scamp import Session

# Start a music session
s = Session()

# Create a piano instrument
piano = s.new_part("piano")

# Play a single note (Middle C, 1 second long)
piano.play_note(60, 1.0, 1.0)

# Play a chord (C major for 2 seconds)
piano.play_chord([60, 64, 67], 2.0, 1.0)
