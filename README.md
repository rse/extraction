
Extraction
==========

Tree Extraction for JavaScript Object Graphs

<p/>
<img src="https://nodei.co/npm/extraction.png?downloads=true&stars=true" alt=""/>

<p/>
<img src="https://david-dm.org/rse/extraction.png" alt=""/>

About
-----

Extraction is a small JavaScript library for extracting object trees
from arbitrary object graphs. Object graphs usually have cycles and
contain many information. Hence, the clue is that the extracted object
trees use links to break reference cycles and can be just partial by
leaving out information. The Extraction library is intended for two
main use cases: to support the persisting and restoring of arbitrary
in-memory object graph structures (where the cycle problem has to be
resolved) and to support the generation of responses in REST APIs based
on object graphs (where the partial information has to be resolved).

Installation
------------

#### Node environments (with NPM package manager):

```shell
$ npm install extraction
```

#### Browser environments (with Bower package manager):

```shell
$ bower install extraction
```

Usage
-----

The Extraction library exposes two API functions:

### `extract`

This is the main API method for extracting an object tree from an object
graph with the help of a tree extraction DSL.

```
extraction.extract(graph: object, spec: string, options?: object): object
```

FIXME

### `reify`

This is a utility API method to re-generate an object graph from an
object tree by reifying all self-references back to the referenced
objects.

```
extraction.reify(tree: object, options?: object): object
```

FIXME

Implementation Notice
---------------------

Although the Extraction library is written in ECMAScript 6, it is
transpiled to ECMAScript 5 and this way runs in really all(!) current
(as of 2015) JavaScript environments, of course.

License
-------

Copyright (c) 2015 Ralf S. Engelschall (http://engelschall.com/)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

