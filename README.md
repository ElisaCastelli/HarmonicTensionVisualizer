# Harmonic Tension Visualizer

*Currently in Development*

## Introduction

The goal of our project is to analyze a chord sequence, given by the user through an intuitive piano-roll interface, in order to determine the trend of the harmonic tension. Following different criteria, estabilished by us and based on music theory, we assign to each chord a certain level of tension, influenced by:
*	the chord's composition,
*	well-known progression patterns,
*	the harmonic context
After these computations, the results of our analysis are graphically represented with dynamic visual effects while the chord progression is being played.

## Technologies used
Our project is a web application completely developed using HTML, JS and CSS. We used HTML in order to define the static interface and structure of the page, CSS to apply some style attributes to the page components and JS to render the dynamic components of the page and manage all the user interactions with the page.

In order to implement audio features, we used an external JS framework named Tone.js. It can be defined as a Web Audio framework for creating and manipulate dynamically sounds and music in a web page. Thanks to the high semplicity of this kind of framework-architecture, it is possible to create web-based audio applications. On the high-level, Tone offers common DAW (digital audio workstation) features like a global transport for synchronizing and scheduling events as well as prebuilt synths and effects. Additionally, Tone provides high-performance building blocks to create your own synthesizers, effects, and complex control signals.

In particular, we made use of Tone.Sampler that allows to combine different samples into a single more complex instrument (a piano in our case).

## User interface

![alt text](./img/example.png)

The structure of the project can be divided into four main parts:

-	piano-roll
-	button bar 
-	tension graphic representation
- readme

## Piano-roll

![alt text](./img/pianoroll.png)

(This is a dynamic component added when the page is loaded for the first time. It consist of a table of buttons, each one corresponding to a note distributed over 3 octaves, from C2 to B4.)
Users can enter the chord sequence to analyze using a simple piano-roll interface in a few passages:
-	select the tonic note of the chord
-	select the type of the chord: triads(minor, major, diminished) or quadriad (major7, minor7, 7, diminished, half diminished)
-	complete the chord manually choosing between the possible notes selectable shown graphically or click the next tonic note in the next column to complete the previous chord automatically (collegamento con chordBuilder.js)

## Button bar

![alt text](./img/buttonBar.png)

At the top of the page the user can find a list of buttons, each one with a specific function:
-	Info: brings the user at the bottom of the page where there is a brief description of the project
-	Play: begins the reproduction of the chord sequence, the scrolling of the piano-roll, the analysis of the harmonic tension and the visualization of the computation results
-	Pause: stops the reproduction
-	Rewind: brings back the reproduction at the starting point
-	Volume mute: mutes the volume 
-	Volum down: decreases the volume (untile a min volume value threshold)
-	Volume up: increases the volume (until a max volume threshold)
-	Reset: cleans the piano-roll content 
-	Download: to download a .txt file containing the progression you put into the piano roll
-	Upload: to upload a .txt file you have on your computer that contains a progression you saved

## Sampler

As previously mentioned, all the audio options and features have been realized with Tone.Js. 
Despite its extreme-intuitivity structure and organization, Tone.js allows to create, develop and then process a wide range of different sounds, each one of them can be affected by some effects.
Once installed Tone.js (or imported it inside the js file in which you want to use it), it is possibile to create sounds by using synthetizer(FM or AM) by code as follows:

![alt text](./img/01.png)

Due to the fact that we need a synthetizer able to play multiple notes at the same time instant (simultaneously), we cannot use any monophonic synthetizer available in Tone.Js and implement only a possible polyphonic synthetizer (or a combination of multiple of more of them). A better solution that allows us to personalize the sound produced when every single note has been played, is represented by Tone.Sampler. In order to implement it, it is necessary not only to declaire a "Sampler object" but also to create an association (called binding) between every note available and the sound that the Sampler object has to play. The following piece of code shows exactly how to create a piano Sampler object:

![alt text](./img/02.png)

## Tension graphic representation (canvas e specchietti con degree e pattern)


## Harmonic Analysis


## Surge

Our project is available on Surge, a free platform that allows you to publish online you web site for free.  
Try it [here](http://harmonytensionvisualizer.surge.sh)!

## Video demo

Here(link) you can find a short video demo 

## Group components:
•	Francesco Zumerle
•	Hakim El Achak
•	Elisa Castelli
•	Simone Lucchiari
