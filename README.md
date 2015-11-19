# png++

png++ is a simple application that can take images and create them into bloated .png images.
While this might not immediately seem useful, it can be helpful to test applications using .png images with a non-standard structure, or run bandwidth/speed tests with easily visible results.


## Required applications

png++ requires the following applications to run:

* [png++.js](https://raw.githubusercontent.com/nutbread/pngpp/master/png++.js): the script itself
* [node.js](https://nodejs.org/): required to run the script
* [ffmpeg](https://ffmpeg.org/): required to decode images

Put the files into a single folder and then you can run png++ from the command line.

For node, you can download a standalone executable file; no other libraries are needed.
For ffmpeg, you can download a static build package and extract only ffmpeg.exe.


## Features

When running png++, you can specify several different options to change how it performs.

#### Target size

You can set the target size of the output file you wish to achieve.
The script will do its best to keep the final .png size as close as possible to the desired file size without going over.
However, it may go over if the compression is not good enough, or a very small target size is used.

#### Two different modes

There are currently two different modes of bloating the file: **idat** and **deflate**.

**idat** will add many empty [IDAT](http://www.w3.org/TR/PNG/#11IDAT) chunks to the png file.
This is not invalid according to [the PNG spec](http://www.w3.org/TR/PNG/).

**deflate** will add many empty [noncompressed](http://www.w3.org/Graphics/PNG/RFC-1951#noncompressed) blocks to the DEFLATE stream.
Again, this is not invalid according to [the DEFLATE spec](http://www.w3.org/Graphics/PNG/RFC-1951).

#### Interlacing

You can also set the image to be interlaced or not.
If interlaced mode is selected, you can also specify a "fake thumbnail" image to use.
This image will be displayed at the lowest resolution of the interlace when the image is loading.
This can be used to show an image that looks different from the completely loaded image to test slow internet speeds.

#### Filtering

Additionally, you can specify [ffmpeg filters](https://ffmpeg.org/ffmpeg-filters.html#Video-Filters) to be used on the image.
Currently, filters are hard-coded into the script, but they can be changed by editing the `filters = [...];` lines in `main()`.

The default filters add JPEG artifacting and bad color curves to the output image.

By default, filters are not enabled. png++ must be executed with the `--filters` option to enable them.


## Executing

png++ can be used from the command line as follows:

```batch
node.exe png++.js input output size [mode] <options>
```

For a list of available options, run: `node.exe png++.js --help`

