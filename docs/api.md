# API reference

The Choba engine API is very small. Three functions that use a few key data structures do most of the work.

The data structures are:

* The **context**, which contains all of the static data for the game. You configure Choba by creating this context and passing it to buildContext, which completes it and returns it to you. Then you pass it to every other API function.
* **dynamicState**, which contains all of the dynamic state for the game. You pass in the current state, Choba returns the new state. It is up to you to manage it.
* The **scene**, which contain the text and options Choba has generated. It is up to you to manage and display this scene, and to allow the player to pick an option.

All of these are explained in more detail below.

## buildContext(context)

This function completes the initial context you give it, setting the right default values.

It returns the completed context to be used in all future calls for this game.

## restartGame(context)

This function resets the dynamic state and generates the first scene.

It returns an object with the following fields:

* newScene: The first scene.
* dynamicState: The initial dynamic state.

## executeOption(dynamicState, context, option)

This function executes an option (from a scene) and generates the next scene and next dynamic state.

It returns an object with the following fields:

* newScene: The new scene.
* dynamicState: The new dynamic state.

## Context

The context object has the following fields:

* firstSceneId: The ID of the first scene. Defaults to 'start'.
* initialVars: The initial values of the gameplay variables. See below.
* scenes: A map of scene descriptions.
* blocks: An array of block descriptions.
* reportError: A function that takes an error message parameter and reports it. Defaults to console.log.
* _rng: A random number generator, used for deterministic random number generation. Don't change this.
* expressionEvaluators: A map of operators to functions that evaluate expressions using that operator. Can be used to add or replace operators. Advanced. 
* actionHandlers: A map of action types to functions that handle that action. Can be used to add or replace actions. Advanced.

## Dynamic state

The dynamic state object has the following fields:

* currentSceneId: The ID of the current scene.
* tagState: Internal data used by tag-based operators.
* vars: The gameplay variables which can be read and modified by operators.

## Scenes

The scene object has the following fields:

* text: All the text in the scene as one string.
* options: The options for the player.
* desc: The description this scene was built from. Useful to access static data, such as information on how to style the scene.

Options have the following fields:

* text: The text for the option.
* action: The action that will be executed when this option is chosen.
* parameters: The parameters for the action.
