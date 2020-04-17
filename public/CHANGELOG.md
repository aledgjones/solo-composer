Welcome to this Solo Apps experiment!

This is very much an early stage work in progress. Most features are not yet implemented and things **will** break.

Version numbers are for reference only for now and will follow Semver when more things are implemented. Changelog entries start with the different section of the application (tabs) for overarching UI / feature changes. This is followed by implementation details (playback, parsing etc...)

## [0.3.0] - 2020-04-16
### Play
- <label type="fixed"></label> Adding/removing players from a flow no longer selects the flow.

## [0.2.0] - 2020-04-16
### Play
- <label type="changed"></label> Updated tick markings for better performance.
- <label type="changed"></label> Updated tick markings to more clearly show beat groupings.

### UI
- <label type="changed"></label> Pulled UI elements into seperate project.
- <label type="changed"></label> Updated the style to be rounder in design.

### Parsing
- <label type="changed"></label> Implemented more rules for ties (multiple adjacent pitches are still broken)

## [0.1.0] - 2020-04-07
### Setup
- <label type="feature"></label> Adding players.
- <label type="feature"></label> Deleting players.
- <label type="feature"></label> Adding instruments.
- <label type="feature"></label> Adding flows.
- <label type="feature"></label> Selecting flows.
- <label type="feature"></label> Assigning players to flows.

### Write
- <label type="feature"></label> Basic rendering only. No input implemented yet.

### Engrave
- <label type="feature"></label> No features implements yet (blank)

### Play
- <label type="feature"></label> Piano roll for each instrument.
- <label type="feature"></label> Very basic note input. click, drag and release to create 'tones'.

### Print
- <label type="feature"></label> Not implements yet.

### Playback
- <label type="feature"></label> Loading samples as instruments are added.
- <label type="feature"></label> Basic implementation of sample Playback.

### Parsing
- <label type="feature"></label> Basic parsing of notation in accordance with simple-time time signatures.
- <label type="feature"></label> Convert notation into generic draw instruction so it can be plugged into different rendering mechanisms.
- <label type="feature"></label> Webworker used for parsing on separate thread.

### Rendering
- <label type="feature"></label> SVG rendering
- <label type="feature"></label> Note spacing currently fixed for each tick. 
- <label type="feature"></label> No tails / beams implements yet.