# Choba

Choba (short for CHOice BAsed) is an experimental interactive storytelling engine written in JavaScript. It is intended to be used for choice-based interactive fiction (IF), and more.

[![Build Status](https://travis-ci.org/jhorneman/choba-engine.svg?branch=master)](https://travis-ci.org/jhorneman/choba-engine)

'Experimental' means:

* Choba's inner workings are an experiment. Does it make sense to use something resembling a programming language inside a storytelling engine? Time will tell.

* Choba is intended to be used for experiments in interactive storytelling. Social simulations, world models, procedural content generation: all of these things should hopefully be reasonably easy to add and integrate.

* Choba is intended to be used for experiments in interactive storytelling *tools*. When I wrote my first game in 1991, we used lists of variables to track what the player had done, so we could react accordingly. Today, in 2016... we pretty much still do the same thing. Is it really not possible to do better after 25 years? Can we detect problems before they occur, visualize the game and its state in new ways, run automated tests, identify and reproduce problems, modify content without using state? Can we use analysis and visualization techniques from other domains? (Specifically programming, and that's one reason why Choba internally works like a programming language.) With Choba, we can hopefully try new things and find out what works.

* Choba is intended to be extensible to other game forms. Visual novels, hybrid formats, storytelling engines running inside other games, maybe even parser-based IF: hopefully, this is reasonably easy to do.

* Choba is intended to be portable to many platforms and devices. It's written in JavaScript. It has extremely few external dependencies and doesn't manage its own state. This means it should be possible to port the engine to mobile (using React-Native) and desktop (using NW.js or Electron). It should also be reasonably easy to port the core engine to other languages.

* The first version of Choba is not easy to use. It does not have a parser (!), or a standard way of handling input and output. In other words: out of the box, there is no easy way to either write or play games using Choba. It also does not include tools or easy ways to package games for distribution. It's an engine, not a game-making system. It is, in part, intended to be more useful to programmers than to game designers or writers. But at the same time it is hopefully the basis for a very powerful system for writing, distributing, and playing games.

## Repos related to Choba

* [choba-engine](https://github.com/jhorneman/choba-engine) - the engine.
* [choba-parser](https://github.com/jhorneman/choba-engine) - the parser.
* [choba-test](https://github.com/jhorneman/choba-engine) - a test project.
* [choba-tracery](https://github.com/jhorneman/choba-tracery) - integrating Tracery into Choba.
