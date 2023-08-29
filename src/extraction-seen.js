/*
**  Extraction -- Tree Extraction for JavaScript Object Graphs
**  Copyright (c) 2015-2023 Dr. Ralf S. Engelschall <rse@engelschall.com>
**
**  Permission is hereby granted, free of charge, to any person obtaining
**  a copy of this software and associated documentation files (the
**  "Software"), to deal in the Software without restriction, including
**  without limitation the rights to use, copy, modify, merge, publish,
**  distribute, sublicense, and/or sell copies of the Software, and to
**  permit persons to whom the Software is furnished to do so, subject to
**  the following conditions:
**
**  The above copyright notice and this permission notice shall be included
**  in all copies or substantial portions of the Software.
**
**  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
**  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
**  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
**  IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
**  CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
**  TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
**  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

/*  helper class for detecting whether object has already been seen (and at which path)  */
const Seen = (() => {
    if (typeof WeakMap === "function") {
        /*  in optimal O(1) complexity, but requires modern environment  */
        return class Seen {
            constructor () {
                this.seenMap = new WeakMap()
            }
            set (obj, path) {
                this.seenMap.set(obj, path)
            }
            get (obj) {
                return this.seenMap.get(obj)
            }
        }
    }
    else {
        /*  in non-optimal O(n) complexity, but works in even ancient environment  */
        return class Seen {
            constructor () {
                this.seenSeq = []
                this.seenMap = {}
            }
            set (obj, path) {
                this.seenMap[this.seenSeq.length] = path
                this.seenSeq.push(obj)
            }
            get (obj) {
                const offset = this.seenSeq.indexOf(obj)
                if (offset >= 0)
                    return this.seenMap[offset]
                else
                    return undefined
            }
        }
    }
})()

export default Seen

