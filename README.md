#### *DEPRECATED (This plugin is no longer maintained*
#### Archive:

---

# grunt-scrape v.0.1.0

A grunt wrapper around [node-scrape plugin](https://github.com/chunksnbits/node-scrape).
Allows to scrape webpages and extract data collections.

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-scrape --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-scrape');
```

## scrape task
_Run this task with the `grunt scrape` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

## Usage

The minimal setup for [grunt-scrape]() is a scrape task the fields `src`, `dest` and `collections`.

```
grunt.initConfig({
scrape: {
  mydata: {
    src: 'http://example.com',
    dest: 'tmp/data.json',
    collections: [{
      name: 'mydata',
      group: '#someid > .some-class > table tr',
      elements: {
        name: {
          query: '> td > a'
        },
        link: {
          query: '> td > a',
          attr: 'href'
        }
      }
    }]
  }
}
```

## Options

### Collections (collections {array(object)})

One or more collections to extract from the website. Each collection will produce an object containing the fields specified under the `elements` option.

Settings:

#### `name {string}`

The name of the collection

#### `elements {array(object)}`

Specifies the fields of data to extract. Options are:

`query {string}`

A [jQuery selector](http://api.jquery.com/category/selectors/) that identifies the field within the page or current group.

`attr {string} (optional)`

Specifies the data to extract. If no `attr` is specified data will be extracted using the `jQuery('.selector').text()` method (will strip any html tags still contained in the node).

If you want to specifically extract html information use `attr: 'html'`

All common html-attributes are available, e.g., `class`, `href`, `src`, ...

`filter {string|function} (optional)`

Allows to define a [regular expression](https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions) to further restrict the data to be extracted from a certain node.

Also allows a callback function for custom filtering. Return `null` to exclude the element from being added to the resulting dataset.

`format {string|function} (optional)`

Specify a formatter to process the extracted data with.
Presets are `number` (formats the data using `Number(data)`) or `date` (will create a new Date object).

Also allows a callback function for custom filtering. Return `null` to exclude the element from being added to the resulting dataset.

#### `group {string}`

A [jQuery selector](http://api.jquery.com/category/selectors/) that identifies a grouped block of information on the page. All queries of a colletion are run against this group.

Should be used to differentiate individual items of information, e.g., a table row within a table.

If no group is specified items will be grouped by index (requires the same number of results for each element of the collections).

### Source (src) and source parameters (params)

`src {string|array(string)}`

One or more urls of websites to scrape.

`params {object} (optional)`

Allows to specify request parameters. Should be used when trying to to scrape multiple websites in a task.
Request parameters should be indicated in the src url using a colon, e.g., `:id`

```
src: 'http://example.com/items/:id?param=:param',
options: {
  id: [123, 456],
  param: ['prime','secondary']
}
```

If multiple options are provided all permutations of the options provided will be scraped, i.e.:

```
http://example.com/items/123?param=prime
http://example.com/items/123?param=secondary
http://example.com/items/456?param=prime
http://example.com/items/456?param=secondary
```

### Destination (dest)

`dest {string}`

The path to the output file. Must specify a valid file ending, as the output file format will be determined by path's file ending.

```
dest: 'path/to/my/file.json'
```

The path will be assumed from the current working directory.

Supported file formats are for now:

```
.json
.xml
.csv (* only available for single collections)
```

### Options (options)

Allows to specify request options for accessing the target website (e.g., proxy, auth). For available options and usage, see [request](https://github.com/mikeal/request).

## Examples

### Filter

```
...
<tr><td>Doe, John</td>...</tr>
<tr><td>Johnson, Jane</td>...</tr>
...
```

Assuming a format of `Lastname, Firstname` within a node you can extract firstname and lastname separately using the filter function

```
elements: {
  firstname: {
    query: '> td > a',
    filter: /,[ ]*(.*)/
  },
  lastname: {
    query: '> td > a',
    filter: /(.*)[ ]*,/
  }
}
```

will extract:
```
[{
  firstname: 'John',
  lastname: 'Doe',
},{
  firstname: 'Jane',
  lastname: 'Johnson',
}]
```

### Format

```
...
<tr><td>Doe, John</td><td>24</td></tr>
<tr><td>Johnson, Jane</td><td>45</td></tr>
...
```

```
elements: {
  age: {
    query: '> td > td:nth-child(2)',
    format: 'number'
  }
}
```

`format: 'number` will convert the data extracted by the query to a number before adding it to the dataset:

```
[{
  age: 'John',
  lastname: 'Doe',
  age: 24
},{
  firstname: 'Jane',
  lastname: 'Johnson',
  age: 45
}]
```


## License

grunt-scrape is licensed under the MIT License.
