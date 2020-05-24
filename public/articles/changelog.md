# What's New

You can find the most recent updates listed here. Version numbers are for tracking purposes only at present and will be in a more strict SemVer style once more features are in place.

## **0.7.0** (12-05-2020)

-   <label type="feature"></label> Added the ability to rename flows.
-   <label type="feature"></label> Added the ability to create both solo and section players.
-   <label type="feature"></label> Added the ability to show different numbering styles for both solo and section players.
-   <label type="feature"></label> Added engraving setting to hide systemic barlines when there is only one instrument.
-   <label type="feature"></label> Help and Feedback scafolding in place. I will write articles when I have more time.
-   <label type="changed"></label> Updated icon pack with custom icons and maskable icons.
-   <label type="changed"></label> Reorganised the File menu, moved what's new into a help article.
-   <label type="changed"></label> Updated light theme based on an inverted version of the dark theme.
-   <label type="fixed"></label> Dotted rhythm dots now print correctly in cluster chords. They follow the rules laid down in 'Behind Bars' by Elaine Gould.
-   <label type="fixed"></label> Fixed a small bug where empty players couldn't be reassigned to a flows
-   <label type="fixed"></label> Fixes for dotted notes at different points in the beat group. Dotted notes at start of beat group display as tied notes unless shorter than the original beat then they are shown as dotted.

## **0.6.0** (09-05-2020)

-   <label type="feature"></label> Indicate when an update is available and add actions to refresh the page to apply them.
-   <label type="feature"></label> Whole bar rests now show as semi-breve rest and center within the bar as per the convension.
-   <label type="feature"></label> Added the ability to apply different themes.
-   <label type="changed"></label> Small tweak to left panel design to clarify actions.
-   <label type="changed"></label> Tick markings in play mode now extend through the piano scroll.
-   <label type="fixed"></label> Key signatures now have a unique key assigned over multiple staves. Fixed issue where react lost track of elements as they had the same key.
-   <label type="fixed"></label> Start / end repeats now have a unique key for dots. Fixed issue where react lost track of elements as they had the same key.

## **0.5.0** (05-05-2020)

-   <label type="feature"></label> Player instruments are now sortable.
-   <label type="feature"></label> Added version information to the about section `File Menu -> About`
-   <label type="changed"></label> Implimented my own sortable components which adhears to React Strict Mode.
-   <label type="changed"></label> Seperated Changelog into it's own section `File Menu -> What's New`
-   <label type="changed"></label> Pre-cache Piano to avoid loading flicker.
-   <label type="changed"></label> Audition notes only when selected and at the end of modification.
-   <label type="changed"></label> Improved app bar layout to be clearer and more organised. File menu behind the burger icon for easy access to app wide preferences and file options.

## **0.4.0** (23-04-2020)

-   <label type="feature"></label> Auditioning notes as they are selected and modified.
-   <label type="feature"></label> Scrolling of the piano roll by dragging.
-   <label type="changed"></label> Reorganisation of sampler code so it is clearer and simpler.
-   <label type="changed"></label> Implimented my own drag scrolling which allows elements to cancel scroll events completely or in a specific direction. Had the side-effect of improving positioning of items in the rendered score.
-   <label type="changed"></label> Migrate to Tone.js. It includes many of the things I need: Sampler (playback of individual samples with pitch shifting built in), Transport (seekable sequence of timed events), envelopes (programatic attach, sustain, release timings).
-   <label type="fixed"></label> Fixed regression where expanding a player on one tab expanded on another due to reorganising the data store.

## **0.3.0** (21-04-2020)

-   <label type="feature"></label> Added tools panel for selection / editing, creation and deletion of tones.
-   <label type="feature"></label> Tones can be moved and duration altered by pointer input. Constrained to track area.
-   <label type="feature"></label> Tones can be deleted by with pointer input.
-   <label type="changed"></label> Update the auto created score to include time signature change.
-   <label type="fixed"></label> Adding/removing players from a flow no longer selects the flow.
-   <label type="fixed"></label> Show beat groupings in all bars of tick track.
-   <label type="fixed"></label> Parse time signature changes correctly.

## **0.2.0** (16-04-2020)

-   <label type="changed"></label> Updated rending of tick track for better performance.
-   <label type="changed"></label> Updated tick track to more clearly show beat groupings.
-   <label type="changed"></label> Pulled UI elements into seperate project.
-   <label type="changed"></label> Updated the style to be rounder in design.
-   <label type="changed"></label> Implemented more rules for ties (multiple adjacent pitches are still broken)

## **0.1.0** (07-04-2020)

-   <label type="feature"></label> Adding players.
-   <label type="feature"></label> Deleting players.
-   <label type="feature"></label> Adding instruments.
-   <label type="feature"></label> Adding flows.
-   <label type="feature"></label> Selecting flows.
-   <label type="feature"></label> Assigning players to flows.
-   <label type="feature"></label> Basic rendering only. No input implemented yet.
-   <label type="feature"></label> No features implements yet (blank)
-   <label type="feature"></label> Piano roll for each instrument.
-   <label type="feature"></label> Very basic note input. click, drag and release to create 'tones'.
-   <label type="feature"></label> Not implements yet.
-   <label type="feature"></label> Loading samples as instruments are added.
-   <label type="feature"></label> Basic implementation of sample Playback.
-   <label type="feature"></label> Basic parsing of notation in accordance with simple-time time signatures.
-   <label type="feature"></label> Convert notation into generic draw instruction so it can be plugged into different rendering mechanisms.
-   <label type="feature"></label> Webworker used for parsing on separate thread.
-   <label type="feature"></label> SVG rendering
-   <label type="feature"></label> Note spacing currently fixed for each tick.
-   <label type="feature"></label> No tails / beams implements yet.
