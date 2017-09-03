# Marvel Hiring Test
###### react.js and sass

<small>Author: Shannon Mosley</small>

## Introduction

Test for marvel using their api
* react
* sass
* gulp
* node

## Background

- building two components: a browse menu and a digital comics list
- Browse Menu:
   - Render a list of letters in the alphabet. Clicking a letter will initiate an AJAX call to the Marvel API, returning a list of characters with names beginning with the clicked letter.
   - With the returned data, render a list of characters. Clicking a character name will invoke the digital comics component outlined below.
- Digital Comics List:
   - Render a list of digital comics featuring the character ID passed from the Browse Menu.
   - Note the API will return a large amount of data. The relevant data is contained in the array at data.results.
   - At minimum, the listed digital comics should feature: 
   > Comic Title
   > Comic ID
   > Release Date
   > Issue Number (*if* issue number is greater than 0)


---


## Getting Started

### Prerequisites

1. [Marvel API](http://developer.marvel.com/) - Sign up and get keys
2. [Node](https://nodejs.org/)
3. [Sass](http://sass-lang.com/)
4. [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Installation 

1. `$ npm install `

2. Start the project up with ` $ npm run start `


### NPM Commands

``` $ npm run build ```
Runs development environment and builds the build folder

``` $ npm run start ```
Builds and watches, re-renders on save


