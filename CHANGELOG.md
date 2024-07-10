# HAR to Postman Changelog

## [Unreleased]

## [v1.1.0] - 2024-07-10

### Chore

-   Updated postman-collection to v4.4.0.

## [v1.0.3] - 2024-02-15

### Fixed

-   Fixed few of frequent type errors.

#### v1.0.2 (March 16, 2022)

-   Fix explicit usage of Space as an indendation type leading to `Space` word in the converted collection
-   Loosen HAR validations on statusText and redirectURL fields to support null value
-   Use the textual representation instead of throwing errors in case of invalid JSON in the body

#### v1.0.1 (December 22, 2021)

-   Skip validations for optional fields in the HAR spec that are not required for conversion to a collection

#### v1.0.0 (December 8, 2021)

-   Base release

[Unreleased]: https://github.com/postmanlabs/har-to-postman/compare/v1.1.0...HEAD

[v1.1.0]: https://github.com/postmanlabs/har-to-postman/compare/v1.0.3...v1.1.0

[v1.0.3]: https://github.com/postmanlabs/har-to-postman/compare/03ce42a1fd66ba053850cbfb3c75f3d3fab62c0f...v1.0.3
