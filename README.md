# Harmonic Tension Visualizer

*Currently in Development*

## Introduction

The goal of our project is to analyze a chord sequence, given by the user through an intuitive piano-roll interface, in order to determine the trend of the harmonic tension. Following different criteria, estabilished by us and based on music theory, we assign to each chord a certain level of tension, influenced by:
•	the chord's composition,
•	well-known progression patterns,
•	the harmonic context
After these computations, the results of our analysis are graphically represented with dynamic visual effects while the chord progression is being played.
Technologies used
Our project is a web application completely developed using HTML, JS and CSS. We used HTML in order to define the static interface of the page, CSS to apply some style attributes to the page components and JS to render the dynamic components of the page and manage all the user interactions with the page.

(Sampler da aggiungere come tecnologia usata?)

## User interface

![alt text](./img/example.png)

The structure of the project can be divided in three main parts:

-	piano-roll
-	button bar 
-	tension graphic representation

## Piano-roll

(This is a dynamic component added when the page is loaded for the first time. It consist of a table of buttons, each one corresponding to a note distributed over 3 octaves, from C2 to B4.)
Users can enter the chord sequence to analyze using a simple piano-roll interface in a few passages:
-	select the tonic note of the chord
-	select the type of the chord: triads(minor, major, diminished) or quadriad (major7, minor7, 7, diminished, half diminished)
-	complete the chord manually choosing between the possible notes selectable shown graphically or click the next tonic note in the next column to complete the previous chord automatically (collegamento con chordBuilder.js)

## Button bar

 

At the top of the page the user can find a list of buttons, each one with a specific function:
-	Info: brings the user at the bottom of the page where there is a brief description of the project
-	Play: begins the reproduction of the chord sequence, the scrolling of the piano-roll, the analysis of the harmonic tension and the visualization of the computation results
-	Pause: stops the reproduction
-	Rewind: brings back the reproduction at the starting point
-	Volume mute: mutes the volume 
-	Volum down: decreases the volume
-	Volume up: increases the volume
-	Reset: cleans the piano-roll content 

## Sampler


Tension graphic representation (canvas e specchietti con degree e pattern)


## Harmonic Analysis


## Surge

Our project is available on Surge, a free platform that allows you to publish online you web site for free.  
Try it here(link)!  

## Video demo

Here(link) you can find a short video demo 

## Group components:
•	Francesco Zumerle
•	Hakim El Achak
•	Elisa Castelli
•	Simone Lucchiari
