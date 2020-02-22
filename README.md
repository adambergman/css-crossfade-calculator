# css-crossfade-calculator
> Quick and dirty form that generates styles for cross fading multiple images in pure CSS (or SCSS).

Visit https://adambergman.github.io/css-crossfade-calculator for the working calculator

## About

This form generates the proper CSS (or SCSS) animation timing styles for
crossfading multiple images on a loop with pure CSS. 

## Math
The idea is that you create a single animation that fades opacity and stagger each animation
so that only one image is visible at a time (except while crossfading).

The following algorithm is used to determine animation-delay, keyframe percentages for the animations. There will always be 5 key frames, with the first always being 0% and the last always being 100%.

`n` = total number of images  
`a` = presentation time for a single image (seconds)  
`b` = duration of crossfade between images (seconds)  
`t` = total animation duration `t = (a + b) * n`  

animation-delay (for each image) = `t - i * (a + b)` where i is the index of each image (1 through `n`)

Keyframe #1 – `0%`  
Keyframe #2 - `a / t * 100%`  
Keyframe #3 - `(a + b) / t * 100%` OR `1 / n * 100%`  
Keyframe #4 - `100% - (b / t * 100%)`  
Keyframe #5 - `100%`  

This approach and algorithm is courtesy of http://css3.bradshawenterprises.com/cfimg/

## Example Results

Below are two examples with output from the form tool available at https://adambergman.github.io/css-crossfade-calculator

### 2 Images
> Crossfade 2 images displaying each for 5 seconds with a 2 second crossfade.

#### HTML
```html
<div class="image-container">
  <img src="//placehold.it/250x175?text=Image%201">
  <img src="//placehold.it/250x175?text=Image%202">
</div>
```

#### CSS
```css
.image-container {
  position: relative;
}

.image-container img {
  position: absolute;
  animation-name: multiple-image-crossfade;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 14s;
}

.image-container img:nth-of-type(1) {
  animation-delay: 7s;
}

.image-container img:nth-of-type(2) {
  animation-delay: 0s;
}



@keyframes multiple-image-crossfade {
  0% {
    opacity:1;
  }
  36% {
    opacity:1;
  }
  50% {
    opacity:0;
  }
  86% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}
```

### 5 Images
> Crossfade 5 images displaying each for 4 seconds with a 1 second crossfade.

#### HTML
```html
<div class="image-container">
  <img src="//placehold.it/250x175?text=Image%201">
  <img src="//placehold.it/250x175?text=Image%202">
  <img src="//placehold.it/250x175?text=Image%203">
  <img src="//placehold.it/250x175?text=Image%204">
  <img src="//placehold.it/250x175?text=Image%205">
</div>
```

#### CSS
```css
.image-container {
  position: relative;
}

.image-container img {
  position: absolute;
  animation-name: multiple-image-crossfade;
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  animation-duration: 25s;
}

.image-container img:nth-of-type(1) {
  animation-delay: 20s;
}

.image-container img:nth-of-type(2) {
  animation-delay: 15s;
}

.image-container img:nth-of-type(3) {
  animation-delay: 10s;
}

.image-container img:nth-of-type(4) {
  animation-delay: 5s;
}

.image-container img:nth-of-type(5) {
  animation-delay: 0s;
}



@keyframes multiple-image-crossfade {
  0% {
    opacity:1;
  }
  16% {
    opacity:1;
  }
  20% {
    opacity:0;
  }
  96% {
    opacity:0;
  }
  100% {
    opacity:1;
  }
}
```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn serve
```

### Compiles and minifies for production
```
yarn build
```

### Builds production, commits and adds dist, pushes subtree to gh-pages branch on origin
```
yarn pages
```
