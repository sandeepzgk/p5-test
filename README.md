# Prototype5

## LIVE SITE LINK!
<p>Last Updated: 3/25/24 <br/>
Comments: 

- CSS elements reviewed for both PC and mobile... probably could still be improved T_T
- added showing negative score -- added it as a value for the JSON as well
- added captuirng mouse travel + other calculations to store... need to check they're actually... correct
- finished highlight tab -- need to know if it looks better with just gray... i dunno... also check the mobile i changed it since it'll look funny
- finished mostly the advanced tab -- still want some feedback on it

</p>
Link: https://kamero0n.github.io/Prototype5_Test/

## Building the Site (For Testing Purposes)

This was made using Google Material's [Quick Start Guide](https://github.com/material-components/material-web/blob/main/docs/quick-start.md) as reference for myself. I also used their main website as a guide for using components [here](https://m3.material.io/).

1. Ensure that you have npm and node properly installed. You can download the latest version of Node.js by checking out their [website](https://nodejs.org/en). 

2. Open a terminal in your project's repo. For me, I just use VS Code, so I use it's built-in terminal. Then, type the following command in the terminal:
```
npm install @material/web
```
This installs Google Material's web components library to your project's repo, allowing you access to all components, themes, etc. 

3. Now, you can use any component you desire. If you plan to include .css scripts, you will need to use a converter for .scss to .css given that .scss is more advanced as well as Google Material's styles are supported using .scss. So, write in .scss, then convert to .css using the [web converter](https://jsonformatter.org/scss-to-css).

4. We also need to install rollup to bundle our project. If you have npm and node installed, type the following command in the terminal:
```
npm install rollup @rollup/plugin-node-resolve
```

5. Now, we can create a bundle from our javascript file. Type the following command in the terminal to create the bundle of the entrypoint file (in this case, "index.js" is our entrypoint and it will be bundled to bundle.js).
```
npx rollup -p @rollup/plugin-node-resolve index.js -o bundle.js
```

6. After creating the bundle, we can now run the rollup build by using the following command:
```
rollup -c
```
You should have a message in your terminal that shows "created build in ___ ms". If not, I'd look at the documentation guide for running rollup at [lit.dev](https://lit.dev/docs/tools/production/#modern-only-build). You will also see a new folder called "build" in your repo. 

7. Within the **build** folder, you can run the web server. I use the following command to run a simple test server, but to actually host I use Github Pages. Here is the command that you can run to test your site:
```
python -m http.server
```

8. If you make new changes to your website, you can repeat steps 5-6, and refresh your web server to check the latest changes. 

## Changing the bundle Rollup module script

You may notice a funny looking script called [**rollup.config.mjs**](https://github.com/kamero0n/Prototype5/blob/main/rollup.config.mjs) in the repo. This fella is a little odd, but essentially it's like a glue for JavaScript files, and any linked assets... I think... all I know for sure is that it's necessary to be able to use Google's UI stuff. For preface, all the information below is pulled from [here](https://modern-web.dev/docs/building/rollup-plugin-html/). And now also [here](https://rollupjs.org/tutorial/).

Anyways, there's a few things I had to modify to bundle *multiple* HTML files. First, add an input line to the export default set like so:
```
export default {
  plugins: [html({input: '*.html',})]
  ...
};
```
The star refers to anything that has the .html extension. I'd also be aware of the fact that you need to be specific about *where* your HTML files are. For example, if I kept them in a folder called "pages" in my repo, I'd have to modify the line like so:
```
export default {
   plugins: [html({input: 'pages/*.html',})]
  ...
};
```
Now, because I am dumb and didn't read more, you need to set your input to the entry file, which in this case, is index.js. This entrypoint is basically giving the bundle.js (our output file from bundling) like all the stuff we want imported from Google Material... so its pretty important.
```
export default {
  input: 'index.js',
  plugins: [html({input: 'pages/*.html',})]
  ...
};
```
You could probably add other fancy stuff, but I'd refer to the docs linked above for that.

## Adding JSON to the build

I am still a little unsure of my methods of going about this, but for rollup, it needs to convert .json files to ES6 files, which requires a plugin. I followed [npm's plugin-json](https://www.npmjs.com/package/@rollup/plugin-json) blurb and added that to my [**rollup.config.mjs**](https://github.com/kamero0n/Prototype5/blob/main/rollup.config.mjs) like so:
```
export default {
  input: '*.html',
  plugins: [
    // Entry point for application build; can specify a glob to build multiple
    // HTML files for non-SPA app
    // html({
    //   input: 'index.html',
    // }),
    html(),
    json(),
    ...
  ]
}
```
OR! Which, believe me, I have no clue if it's the right way, but you can just add the json file to the build folder, and it ends up getting stored correctly... so not positive but it works so yay!


