# har-to-postman
Enables Postman support of the HAR specification

### Options:

Check out complete list of options and their usage at [OPTIONS.md](/OPTIONS.md)

## Command Line Interface

The converter can be used as a CLI tool as well. The following [command line options](#options) are available.

`har2postman [options]`

### Options
- `-v`, `--version`  
  Specifies the version of the converter

- `-s <source>`, `--spec <source>`  
  Used to specify the HAR specification (file path) which is to be converted

- `-o <destination>`, `--output <destination>`  
  Used to specify the destination file in which the collection is to be written

- `-t`, `--test`  
  Used to test the collection with an in-built sample specification

- `-p`, `--pretty`  
  Used to pretty print the collection object while writing to a file

- `-O`, `--options`
  Used to supply options to the converter, for complete options details see [here](/OPTIONS.md)

- `-c`, `--options-config`  
  Used to supply options to the converter through config file, for complete options details see [here](/OPTIONS.md)

- `-h`, `--help`  
  Specifies all the options along with a few usage examples on the terminal


### Usage

**Sample usage examples of the converter CLI**


- Takes a specification (spec.har) as an input and writes to a file (collection.json) with pretty printing and using provided options
```terminal
$ har2postman -s spec.har -o collection.json -p -O folderStrategy=Page
```

- Takes a specification (spec.har) as an input and writes to a file (collection.json) with pretty printing and using provided options via config file
```terminal
$ har2postman -s spec.har -o collection.json -p  -c ./examples/cli-options-config.json
```

- Testing the converter
```terminal
$ har2postman --test
```
