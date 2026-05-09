openapi: 3.0.3
info:
  title: OPhim API
  description: API cung cấp dữ liệu phim ảnh (RESTful)
  version: 1.0.0

servers:
  - url: https://ophim1.com/v1/api

tags:
  - name: Home
  - name: Movie List
  - name: Search
  - name: Category
  - name: Country
  - name: Movie Detail

paths:

  /home:
    get:
      tags: [Home]
      summary: Lấy dữ liệu trang chủ
      responses:
        '200':
          $ref: '#/components/responses/HomeResponse'

  /danh-sach/{slug}:
    get:
      tags: [Movie List]
      summary: Lấy danh sách phim theo bộ lọc
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
            enum: [phim-moi, phim-bo, phim-le, tv-shows, hoat-hinh]
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
        - $ref: '#/components/parameters/SortField'
        - $ref: '#/components/parameters/SortType'
        - $ref: '#/components/parameters/Category'
        - $ref: '#/components/parameters/Country'
        - $ref: '#/components/parameters/Year'
      responses:
        '200':
          $ref: '#/components/responses/ListResponse'

  /tim-kiem:
    get:
      tags: [Search]
      summary: Tìm kiếm phim
      parameters:
        - name: keyword
          in: query
          required: true
          schema:
            type: string
        - $ref: '#/components/parameters/Page'
        - $ref: '#/components/parameters/Limit'
      responses:
        '200':
          $ref: '#/components/responses/SearchResponse'

  /the-loai:
    get:
      tags: [Category]
      summary: Lấy danh sách thể loại
      responses:
        '200':
          $ref: '#/components/responses/SimpleListResponse'

  /the-loai/{slug}:
    get:
      tags: [Category]
      summary: Lấy phim theo thể loại
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/ListResponse'

  /quoc-gia:
    get:
      tags: [Country]
      summary: Lấy danh sách quốc gia
      responses:
        '200':
          $ref: '#/components/responses/SimpleListResponse'

  /quoc-gia/{slug}:
    get:
      tags: [Country]
      summary: Lấy phim theo quốc gia
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/ListResponse'

  /phim/{slug}:
    get:
      tags: [Movie Detail]
      summary: Lấy chi tiết phim
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/MovieDetailResponse'
        '404':
          $ref: '#/components/responses/ErrorResponse'

  /phim/{slug}/images:
    get:
      tags: [Movie Detail]
      summary: Lấy hình ảnh phim
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/ImageResponse'

  /phim/{slug}/peoples:
    get:
      tags: [Movie Detail]
      summary: Lấy diễn viên / đạo diễn
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/PeopleResponse'

  /phim/{slug}/keywords:
    get:
      tags: [Movie Detail]
      summary: Lấy keywords phim
      parameters:
        - name: slug
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          $ref: '#/components/responses/KeywordResponse'

components:

  parameters:
    Page:
      name: page
      in: query
      schema:
        type: integer
        default: 1

    Limit:
      name: limit
      in: query
      schema:
        type: integer
        default: 24

    SortField:
      name: sort_field
      in: query
      schema:
        type: string
        enum: [modified.time, year, _id]

    SortType:
      name: sort_type
      in: query
      schema:
        type: string
        enum: [asc, desc]

    Category:
      name: category
      in: query
      schema:
        type: string

    Country:
      name: country
      in: query
      schema:
        type: string

    Year:
      name: year
      in: query
      schema:
        type: string

  schemas:

    BaseResponse:
      type: object
      properties:
        status:
          type: string
          enum: [success, error]
        message:
          type: string

    MovieItem:
      type: object
      properties:
        _id: { type: string }
        name: { type: string }
        slug: { type: string }
        origin_name: { type: string }
        alternative_names:
          type: array
          items: { type: string }
        type: { type: string }
        thumb_url: { type: string }
        poster_url: { type: string }
        year: { type: integer }

    Pagination:
      type: object
      properties:
        currentPage: { type: integer }
        totalItems: { type: integer }
        totalItemsPerPage: { type: integer }
        totalPages: { type: integer }

    MovieDetail:
      allOf:
        - $ref: '#/components/schemas/MovieItem'
        - type: object
          properties:
            content: { type: string }
            episodes:
              type: array
              items:
                type: object

  responses:

    HomeResponse:
      description: Home data
      content:
        application/json:
          schema:
            allOf:
              - $ref: '#/components/schemas/BaseResponse'
              - type: object
                properties:
                  data:
                    type: object
                    properties:
                      items:
                        type: array
                        items:
                          $ref: '#/components/schemas/MovieItem'

    ListResponse:
      description: List data
      content:
        application/json:
          schema:
            allOf:
              - $ref: '#/components/schemas/BaseResponse'
              - type: object
                properties:
                  data:
                    type: object
                    properties:
                      items:
                        type: array
                        items:
                          $ref: '#/components/schemas/MovieItem'
                      pagination:
                        $ref: '#/components/schemas/Pagination'

    SearchResponse:
      $ref: '#/components/responses/ListResponse'

    SimpleListResponse:
      description: Simple list
      content:
        application/json:
          schema:
            allOf:
              - $ref: '#/components/schemas/BaseResponse'
              - type: object
                properties:
                  data:
                    type: array
                    items:
                      type: object

    MovieDetailResponse:
      description: Movie detail
      content:
        application/json:
          schema:
            allOf:
              - $ref: '#/components/schemas/BaseResponse'
              - type: object
                properties:
                  data:
                    type: object
                    properties:
                      item:
                        $ref: '#/components/schemas/MovieDetail'

    ImageResponse:
      description: Images
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/BaseResponse'

    PeopleResponse:
      description: Peoples
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/BaseResponse'

    KeywordResponse:
      description: Keywords
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/BaseResponse'

    ErrorResponse:
      description: Error
      content:
        application/json:
          schema:
            $ref: '#/components/schemas/BaseResponse'