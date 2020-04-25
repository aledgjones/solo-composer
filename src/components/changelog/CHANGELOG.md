Welcome to this Solo Apps experiment!

This is a very early stage work in progress. Most features are not yet implemented and things **will** break. This project is inspired by the amazing work the people at Steinberg are doing on [Dorico](https://new.steinberg.net/dorico/). If you haven't taken a look I recommend you do. It's a serious game changer for music notation software.

Version numbers are for reference only for now and will follow Semver when more things are implemented. Changelog entries start with the different section of the application (tabs) for overarching UI / feature changes. This is followed by implementation details (playback, parsing etc...)

## [0.4.0] - 2020-04-23
### Play
- <label type="feature"></label> Auditioning notes as they are selected and modified.
- <label type="feature"></label> Scrolling of the piano roll by dragging.
- <label type="changed"></label> Reorganisation of sampler code so it is clearer and simpler.
- <label type="fixed"></label> Fixed regression where expanding a player on one tab expanded on another due to reorganising the data store.

### Playback
- <label type="changed"></label> Migrate to Tone.js. It includes many of the things I need: Sampler (playback of individual samples with pitch shifting built in), Transport (seekable sequence of timed events), envelopes (programatic attach, sustain, release timings).

## [0.3.0] - 2020-04-21
### Play
- <label type="feature"></label> Added tools panel for selection / editing, creation and deletion of tones.
- <label type="feature"></label> Tones can be moved and duration altered by pointer input. Constrained to track area.
- <label type="feature"></label> Tones can be deleted by with pointer input.
- <label type="changed"></label> Update the auto created score to include time signature change.
- <label type="fixed"></label> Adding/removing players from a flow no longer selects the flow.
- <label type="fixed"></label> Show beat groupings in all bars of tick track.

### Parse
- <label type="fixed"></label> Parse time signature changes correctly.

## [0.2.0] - 2020-04-16
### Play
- <label type="changed"></label> Updated rending of tick track for better performance.
- <label type="changed"></label> Updated tick track to more clearly show beat groupings.

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