Welcome to this Solo Apps experiment!

This is very much an early stage work in progress. Most features are not yet implemented and things **will** break.

Version numbers are for reference only for now and will follow Semver when more things are implemented. Changelog entries start with the different section of the application (tabs) for overarching UI / feature changes. This is followed by implementation details (playback, parsing etc...)

## [0.1.0] - 2020-04-07
### Setup
- [ADDED] Adding players.
- [ADDED] Deleting players.
- [ADDED] Adding instruments.
- [ADDED] Adding flows.
- [ADDED] Selecting flows.
- [ADDED] Assigning players to flows.

### Write
- [ADDED] Basic rendering only. No input implemented yet.

### Engrave
- [ADDED] No features implements yet (blank)

### Play
- [ADDED] Piano roll for each instrument.
- [ADDED] Very basic note input. click, drag and release to create 'tones'.

### Print
- [ADDED] Not implements yet.

### Playback
- [ADDED] Loading samples as instruments are added.
- [ADDED] Basic implementation of sample Playback.

### Parsing
- [ADDED] Basic parsing of notation in accordance with simple-time time signatures.
- [ADDED] Convert notation into generic draw instruction so it can be plugged into different
          rendering mechanisms.
- [ADDED] Webworker used for parsing on separate thread.

### Rendering
- [ADDED] SVG rendering
- [ADDED] Note spacing currently fixed for each tick. 
- [ADDED] No tails / beams implements yet.