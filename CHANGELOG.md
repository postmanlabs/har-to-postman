#### v1.0.2 (March 16, 2022)
* Fix explicit usage of Space as an indendation type leading to `Space` word in the converted collection
* Loosen HAR validations on statusText and redirectURL fields to support null value
* Use the textual representation instead of throwing errors in case of invalid JSON in the body

#### v1.0.1 (December 22, 2021)
* Skip validations for optional fields in the HAR spec that are not required for conversion to a collection
#### v1.0.0 (December 8, 2021)
* Base release
